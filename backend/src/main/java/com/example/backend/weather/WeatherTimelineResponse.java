package com.example.backend.weather;

import java.util.List;

/** Wraps the dashboard weather timeline payload returned by the API. */
public record WeatherTimelineResponse(
	String generatedAtIso,
	double latitude,
	double longitude,
	List<WeatherTimelinePoint> timeline
) {
}
