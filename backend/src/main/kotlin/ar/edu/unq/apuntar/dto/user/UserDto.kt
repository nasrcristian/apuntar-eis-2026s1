package ar.edu.unq.apuntar.dto

import ar.edu.unq.apuntar.model.User

data class UserDto(
    val name: String,
    val surname: String,
    val mail: String,
    val description: String?,
)

fun User.toDto() = UserDto(
    name = name,
    surname = surname,
    mail = mail,
    description = description,
)
