package ar.edu.unq.apuntar.persistence.dao

import org.springframework.data.jpa.repository.JpaRepository

interface UserDao : JpaRepository<User, UUID> {
}