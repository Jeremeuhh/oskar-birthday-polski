/* ── Types pour les logements ── */

export interface Accommodation {
  id: string
  name: string
  description: string | null
  url: string | null
  image_url: string | null
  price_per_night: number | null
  lat: number
  lng: number
  city: string | null
}
