package ar.edu.unq.apuntar.dto

data class LoginResDto(
    val token: String,
    val user: UserDto  // o la entidad directamente si no tenés DTO de usuario
)