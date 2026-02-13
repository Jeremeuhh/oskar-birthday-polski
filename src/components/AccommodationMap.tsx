import { useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import type { Accommodation } from '../lib/types'

// ── Fix default marker icon paths broken by Vite bundling ──
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
})

// ── Auto-fit map bounds to markers ──
function FitBounds({ positions }: { positions: [number, number][] }) {
  const map = useMap()
  useEffect(() => {
    if (positions.length > 0) {
      map.fitBounds(positions, { padding: [40, 40], maxZoom: 13 })
    }
  }, [map, positions])
  return null
}

interface Props {
  accommodations: Accommodation[]
  onSelect?: (id: string) => void
}

// Default center: Poland
const POLAND_CENTER: [number, number] = [51.9194, 19.1451]

export default function AccommodationMap({ accommodations, onSelect }: Props) {
  const positions = accommodations.map(
    (a) => [a.lat, a.lng] as [number, number]
  )

  return (
    <MapContainer
      center={POLAND_CENTER}
      zoom={6}
      className="accommodation-map"
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <FitBounds positions={positions} />
      {accommodations.map((a) => (
        <Marker key={a.id} position={[a.lat, a.lng]}>
          <Popup>
            <strong>{a.name}</strong>
            {a.city && <br />}
            {a.city && <span>📍 {a.city}</span>}
            {a.price_per_night != null && (
              <>
                <br />
                <span>{a.price_per_night} € / nuit</span>
              </>
            )}
            <br />
            <button
              className="popup-link"
              onClick={() => onSelect?.(a.id)}
            >
              Voir détails
            </button>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}
