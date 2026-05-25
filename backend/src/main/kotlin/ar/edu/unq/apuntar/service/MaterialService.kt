package ar.edu.unq.apuntar.service

import ar.edu.unq.apuntar.dto.CreateFileDTO
import ar.edu.unq.apuntar.dto.UpdateMaterialDto
import ar.edu.unq.apuntar.model.material.Material

interface MaterialService {
    fun create(fileData:CreateFileDTO): Material
    fun update(id: Long, data: UpdateMaterialDto, requesterMail: String): Material
    fun deleteById(id: Long, requesterMail: String)
    fun findById(id: Long): Material
    fun findAll(): List<Material>
    fun findByName(name: String): List<Material>
    fun toggleLike(id: Long, isAdding: Boolean): Material
    fun toggleDislike(id: Long, isAdding: Boolean): Material
    fun findByOwnerMail(ownerMail: String): List<Material>
}
