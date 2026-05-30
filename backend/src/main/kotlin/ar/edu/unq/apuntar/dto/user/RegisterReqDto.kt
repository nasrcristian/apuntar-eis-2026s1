package ar.edu.unq.apuntar.dto.user

import ar.edu.unq.apuntar.model.User
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.Size

data class RegisterReqDto(

    @field:NotBlank("El nombre no puede estar vacio")
    val name: String,

    @field:NotBlank("El apellido no puede estar vacio")
    val surname: String,

    @field:NotBlank("Se debe ingresar un correo")
    val mail: String,

    @field:NotBlank("Se debe ingresar una contraseña")
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