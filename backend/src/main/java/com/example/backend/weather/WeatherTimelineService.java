package com.example.backend.weather;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.IOException;
import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.time.Clock;
import java.time.Instant;
import java.time.LocalDate;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

/** Loads and aggregates historical weather data for the dashboard timeline. */
@Service
public class WeatherTimelineService {

	private static final int TIMELINE_MONTHS = 12;
	private static final DateTimeFormatter MONTH_LABEL_FORMATTER = DateTimeFormatter.ofPattern("MMM");
	private static final String DAILY_VARIABLES = String.join(",",
		"temperature_2m_mean",
		"relative_humidity_2m_mean",
		"wind_speed_10m_mean",
		"precipitation_sum",
		"shortwave_radiation_sum",
		"sunshine_duration",
		"weather_code"
	);

	private final HttpClient httpClient;
	private final ObjectMapper objectMapper;
	private final Clock clock;
	private final double defaultLatitude;
	private final double defaultLongitude;
	private final String baseUrl;

	/** Creates the service with the configured provider endpoint and fallback coordinates. */
	@Autowired
	public WeatherTimelineService(
		ObjectMapper objectMapper,
		@Value("${weather.timeline.default-latitude:52.2053}") double defaultLatitude,
		@Value("${weather.timeline.default-longitude:0.1218}") double defaultLongitude,
		@Value("${weather.timeline.base-url:https://archive-api.open-meteo.com}") String baseUrl
	) {
		this(HttpClient.newHttpClient(), objectMapper, Clock.systemUTC(), defaultLatitude, defaultLongitude, baseUrl);
	}

	WeatherTimelineService(
		HttpClient httpClient,
		ObjectMapper objectMapper,
		Clock clock,
		double defaultLatitude,
		double defaultLongitude,
		String baseUrl
	) {
		this.httpClient = httpClient;
		this.objectMapper = objectMapper;
		this.clock = clock;
		this.defaultLatitude = defaultLatitude;
		this.defaultLongitude = defaultLongitude;
		this.baseUrl = baseUrl;
	}

	/** Returns the last 12 monthly summaries for the requested or default location. */
	public WeatherTimelineResponse getPastYearTimeline(Double latitude, Double longitude) {
		double resolvedLatitude = latitude == null ? defaultLatitude : latitude;
		double resolvedLongitude = longitude == null ? defaultLongitude : longitude;
		validateCoordinates(resolvedLatitude, resolvedLongitude);

		LocalDate startMonth = LocalDate.now(clock).withDayOfMonth(1).minusMonths(TIMELINE_MONTHS - 1L);
		LocalDate endDate = LocalDate.now(clock);
		DailyWeatherData dailyWeatherData = fetchDailyWeather(resolvedLatitude, resolvedLongitude, startMonth, endDate);
		List<WeatherTimelinePoint> timeline = buildTimeline(dailyWeatherData, startMonth);

		return new WeatherTimelineResponse(Instant.now(clock).toString(), resolvedLatitude, resolvedLongitude, timeline);
	}

	/** Fetches daily historical metrics from the Open-Meteo archive API. */
	private DailyWeatherData fetchDailyWeather(double latitude, double longitude, LocalDate startDate, LocalDate endDate) {
		String url = "%s/v1/archive?latitude=%s&longitude=%s&start_date=%s&end_date=%s&daily=%s&timezone=GMT&temperature_unit=celsius&wind_speed_unit=kmh&precipitation_unit=mm"
			.formatted(
				baseUrl,
				encode(Double.toString(latitude)),
				encode(Double.toString(longitude)),
				startDate,
				endDate,
				encode(DAILY_VARIABLES)
			);

		HttpRequest request = HttpRequest.newBuilder(URI.create(url)).GET().build();

		try {
			HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
			if (response.statusCode() >= 400) {
				throw new ResponseStatusException(HttpStatus.BAD_GATEWAY, "Weather provider request failed.");
			}

			return parseDailyWeather(response.body());
		} catch (InterruptedException exception) {
			Thread.currentThread().interrupt();
			throw new ResponseStatusException(HttpStatus.BAD_GATEWAY, "Weather provider request was interrupted.", exception);
		} catch (IOException exception) {
			throw new ResponseStatusException(HttpStatus.BAD_GATEWAY, "Weather provider response could not be read.", exception);
		}
	}

	/** Parses the provider response into typed daily arrays. */
	private DailyWeatherData parseDailyWeather(String responseBody) {
		try {
			JsonNode daily = objectMapper.readTree(responseBody).path("daily");
			DailyWeatherData data = new DailyWeatherData(
				readDates(daily, "time"),
				readDoubles(daily, "temperature_2m_mean"),
				readDoubles(daily, "relative_humidity_2m_mean"),
				readDoubles(daily, "wind_speed_10m_mean"),
				readDoubles(daily, "precipitation_sum"),
				readDoubles(daily, "shortwave_radiation_sum"),
				readDoubles(daily, "sunshine_duration"),
				readIntegers(daily, "weather_code")
			);
			validateLengths(data);
			return data;
		} catch (IOException exception) {
			throw new ResponseStatusException(HttpStatus.BAD_GATEWAY, "Weather provider JSON could not be parsed.", exception);
		}
	}

	/** Aggregates daily weather samples into a monthly timeline. */
	private List<WeatherTimelinePoint> buildTimeline(DailyWeatherData data, LocalDate startMonth) {
		Map<YearMonth, MonthlyAccumulator> monthlyValues = new HashMap<>();

		for (int index = 0; index < data.dates().size(); index++) {
			YearMonth month = YearMonth.from(data.dates().get(index));
			monthlyValues.computeIfAbsent(month, ignored -> new MonthlyAccumulator()).add(
				data.temperatures().get(index),
				data.humidities().get(index),
				data.windSpeeds().get(index),
				data.precipitationTotals().get(index),
				data.shortwaveRadiationSums().get(index),
				data.sunshineDurations().get(index),
				data.weatherCodes().get(index)
			);
		}

		List<WeatherTimelinePoint> timeline = new ArrayList<>();
		for (int monthOffset = 0; monthOffset < TIMELINE_MONTHS; monthOffset++) {
			LocalDate monthStart = startMonth.plusMonths(monthOffset);
			MonthlyAccumulator month = monthlyValues.get(YearMonth.from(monthStart));
			if (month == null || month.days == 0) {
				continue;
			}

			timeline.add(new WeatherTimelinePoint(
				monthStart.format(MONTH_LABEL_FORMATTER),
				monthStart.toString(),
				round(month.temperatureTotal / month.days),
				round(month.humidityTotal / month.days),
				round(month.windTotal / month.days),
				round(month.precipitationTotal),
				month.rainyDays,
				month.days,
				round(month.shortwaveRadiationTotal / 3.6),
				round(month.sunshineDurationSeconds / 3600.0),
				getSummary(month.weatherCodeCounts)
			));
		}

		return timeline;
	}

	/** Maps dominant WMO weather codes to dashboard labels. */
	private String getSummary(Map<Integer, Integer> weatherCodeCounts) {
		int dominantCode = weatherCodeCounts.entrySet().stream()
			.max(Map.Entry.<Integer, Integer>comparingByValue().thenComparing(Map.Entry.comparingByKey()))
			.map(Map.Entry::getKey)
			.orElse(3);

		return switch (dominantCode) {
			case 0 -> "Clear";
			case 1, 2, 3 -> "Mixed skies";
			case 45, 48 -> "Foggy";
			case 51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82 -> "Rainy";
			case 71, 73, 75, 77, 85, 86 -> "Snowy";
			case 95, 96, 99 -> "Stormy";
			default -> "Overcast";
		};
	}

	/** Rejects invalid query coordinates before provider requests are made. */
	private void validateCoordinates(double latitude, double longitude) {
		if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Latitude or longitude is out of range.");
		}
	}

	/** Ensures every provider array has the same number of samples. */
	private void validateLengths(DailyWeatherData data) {
		int expectedSize = data.dates().size();
		if (data.temperatures().size() != expectedSize
			|| data.humidities().size() != expectedSize
			|| data.windSpeeds().size() != expectedSize
			|| data.precipitationTotals().size() != expectedSize
			|| data.shortwaveRadiationSums().size() != expectedSize
			|| data.sunshineDurations().size() != expectedSize
			|| data.weatherCodes().size() != expectedSize) {
			throw new ResponseStatusException(HttpStatus.BAD_GATEWAY, "Weather provider response arrays are inconsistent.");
		}
	}

	/** Reads a date array from the provider payload. */
	private List<LocalDate> readDates(JsonNode daily, String fieldName) {
		return readValues(daily, fieldName).stream().map(LocalDate::parse).toList();
	}

	/** Reads a numeric array from the provider payload as doubles. */
	private List<Double> readDoubles(JsonNode daily, String fieldName) {
		return readValues(daily, fieldName).stream().map(Double::valueOf).toList();
	}

	/** Reads a numeric array from the provider payload as integers. */
	private List<Integer> readIntegers(JsonNode daily, String fieldName) {
		return readValues(daily, fieldName).stream().map(Integer::valueOf).toList();
	}

	/** Reads a raw JSON array into a list of string values. */
	private List<String> readValues(JsonNode daily, String fieldName) {
		JsonNode node = daily.path(fieldName);
		if (!node.isArray()) {
			throw new ResponseStatusException(HttpStatus.BAD_GATEWAY, "Weather provider response is missing expected daily fields.");
		}

		List<String> values = new ArrayList<>();
		node.forEach(value -> values.add(value.asText()));
		return values;
	}

	/** Encodes query parameter values for provider requests. */
	private String encode(String value) {
		return URLEncoder.encode(value, StandardCharsets.UTF_8);
	}

	/** Rounds values for concise chart display. */
	private double round(double value) {
		return Math.round(value * 10.0) / 10.0;
	}

	/** Holds the daily weather arrays returned by the provider. */
	private record DailyWeatherData(
		List<LocalDate> dates,
		List<Double> temperatures,
		List<Double> humidities,
		List<Double> windSpeeds,
		List<Double> precipitationTotals,
		List<Double> shortwaveRadiationSums,
		List<Double> sunshineDurations,
		List<Integer> weatherCodes
	) {
	}

	/** Tracks monthly totals before values are averaged for the response. */
	private static final class MonthlyAccumulator {

		private double temperatureTotal;
		private double humidityTotal;
		private double windTotal;
		private double precipitationTotal;
		private double shortwaveRadiationTotal;
		private double sunshineDurationSeconds;
		private int days;
		private int rainyDays;
		private final Map<Integer, Integer> weatherCodeCounts = new HashMap<>();

		private void add(
			double temperature,
			double humidity,
			double windSpeed,
			double precipitation,
			double shortwaveRadiation,
			double sunshineDuration,
			int weatherCode
		) {
			temperatureTotal += temperature;
			humidityTotal += humidity;
			windTotal += windSpeed;
			precipitationTotal += precipitation;
			shortwaveRadiationTotal += shortwaveRadiation;
			sunshineDurationSeconds += sunshineDuration;
			days += 1;
			if (precipitation >= 1.0) {
				rainyDays += 1;
			}
			weatherCodeCounts.merge(weatherCode, 1, Integer::sum);
		}
	}
}
