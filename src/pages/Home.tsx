import { useRef, useState } from 'react'
import AccommodationCard from '../components/AccommodationCard'
import AccommodationMap from '../components/AccommodationMap'
import TripQuestionnaire from '../components/TripQuestionnaire'
import type { Accommodation } from '../lib/types'

// Données statiques des logements
const ACCOMMODATIONS: Accommodation[] = [
  {
    id: '1',
    name: 'Oki Doki Old Town Hostel',
    description: '🏆 Meilleure auberge de Pologne ! À 200m de la Place du Marché dans la Vieille Ville. Bar, cuisine équipée, réception 24/7. 2x vainqueur du HOSCAR award.',
    url: 'https://okidoki.pl/',
    image_url: 'https://okidoki.pl/wp-content/uploads/2025/03/DSCF4152.jpg',
    price_per_night: 25,
    lat: 52.2499,
    lng: 21.0124,
    city: 'Varsovie - Vieille Ville'
  }
]

export default function Home() {
  const [accommodations] = useState<Accommodation[]>(ACCOMMODATIONS)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({})

  const scrollToCard = (id: string) => {
    setExpandedId(id)
    cardRefs.current[id]?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }

  return (
    <main className="container">
      <header style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1>🎂 Anniversaire d'Oskar en Pologne</h1>
        <p>Découvrez les informations essentielles pour notre voyage</p>
      </header>

      {/* Section Vols */}
      <section style={{ 
        background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
        color: 'white',
        padding: '2rem',
        borderRadius: '12px',
        marginBottom: '2rem',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ margin: '0 0 1.5rem 0', fontSize: '1.5rem' }}>✈️ Vols Ryanair</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
          <div style={{ background: 'rgba(255,255,255,0.1)', padding: '1.5rem', borderRadius: '8px', backdropFilter: 'blur(10px)' }}>
            <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.1rem' }}>🛫 Vol Aller</h3>
            <p style={{ margin: '0.5rem 0', fontSize: '0.95rem' }}><strong>📅 Date :</strong> Vendredi 17 avril 2026</p>
            <p style={{ margin: '0.5rem 0', fontSize: '0.95rem' }}><strong>🕐 Départ :</strong> 14h55 (2:55 PM)</p>
            <p style={{ margin: '0.5rem 0', fontSize: '0.95rem' }}><strong>🛫 Aéroport :</strong> Paris Beauvais (BVA)</p>
            <p style={{ margin: '0.5rem 0', fontSize: '0.95rem' }}><strong>🕔 Arrivée :</strong> 17h05 (5:05 PM)</p>
            <p style={{ margin: '0.5rem 0', fontSize: '0.95rem' }}><strong>🛬 Aéroport :</strong> Varsovie Modlin (WMI)</p>
            <p style={{ margin: '0.5rem 0', fontSize: '0.95rem' }}><strong>⏱️ Durée :</strong> 2h10</p>
            <p style={{ margin: '0.5rem 0', fontSize: '0.95rem' }}><strong>✈️ Vol :</strong> Ryanair FR1889 (Boeing 737)</p>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.1)', padding: '1.5rem', borderRadius: '8px', backdropFilter: 'blur(10px)' }}>
            <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.1rem' }}>🛬 Vol Retour</h3>
            <p style={{ margin: '0.5rem 0', fontSize: '0.95rem' }}><strong>📅 Date :</strong> Lundi 20 avril 2026</p>
            <p style={{ margin: '0.5rem 0', fontSize: '0.95rem' }}><strong>🕘 Départ :</strong> 09h20 (9:20 AM)</p>
            <p style={{ margin: '0.5rem 0', fontSize: '0.95rem' }}><strong>🛫 Aéroport :</strong> Varsovie Modlin (WMI)</p>
            <p style={{ margin: '0.5rem 0', fontSize: '0.95rem' }}><strong>🕚 Arrivée :</strong> 11h40 (11:40 AM)</p>
            <p style={{ margin: '0.5rem 0', fontSize: '0.95rem' }}><strong>🛬 Aéroport :</strong> Paris Beauvais (BVA)</p>
            <p style={{ margin: '0.5rem 0', fontSize: '0.95rem' }}><strong>⏱️ Durée :</strong> 2h20</p>
            <p style={{ margin: '0.5rem 0', fontSize: '0.95rem' }}><strong>✈️ Vol :</strong> Ryanair FR1888 (Boeing 737MAX 8)</p>
          </div>
        </div>
        <p style={{ marginTop: '1.5rem', fontSize: '0.9rem', opacity: 0.9 }}>
          📝 <strong>Durée du séjour :</strong> 3 nuits (17-20 avril 2026)
        </p>
        <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
          <a 
            href="https://www.google.com/travel/flights/booking?tfs=CBwQAhpKEgoyMDI2LTA0LTE3IiAKA0JWQRIKMjAyNi0wNC0xNxoDV01JKgJGUjIEMTg4OWoMCAISCC9tLzA1cXRqcgwIAxIIL20vMDgxbV8aShIKMjAyNi0wNC0yMCIgCgNXTUkSCjIwMjYtMDQtMjAaA0JWQSoCRlIyBDE4ODhqDAgDEggvbS8wODFtX3IMCAISCC9tLzA1cXRqQAFIAXABggELCP___________wGYAQE&tfu=CmxDalJJV1hOTU5rUmFTMGhOUjBsQlJYZHZSSGRDUnkwdExTMHRMUzB0ZDJKaVpYY3hNa0ZCUVVGQlIyMVFXVTEzUlZKd05tOUJFZ1pHVWpFNE9EZ2FDZ2lRU2hBQ0dnTkZWVkk0SEhDSFdBPT0SBggAIAIoASIA"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-block',
              background: '#1a1a1a',
              color: 'white',
              padding: '0.75rem 2rem',
              borderRadius: '8px',
              textDecoration: 'none',
              fontWeight: 'bold',
              fontSize: '1rem',
              transition: 'transform 0.2s, box-shadow 0.2s',
              boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
              border: '2px solid white'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.3)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.2)';
            }}
          >
            🎫 Réserver ces vols sur Google Flights
          </a>
        </div>
      </section>
      
      <div className="home-layout">
        {/* Left column: list */}
        <section className="accommodations-list">
          <div className="list-header">
            <h2>🏨 Notre Logement</h2>
          </div>

          {accommodations.map((a) => (
            <div
              key={a.id}
              ref={(el) => { cardRefs.current[a.id] = el }}
            >
              <AccommodationCard
                accommodation={a}
                expanded={expandedId === a.id}
                onToggle={() =>
                  setExpandedId(expandedId === a.id ? null : a.id)
                }
              />
            </div>
          ))}
        </section>

        {/* Right column: map */}
        <section className="map-column">
          <AccommodationMap
            accommodations={accommodations}
            onSelect={scrollToCard}
          />
        </section>
      </div>

      {/* Section Activités */}
      <section style={{
        background: 'linear-gradient(135deg, #16a085 0%, #0a7c68 100%)',
        padding: '2rem',
        borderRadius: '12px',
        marginTop: '2rem',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        color: 'white'
      }}>
        <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem', textAlign: 'center' }}>
          🎯 Activités Proposées
        </h2>
        
        <div style={{
          background: 'rgba(255,255,255,0.1)',
          padding: '1.5rem',
          borderRadius: '12px',
          backdropFilter: 'blur(10px)'
        }}>
          <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.2rem' }}>
            🍸 Musée de la Vodka Polonaise
          </h3>
          <p style={{ margin: '0.5rem 0', fontSize: '0.95rem', lineHeight: '1.6' }}>
            Découvrez l'histoire de la vodka polonaise dans un bâtiment historique ! Visite interactive de 60 minutes + dégustation de 20 minutes. 
            Explorez plus de 500 ans d'histoire de cette boisson nationale et visitez un laboratoire d'alchimiste médiéval.
          </p>
          <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{ fontSize: '0.9rem' }}>⏱️ Durée : 80 min (visite + dégustation)</span>
            <span style={{ fontSize: '0.9rem' }}>💰 Prix : ~70 zł (environ 16€)</span>
          </div>
          <div style={{ marginTop: '1rem' }}>
            <a 
              href="https://muzeumpolskiejwodki.pl/en/tours-and-tasting/standard/"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-block',
                background: 'white',
                color: '#16a085',
                padding: '0.75rem 1.5rem',
                borderRadius: '8px',
                textDecoration: 'none',
                fontWeight: 'bold',
                fontSize: '0.95rem',
                transition: 'transform 0.2s',
                boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              📍 Plus d'infos & Réservation
            </a>
          </div>
          <p style={{ marginTop: '1rem', fontSize: '0.85rem', opacity: 0.9 }}>
            ℹ️ Note : Les billets Basic ne sont pas disponibles les vendredis et samedis.
          </p>
        </div>

        {/* Stand de Tir */}
        <div style={{
          background: 'rgba(255,255,255,0.1)',
          padding: '1.5rem',
          borderRadius: '12px',
          backdropFilter: 'blur(10px)',
          marginTop: '1.5rem'
        }}>
          <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.2rem' }}>
            🔫 Stand de Tir - PM Shooter
          </h3>
          <p style={{ margin: '0.5rem 0', fontSize: '0.95rem', lineHeight: '1.6' }}>
            Expérience unique de tir avec des armes authentiques ! Le Package 1 inclut 50 tirs avec 5 armes différentes : 
            CZ 75 (pistolet), Glock 17, AK-47 (fusil d'assaut), Colt 1911, et fusil.
          </p>
          <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{ fontSize: '0.9rem' }}>🎯 Package 1 : 50 tirs</span>
            <span style={{ fontSize: '0.9rem' }}>💰 Prix : 225 zł (environ 52€)</span>
            <span style={{ fontSize: '0.9rem' }}>⭐ Inclut AK-47</span>
          </div>
          <div style={{ marginTop: '1rem' }}>
            <a 
              href="https://www.pmshooter.pl/index.php/en/arsenal"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-block',
                background: 'white',
                color: '#16a085',
                padding: '0.75rem 1.5rem',
                borderRadius: '8px',
                textDecoration: 'none',
                fontWeight: 'bold',
                fontSize: '0.95rem',
                transition: 'transform 0.2s',
                boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              🎯 Voir tous les packages
            </a>
          </div>
          <p style={{ marginTop: '1rem', fontSize: '0.85rem', opacity: 0.9 }}>
            ℹ️ D'autres packages disponibles avec plus d'armes et de munitions.
          </p>
        </div>

        {/* Activités Culturelles */}
        <div style={{
          background: 'rgba(255,255,255,0.1)',
          padding: '1.5rem',
          borderRadius: '12px',
          backdropFilter: 'blur(10px)',
          marginTop: '1.5rem'
        }}>
          <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.2rem' }}>
            🏛️ Visites Culturelles - Les Incontournables de Varsovie
          </h3>
          
          <div style={{ display: 'grid', gap: '1rem', marginTop: '1rem' }}>
            <div style={{ borderLeft: '3px solid white', paddingLeft: '1rem' }}>
              <strong style={{ fontSize: '1rem' }}>🏰 La Vieille Ville (Stare Miasto)</strong>
              <p style={{ margin: '0.5rem 0', fontSize: '0.9rem', lineHeight: '1.5' }}>
                Cœur historique classé UNESCO, entièrement reconstruit après la guerre. Place du marché colorée, ruelles médiévales, 
                et la statue de la Sirène (symbole de Varsovie).
              </p>
            </div>

            <div style={{ borderLeft: '3px solid white', paddingLeft: '1rem' }}>
              <strong style={{ fontSize: '1rem' }}>🌳 Parc Łazienki & Palais sur l'Eau</strong>
              <p style={{ margin: '0.5rem 0', fontSize: '0.9rem', lineHeight: '1.5' }}>
                Le plus beau parc de Varsovie ! Palais royal sur l'eau, paons en liberté, monument à Chopin 
                (concerts gratuits l'été).
              </p>
            </div>

            <div style={{ borderLeft: '3px solid white', paddingLeft: '1rem' }}>
              <strong style={{ fontSize: '1rem' }}>👑 Château Royal (Zamek Królewski)</strong>
              <p style={{ margin: '0.5rem 0', fontSize: '0.9rem', lineHeight: '1.5' }}>
                Ancienne résidence des rois de Pologne avec salles somptueuses et collection d'art. 
                Marque l'entrée de la Vieille Ville.
              </p>
            </div>

            <div style={{ borderLeft: '3px solid white', paddingLeft: '1rem' }}>
              <strong style={{ fontSize: '1rem' }}>🏢 Palais de la Culture et de la Science</strong>
              <p style={{ margin: '0.5rem 0', fontSize: '0.9rem', lineHeight: '1.5' }}>
                Bâtiment emblématique (style soviétique). Monte à l'observatoire pour une vue panoramique incroyable !
              </p>
            </div>

            <div style={{ borderLeft: '3px solid white', paddingLeft: '1rem' }}>
              <strong style={{ fontSize: '1rem' }}>🎭 Musée de l'Insurrection de Varsovie</strong>
              <p style={{ margin: '0.5rem 0', fontSize: '0.9rem', lineHeight: '1.5' }}>
                Visite immersive et émouvante sur l'insurrection de 1944 contre les nazis. 
                Essentiel pour comprendre l'histoire de la ville.
              </p>
            </div>

            <div style={{ borderLeft: '3px solid white', paddingLeft: '1rem' }}>
              <strong style={{ fontSize: '1rem' }}>🎨 Quartier de Praga</strong>
              <p style={{ margin: '0.5rem 0', fontSize: '0.9rem', lineHeight: '1.5' }}>
                Ancien quartier alternatif : street art, bars locaux, atmosphère authentique et moins touristique.
              </p>
            </div>
          </div>

          <p style={{ marginTop: '1.5rem', fontSize: '0.85rem', opacity: 0.9 }}>
            💡 La plupart de ces lieux sont gratuits ou à prix très réduit. Parfait pour découvrir Varsovie !
          </p>
        </div>
      </section>

      {/* Liste des participants */}
      <section style={{
        background: 'linear-gradient(135deg, #2a5298 0%, #1e3c72 100%)',
        padding: '2rem',
        borderRadius: '12px',
        marginTop: '2rem',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        color: 'white'
      }}>
        <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem', textAlign: 'center' }}>
          👥 Liste des Participants
        </h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
          maxWidth: '1000px',
          margin: '0 auto'
        }}>
          <div style={{ background: 'rgba(255,255,255,0.1)', padding: '1rem', borderRadius: '8px' }}>
            ✅ <strong>OSKAR</strong>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.1)', padding: '1rem', borderRadius: '8px' }}>
            ✅ <strong>ANIL</strong>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.1)', padding: '1rem', borderRadius: '8px' }}>
            ~ <strong>THOMAS</strong>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.1)', padding: '1rem', borderRadius: '8px' }}>
            ~ <strong>AURELIEN G</strong>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.1)', padding: '1rem', borderRadius: '8px' }}>
            ✅ <strong>NATHAN</strong>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.1)', padding: '1rem', borderRadius: '8px' }}>
            ✅ <strong>VICTOR</strong>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.1)', padding: '1rem', borderRadius: '8px' }}>
            ~ <strong>AXEL</strong>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.1)', padding: '1rem', borderRadius: '8px' }}>
            ✅ <strong>TIWAN</strong>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.1)', padding: '1rem', borderRadius: '8px' }}>
            ✅ <strong>JEREM</strong>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.1)', padding: '1rem', borderRadius: '8px' }}>
            ✅ <strong>GAB</strong>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.1)', padding: '1rem', borderRadius: '8px' }}>
            ~ <strong>MAXENCE</strong>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.1)', padding: '1rem', borderRadius: '8px' }}>
            ~ <strong>MILAN</strong>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.1)', padding: '1rem', borderRadius: '8px' }}>
            ~ <strong>MATHIS</strong>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.1)', padding: '1rem', borderRadius: '8px' }}>
            ✅ <strong>GAEL</strong>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.1)', padding: '1rem', borderRadius: '8px' }}>
            ✅ <strong>ELIOTT</strong>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.1)', padding: '1rem', borderRadius: '8px' }}>
            ✅ <strong>CLEMENT</strong>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.1)', padding: '1rem', borderRadius: '8px' }}>
            ~ <strong>CESAR</strong>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.1)', padding: '1rem', borderRadius: '8px' }}>
            ~ <strong>KEVIN</strong>
          </div>
        </div>
        <p style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.95rem', opacity: 0.9 }}>
          ✅ Participation confirmée • ~ Participation à confirmer
        </p>
      </section>

      {/* Questionnaire */}
      <TripQuestionnaire />
    </main>
  )
}
