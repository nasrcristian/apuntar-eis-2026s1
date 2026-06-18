package ar.edu.unq.apuntar.controller

import ar.edu.unq.apuntar.exception.UserAlreadyExistsException
import ar.edu.unq.apuntar.dto.ApiErrorDto
import ar.edu.unq.apuntar.dto.ValidationError
import ar.edu.unq.apuntar.exception.InvalidMailException
import ar.edu.unq.apuntar.exception.InvalidMaterialException
import ar.edu.unq.apuntar.exception.MaterialNotFoundException
import ar.edu.unq.apuntar.exception.UserNotFoundException
import jakarta.servlet.http.HttpServletRequest
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.http.converter.HttpMessageNotReadableException
import org.springframework.web.bind.MethodArgumentNotValidException
import org.springframework.web.bind.annotation.ExceptionHandler
import org.springframework.web.bind.annotation.RestControllerAdvice
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException
import org.springframework.web.server.ResponseStatusException
import ar.edu.unq.apuntar.exception.ForbiddenActionException


@RestControllerAdvice
class GlobalErrorHandler {

    @ExceptionHandler(ResponseStatusException::class)
    fun handleResponseStatusException(
        ex: ResponseStatusException,
        request: HttpServletRequest
    ): ResponseEntity<ApiErrorDto> {
        return buildStandardResponse(
            HttpStatus.valueOf(ex.statusCode.value()),
            request.requestURI,
            ex.reason ?: "Error"
        )
    }

    @ExceptionHandler(InvalidMaterialException::class)
    fun handleInvalidMaterialException(ex: InvalidMaterialException): ResponseEntity<String> =
        ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ex.message)

    @ExceptionHandler(ForbiddenActionException::class)
    fun handleForbiddenAction(ex: ForbiddenActionException): ResponseEntity<String> =
        ResponseEntity.status(HttpStatus.FORBIDDEN).body(ex.message)

    @ExceptionHandler(MaterialNotFoundException::class)
    fun handleMaterialNotFoundException(ex: MaterialNotFoundException): ResponseEntity<String> =
        ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.message)

    @ExceptionHandler(UserNotFoundException::class)
    fun handleUserNotFoundException(ex: UserNotFoundException): ResponseEntity<String> =
        ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.message)

    @ExceptionHandler(UserAlreadyExistsException::class)
    fun handleConflict(ex: RuntimeException, request: HttpServletRequest): ResponseEntity<ApiErrorDto> {
        return buildStandardResponse(HttpStatus.CONFLICT, request.requestURI, ex.message ?: "Datos ingresados inconsistentes")
    }

    @ExceptionHandler(InvalidMailException::class)
    fun handleBadRequest(ex: RuntimeException, request: HttpServletRequest): ResponseEntity<ApiErrorDto>{
        return buildStandardResponse(HttpStatus.BAD_REQUEST, request.requestURI, ex.message ?: "Datos ingresados incorrectos")
    }

    @ExceptionHandler(Exception::class) // fallback por si se escapa algo
    fun handleUnexpectedException(ex: Exception, request: HttpServletRequest): ResponseEntity<ApiErrorDto>{
        return buildStandardResponse(HttpStatus.INTERNAL_SERVER_ERROR, request.requestURI, ex.message ?: "Error del servidor")
    }

    @ExceptionHandler(MethodArgumentNotValidException::class)
    fun handleValidationErrors(
        ex: MethodArgumentNotValidException,
        request: HttpServletRequest
    ): ResponseEntity<ApiErrorDto> {
        val errors = ex.bindingResult.fieldErrors.map {
            ValidationError(
                field = it.field,
                error = it.defaultMessage ?: "Valor inválido"
            )
        }


        return buildValidationResponse(HttpStatus.BAD_REQUEST, request.requestURI, "Error en la validacion de los campos", errors)
    }

    @ExceptionHandler(MethodArgumentTypeMismatchException::class)
    fun handleTypeMismatch(
        ex: MethodArgumentTypeMismatchException,
        request: HttpServletRequest
    ): ResponseEntity<ApiErrorDto> {
        val field = ex.name
        val message = "El parámetro '$field' tiene un tipo inválido"

        return buildStandardResponse(HttpStatus.BAD_REQUEST, request.requestURI, message)
    }

    @ExceptionHandler(HttpMessageNotReadableException::class)
    fun handleMessageNotReadable(
        ex: HttpMessageNotReadableException,
        request: HttpServletRequest
    ): ResponseEntity<ApiErrorDto>{
        return buildStandardResponse(HttpStatus.BAD_REQUEST, request.requestURI, ex.message?: "Error de formato de datos o cuerpo faltante")

    }

    private fun buildStandardResponse(status: HttpStatus, path: String, message: String) : ResponseEntity<ApiErrorDto>{
        val error = ApiErrorDto.Builder()
            .path(path)
            .status(status.value())
            .message(message)
            .build()
        return ResponseEntity(error, status)
    }

    private fun buildValidationResponse(status: HttpStatus, path: String, message: String, errors: List<ValidationError>) : ResponseEntity<ApiErrorDto>{
        val error = ApiErrorDto.Builder()
            .path(path)
            .status(status.value())
            .message(message)
            .validationErrors(errors)
            .build()

        return ResponseEntity.badRequest().body(error)
    }
}