package com.example.backend.weather;

import static org.junit.jupiter.api.Assertions.assertEquals;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpServer;
import java.io.IOException;
import java.net.InetSocketAddress;
import java.net.http.HttpClient;
import java.nio.charset.StandardCharsets;
import java.time.Clock;
import java.time.Instant;
import java.time.ZoneOffset;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;

/** Verifies provider data is aggregated into the dashboard timeline. */
class WeatherTimelineServiceTest {

	private HttpServer server;

	/** Stops the temporary provider server after each test. */
	@AfterEach
	void tearDown() {
		if (server != null) {
			server.stop(0);
		}
	}

	/** Aggregates one daily sample per month into 12 monthly timeline points. */
	@Test
	void mapsProviderDailyWeatherIntoMonthlyTimeline() throws Exception {
		server = HttpServer.create(new InetSocketAddress(0), 0);
		server.createContext("/v1/archive", this::writeArchiveResponse);
		server.start();

		WeatherTimelineService service = new WeatherTimelineService(
			HttpClient.newHttpClient(),
			new ObjectMapper(),
			Clock.fixed(Instant.parse("2026-04-26T00:00:00Z"), ZoneOffset.UTC),
			52.2053,
			0.1218,
			"http://localhost:" + server.getAddress().getPort()
		);

		WeatherTimelineResponse response = service.getPastYearTimeline(51.5, -0.12);

		assertEquals(51.5, response.latitude());
		assertEquals(-0.12, response.longitude());
		assertEquals(12, response.timeline().size());
		assertEquals("May", response.timeline().getFirst().monthLabel());
		assertEquals(10.0, response.timeline().getFirst().averageTempC());
		assertEquals(1, response.timeline().getFirst().rainyDays());
		assertEquals(2.0, response.timeline().getFirst().sunshineHours());
		assertEquals("Clear", response.timeline().getFirst().summary());
		assertEquals("Apr", response.timeline().getLast().monthLabel());
		assertEquals(21.0, response.timeline().getLast().averageTempC());
		assertEquals(40.0, response.timeline().getLast().solarRadiationKwhM2());
		assertEquals("Rainy", response.timeline().getLast().summary());
	}

	/** Returns a minimal Open-Meteo archive payload for the service test. */
	private void writeArchiveResponse(HttpExchange exchange) throws IOException {
		String payload = """
			{
			  "daily": {
			    "time": ["2025-05-01","2025-06-01","2025-07-01","2025-08-01","2025-09-01","2025-10-01","2025-11-01","2025-12-01","2026-01-01","2026-02-01","2026-03-01","2026-04-01"],
			    "temperature_2m_mean": [10,12,15,17,16,13,9,6,4,5,8,21],
			    "relative_humidity_2m_mean": [61,62,60,58,64,71,76,78,80,77,73,65],
			    "wind_speed_10m_mean": [12,13,14,12,11,15,16,17,18,16,14,13],
			    "precipitation_sum": [20,22,18,25,29,40,55,62,58,50,44,67],
			    "shortwave_radiation_sum": [72,81,95,102,88,64,36,24,18,22,41,144],
			    "sunshine_duration": [7200,8000,10000,11200,9400,6800,4600,3600,3200,4100,5200,10800],
			    "weather_code": [0,1,2,3,45,61,63,71,73,80,95,81]
			  }
			}
			""";

		byte[] response = payload.getBytes(StandardCharsets.UTF_8);
		exchange.getResponseHeaders().add("Content-Type", "application/json");
		exchange.sendResponseHeaders(200, response.length);
		try (var outputStream = exchange.getResponseBody()) {
			outputStream.write(response);
		}
	}
}
