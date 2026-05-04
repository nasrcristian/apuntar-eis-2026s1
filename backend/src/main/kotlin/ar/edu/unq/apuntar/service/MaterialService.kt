package ar.edu.unq.apuntar.service

import ar.edu.unq.apuntar.dto.CreateFileDTO
import ar.edu.unq.apuntar.model.material.Material

interface MaterialService {
    fun create(fileData:CreateFileDTO): Material
    fun findById(id: Long): Material
    fun findAll(): List<Material>
}
