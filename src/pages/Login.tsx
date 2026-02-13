import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const { signIn, signUp } = useAuth()
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    if (isSignUp) {
      if (!name.trim()) {
        setError('Le nom est obligatoire')
        setLoading(false)
        return
      }
      const { error: signUpError } = await signUp(email, password, name.trim())
      if (signUpError) {
        setError(signUpError)
      } else {
        setError(null)
        // On peut afficher un message de confirmation email si besoin
      }
    } else {
      const { error: signInError } = await signIn(email, password)
      if (signInError) {
        setError(signInError)
      }
    }

    setLoading(false)
  }

  return (
    <main className="container">
      <article className="login-card">
        <header>
          <h1>🇵🇱 Anniversaire d'Oskar</h1>
          <p>Voyage en Pologne — Organise-toi avec tes potes !</p>
        </header>

        <form onSubmit={handleSubmit}>
          {isSignUp && (
            <label>
              Nom / Pseudo
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Thomas"
                required
              />
            </label>
          )}

          <label>
            Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="thomas@example.com"
              required
            />
          </label>

          <label>
            Mot de passe
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              minLength={6}
              required
            />
          </label>

          {error && <p className="error-text">{error}</p>}

          <button type="submit" disabled={loading} aria-busy={loading}>
            {loading ? 'Chargement…' : isSignUp ? "S'inscrire" : 'Se connecter'}
          </button>
        </form>

        <footer>
          <button
            className="outline secondary"
            onClick={() => {
              setIsSignUp(!isSignUp)
              setError(null)
            }}
          >
            {isSignUp
              ? 'Déjà un compte ? Se connecter'
              : "Pas de compte ? S'inscrire"}
          </button>
        </footer>
      </article>
    </main>
  )
}
