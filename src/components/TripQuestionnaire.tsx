import { useState } from 'react'

export default function TripQuestionnaire() {
  const [formData, setFormData] = useState({
    name: '',
    tripType: '',
    activities: '',
    unusualActivities: '',
    budget: '',
    groupPreference: '',
    legiaMatch: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus('idle')

    try {
      const webhookUrl = 'https://discord.com/api/webhooks/1471930569364344873/3E6g7XZOlWO9vtBV7wuy6zRwMSrOwPA4XiY2J2OQHxpwdB-OQQRjx-sxMCxm1MycQp4i'
      
      const message = {
        embeds: [{
          title: '📋 Nouveau questionnaire voyage Pologne',
          color: 0x1e3c72,
          fields: [
            {
              name: '👤 Nom',
              value: formData.name || 'Non renseigné',
              inline: false
            },
            {
              name: '✈️ Type de voyage attendu',
              value: formData.tripType || 'Non renseigné',
              inline: false
            },
            {
              name: '🎯 Activités souhaitées',
              value: formData.activities || 'Non renseigné',
              inline: false
            },
            {
              name: '💡 Activités hors du commun proposées',
              value: formData.unusualActivities || 'Non renseigné',
              inline: false
            },
            {
              name: '💰 Budget (hors billets et hostel)',
              value: formData.budget || 'Non renseigné',
              inline: false
            },
            {
              name: '👥 Préférence groupe/séparé',
              value: formData.groupPreference || 'Non renseigné',
              inline: false
            },
            {
              name: '⚽ Match Legia Warsaw (70€)',
              value: formData.legiaMatch || 'Non renseigné',
              inline: false
            }
          ],
          timestamp: new Date().toISOString(),
          footer: {
            text: '🎂 Anniversaire Oskar en Pologne'
          }
        }]
      }

      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(message)
      })

      if (response.ok) {
        setSubmitStatus('success')
        setFormData({
          name: '',
          tripType: '',
          activities: '',
          unusualActivities: '',
          budget: '',
          groupPreference: '',
          legiaMatch: ''
        })
      } else {
        setSubmitStatus('error')
      }
    } catch (error) {
      console.error('Erreur lors de l\'envoi:', error)
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section style={{
      background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
      padding: '2rem',
      borderRadius: '12px',
      marginTop: '2rem',
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
    }}>
      <h2 style={{ color: 'white', marginBottom: '1.5rem', fontSize: '1.5rem' }}>
        📝 Questionnaire pour organiser le voyage
      </h2>
      
      <form onSubmit={handleSubmit} style={{
        background: '#1a1a1a',
        padding: '2rem',
        borderRadius: '8px',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem'
      }}>
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: 'white' }}>
            👤 Votre nom :
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            style={{
              width: '100%',
              padding: '0.75rem',
              borderRadius: '6px',
              border: '2px solid #1e3c72',
              fontSize: '1rem',
              background: '#2a2a2a',
              color: 'white'
            }}
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: 'white' }}>
            ✈️ Quel type de voyage attendez-vous ? (fête, visites...)
          </label>
          <textarea
            value={formData.tripType}
            onChange={(e) => setFormData({ ...formData, tripType: e.target.value })}
            required
            rows={3}
            style={{
              width: '100%',
              padding: '0.75rem',
              borderRadius: '6px',
              border: '2px solid #1e3c72',
              fontSize: '1rem',
              fontFamily: 'inherit',
              resize: 'vertical',
              background: '#2a2a2a',
              color: 'white'
            }}
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: 'white' }}>
            🎯 Quelles sont les activités que vous voulez faire ?
          </label>
          <textarea
            value={formData.activities}
            onChange={(e) => setFormData({ ...formData, activities: e.target.value })}
            required
            rows={3}
            style={{
              width: '100%',
              padding: '0.75rem',
              borderRadius: '6px',
              border: '2px solid #1e3c72',
              fontSize: '1rem',
              fontFamily: 'inherit',
              resize: 'vertical',
              background: '#2a2a2a',
              color: 'white'
            }}
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: 'white' }}>
            💡 Proposez des activités hors du commun (autre chose que des bars et des boîtes)
          </label>
          <textarea
            value={formData.unusualActivities}
            onChange={(e) => setFormData({ ...formData, unusualActivities: e.target.value })}
            required
            rows={3}
            style={{
              width: '100%',
              padding: '0.75rem',
              borderRadius: '6px',
              border: '2px solid #1e3c72',
              fontSize: '1rem',
              fontFamily: 'inherit',
              resize: 'vertical',
              background: '#2a2a2a',
              color: 'white'
            }}
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: 'white' }}>
            💰 Quel est votre budget pour tout le voyage ? (billets et hostel non compris)
          </label>
          <input
            type="text"
            value={formData.budget}
            onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
            required
            placeholder="Ex: 150-200€"
            style={{
              width: '100%',
              padding: '0.75rem',
              borderRadius: '6px',
              border: '2px solid #1e3c72',
              fontSize: '1rem',
              background: '#2a2a2a',
              color: 'white'
            }}
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: 'white' }}>
            👥 Au vu du nombre de gens, il est compliqué de tout faire toujours ensemble. Est-ce que vous vous voyez faire des activités séparées ou vous voulez toujours rester ensemble ?
          </label>
          <select
            value={formData.groupPreference}
            onChange={(e) => setFormData({ ...formData, groupPreference: e.target.value })}
            required
            style={{
              width: '100%',
              padding: '0.75rem',
              borderRadius: '6px',
              border: '2px solid #1e3c72',
              fontSize: '1rem',
              background: '#2a2a2a',
              color: 'white'
            }}
          >
            <option value="">-- Sélectionnez une option --</option>
            <option value="Toujours ensemble">Toujours ensemble</option>
            <option value="Activités séparées OK">Je suis OK pour faire des activités séparées</option>
            <option value="Mélange des deux">Un mélange des deux</option>
          </select>
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: 'white' }}>
            ⚽ Le lundi 18 il y a un match de Legia Warsaw qui coûte 70 euros. Êtes-vous prêt à payer une telle activité ?
          </label>
          <p style={{ fontSize: '0.9rem', color: '#aaa', marginBottom: '0.5rem' }}>
            <a 
              href="https://www.youtube.com/results?search_query=legia+warsaw+ultras" 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ color: '#5a9fd4', textDecoration: 'underline' }}
            >
              👉 Voir des vidéos des supporters ultra
            </a>
          </p>
          <select
            value={formData.legiaMatch}
            onChange={(e) => setFormData({ ...formData, legiaMatch: e.target.value })}
            required
            style={{
              width: '100%',
              padding: '0.75rem',
              borderRadius: '6px',
              border: '2px solid #1e3c72',
              fontSize: '1rem',
              background: '#2a2a2a',
              color: 'white'
            }}
          >
            <option value="">-- Sélectionnez une option --</option>
            <option value="Oui, je suis partant(e) pour 70€">✅ Oui, je suis partant(e) pour 70€</option>
            <option value="Peut-être, à voir">🤔 Peut-être, à voir</option>
            <option value="Non, trop cher pour moi">❌ Non, trop cher pour moi</option>
          </select>
        </div>

        {submitStatus === 'success' && (
          <div style={{
            padding: '1rem',
            background: '#d4edda',
            color: '#155724',
            borderRadius: '6px',
            border: '1px solid #c3e6cb'
          }}>
            ✅ Merci ! Vos réponses ont été envoyées avec succès.
          </div>
        )}

        {submitStatus === 'error' && (
          <div style={{
            padding: '1rem',
            background: '#f8d7da',
            color: '#721c24',
            borderRadius: '6px',
            border: '1px solid #f5c6cb'
          }}>
            ❌ Erreur lors de l'envoi. Veuillez réessayer.
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          style={{
            padding: '1rem 2rem',
            background: isSubmitting ? '#ccc' : '#1e3c72',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '1.1rem',
            fontWeight: 'bold',
            cursor: isSubmitting ? 'not-allowed' : 'pointer',
            transition: 'transform 0.2s',
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
          }}
          onMouseOver={(e) => {
            if (!isSubmitting) {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.background = '#2a5298';
            }
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.background = '#1e3c72';
          }}
        >
          {isSubmitting ? '📤 Envoi en cours...' : '📤 Envoyer mes réponses'}
        </button>
      </form>
    </section>
  )
}
