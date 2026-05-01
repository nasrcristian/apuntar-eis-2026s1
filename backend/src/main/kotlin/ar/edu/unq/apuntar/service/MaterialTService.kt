package ar.edu.unq.apuntar.service

import ar.edu.unq.apuntar.model.material.FileMetadata
import ar.edu.unq.apuntar.model.material.teorico.MaterialT
import ar.edu.unq.apuntar.persistence.repository.MaterialTRepository
import ar.edu.unq.apuntar.storage.StorageProvider
import org.springframework.stereotype.Service
import ar.edu.unq.apuntar.dto.CreateFileDTO
import ar.edu.unq.apuntar.model.material.PendingFile

@Service
class MaterialTService(
    private val storageProvider: StorageProvider,
    private val materialTRepository: MaterialTRepository
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
        return materialTRepository.save(materialT)
    }

    fun findById(id: Long): MaterialT = materialTRepository.findById(id)

    fun findAll(): List<MaterialT> = materialTRepository.findAll()
}

