package ar.edu.unq.apuntar.persistence.dao

import ar.edu.unq.apuntar.model.PasswordResetToken
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import java.util.UUID

@Repository
interface PasswordResetTokenDao : JpaRepository<PasswordResetToken, UUID> {
    fun findByToken(token: String): PasswordResetToken?
}