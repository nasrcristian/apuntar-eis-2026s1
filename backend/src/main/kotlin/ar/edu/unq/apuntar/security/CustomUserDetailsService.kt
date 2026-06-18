package ar.edu.unq.apuntar.security

import ar.edu.unq.apuntar.persistence.repository.UserRepository
import org.springframework.security.core.userdetails.User
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.security.core.userdetails.UserDetailsService
import org.springframework.security.core.userdetails.UsernameNotFoundException
import org.springframework.stereotype.Service

@Service
class CustomUserDetailsService(private val userRepository: UserRepository) : UserDetailsService {

    override fun loadUserByUsername(username: String): UserDetails {
        val user = userRepository.findByMail(username)
            ?: throw UsernameNotFoundException("Usuario no encontrado: $username")

        return User.withUsername(user.mail)
            .password(user.password)
            .authorities("USER")
            .build()
    }
}