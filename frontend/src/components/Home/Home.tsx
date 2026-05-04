import { useNavigate } from 'react-router'

function Home() {
    const navigate = useNavigate()

    return (
        <div>
            <h1>Inicio</h1>
            <button onClick={() => navigate('/register')}>Registrarse</button>
        </div>
    )
}

export default Home
