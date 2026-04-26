package com.example.backend.weather;

import static org.hamcrest.Matchers.hasSize;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.databind.ObjectMapper;
import java.net.http.HttpClient;
import java.time.Clock;
import java.util.Collections;
import org.junit.jupiter.api.Test;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

/** Verifies the dashboard weather timeline API contract. */
class WeatherTimelineControllerTest {

	/** Returns a complete 12 month timeline payload for the dashboard. */
	@Test
	void returnsPastYearWeatherTimeline() throws Exception {
		WeatherTimelineService service = new WeatherTimelineService(
			HttpClient.newHttpClient(),
			new ObjectMapper(),
			Clock.systemUTC(),
			52.2053,
			0.1218,
			"http://localhost:9"
		) {
			@Override
			public WeatherTimelineResponse getPastYearTimeline(Double latitude, Double longitude) {
				return new WeatherTimelineResponse(
					"2026-04-26T00:00:00Z",
					51.5,
					-0.12,
					Collections.nCopies(12, new WeatherTimelinePoint("Apr", "2026-04-01", 12.3, 67.0, 11.4, 42.1, 11, 30, 92.7, 183.2, "Mixed skies"))
				);
			}
		};

		MockMvc mockMvc = MockMvcBuilders.standaloneSetup(new WeatherTimelineController(service)).build();

		mockMvc.perform(get("/api/weather/timeline").param("latitude", "51.5").param("longitude", "-0.12"))
			.andExpect(status().isOk())
			.andExpect(jsonPath("$.generatedAtIso").isString())
			.andExpect(jsonPath("$.latitude").value(51.5))
			.andExpect(jsonPath("$.longitude").value(-0.12))
			.andExpect(jsonPath("$.timeline", hasSize(12)))
			.andExpect(jsonPath("$.timeline[0].monthLabel").value("Apr"))
			.andExpect(jsonPath("$.timeline[0].averageTempC").value(12.3))
			.andExpect(jsonPath("$.timeline[0].totalRainfallMm").value(42.1))
			.andExpect(jsonPath("$.timeline[0].solarRadiationKwhM2").value(92.7));
	}
}
