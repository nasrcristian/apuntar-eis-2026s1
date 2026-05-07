package ar.edu.unq.apuntar.security

import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test

class JwtUtilTest {

    private val secret = "RBCj+ZLbXkK8ifj1ApAJ8gUwUdvZdL0kE3zRYyxm/f9NfbJwWhTnQJayYLX3mdfF"
    private lateinit var jwtUtil: JwtUtil

    @BeforeEach
    fun setup() {
        jwtUtil = JwtUtil(secret, 86_400_000L) // 24h
    }

    @Test
    fun `generateToken devuelve un JWT con tres partes`() {
        val token = jwtUtil.generateToken("test@test.com")
        assertEquals(3, token.split(".").size)
    }

    @Test
    fun `extractUsername devuelve el mismo email que se uso para generar el token`() {
        val token = jwtUtil.generateToken("test@test.com")
        assertEquals("test@test.com", jwtUtil.extractUsername(token))
    }

    @Test
    fun `extractUsername devuelve null si el token es invalido`() {
        assertNull(jwtUtil.extractUsername("esto.no.es.un.jwt"))
    }

    @Test
    fun `isTokenValid es true para un token valido y email coincidente`() {
        val token = jwtUtil.generateToken("test@test.com")
        assertTrue(jwtUtil.isTokenValid(token, "test@test.com"))
    }

    @Test
    fun `isTokenValid es false si el email no coincide`() {
        val token = jwtUtil.generateToken("test@test.com")
        assertFalse(jwtUtil.isTokenValid(token, "otro@test.com"))
    }

    @Test
    fun `un token expirado no es valido`() {
        val expiredJwtUtil = JwtUtil(secret, -1_000L) // ya expirado al generarlo
        val token = expiredJwtUtil.generateToken("test@test.com")
        assertFalse(expiredJwtUtil.isTokenValid(token, "test@test.com"))
    }

    @Test
    fun `dos tokens generados con el mismo email son distintos en el tiempo`() {
        val t1 = jwtUtil.generateToken("test@test.com")
        Thread.sleep(1_100) // los iat tienen resolución de segundos
        val t2 = jwtUtil.generateToken("test@test.com")
        assertNotEquals(t1, t2)
    }
}