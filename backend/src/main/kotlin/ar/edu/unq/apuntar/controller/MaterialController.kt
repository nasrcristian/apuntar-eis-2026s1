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

@RestController
@RequestMapping("/materiales")
class MaterialController(private val materialService: MaterialService) {
    @PostMapping
    fun createMaterial(
        @RequestParam title: String,
        @RequestParam description: String,
        @RequestParam subject: String,
        @RequestParam career: String,
        @RequestParam topic: String,
        @RequestParam category: Category,
        @RequestParam("files") files: List<MultipartFile>
    ): ResponseEntity<MaterialDTO> {
        val fileData = CreateFileDTO(title, description, subject, career, topic, category, files)
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
        @RequestParam(name = "id", required = false) id: Long?,
        @RequestParam(name = "detalle") detalle: String
    ): ResponseEntity<List<MaterialDTO>> {
        return ResponseEntity.ok(materialService.findByName(detalle).map { it.toDTO() })
    }



    @DeleteMapping("/{id}")
    fun deleteMaterial(@PathVariable id: Long): ResponseEntity<Void> {
        materialService.deleteById(id)
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
}

