package ar.edu.unq.apuntar.service

import ar.edu.unq.apuntar.model.material.FileMetadata
import ar.edu.unq.apuntar.model.material.Material
import ar.edu.unq.apuntar.persistence.repository.MaterialRepository
import ar.edu.unq.apuntar.storage.StorageProvider
import org.springframework.stereotype.Service
import ar.edu.unq.apuntar.dto.CreateFileDTO
import ar.edu.unq.apuntar.model.material.PendingFile
import org.springframework.transaction.annotation.Transactional


@Service
@Transactional
class MaterialServiceImpl(
    private val storageProvider: StorageProvider,
    private val materialRepository: MaterialRepository
) : MaterialService {
    override fun create(fileData: CreateFileDTO): Material {
        if (fileData.files.isEmpty()) throw IllegalArgumentException("At least one file must be provided")

        // valido cada archivo y creo un PendingFile para cada uno, que contiene la metadata original del archivo antes de ser almacenado
        val pendings = fileData.files.map { mf ->
            PendingFile(
                originalFileName = mf.originalFilename ?: "unknown",
                contentType = mf.contentType ?: "application/octet-stream",
                size = mf.size
            )
        }

        // despues de la validación, almaceno cada archivo usando el StorageProvider y creo un FileMetadata para cada uno, que contiene la metadata del archivo después de ser almacenado (incluyendo el nombre del archivo almacenado)
        val fileMetadatas = fileData.files.zip(pendings).map { (mf, pending) ->
            val stored = storageProvider.store(mf)
            FileMetadata.of(pending, stored.storedFileName)
        }

        val material = Material.create(
            title = fileData.title,
            description = fileData.description,
            subject = fileData.subject,
            career = fileData.career,
            category = fileData.category,
            topic = fileData.topic,
            fileMetadatas = fileMetadatas
        )

        return materialRepository.save(material)
    }

    @Transactional(readOnly = true)
    override fun findById(id: Long): Material = materialRepository.findById(id)

    @Transactional(readOnly = true)
    override fun findAll(): List<Material> = materialRepository.findAll()

    override fun deleteById(id: Long) {
        val material = materialRepository.findById(id)
        materialRepository.deleteById(id)

        // borrar los archivos asociados al material usando el StorageProvider
        material.fileMetadatas.forEach { fileMetadata ->
            storageProvider.delete(fileMetadata.storedFileName)
        }
    }
}

