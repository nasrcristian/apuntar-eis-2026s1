package ar.edu.unq.apuntar.persistence.dao

import ar.edu.unq.apuntar.persistence.entity.MaterialSQL
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface MaterialDao : JpaRepository<MaterialSQL, Long>