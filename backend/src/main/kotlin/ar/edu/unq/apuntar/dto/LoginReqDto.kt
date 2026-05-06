package ar.edu.unq.apuntar.dto

import jakarta.validation.constraints.NotBlank

data class LoginReqDto(

    @field:NotBlank("Se debe ingresar un correo")
    val mail: String, //email

    @field:NotBlank("Se debe ingresar una contraseña")
    val password: String
)
