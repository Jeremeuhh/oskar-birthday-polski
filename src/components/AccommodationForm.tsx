import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

interface Props {
  onAdded: () => void
}

/** Geocode a city / address using Nominatim (OpenStreetMap) */
async function geocode(query: string): Promise<{ lat: number; lng: number } | null> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`,
      { headers: { 'User-Agent': 'oskar-birthday-polski/1.0' } }
    )
    const data = await res.json()
    if (data.length > 0) {
      return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) }
    }
  } catch (err) {
    console.error('Geocode error:', err)
  }
  return null
}

export default function AccommodationForm({ onAdded }: Props) {
  const { user } = useAuth()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [url, setUrl] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [price, setPrice] = useState('')
  const [city, setCity] = useState('')
  const [lat, setLat] = useState('')
  const [lng, setLng] = useState('')

  const reset = () => {
    setName('')
    setDescription('')
    setUrl('')
    setImageUrl('')
    setPrice('')
    setCity('')
    setLat('')
    setLng('')
    setError(null)
  }

  const handleGeocode = async () => {
    if (!city) return
    setLoading(true)
    const result = await geocode(city)
    setLoading(false)
    if (result) {
      setLat(String(result.lat))
      setLng(String(result.lng))
    } else {
      setError('Adresse introuvable. Essaie un format "ville, pays" ou entre les coordonnées manuellement.')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    const latNum = parseFloat(lat)
    const lngNum = parseFloat(lng)

    if (!name.trim()) {
      setError('Le nom est obligatoire.')
      return
    }
    if (isNaN(latNum) || isNaN(lngNum)) {
      setError('Coordonnées invalides. Utilise le bouton "Géocoder" ou entre lat/lng manuellement.')
      return
    }

    setLoading(true)
    setError(null)

    const { error: insertError } = await supabase
      .from('accommodations')
      .insert({
        name: name.trim(),
        description: description.trim() || null,
        url: url.trim() || null,
        image_url: imageUrl.trim() || null,
        price_per_night: price ? parseFloat(price) : null,
        lat: latNum,
        lng: lngNum,
        city: city.trim() || null,
        added_by: user.id,
      })

    setLoading(false)

    if (insertError) {
      setError(insertError.message)
    } else {
      reset()
      setOpen(false)
      onAdded()
    }
  }

  if (!open) {
    return (
      <button onClick={() => setOpen(true)}>
        + Ajouter un logement
      </button>
    )
  }

  return (
    <article className="accommodation-form">
      <header>
        <h4>Nouveau logement</h4>
      </header>
      <form onSubmit={handleSubmit}>
        <label>
          Nom *
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Airbnb centre Cracovie"
            required
          />
        </label>

        <label>
          Description
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="3 chambres, balcon, proche bar…"
          />
        </label>

        <div className="grid">
          <label>
            Lien (URL)
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://airbnb.com/..."
            />
          </label>
          <label>
            Image (URL)
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://..."
            />
          </label>
        </div>

        <div className="grid">
          <label>
            Prix / nuit (€)
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="85"
              min="0"
              step="0.01"
            />
          </label>
          <label>
            Ville / adresse
            <div className="geocode-row">
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Cracovie, Pologne"
              />
              <button type="button" className="outline" onClick={handleGeocode} disabled={loading}>
                📍 Géocoder
              </button>
            </div>
          </label>
        </div>

        <div className="grid">
          <label>
            Latitude
            <input
              type="number"
              value={lat}
              onChange={(e) => setLat(e.target.value)}
              placeholder="50.0647"
              step="any"
            />
          </label>
          <label>
            Longitude
            <input
              type="number"
              value={lng}
              onChange={(e) => setLng(e.target.value)}
              placeholder="19.9450"
              step="any"
            />
          </label>
        </div>

        {error && <p className="error-text">{error}</p>}

        <div className="form-actions">
          <button type="submit" disabled={loading} aria-busy={loading}>
            {loading ? 'Ajout…' : 'Ajouter'}
          </button>
          <button type="button" className="outline secondary" onClick={() => { setOpen(false); reset() }}>
            Annuler
          </button>
        </div>
      </form>
    </article>
  )
}
