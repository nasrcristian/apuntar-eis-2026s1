package ar.edu.unq.apuntar.dto

import ar.edu.unq.apuntar.model.material.Category
import org.springframework.web.multipart.MultipartFile

data class UpdateMaterialDto(
    val title: String,
    val description: String,
    val subject: String,
    val career: String,
    val topic: String,
    val category: Category,
    val files: List<MultipartFile>?
)