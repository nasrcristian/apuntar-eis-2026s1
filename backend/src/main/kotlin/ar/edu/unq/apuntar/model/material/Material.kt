package ar.edu.unq.apuntar.model.material

import ar.edu.unq.apuntar.exception.InvalidMaterialException
import java.time.Instant

class Material private constructor(
    val id: Long?,
    val title: String,
    val description: String,
    val subject: String, //materia
    val career: String,
    val category: Category,
    val topic: String,
    val fileMetadatas: List<FileMetadata>,
    val createdAt: Instant
) {
    companion object {
        private const val MIN_DESCRIPTION = 10

        fun create(
            title: String,
            description: String,
            subject: String,
            career: String,
            category: Category,
            topic: String,
            fileMetadatas: List<FileMetadata>
        ): Material {
            if (title.isBlank()) throw InvalidMaterialException("El título no puede estar vacío")
            if (description.length < MIN_DESCRIPTION) throw InvalidMaterialException("La descripción es demasiado corta")
            return Material(
                null,
                title.trim(),
                description.trim(),
                subject.trim(),
                career.trim(),
                category,
                topic.trim(),
                fileMetadatas,
                Instant.now()
            )
        }

        // Metodo para reconstruir un Material desde datos persistidos
        fun toModel(
            id: Long,
            title: String,
            description: String,
            subject: String,
            career: String,
            category: Category,
            topic: String,
            fileMetadatas: List<FileMetadata>,
            createdAt: Instant
        ): Material = Material(id, title, description, subject, career, category, topic, fileMetadatas, createdAt)
    }
}