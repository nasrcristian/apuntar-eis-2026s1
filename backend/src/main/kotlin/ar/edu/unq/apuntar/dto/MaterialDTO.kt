package ar.edu.unq.apuntar.dto

import ar.edu.unq.apuntar.model.material.Material
import ar.edu.unq.apuntar.model.material.VideoMetadata
import java.time.Instant

data class FileMetadataDTO(
    val originalFileName: String,
    val storedFileName: String,
    val contentType: String,
    val size: Long
)

data class VideoMetadataDTO(
    val originalFileName: String,
    val storedFileName: String,
    val contentType: String,
    val size: Long,
    val duracion: Long?,
    val bitrate: Int?,
    val resolucion: String?,
    val codec: String?
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
    val videos: List<VideoMetadataDTO>,
    val likes: Long,
    val dislikes: Long,
    val createdAt: Instant
)

fun VideoMetadata.toDTO(): VideoMetadataDTO = VideoMetadataDTO(
    originalFileName = this.originalFileName,
    storedFileName = this.storedFileName,
    contentType = this.contentType,
    size = this.size,
    duracion = this.duracion?.seconds,
    bitrate = this.bitrate,
    resolucion = this.resolucion,
    codec = this.codec
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
    videos = this.videoMetadatas.map { it.toDTO() },
    likes = this.likes,
    dislikes = this.dislikes,
    createdAt = this.createdAt
)

