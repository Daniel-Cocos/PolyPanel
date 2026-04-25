export type AddressSuggestion = {
  id: string
  label: string
  latitude: number
  longitude: number
}

type PhotonFeature = {
  geometry: { coordinates: [number, number] }
  properties: Record<string, string | undefined>
}

/** Builds a readable address label from Photon properties. */
function formatAddressLabel(properties: Record<string, string | undefined>) {
  return [properties.name, properties.street, properties.city, properties.state, properties.country]
    .filter(Boolean)
    .join(', ')
}

/** Searches Photon for address suggestions near the current map center. */
export async function searchAddresses(query: string, latitude: number, longitude: number, signal: AbortSignal) {
  const params = new URLSearchParams({
    q: query,
    lat: String(latitude),
    lon: String(longitude),
    limit: '5',
  })

  const response = await fetch(`https://photon.komoot.io/api/?${params.toString()}`, { signal })
  if (!response.ok) {
    throw new Error('Address lookup failed')
  }

  const data = (await response.json()) as { features?: PhotonFeature[] }
  return (data.features ?? []).map((feature, index) => ({
    id: `${feature.properties.osm_type ?? 'result'}-${feature.properties.osm_id ?? index}`,
    label: formatAddressLabel(feature.properties) || 'Unnamed result',
    longitude: feature.geometry.coordinates[0],
    latitude: feature.geometry.coordinates[1],
  }))
}
