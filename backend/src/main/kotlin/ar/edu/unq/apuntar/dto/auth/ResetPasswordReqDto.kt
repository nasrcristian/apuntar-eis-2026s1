package ar.edu.unq.apuntar.dto.auth

import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.Size

data class ResetPasswordReqDto(
    @field:NotBlank(message = "Se debe ingresar un token")
    val token: String,

    @field:NotBlank(message = "Se debe ingresar una contrasenia")
    @field:Size(min = 8, message = "La contrasenia debe tener al menos 8 carcteres")
    val newPassword: String
)