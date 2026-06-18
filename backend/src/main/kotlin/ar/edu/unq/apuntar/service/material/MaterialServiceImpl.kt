package ar.edu.unq.apuntar.service

import ar.edu.unq.apuntar.model.material.FileMetadata
import ar.edu.unq.apuntar.model.material.Material
import ar.edu.unq.apuntar.model.material.VideoMetadata
import ar.edu.unq.apuntar.persistence.repository.MaterialRepository
import ar.edu.unq.apuntar.storage.StorageProvider
import org.springframework.stereotype.Service
import ar.edu.unq.apuntar.dto.CreateFileDTO
import ar.edu.unq.apuntar.dto.UpdateMaterialDto
import ar.edu.unq.apuntar.exception.ForbiddenActionException
import ar.edu.unq.apuntar.model.material.PendingFile
import org.springframework.transaction.annotation.Transactional


@Service
@Transactional
class MaterialServiceImpl(
    private val storageProvider: StorageProvider,
    private val materialRepository: MaterialRepository,
    private val probeMedia: ProbeMedia
) : MaterialService {
    override fun create(fileData: CreateFileDTO): Material {
        if (fileData.files.isEmpty()) throw IllegalArgumentException("At least one file must be provided")

        val pendings = fileData.files.map { mf ->
            PendingFile(
                originalFileName = mf.originalFilename ?: "unknown",
                contentType = mf.contentType ?: "application/octet-stream",
                size = mf.size
            )
        }

        val fileMetadatas = mutableListOf<FileMetadata>()
        val videoMetadatas = mutableListOf<VideoMetadata>()

        fileData.files.zip(pendings).forEach { (mf, pending) ->
            val stored = storageProvider.store(mf)
            if (pending.isVideo) {
                val probed = probeMedia.probe(stored.storedFileName)
                videoMetadatas.add(
                    VideoMetadata.of(
                        pending, stored.storedFileName,
                        duracion = probed?.duracion,
                        bitrate = probed?.bitrate,
                        resolucion = probed?.resolucion,
                        codec = probed?.codec
                    )
                )
            } else {
                fileMetadatas.add(FileMetadata.of(pending, stored.storedFileName))
            }
        }

        val material = Material.create(
            ownerMail = fileData.ownerMail,
            title = fileData.title,
            description = fileData.description,
            subject = fileData.subject,
            career = fileData.career,
            category = fileData.category,
            topic = fileData.topic,
            fileMetadatas = fileMetadatas,
            videoMetadatas = videoMetadatas
        )

        return materialRepository.save(material)
    }

    @Transactional
    override fun update(
        id: Long,
        data: UpdateMaterialDto,
        requesterMail: String
    ): Material {
        val existing = materialRepository.findById(id)

        if (existing.ownerMail != requesterMail) {
            throw ForbiddenActionException("No tenés permiso para modificar este material")
        }

        val hasNewFiles = !data.files.isNullOrEmpty()
        val newlyStoredFileNames = mutableListOf<String>()

        try {
            var newFileMetadatas: List<FileMetadata>? = null
            var newVideoMetadatas: List<VideoMetadata>? = null

            if (hasNewFiles) {
                val pendings = data.files!!.map { mf ->
                    PendingFile(
                        originalFileName = mf.originalFilename ?: "unknown",
                        contentType = mf.contentType ?: "application/octet-stream",
                        size = mf.size
                    )
                }

                val files = mutableListOf<FileMetadata>()
                val videos = mutableListOf<VideoMetadata>()

                data.files.zip(pendings).forEach { (mf, pending) ->
                    val stored = storageProvider.store(mf)
                    newlyStoredFileNames.add(stored.storedFileName)

                    if (pending.isVideo) {
                        val probed = probeMedia.probe(stored.storedFileName)
                        videos.add(
                            VideoMetadata.of(
                                pending, stored.storedFileName,
                                duracion = probed?.duracion,
                                bitrate = probed?.bitrate,
                                resolucion = probed?.resolucion,
                                codec = probed?.codec
                            )
                        )
                    } else {
                        files.add(FileMetadata.of(pending, stored.storedFileName))
                    }
                }
                newFileMetadatas = files
                newVideoMetadatas = videos
            }

            val updatedDomain = existing.update(
                title = data.title,
                description = data.description,
                subject = data.subject,
                career = data.career,
                category = data.category,
                topic = data.topic,
                newFileMetadatas = newFileMetadatas,
                newVideoMetadatas = newVideoMetadatas
            )

            val saved = materialRepository.update(updatedDomain, replaceFiles = hasNewFiles)

            if (hasNewFiles) {
                existing.fileMetadatas.forEach { storageProvider.delete(it.storedFileName) }
                existing.videoMetadatas.forEach { storageProvider.delete(it.storedFileName) }
            }
            return saved
        } catch (e: Exception) {
            //rollback
            newlyStoredFileNames.forEach {
                try { storageProvider.delete(it) } catch (_: Exception) { }
            }
            throw e
        }
    }

    @Transactional(readOnly = true)
    override fun findById(id: Long): Material = materialRepository.findById(id)

    @Transactional(readOnly = true)
    override fun findAll(): List<Material> = materialRepository.findAll()

    @Transactional(readOnly = true)
    override fun findByName(name: String): List<Material> = materialRepository.findByName(name)

    @Transactional
    override fun deleteById(id: Long, requesterMail: String) {
        val material = materialRepository.findById(id)

        if (material.ownerMail != requesterMail) {
            throw ForbiddenActionException("No tenés permiso para eliminar este material")
        }

        materialRepository.deleteById(id)

        material.fileMetadatas.forEach { storageProvider.delete(it.storedFileName) }
        material.videoMetadatas.forEach { storageProvider.delete(it.storedFileName) }
    }

    @Transactional
    override fun toggleLike(id: Long, isAdding: Boolean): Material {
        val material = materialRepository.findById(id)
        material.applyVote(ar.edu.unq.apuntar.model.material.VoteType.LIKE, isAdding)
        materialRepository.toggleLike(id, isAdding)
        return materialRepository.findById(id)
    }

    @Transactional
    override fun toggleDislike(id: Long, isAdding: Boolean): Material {
        val material = materialRepository.findById(id)
        material.applyVote(ar.edu.unq.apuntar.model.material.VoteType.DISLIKE, isAdding)
        materialRepository.toggleDislike(id, isAdding)
        return materialRepository.findById(id)
    }

    override fun findByOwnerMail(ownerMail: String): List<Material> =
        materialRepository.findByOwnerMail(ownerMail)
}

