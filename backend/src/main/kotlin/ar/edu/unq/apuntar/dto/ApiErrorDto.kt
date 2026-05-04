package ar.edu.unq.apuntar.dto

import java.time.Instant

data class ApiErrorDto(
    val path: String,
    val status: Int,
    val message: String,
    val timestamp: Instant,
    val validationErrors: List<ValidationError>? = null
) {
    class Builder { // Asi se hace en la administración pública B)
        private var path: String = ""
        private var status: Int = 500
        private var message: String = "Error de servidor"
        private var timestamp: Instant = Instant.now()
        private var validationErrors: List<ValidationError>? = null

        fun path(path: String) = apply { this.path = path }
        fun status(status: Int) = apply { this.status = status }
        fun message(message: String) = apply { this.message = message }
        fun timestamp(timestamp: Instant) = apply { this.timestamp = timestamp }

        fun validationErrors(errors: List<ValidationError>) =
            apply { this.validationErrors = errors }

        fun build(): ApiErrorDto {
            return ApiErrorDto(
                path = path,
                status = status,
                message = message,
                timestamp = timestamp,
                validationErrors = validationErrors
            )
        }
    }
}

data class ValidationError(
    val field: String,
    val error: String
)