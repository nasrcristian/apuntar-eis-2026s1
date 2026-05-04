package ar.edu.unq.apuntar.persistence.repository

import ar.edu.unq.apuntar.model.material.Material

interface MaterialRepository {
    fun save(material: Material): Material
    fun findById(id: Long): Material
    fun findAll(): List<Material>
}

