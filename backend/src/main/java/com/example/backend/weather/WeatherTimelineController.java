package com.example.backend.weather;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/** Exposes weather timeline endpoints used by the dashboard. */
@RestController
@RequestMapping("/api/weather")
public class WeatherTimelineController {

	private final WeatherTimelineService weatherTimelineService;

	/** Injects the weather timeline generator used by the dashboard route. */
	public WeatherTimelineController(WeatherTimelineService weatherTimelineService) {
		this.weatherTimelineService = weatherTimelineService;
	}

	/** Returns the last 12 months of monthly weather summaries. */
	@GetMapping("/timeline")
	public WeatherTimelineResponse getTimeline(
		@RequestParam(required = false) Double latitude,
		@RequestParam(required = false) Double longitude
	) {
		return weatherTimelineService.getPastYearTimeline(latitude, longitude);
	}
}
