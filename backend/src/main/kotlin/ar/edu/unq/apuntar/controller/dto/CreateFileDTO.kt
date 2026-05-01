package ar.edu.unq.apuntar.controller.dto

import org.springframework.web.multipart.MultipartFile

data class CreateFileDTO(
    val title: String,
    val description: String,
    val subject: String,
    val faculty: String,
    val file: MultipartFile
)