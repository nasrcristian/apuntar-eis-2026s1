package ar.edu.unq.apuntar.service

import ar.edu.unq.apuntar.exception.UserAlreadyExistsException
import ar.edu.unq.apuntar.model.User
import ar.edu.unq.apuntar.persistence.repository.UserRepository
import jakarta.transaction.Transactional
import org.springframework.stereotype.Service


@Service
@Transactional
class UserServiceImpl(private val repository: UserRepository) : UserService {

    fun register(user: User): User {

        if (repository.findByMail(user.mail).isPresent){
            throw UserAlreadyExistsException(user.mail)
        }


    }
}