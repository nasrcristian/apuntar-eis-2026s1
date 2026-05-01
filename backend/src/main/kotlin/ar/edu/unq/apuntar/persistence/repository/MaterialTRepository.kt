package ar.edu.unq.apuntar.persistence.repository

import ar.edu.unq.apuntar.model.material.teorico.MaterialT

interface MaterialTRepository {
    fun save(materialT: MaterialT): MaterialT
    fun findById(id: Long): MaterialT
    fun findAll(): List<MaterialT>
}

