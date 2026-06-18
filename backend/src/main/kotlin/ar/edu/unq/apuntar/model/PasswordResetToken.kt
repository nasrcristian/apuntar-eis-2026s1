package ar.edu.unq.apuntar.model

import jakarta.persistence.*
import java.time.LocalDateTime
import java.util.UUID

@Entity
@Table(name = "password_reset_tokens")
class PasswordResetToken(
    @Id
    val id: UUID = UUID.randomUUID(),

    @Column(nullable = false)
    val userMail: String,

    @Column(nullable = false, unique = true)
    val token: String,

    @Column(nullable = false)
    val expiresAt: LocalDateTime,

    @Column
    var usedAt: LocalDateTime? = null

) {
    fun isExpired() : Boolean = LocalDateTime.now().isAfter(expiresAt)
    fun isUsed(): Boolean = usedAt != null
    fun isValid(): Boolean = !isExpired() && !isUsed()
}