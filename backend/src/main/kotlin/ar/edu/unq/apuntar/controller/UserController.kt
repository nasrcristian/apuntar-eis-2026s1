package ar.edu.unq.apuntar.controller

import ar.edu.unq.apuntar.dto.UserDto
import ar.edu.unq.apuntar.service.UserService
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/user")
class UserController(private val service: UserService) {

    @GetMapping("/")
    fun getUsers(): List<UserDto> = service.getUsers()






}
