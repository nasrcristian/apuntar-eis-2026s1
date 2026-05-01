package ar.edu.unq.apuntar.dto

import ar.edu.unq.apuntar.model.material.teorico.MaterialT
import java.time.Instant

data class FileMetadataDTO(
    val originalFileName: String,
    val storedFileName: String,
    val contentType: String,
    val size: Long
)

data class MaterialDTO(
    val id: Long,
    val title: String,
    val description: String,
    val subject: String,
    val faculty: String,
    val fileMetadata: FileMetadataDTO,
    val createdAt: Instant
)

fun MaterialT.toDTO(): MaterialDTO = MaterialDTO(
    id = this.id ?: throw IllegalStateException("Material sin id"),
    title = this.title,
    description = this.description,
    subject = this.subject,
    faculty = this.faculty,
    fileMetadata = FileMetadataDTO(this.fileMetadata.originalFileName, this.fileMetadata.storedFileName, this.fileMetadata.contentType, this.fileMetadata.size),
    createdAt = this.createdAt
)

