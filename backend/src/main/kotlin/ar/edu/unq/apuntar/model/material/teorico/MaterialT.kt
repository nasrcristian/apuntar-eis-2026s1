package ar.edu.unq.apuntar.model.material.teorico

import java.time.Instant
import ar.edu.unq.apuntar.exception.InvalidMaterialException
import ar.edu.unq.apuntar.model.material.FileMetadata

class MaterialT private constructor(
    val id: Long?,
    val title: String,
    val description: String,
    val subject: String,
    val faculty: String,
    val fileMetadata: FileMetadata,
    val createdAt: Instant
) {
    companion object {
        private const val MIN_DESCRIPTION = 10

        fun create(
            title: String,
            description: String,
            subject: String,
            faculty: String,
            fileMetadata: FileMetadata
        ): MaterialT {
            if (title.isBlank()) throw InvalidMaterialException("El título no puede estar vacío")
            if (description.length < MIN_DESCRIPTION) throw InvalidMaterialException("La descripción es demasiado corta")
            return MaterialT(null, title.trim(), description.trim(), subject.trim(), faculty.trim(), fileMetadata, Instant.now())
        }

        // Metodo para reconstruir un Material desde datos persistidos
        fun toModel(
            id: Long,
            title: String,
            description: String,
            subject: String,
            faculty: String,
            fileMetadata: FileMetadata,
            createdAt: Instant
        ): MaterialT = MaterialT(id, title, description, subject, faculty, fileMetadata, createdAt)
    }
}


