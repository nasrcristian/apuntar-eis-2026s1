package ar.edu.unq.apuntar.controller

import ar.edu.unq.apuntar.dto.UserDto
import ar.edu.unq.apuntar.dto.toDto
import ar.edu.unq.apuntar.dto.user.RegisterReqDto
import ar.edu.unq.apuntar.dto.user.UpdateProfileReqDto
import ar.edu.unq.apuntar.service.UserService
import jakarta.validation.Valid
import org.springframework.http.ResponseEntity
import org.springframework.security.core.Authentication
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/user")
class UserController(private val service: UserService) {

    @PostMapping
    fun register(@RequestBody user: RegisterReqDto): UserDto = service.register(user.asModel()).toDto()

    @GetMapping("/me")
    fun getCurrentUser(authentication: Authentication): UserDto? {
        val email = authentication.name
        return service.getUserByEmail(email)?.toDto()
    }

    @GetMapping("/perfil")
    fun getUserProfile(@RequestParam mail: String): ResponseEntity<UserDto> {
        val user = service.getUserByEmail(mail) ?: return ResponseEntity.notFound().build()
        return ResponseEntity.ok(user.toDto())
    }

    @PutMapping("/me")
    fun updateMyProfile(
        @RequestBody @Valid body: UpdateProfileReqDto,
        authentication: Authentication,
    ): UserDto = service.updateDescription(authentication.name, body.description).toDto()
}
