package ar.edu.unq.apuntar.service

import ar.edu.unq.apuntar.dto.auth.LoginReqDto
import ar.edu.unq.apuntar.model.PasswordResetToken
import ar.edu.unq.apuntar.persistence.dao.PasswordResetTokenDao
import ar.edu.unq.apuntar.persistence.repository.UserRepository
import ar.edu.unq.apuntar.security.JwtUtil
import jakarta.transaction.Transactional
import org.springframework.http.HttpStatus
import org.springframework.stereotype.Service
import org.springframework.web.server.ResponseStatusException
import java.time.LocalDateTime
import java.util.UUID

@Service
class AuthServiceImpl (
    private val userRepository: UserRepository,
    private val tokenDao: PasswordResetTokenDao,
    private val jwtUtil: JwtUtil
) : AuthService {
    override fun login(request: LoginReqDto): String {
        val user = userRepository.findByMail(request.mail)
            ?: throw ResponseStatusException(HttpStatus.NOT_FOUND, "Credenciales invalidas")
        if (request.password != user.password) {
            throw ResponseStatusException(HttpStatus.UNAUTHORIZED, "Credenciales invalidas")
        }
        return jwtUtil.generateToken(user.mail)
    }

    @Transactional
    override fun requestPasswordReset(mail: String): String? {
        // si el mail no existe devuelvo null para no filtrar info
        val user = userRepository.findByMail(mail) ?: return null
        val token = UUID.randomUUID().toString()
        tokenDao.save(
            PasswordResetToken(
                userMail = user.mail,
                token = token,
                expiresAt = LocalDateTime.now().plusMinutes(30)
            )
        )
        return token
    }

    @Transactional
    override fun resetPassword(token: String, newPassword: String) {
        val resetToken = tokenDao.findByToken(token)
            ?: throw ResponseStatusException(HttpStatus.BAD_REQUEST, "Token inválido")
        if (!resetToken.isValid()) {
            throw ResponseStatusException(HttpStatus.BAD_REQUEST, "Token expirado o ya utilizado")
        }
        val user = userRepository.findByMail(resetToken.userMail)
            ?: throw ResponseStatusException(HttpStatus.NOT_FOUND, "Usuario no encontrado")
        user.password = newPassword
        userRepository.save(user)
        resetToken.usedAt = LocalDateTime.now()
        tokenDao.save(resetToken)
    }
}


