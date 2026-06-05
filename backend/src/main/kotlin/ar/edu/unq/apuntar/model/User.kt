package ar.edu.unq.apuntar.model

import ar.edu.unq.apuntar.exception.InvalidMailException
import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.Id
import jakarta.persistence.Table
import java.util.UUID

@Entity
@Table(name = "users") // increible este caso borde
class User(
    @Id
    val id: UUID = UUID.randomUUID(),

    @Column(nullable = false)
    val name: String,

    @Column(nullable = false)
    val surname: String,

    @Column(nullable = false, unique = true)
    val mail: String,

    @Column(nullable = false)
    var password: String,

    @Column(columnDefinition = "TEXT")
    var description: String? = null
    ){
    init {
        if(!isValidMail(mail)){
            throw InvalidMailException(mail)
        }
    }

    fun isValidMail(mail: String): Boolean {
        return mail.matches("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,6}$".toRegex())
    }
}