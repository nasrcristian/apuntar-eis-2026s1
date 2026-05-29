package ar.edu.unq.apuntar.service

import ar.edu.unq.apuntar.model.User

interface UserService {
    fun register(user: User): User
}