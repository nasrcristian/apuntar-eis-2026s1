package ar.edu.unq.apuntar.service

import ar.edu.unq.apuntar.dto.LoginReqDto
import ar.edu.unq.apuntar.persistence.repository.UserRepository
import ar.edu.unq.apuntar.security.JwtUtil
import org.springframework.http.HttpStatus
import org.springframework.stereotype.Service
import org.springframework.web.server.ResponseStatusException

@Service
class AuthServiceImpl (
    private val userRepository: UserRepository,
    private val jwtUtil: JwtUtil
) : AuthService {
    override fun login(request: LoginReqDto): String {
        val user = userRepository.findByMail(request.mail)
            ?: throw ResponseStatusException(HttpStatus.NOT_FOUND, "El correo ingresado no existe")

        if (request.password != user.password) {
            throw ResponseStatusException(HttpStatus.UNAUTHORIZED, "La contrasenia ingresada es incorrecta")
        }

        return jwtUtil.generateToken(user.mail)
    }
}


