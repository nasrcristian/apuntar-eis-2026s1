package ar.edu.unq.apuntar.persistence.repository

import ar.edu.unq.apuntar.model.User
import org.springframework.stereotype.Repository

@Repository
interface UserRepository {

    fun findByMail(mail: String): User?
    fun save(user: User): User

}