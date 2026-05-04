package ar.edu.unq.apuntar.persistence.repository

import ar.edu.unq.apuntar.exception.MaterialNotFoundException
import ar.edu.unq.apuntar.model.material.FileMetadata
import ar.edu.unq.apuntar.model.material.Material
import ar.edu.unq.apuntar.persistence.dao.MaterialDao
import ar.edu.unq.apuntar.persistence.entity.MaterialSQL
import ar.edu.unq.apuntar.persistence.entity.MaterialFileSQL
import org.springframework.stereotype.Component

@Component
class MaterialRepositoryImpl(
    private val materialDao: MaterialDao
) : MaterialRepository {
    override fun save(material: Material): Material {
        val entity = MaterialSQL(
            id = null,
            title = material.title,
            description = material.description,
            subject = material.subject,
            career = material.career,
            category = material.category,
            topic = material.topic,
            files = material.fileMetadatas.map { fm ->
                MaterialFileSQL(
                    id = null,
                    originalFileName = fm.originalFileName,
                    storedFileName = fm.storedFileName,
                    contentType = fm.contentType,
                    size = fm.size,
                    material = null // se va a setear despues de crear el MaterialSQL para evitar problemas de referencia circular
                )
            }.toMutableList(),
            createdAt = material.createdAt
        )

        // Seteamos la referencia al material en cada archivo para que JPA pueda persistir correctamente la relación
        entity.files.forEach { it.material = entity }

        val saved = materialDao.save(entity)

        val fileMetadatas = saved.files.map { savedFile ->
            FileMetadata.fromPersistence(
                savedFile.originalFileName,
                savedFile.storedFileName,
                savedFile.contentType,
                savedFile.size
            )
        }

        return Material.toModel(
            saved.id ?: throw IllegalStateException("Saved material does not have an id"),
            saved.title,
            saved.description,
            saved.subject,
            saved.career,
            saved.category,
            saved.topic,
            fileMetadatas,
            saved.createdAt
        )
    }

    override fun findById(id: Long): Material {
        val materialEntity = materialDao.findById(id).orElseThrow { MaterialNotFoundException("No se encontró el material") }
        val fileMetadatas = materialEntity.files.map { f ->
            FileMetadata.fromPersistence(f.originalFileName, f.storedFileName, f.contentType, f.size)
        }
        return Material.toModel(id, materialEntity.title, materialEntity.description, materialEntity.subject, materialEntity.career, materialEntity.category, materialEntity.topic, fileMetadatas, materialEntity.createdAt)
    }

    override fun findAll(): List<Material> = materialDao.findAll().map { saved ->
        val fileMetadatas = saved.files.map { f -> FileMetadata.fromPersistence(f.originalFileName, f.storedFileName, f.contentType, f.size) }
        Material.toModel(saved.id ?: throw IllegalStateException("Material sin id"), saved.title, saved.description, saved.subject, saved.career, saved.category, saved.topic, fileMetadatas, saved.createdAt)
    }
}

