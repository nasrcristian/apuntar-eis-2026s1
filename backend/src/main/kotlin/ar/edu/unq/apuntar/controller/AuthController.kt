package ar.edu.unq.apuntar.controller

import ar.edu.unq.apuntar.dto.LoginReqDto
import ar.edu.unq.apuntar.service.AuthService
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/auth")
class AuthController(private val authService: AuthService) {

    @PostMapping("/login")
    fun login(@RequestBody request: LoginReqDto): ResponseEntity<Map<String, String>> {
        val token = authService.login(request)
        return ResponseEntity.ok(mapOf("token" to token))
    }
}