package ar.edu.unq.apuntar.persistence.repository

import ar.edu.unq.apuntar.exception.MaterialNotFoundException
import ar.edu.unq.apuntar.model.material.FileMetadata
import ar.edu.unq.apuntar.model.material.Material
import ar.edu.unq.apuntar.model.material.VideoMetadata
import ar.edu.unq.apuntar.persistence.dao.MaterialDao
import ar.edu.unq.apuntar.persistence.entity.*
import java.time.Duration
import org.springframework.stereotype.Component

@Component
class MaterialRepositoryImpl(
    private val materialDao: MaterialDao
) : MaterialRepository {
    override fun save(material: Material): Material {
        val fileEntities = material.fileMetadatas.map { fm ->
            MaterialFileSQL(
                id = null,
                originalFileName = fm.originalFileName,
                storedFileName = fm.storedFileName,
                contentType = fm.contentType,
                size = fm.size,
                material = null
            )
        }.toMutableList()

        val videoEntities = material.videoMetadatas.map { vm ->
            val videoFile = MaterialFileSQL(
                id = null,
                originalFileName = vm.originalFileName,
                storedFileName = vm.storedFileName,
                contentType = vm.contentType,
                size = vm.size,
                material = null
            )
            MaterialVideoSQL(
                id = null,
                duracion = vm.duracion?.seconds,
                bitrate = vm.bitrate,
                resolucion = vm.resolucion,
                codec = vm.codec,
                file = videoFile,
                material = null
            )
        }.toMutableList()

        val entity = MaterialSQL(
            id = material.id,
            title = material.title,
            description = material.description,
            subject = material.subject,
            career = material.career,
            category = material.category,
            topic = material.topic,
            files = fileEntities,
            videos = videoEntities,
            createdAt = material.createdAt
        )

        entity.files.forEach { it.material = entity }
        entity.videos.forEach {
            it.material = entity
            it.file?.material = entity
        }

        val saved = materialDao.save(entity)

        val fileMetadatas = saved.files.map { savedFile ->
            FileMetadata.fromPersistence(
                savedFile.originalFileName,
                savedFile.storedFileName,
                savedFile.contentType,
                savedFile.size
            )
        }

        val videoMetadatas = saved.videos.map { savedVideo ->
            val f = savedVideo.file ?: throw IllegalStateException("Video sin archivo asociado")
            VideoMetadata.fromPersistence(
                originalFileName = f.originalFileName,
                storedFileName = f.storedFileName,
                contentType = f.contentType,
                size = f.size,
                duracion = savedVideo.duracion?.let { Duration.ofSeconds(it) },
                bitrate = savedVideo.bitrate,
                resolucion = savedVideo.resolucion,
                codec = savedVideo.codec
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
            saved.likes,
            saved.dislikes,
            saved.createdAt,
            videoMetadatas = videoMetadatas
        )
    }

    override fun findById(id: Long): Material {
        val entity = materialDao.findById(id).orElseThrow { MaterialNotFoundException("No se encontró el material") }
        return toMaterial(entity)
    }

    override fun findAll(): List<Material> = materialDao.findAll().map { toMaterial(it) }

    override fun deleteById(id: Long) {
        if (!materialDao.existsById(id)) throw MaterialNotFoundException("No se encontró el material")
        materialDao.deleteById(id)
    }

    override fun toggleLike(id: Long, isAdding: Boolean) {
        val updated = materialDao.toggleLike(id, isAdding)
        if (updated == 0) throw MaterialNotFoundException("No se encontró el material")
    }

    override fun toggleDislike(id: Long, isAdding: Boolean) {
        val updated = materialDao.toggleDislike(id, isAdding)
        if (updated == 0) throw MaterialNotFoundException("No se encontró el material")
    }

    private fun toMaterial(entity: MaterialSQL): Material {
        val fileMetadatas = entity.files.map { f ->
            FileMetadata.fromPersistence(f.originalFileName, f.storedFileName, f.contentType, f.size)
        }
        val videoMetadatas = entity.videos.map { v ->
            val f = v.file ?: throw IllegalStateException("Video sin archivo asociado")
            VideoMetadata.fromPersistence(
                originalFileName = f.originalFileName,
                storedFileName = f.storedFileName,
                contentType = f.contentType,
                size = f.size,
                duracion = v.duracion?.let { Duration.ofSeconds(it) },
                bitrate = v.bitrate,
                resolucion = v.resolucion,
                codec = v.codec
            )
        }
        return Material.toModel(
            entity.id ?: throw IllegalStateException("Material sin id"),
            entity.title,
            entity.description,
            entity.subject,
            entity.career,
            entity.category,
            entity.topic,
            fileMetadatas,
            entity.likes,
            entity.dislikes,
            entity.createdAt,
            videoMetadatas = videoMetadatas
        )
    }
}

