package ar.edu.unq.apuntar.exception

import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.ControllerAdvice
import org.springframework.web.bind.annotation.ExceptionHandler

@ControllerAdvice
class GlobalExceptionHandler {
    @ExceptionHandler(InvalidMaterialException::class)
    fun handleInvalidMaterialException(ex: InvalidMaterialException): ResponseEntity<String> =
        ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ex.message)

    @ExceptionHandler(MaterialNotFoundException::class)
    fun handleMaterialNotFoundException(ex: MaterialNotFoundException): ResponseEntity<String> =
        ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.message)

    @ExceptionHandler(IllegalStateException::class)
    fun handleIllegalStateException(ex: IllegalStateException): ResponseEntity<String> =
        ResponseEntity.status(HttpStatus.CONFLICT).body(ex.message)
}
