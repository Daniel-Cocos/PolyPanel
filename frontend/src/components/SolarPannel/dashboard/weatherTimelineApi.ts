import type { WeatherTimelineResponse } from './types'

/** Resolves the backend base URL for weather timeline requests. */
function getApiBaseUrl() {
  const configuredBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim()
  return configuredBaseUrl ? configuredBaseUrl.replace(/\/$/, '') : ''
}

/** Fetches the last 12 months of weather timeline data from the backend. */
export async function fetchWeatherTimeline(
  options: { latitude?: number; longitude?: number; signal?: AbortSignal } = {},
) {
  const params = new URLSearchParams()
  if (typeof options.latitude === 'number') {
    params.set('latitude', options.latitude.toString())
  }
  if (typeof options.longitude === 'number') {
    params.set('longitude', options.longitude.toString())
  }

  const query = params.size > 0 ? `?${params.toString()}` : ''
  const response = await fetch(`${getApiBaseUrl()}/api/weather/timeline${query}`, { signal: options.signal })
  if (!response.ok) {
    throw new Error(`Weather timeline request failed with status ${response.status}`)
  }

  return response.json() as Promise<WeatherTimelineResponse>
}
