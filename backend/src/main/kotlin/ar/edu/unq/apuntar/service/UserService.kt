package ar.edu.unq.apuntar.service

import ar.edu.unq.apuntar.dto.UserDto
import org.springframework.stereotype.Service

@Service
interface UserService {
    fun getUsers(): List<UserDto>
}