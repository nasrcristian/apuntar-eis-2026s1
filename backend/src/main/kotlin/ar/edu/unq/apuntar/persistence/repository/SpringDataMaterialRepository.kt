package ar.edu.unq.apuntar.persistence.repository

import ar.edu.unq.apuntar.persistence.entity.JpaMaterialTEntity
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface SpringDataMaterialRepository : JpaRepository<JpaMaterialTEntity, Long>


