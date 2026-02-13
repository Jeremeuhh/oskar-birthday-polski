import type { Accommodation } from '../lib/types'

interface Props {
  accommodation: Accommodation
  expanded?: boolean
  onToggle?: () => void
}

export default function AccommodationCard({
  accommodation: a,
  expanded,
  onToggle,
}: Props) {
  return (
    <article className="accommodation-card">
      <header>
        <div className="card-header-row">
          <h4>{a.name}</h4>
        </div>
        {a.city && <small className="city-label">📍 {a.city}</small>}
      </header>

      {a.image_url && (
        <img
          src={a.image_url}
          alt={a.name}
          className="accommodation-img"
          loading="lazy"
        />
      )}

      {a.description && <p>{a.description}</p>}

      <footer>
        <div className="card-footer-row">
          {a.price_per_night != null && (
            <span>{a.price_per_night} € / nuit</span>
          )}
          {a.url && (
            <a href={a.url} target="_blank" rel="noopener noreferrer">
              Voir l'annonce ↗
            </a>
          )}
        </div>
      </footer>
    </article>
  )
}
