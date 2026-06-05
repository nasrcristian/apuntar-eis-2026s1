package ar.edu.unq.apuntar.service

import ar.edu.unq.apuntar.model.User
import java.util.UUID

interface UserService {
    fun register(user: User): User
    fun getUserByEmail(email: String): User?
    fun updateDescription(email: String, description: String?): User
}