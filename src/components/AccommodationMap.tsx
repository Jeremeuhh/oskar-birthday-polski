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

// ── Points d'intérêt à afficher sur la carte ──
interface PointOfInterest {
  id: string
  name: string
  description: string
  lat: number
  lng: number
}

const POINTS_OF_INTEREST: PointOfInterest[] = [
  {
    id: 'poi-hostel',
    name: 'Oki Doki Old Town Hostel',
    description: '🏨 Notre logement — Długa 6, 00-238 Warszawa',
    lat: 52.2499,
    lng: 21.0124
  },
  {
    id: 'poi-stare-miasto',
    name: 'Vieille Ville (Stare Miasto)',
    description: '🏰 Centre historique UNESCO — Place du Marché',
    lat: 52.2495,
    lng: 21.0122
  },
  {
    id: 'poi-lazienki',
    name: 'Parc Łazienki & Palais sur l\'Eau',
    description: '🌳 Parc, paons, monument Chopin — Agrykola 1',
    lat: 52.2153,
    lng: 21.0352
  },
  {
    id: 'poi-chateau',
    name: 'Château Royal (Zamek Królewski)',
    description: '👑 Résidence des rois de Pologne — plac Zamkowy 4',
    lat: 52.2479,
    lng: 21.0153
  },
  {
    id: 'poi-palais-culture',
    name: 'Palais de la Culture et de la Science',
    description: '🏢 Vue panoramique sur Varsovie — pl. Defilad 1',
    lat: 52.2319,
    lng: 21.0067
  },
  {
    id: 'poi-insurrection',
    name: 'Musée de l\'Insurrection de Varsovie',
    description: '🎭 Histoire de l\'insurrection de 1944 — Grzybowska 79',
    lat: 52.2323,
    lng: 20.9811
  },
  {
    id: 'poi-praga',
    name: 'Quartier de Praga',
    description: '🎨 Street art, bars locaux, ambiance authentique',
    lat: 52.2502,
    lng: 21.0330
  },
  {
    id: 'poi-vodka',
    name: 'Musée de la Vodka Polonaise',
    description: '🍸 Visite + dégustation — 70 zł',
    lat: 52.2561,
    lng: 21.0463
  },
  {
    id: 'poi-tir',
    name: 'Stand de Tir — PM Shooter',
    description: '🔫 Package AK-47 — 225 zł — Krakowiaków 80A',
    lat: 52.1771,
    lng: 21.0156
  }
]

// Icône personnalisée pour les points d'intérêt (rouge)
const poiIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
})

// Icône pour le logement (bleu par défaut)
const hostelIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png',
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
})

// ── Auto-fit map bounds to markers ──
function FitBounds({ positions }: { positions: [number, number][] }) {
  const map = useMap()
  useEffect(() => {
    if (positions.length > 0) {
      map.fitBounds(positions, { padding: [40, 40], maxZoom: 14 })
    }
  }, [map, positions])
  return null
}

interface Props {
  accommodations: Accommodation[]
  onSelect?: (id: string) => void
}

// Default center: Warsaw
const WARSAW_CENTER: [number, number] = [52.2297, 21.0122]

export default function AccommodationMap({ accommodations, onSelect }: Props) {
  const allPositions = POINTS_OF_INTEREST.map(
    (p) => [p.lat, p.lng] as [number, number]
  )

  return (
    <MapContainer
      center={WARSAW_CENTER}
      zoom={13}
      className="accommodation-map"
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <FitBounds positions={allPositions} />

      {/* Points d'intérêt */}
      {POINTS_OF_INTEREST.map((poi) => (
        <Marker 
          key={poi.id} 
          position={[poi.lat, poi.lng]}
          icon={poi.id === 'poi-hostel' ? hostelIcon : poiIcon}
        >
          <Popup>
            <strong>{poi.name}</strong>
            <br />
            <span>{poi.description}</span>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}
