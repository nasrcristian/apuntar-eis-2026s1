package ar.edu.unq.apuntar.persistence.dao

import ar.edu.unq.apuntar.persistence.entity.MaterialTSQL
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface MaterialTDao : JpaRepository<MaterialTSQL, Long>