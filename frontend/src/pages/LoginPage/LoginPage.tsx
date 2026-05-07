import { useState } from 'react'
import './LoginPage.css'

export default function LoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState<String | null>(null)
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const validate = (): boolean => {
        if(!email.trim() || !password.trim()) {
            setError('Los datos ingresados son incorrectos')
            return false
        }
        return true
    }

    const handleLogin = async () => {
        setError(null)
        if (!validate()) return

        setLoading(true)
        try {
            const response = await fetch('http://localhost:8080/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ mail: email, password }),
            })

            const data = await response.json()

            if(response.ok) {
                localStorage.setItem('jwt', data.token)
                navigate('/home')
            } else {
                setError(data.error ?? 'Los datos ingresados son incorrectos')
            }
        } catch {
            setError('Los datos ingresados son incorrectos')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="login-wrapper">
            <div className="login-card">
                <h1 className="login-title">Iniciar Sesión</h1>

                <div className="login-field">
                    <label htmlFor="email">Correo electrónico</label>
                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="correo@ejemplo.com"
                        autoComplete="email"
                    />
                </div>

                <div className="login-field">
                    <label htmlFor="password">Contraseña</label>
                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        placeholder="Tu contraseña"
                        autoComplete="current-password"
                    />
                </div>

                {error && (
                    <p className="login-error" role="alert">
                        {error}
                    </p>
                )}

                <button
                    type="button"
                    className="login-forgot"
                    onClick={() => {
                        // TODO APUNTAR-7: flujo de recuperación de contraseña
                    }}
                >
                    ¿Olvidaste tu contraseña?
                </button>

                <button
                    type="button"
                    className="login-submit"
                    onClick={handleLogin}
                    disabled={loading}
                >
                    {loading ? 'Cargando...' : 'Iniciar Sesión'}
                </button>
            </div>
        </div>
    )
}