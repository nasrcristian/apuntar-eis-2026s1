package ar.edu.unq.apuntar.dto.user

import jakarta.validation.constraints.Size

data class UpdateProfileReqDto(
    @field:Size(max = 500, message = "La descripción no puede superar los 500 caracteres")
    val description: String?,
)
