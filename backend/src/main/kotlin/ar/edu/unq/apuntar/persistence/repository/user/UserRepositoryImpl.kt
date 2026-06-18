package ar.edu.unq.apuntar.persistence.repository

import ar.edu.unq.apuntar.model.User
import ar.edu.unq.apuntar.persistence.dao.UserDao
import org.springframework.stereotype.Repository

@Repository
class UserRepositoryImpl(private val dao: UserDao) : UserRepository{
    override fun findByMail(mail: String): User? = dao.findByMail(mail)
    override fun save(user: User): User = dao.save(user)
}