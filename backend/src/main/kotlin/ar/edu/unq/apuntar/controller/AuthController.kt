package ar.edu.unq.apuntar.controller

import ar.edu.unq.apuntar.dto.LoginResDto
import ar.edu.unq.apuntar.dto.auth.ForgotPasswordReqDto
import ar.edu.unq.apuntar.dto.auth.LoginReqDto
import ar.edu.unq.apuntar.dto.auth.ResetPasswordReqDto
import ar.edu.unq.apuntar.service.AuthService
import jakarta.validation.Valid
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/auth")
class AuthController(private val authService: AuthService) {

    @PostMapping("/login")
    fun login(@RequestBody request: LoginReqDto): ResponseEntity<LoginResDto> {
        val loginRes = authService.login(request)
        return ResponseEntity.ok(loginRes)
    }

    @PostMapping("/forgot-password")
    fun forgotPassword(@RequestBody @Valid request: ForgotPasswordReqDto): ResponseEntity<Map<String, String?>> {
        val token = authService.requestPasswordReset(request.mail)
        // Devolvemos siempre 200 para no filtrar si el mail existe.
        // El campo "token" se incluye SOLO PARA LA DEMO, en producción se mandaría por mail.
        return ResponseEntity.ok(mapOf(
            "message" to "Si el correo está registrado, podrás restablecer tu contraseña",
            "token" to token
        ))
    }

    @PostMapping("/reset-password")
    fun resetPassword(@RequestBody @Valid request: ResetPasswordReqDto): ResponseEntity<Map<String, String>> {
        authService.resetPassword(request.token, request.newPassword)
        return ResponseEntity.ok(mapOf("message" to "Contraseña actualizada"))
    }
}