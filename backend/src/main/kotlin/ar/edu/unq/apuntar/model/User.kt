package ar.edu.unq.apuntar.model

import jakarta.persistence.Entity
import jakarta.persistence.Id

@Entity
class User(
    @Id val id: Long,
    val name: String,
    )