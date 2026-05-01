package ar.edu.unq.apuntar.persistence.entity

import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.Table
import java.time.Instant

@Entity
@Table(name = "materiales")
data class MaterialTSQL(
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    val id: Long?,
    val title: String,
    val description: String,
    val subject: String,
    val faculty: String,
    val originalFileName: String,
    val storedFileName: String,
    val contentType: String,
    val size: Long,
    val createdAt : Instant
)