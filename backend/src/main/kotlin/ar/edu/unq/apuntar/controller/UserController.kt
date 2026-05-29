package ar.edu.unq.apuntar.controller

import ar.edu.unq.apuntar.dto.UserDto
import ar.edu.unq.apuntar.dto.toDto
import ar.edu.unq.apuntar.dto.user.RegisterReqDto
import ar.edu.unq.apuntar.service.UserService
import org.springframework.security.core.Authentication
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
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
}
