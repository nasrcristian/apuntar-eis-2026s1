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
    val videoMetadatas: List<VideoMetadata> = emptyList(),
    var likes: Long,
    var dislikes: Long,
    val createdAt: Instant
) {
    companion object {
        private const val MIN_DESCRIPTION = 10
        private const val MAX_TITLE = 120
        private const val MAX_TOPIC = 80

        fun create(
            title: String,
            description: String,
            subject: String,
            career: String,
            category: Category,
            topic: String,
            fileMetadatas: List<FileMetadata>,
            videoMetadatas: List<VideoMetadata> = emptyList()
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
                videoMetadatas,
                0,
                0,
                Instant.now()
            )
        }

        fun toModel(
            id: Long,
            title: String,
            description: String,
            subject: String,
            career: String,
            category: Category,
            topic: String,
            fileMetadatas: List<FileMetadata>,
            likes: Long,
            dislikes: Long,
            createdAt: Instant,
            videoMetadatas: List<VideoMetadata> = emptyList()
        ): Material = Material(id, title, description, subject, career, category, topic, fileMetadatas, videoMetadatas, likes, dislikes, createdAt)
    }

    fun applyVote(type: VoteType, isAdding: Boolean) {
        when (type) {
            VoteType.LIKE -> {
                likes = if (isAdding) likes + 1 else (likes - 1).coerceAtLeast(0)
            }
            VoteType.DISLIKE -> {
                dislikes = if (isAdding) dislikes + 1 else (dislikes - 1).coerceAtLeast(0)
            }
        }
    }

    fun update(
        title: String,
        description: String,
        subject: String,
        career: String,
        category: Category,
        topic: String,
        newFileMetadatas: List<FileMetadata>? = null,
        newVideoMetadatas: List<VideoMetadata>? = null
    ): Material {
        if (title.isBlank()) throw InvalidMaterialException("El titulo no puede estar vacio")
        if (title.trim().length > MAX_TITLE) throw InvalidMaterialException("El titulo no puede tener mas de $MAX_TITLE caracteres")
        if (subject.isBlank()) throw InvalidMaterialException("La materia no puede estar vacia")
        if (career.isBlank()) throw InvalidMaterialException("La carrera no puede estar vacia")
        if (topic.isBlank()) throw InvalidMaterialException("El tema no puede estar vacio")
        if (topic.trim().length > MAX_TOPIC) throw InvalidMaterialException("El tema no puede tener mas de $MAX_TOPIC caracteres")

        return Material(
            id = this.id,
            title = title.trim(),
            description = description.trim(),
            subject = subject.trim(),
            career = career.trim(),
            category = category,
            topic = topic.trim(),
            fileMetadatas = newFileMetadatas ?: this.fileMetadatas,
            videoMetadatas = newVideoMetadatas ?: this.videoMetadatas,
            likes = this.likes,
            dislikes = this.dislikes,
            createdAt = this.createdAt
        )
    }
}