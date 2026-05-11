package ar.edu.unq.apuntar.dto.auth

import jakarta.validation.constraints.NotBlank

data class ForgotPasswordReqDto(
    @field:NotBlank(message = "Se debe ingresar un correo")
    val mail: String
)