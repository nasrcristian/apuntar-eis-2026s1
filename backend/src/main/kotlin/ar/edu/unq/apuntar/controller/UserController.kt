package ar.edu.unq.apuntar.controller

import ar.edu.unq.apuntar.dto.RegisterReqDto
import ar.edu.unq.apuntar.dto.UserDto
import ar.edu.unq.apuntar.dto.toDto
import ar.edu.unq.apuntar.service.UserService
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/user")
class UserController(private val service: UserService) {

    @PostMapping
    fun register(@RequestBody user: RegisterReqDto): UserDto = service.register(user.asModel()).toDto()

}
