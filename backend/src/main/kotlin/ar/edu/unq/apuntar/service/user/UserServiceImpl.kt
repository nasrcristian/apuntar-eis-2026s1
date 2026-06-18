package ar.edu.unq.apuntar.service

import ar.edu.unq.apuntar.exception.UserAlreadyExistsException
import ar.edu.unq.apuntar.exception.UserNotFoundException
import ar.edu.unq.apuntar.model.User
import ar.edu.unq.apuntar.persistence.repository.UserRepository
import jakarta.transaction.Transactional
import org.springframework.stereotype.Service
import java.util.UUID


@Service
@Transactional
class UserServiceImpl(private val repository: UserRepository) : UserService {

    override fun register(user: User): User {

        repository.findByMail(user.mail)?.let{
            throw UserAlreadyExistsException(user.mail)
        }

        return repository.save(user)
    }

    override fun getUserByEmail(email: String): User? {
        return repository.findByMail(email)
    }

    override fun updateDescription(email: String, description: String?): User {
        val user = repository.findByMail(email)
            ?: throw UserNotFoundException("Usuario no encontrado: $email")
        user.description = description
        return repository.save(user)
    }
}