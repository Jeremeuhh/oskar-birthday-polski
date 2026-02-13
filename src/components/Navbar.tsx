import { NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { profile, signOut } = useAuth()

  return (
    <nav className="container-fluid">
      <ul>
        <li>
          <strong>🇵🇱 Oskar Birthday Trip</strong>
        </li>
      </ul>
      <ul>
        <li>
          <NavLink to="/">Logements</NavLink>
        </li>
        <li>
          <NavLink to="/ranking">Classement</NavLink>
        </li>
        {profile && (
          <li>
            <span className="user-badge">
              {profile.avatar_url && (
                <img
                  src={profile.avatar_url}
                  alt=""
                  className="avatar-small"
                />
              )}
              {profile.name}
            </span>
          </li>
        )}
        <li>
          <button className="outline secondary" onClick={signOut}>
            Déconnexion
          </button>
        </li>
      </ul>
    </nav>
  )
}
