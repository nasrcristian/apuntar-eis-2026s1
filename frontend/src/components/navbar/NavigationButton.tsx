import { NavLink } from 'react-router-dom'
import './NavigationButton.css'

interface NavigationButtonProps {
  title: string
  to: string
  onClick?: (e: React.MouseEvent) => void
}

export default function NavigationButton({ title, to, onClick }: NavigationButtonProps) {
  return (
    <NavLink to={to} className="nav-btn" onClick={onClick}>
      {({ isActive }) => (
        <span className={isActive ? 'nav-btn--active' : undefined}>{title}</span>
      )}
    </NavLink>
  )
}
