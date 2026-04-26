package com.example.backend.weather;

/** Represents one monthly weather summary in the yearly dashboard timeline. */
public record WeatherTimelinePoint(
	String monthLabel,
	String monthStartIso,
	double averageTempC,
	double averageHumidityPct,
	double averageWindKph,
	double totalRainfallMm,
	int rainyDays,
	int observedDays,
	double solarRadiationKwhM2,
	double sunshineHours,
	String summary
) {
}
