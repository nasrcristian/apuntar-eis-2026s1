package ar.edu.unq.apuntar.security

import io.jsonwebtoken.Jwts
import io.jsonwebtoken.security.Keys
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Component
import java.util.Date

@Component
class JwtUtil(
    @Value("\${jwt.secret}") private val secret: String,
    @Value("\${jwt.expiration}") private val expiration: Long
) {
    private val key get() = Keys.hmacShaKeyFor(secret.toByteArray())

    fun generateToken(email: String): String =
        Jwts.builder()
            .subject(email)
            .issuedAt(Date())
            .expiration(Date(System.currentTimeMillis() + expiration))
            .signWith(key)
            .compact()

    fun extractUsername(token: String): String? {
        return try {
            Jwts.parser()
                .verifyWith(key)
                .build()
                .parseSignedClaims(token)
                .payload
                .subject // Aquí es donde guardaste el mail al generar el token
        } catch (e: Exception) {
            null
        }
    }

    // Valida si el token es del usuario y no expiró
    fun isTokenValid(token: String, email: String): Boolean {
        val extractedEmail = extractUsername(token)
        return (extractedEmail == email && !isTokenExpired(token))
    }

    private fun isTokenExpired(token: String): Boolean {
        val expiration = Jwts.parser()
            .verifyWith(key)
            .build()
            .parseSignedClaims(token)
            .payload
            .expiration
        return expiration.before(Date())
    }
}