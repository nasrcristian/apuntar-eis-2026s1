package ar.edu.unq.apuntar.service

import ar.edu.unq.apuntar.dto.CreateFileDTO
import ar.edu.unq.apuntar.model.material.teorico.MaterialT

interface MaterialTService {
    fun create(fileData:CreateFileDTO): MaterialT
    fun findById(id: Long): MaterialT
    fun findAll(): List<MaterialT>
}
