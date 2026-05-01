package ar.edu.unq.apuntar.persistence.repository

import ar.edu.unq.apuntar.exception.MaterialNotFoundException
import ar.edu.unq.apuntar.model.material.FileMetadata
import ar.edu.unq.apuntar.model.material.teorico.MaterialT
import ar.edu.unq.apuntar.persistence.dao.MaterialTDao
import ar.edu.unq.apuntar.persistence.entity.MaterialTSQL
import org.springframework.stereotype.Component

@Component
class MaterialTRepositoryImpl(
    private val materialTDao: MaterialTDao
) : MaterialTRepository {
    override fun save(materialT: MaterialT): MaterialT {
        val entity = MaterialTSQL(
            id = null,
            title = materialT.title,
            description = materialT.description,
            subject = materialT.subject,
            faculty = materialT.faculty,
            originalFileName = materialT.fileMetadata.originalFileName,
            storedFileName = materialT.fileMetadata.storedFileName,
            contentType = materialT.fileMetadata.contentType,
            size = materialT.fileMetadata.size,
            createdAt = materialT.createdAt
        )
        val saved = materialTDao.save(entity)
        val fileMetadata = FileMetadata.fromPersistence(
            saved.originalFileName,
            saved.storedFileName,
            saved.contentType,
            saved.size
        )

        return MaterialT.toModel(
            saved.id ?: throw IllegalStateException("Saved material does not have an id"),
            saved.title,
            saved.description,
            saved.subject,
            saved.faculty,
            fileMetadata,
            saved.createdAt
        )
    }

    override fun findById(id: Long): MaterialT {
        val materialT = materialTDao.findById(id).orElseThrow { MaterialNotFoundException("No se encontró el material") }
        val fileMetadata = FileMetadata.fromPersistence(
            materialT.originalFileName,
            materialT.storedFileName,
            materialT.contentType,
            materialT.size
        )
        return MaterialT.toModel(id, materialT.title, materialT.description, materialT.subject, materialT.faculty, fileMetadata, materialT.createdAt)
    }

    override fun findAll(): List<MaterialT> = materialTDao.findAll().map { saved ->
        val fileMetadata = FileMetadata.fromPersistence(
            saved.originalFileName,
            saved.storedFileName,
            saved.contentType,
            saved.size
        )
        MaterialT.toModel(saved.id ?: throw IllegalStateException("Material sin id"), saved.title, saved.description, saved.subject, saved.faculty, fileMetadata, saved.createdAt)
    }
}

