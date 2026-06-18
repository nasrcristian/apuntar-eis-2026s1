package ar.edu.unq.apuntar.dto

import org.springframework.web.multipart.MultipartFile
import ar.edu.unq.apuntar.model.material.Category

data class CreateFileDTO(
    val ownerMail: String,
    val title: String,
    val description: String,
    val subject: String,
    val career: String,
    val topic: String,
    val category: Category,
    val files: List<MultipartFile>
)