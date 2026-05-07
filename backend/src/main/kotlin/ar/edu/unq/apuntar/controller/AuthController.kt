package ar.edu.unq.apuntar.controller

import ar.edu.unq.apuntar.dto.LoginReqDto
import ar.edu.unq.apuntar.persistence.repository.UserRepository
import ar.edu.unq.apuntar.security.JwtUtil
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/auth")
class AuthController(
    private val userRepository: UserRepository,
    private val jwtUtil: JwtUtil
) {

    @PostMapping("/login")
    fun login(@RequestBody request: LoginReqDto): ResponseEntity<Map<String, String>> {

        //Busqueda por email
        val user = userRepository.findByMail(request.mail)
            ?: return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body(mapOf("error" to "El correo electronico ingresado no existe"))

        if (request.password != user.password) {
            return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .body(mapOf("error" to "La contrasenia ingresada es incorrecta"))
        }

        val token = jwtUtil.generateToken(user.mail)
        return ResponseEntity.ok(mapOf("token" to token))
    }
}