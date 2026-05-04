package ar.edu.unq.apuntar.storage

import org.springframework.web.multipart.MultipartFile

interface StorageProvider {
    data class StoredFile(
        val storedFileName: String,
        val contentType: String?,
        val size: Long
    )
    fun store(file: MultipartFile): StoredFile
    fun delete(storedFileName: String)
}

