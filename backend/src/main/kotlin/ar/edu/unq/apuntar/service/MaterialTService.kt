package ar.edu.unq.apuntar.service

import ar.edu.unq.apuntar.model.material.FileMetadata
import ar.edu.unq.apuntar.model.material.teorico.MaterialT
import ar.edu.unq.apuntar.persistence.repository.MaterialRepository
import ar.edu.unq.apuntar.storage.StorageProvider
import org.springframework.stereotype.Service
import ar.edu.unq.apuntar.controller.dto.CreateFileDTO
import ar.edu.unq.apuntar.model.material.PendingFile

@Service
class MaterialTService(
    private val storageProvider: StorageProvider,
    private val materialRepository: MaterialRepository
) {
    fun create(fileData: CreateFileDTO): MaterialT {
        val pending = PendingFile(
            originalFileName = fileData.file.originalFilename ?: "unknown",
            contentType = fileData.file.contentType ?: "application/octet-stream",
            size = fileData.file.size
        )
        val stored = storageProvider.store(fileData.file)
        val fileMetadata = FileMetadata.of(pending, stored.storedFileName)
        val materialT = MaterialT.create(fileData.title, fileData.description, fileData.subject, fileData.faculty, fileMetadata)
        return materialRepository.save(materialT)
    }

    fun findById(id: Long): MaterialT = materialRepository.findById(id)

    fun findAll(): List<MaterialT> = materialRepository.findAll()
}

