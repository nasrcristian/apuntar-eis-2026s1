import { Link, useNavigate, useLocation } from 'react-router-dom'
import MenuBookIcon from '@mui/icons-material/MenuBook'
import { useAuth } from '../../context/AuthContext'
import NavigationButton from './NavigationButton'
import './Navbar.css'

const PROTECTED_ROUTES = ['/create', '/profile']

export default function Navbar() {
  const { isLoggedIn, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    logout()
    if (PROTECTED_ROUTES.includes(location.pathname)) {
      navigate('/login')
    }
  }

  return (
    <header className="navbar">
      <div className="navbar__left">
        <Link to="/" className="navbar__logo">
          <MenuBookIcon fontSize="small" />
          <span className="navbar__logo-text">Apuntar</span>
        </Link>
        <nav className="navbar__links">
          <NavigationButton title="Materiales" to="/library" />
          <NavigationButton
            title="Quiero Colaborar"
            to="/create"
            onClick={
              isLoggedIn
                ? undefined
                : (e) => {
                    e.preventDefault()
                    navigate('/login')
                  }
            }
          />
        </nav>
      </div>
      <div className="navbar__right">
        {isLoggedIn ? (
          <>
            <NavigationButton title="Mi Perfil" to="/profile" />
            <span className="nav-btn" onClick={handleLogout}>
              Cerrar Sesion
            </span>
          </>
        ) : (
          <NavigationButton title="Iniciar Sesion" to="/login" />
        )}
      </div>
    </header>
  )
}
