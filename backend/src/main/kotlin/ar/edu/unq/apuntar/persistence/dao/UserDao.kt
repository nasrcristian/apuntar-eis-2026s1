package ar.edu.unq.apuntar.persistence.dao

import ar.edu.unq.apuntar.model.User
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import java.util.UUID

@Repository
interface UserDao : JpaRepository<User, UUID> {
}