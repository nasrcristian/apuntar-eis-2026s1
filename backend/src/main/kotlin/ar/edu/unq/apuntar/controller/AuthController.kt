package ar.edu.unq.apuntar.controller

import ar.edu.unq.apuntar.dto.LoginReqDto
import ar.edu.unq.apuntar.persistence.repository.UserRepository
import ar.edu.unq.apuntar.security.JwtUtil
import jakarta.servlet.http.HttpServletResponse
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/auth")
class AuthController(
    private val userRepository: UserRepository,
    private val jwtUtil: JwtUtil,
    private val passwordEncoder: BCryptPasswordEncoder
) {

    @PostMapping("/login")
    fun login(
        @RequestBody request: LoginReqDto,
        response: HttpServletResponse
    ): ResponseEntity<Map<String, String>> {

        //Busqueda por email
        val user = userRepository.findByMail(request.mail)
            ?: return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body(mapOf("error" to "El correo electronico ingresado no existe"))

        if (!passwordEncoder.matches(request.password, user.password)) {
            return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .body(mapOf("error" to "La contrasenia ingresada es incorrecta"))
        }

        val token = jwtUtil.generateToken(user.mail)

        //Guardo el JWT en Cookie HttpOnly (No accesible desde JS)
        val cookie = jakarta.servlet.http.Cookie("jwt", token).apply {
            isHttpOnly = true
            secure = false //cambiar a true en produccion (requiere HTTPS)
            path = "/"
            maxAge = 86400 //24 horas en segundos
        }
        response.addCookie(cookie)

        return ResponseEntity.ok(mapOf("message" to "Login exitoso")) //maybe sacar el message?
    }
}