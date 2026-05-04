package ar.edu.unq.apuntar.dto

import ar.edu.unq.apuntar.model.material.Material
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
    val career: String,
    val category: String,
    val topic: String,
    val files: List<FileMetadataDTO>,
    val likes: Long,
    val dislikes: Long,
    val createdAt: Instant
)

fun Material.toDTO(): MaterialDTO = MaterialDTO(
    id = this.id ?: throw IllegalStateException("Material sin id"),
    title = this.title,
    description = this.description,
    subject = this.subject,
    career = this.career,
    category = this.category.code,
    topic = this.topic,
    files = this.fileMetadatas.map { fm -> FileMetadataDTO(fm.originalFileName, fm.storedFileName, fm.contentType, fm.size) },
    likes = this.likes,
    dislikes = this.dislikes,
    createdAt = this.createdAt
)

