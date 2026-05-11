import { Navigate, useLocation } from 'react-router-dom'

interface ProtectedRouteProps {
    children: React.ReactNode

}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
    const token = localStorage.getItem('jwt')
    const location = useLocation()

    if(!token) {
        return <Navigate to="/login" state={{ from: location }} replace />
    }

    return <>{children}</>
}
