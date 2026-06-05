package ar.edu.unq.apuntar.controller

import ar.edu.unq.apuntar.dto.MaterialDTO
import ar.edu.unq.apuntar.dto.CreateFileDTO
import ar.edu.unq.apuntar.dto.toDTO
import ar.edu.unq.apuntar.service.MaterialService
import ar.edu.unq.apuntar.model.material.Category
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import org.springframework.web.multipart.MultipartFile
import kotlin.Long
import ar.edu.unq.apuntar.dto.UpdateMaterialDto
import ar.edu.unq.apuntar.dto.material.FavoriteStatusDTO
import org.springframework.security.core.Authentication
import ar.edu.unq.apuntar.service.favorite.FavoriteService
import ar.edu.unq.apuntar.storage.StorageProvider
import org.springframework.core.io.UrlResource
import org.springframework.http.HttpHeaders
import org.springframework.http.MediaType

@RestController
@RequestMapping("/materiales")
class MaterialController(
    private val materialService: MaterialService,
    private val favoriteService: FavoriteService,
    private val storageProvider: StorageProvider
) {
    @PostMapping
    fun createMaterial(
        @RequestParam title: String,
        @RequestParam description: String,
        @RequestParam subject: String,
        @RequestParam career: String,
        @RequestParam topic: String,
        @RequestParam category: Category,
        @RequestParam("files") files: List<MultipartFile>,
        authentication: Authentication
    ): ResponseEntity<MaterialDTO> {
        val ownerMail = authentication.name
        val fileData = CreateFileDTO(
            ownerMail = ownerMail,
            title = title,
            description = description,
            subject = subject,
            career = career,
            topic = topic,
            category = category,
            files = files
        )
        val material = materialService.create(fileData)
        return ResponseEntity.status(HttpStatus.CREATED).body(material.toDTO())
    }

    @GetMapping("/{id}")
    fun getMaterial(@PathVariable id: Long): ResponseEntity<MaterialDTO> {
        val material = materialService.findById(id)
        return ResponseEntity.ok(material.toDTO())
    }

    @GetMapping
    fun getAll(): ResponseEntity<List<MaterialDTO>> = ResponseEntity.ok(materialService.findAll().map { it.toDTO() })

    @GetMapping("/filtrado")
    fun getByName(
        @RequestParam(name = "detalle") detalle: String
    ): ResponseEntity<List<MaterialDTO>> {
        return ResponseEntity.ok(materialService.findByName(detalle).map { it.toDTO() })
    }

    @PutMapping("/{id}")
    fun updateMaterial(
        @PathVariable id: Long,
        @RequestParam title: String,
        @RequestParam description: String,
        @RequestParam subject: String,
        @RequestParam career: String,
        @RequestParam topic: String,
        @RequestParam category: Category,
        @RequestParam(value = "files", required = false) files: List<MultipartFile>?,
        authentication: Authentication
    ): ResponseEntity<MaterialDTO> {
        val data = UpdateMaterialDto(title, description, subject, career, topic, category, files)
        val updated = materialService.update(id, data, authentication.name)
        return ResponseEntity.ok(updated.toDTO())
    }

    @DeleteMapping("/{id}")
    fun deleteMaterial(
        @PathVariable id: Long,
        authentication: Authentication
    ): ResponseEntity<Void> {
        materialService.deleteById(id, authentication.name)
        return ResponseEntity.noContent().build()
    }

    @PostMapping("/{id}/like")
    fun likeMaterial(
        @PathVariable id: Long,
        @RequestParam(required = false, defaultValue = "true") isAdding: Boolean
    ): ResponseEntity<MaterialDTO> {
        val updated = materialService.toggleLike(id, isAdding)
        return ResponseEntity.ok(updated.toDTO())
    }

    @PostMapping("/{id}/dislike")
    fun dislikeMaterial(
        @PathVariable id: Long,
        @RequestParam(required = false, defaultValue = "true") isAdding: Boolean
    ): ResponseEntity<MaterialDTO> {
        val updated = materialService.toggleDislike(id, isAdding)
        return ResponseEntity.ok(updated.toDTO())
    }

    @PostMapping("/{id}/favoritos")
    fun toggleFavorite(
        @PathVariable id: Long,
        authentication: Authentication
    ): ResponseEntity<FavoriteStatusDTO> {
        val isFavorite = favoriteService.toggleFavorite(id, authentication.name)
        return ResponseEntity.ok(FavoriteStatusDTO(materialId = id, isFavorite = isFavorite))
    }

    @GetMapping("/{id}/favoritos")
    fun getFavoriteStatus(
        @PathVariable id: Long,
        authentication: Authentication
    ): ResponseEntity<FavoriteStatusDTO> {
        val isFavorite = favoriteService.isFavorite(id, authentication.name)
        return ResponseEntity.ok(FavoriteStatusDTO(materialId = id, isFavorite = isFavorite))
    }

    @GetMapping("/favoritos")
    fun getFavorites(authentication: Authentication): ResponseEntity<List<MaterialDTO>> {
        val favorites = favoriteService.getFavorites(authentication.name)
            .map { it.toDTO() }
        return ResponseEntity.ok(favorites)
    }

    @GetMapping("/{id}/archivos/{storedFileName}")
    fun downloadFile(
        @PathVariable id: Long,
        @PathVariable storedFileName: String
    ): ResponseEntity<UrlResource> {
        val material = materialService.findById(id)
        val fileMeta = material.fileMetadatas.find { it.storedFileName == storedFileName }
            ?: return ResponseEntity.notFound().build()

        val path = storageProvider.load(storedFileName)
        val resource = UrlResource(path.toUri())

        if (!resource.exists() || !resource.isReadable) {
            return ResponseEntity.notFound().build()
        }

        return ResponseEntity.ok()
            .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"${fileMeta.originalFileName}\"")
            .contentType(MediaType.parseMediaType(fileMeta.contentType))
            .body(resource)
    }

    @GetMapping("/mis-publicaciones")
    fun getMyMaterials(authentication: Authentication): ResponseEntity<List<MaterialDTO>> {
        return ResponseEntity.ok(materialService.findByOwnerMail(authentication.name)
            .sortedByDescending { it.createdAt }
            .map { it.toDTO() })
    }

    @GetMapping("/usuario")
    fun getByOwner(@RequestParam mail: String): ResponseEntity<List<MaterialDTO>> =
        ResponseEntity.ok(
            materialService.findByOwnerMail(mail)
                .sortedByDescending { it.createdAt }
                .map { it.toDTO() }
        )
}
