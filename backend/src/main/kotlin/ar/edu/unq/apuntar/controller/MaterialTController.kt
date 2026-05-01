package ar.edu.unq.apuntar.controller

import ar.edu.unq.apuntar.controller.dto.MaterialDTO
import ar.edu.unq.apuntar.service.MaterialTService
import ar.edu.unq.apuntar.controller.dto.CreateFileDTO
import ar.edu.unq.apuntar.controller.dto.toDTO
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import org.springframework.web.multipart.MultipartFile
import kotlin.Long

@RestController
@RequestMapping("/materiales")
class MaterialTController(private val materialTService: MaterialTService) {
    @PostMapping
    fun createMaterialT(
        @RequestParam title: String,
        @RequestParam description: String,
        @RequestParam subject: String,
        @RequestParam faculty: String,
        @RequestParam file: MultipartFile
    ): ResponseEntity<MaterialDTO> {
        val fileData = CreateFileDTO(title, description, subject, faculty, file)
        val material = materialTService.create(fileData)
        return ResponseEntity.status(HttpStatus.CREATED).body(material.toDTO());
    }

    @GetMapping("/{id}")
    fun getMaterialT(@PathVariable id: Long): ResponseEntity<MaterialDTO> {
        val material = materialTService.findById(id)
        return ResponseEntity.ok(material.toDTO())
    }

    @GetMapping
    fun getAll(): ResponseEntity<List<MaterialDTO>> = ResponseEntity.ok(materialTService.findAll().map { it.toDTO() })
}

