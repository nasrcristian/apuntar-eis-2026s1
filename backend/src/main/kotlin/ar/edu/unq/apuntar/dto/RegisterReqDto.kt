package ar.edu.unq.apuntar.dto

import ar.edu.unq.apuntar.model.User
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.Size

data class RegisterReqDto(

    @field:NotBlank
    val name: String,

    @field:NotBlank
    val surname: String,

    @field:NotBlank
    val mail: String,

    @field:NotBlank
    @field:Size(min = 8)
    val password: String,
){

    fun asModel(): User {
        return User(
            name = name,
            surname = surname,
            mail = mail,
            password = password,
        )
    }
}
