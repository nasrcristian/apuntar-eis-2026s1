package ar.edu.unq.apuntar.model

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.Id
import java.util.UUID

@Entity
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
    val password: String,
    )