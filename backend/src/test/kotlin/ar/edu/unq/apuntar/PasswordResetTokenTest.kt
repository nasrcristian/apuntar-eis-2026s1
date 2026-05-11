package ar.edu.unq.apuntar

import ar.edu.unq.apuntar.model.PasswordResetToken
import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.Test
import java.time.LocalDateTime
import java.util.UUID

class PasswordResetTokenTest {

    private fun newToken(
        expiresAt: LocalDateTime = LocalDateTime.now().plusMinutes(30),
        usedAt: LocalDateTime? = null
    ) = PasswordResetToken(
        userMail = "test@test.com",
        token = UUID.randomUUID().toString(),
        expiresAt = expiresAt,
        usedAt = usedAt
    )

    @Test
    fun `un token recien creado no esta expirado`() {
        assertFalse(newToken().isExpired())
    }

    @Test
    fun `un token con expiracion en el pasado esta expirado`() {
        assertTrue(newToken(expiresAt = LocalDateTime.now().minusMinutes(1)).isExpired())
    }

    @Test
    fun `un token con usedAt en null no esta usado`() {
        assertFalse(newToken().isUsed())
    }

    @Test
    fun `un token con usedAt seteado esta usado`() {
        assertTrue(newToken(usedAt = LocalDateTime.now()).isUsed())
    }

    @Test
    fun `un token nuevo es valido`() {
        assertTrue(newToken().isValid())
    }

    @Test
    fun `un token expirado no es valido`() {
        assertFalse(newToken(expiresAt = LocalDateTime.now().minusMinutes(1)).isValid())
    }

    @Test
    fun `un token usado no es valido aunque no este expirado`() {
        assertFalse(newToken(usedAt = LocalDateTime.now()).isValid())
    }
}
