package ar.edu.unq.apuntar.persistence.dao

import ar.edu.unq.apuntar.persistence.entity.FavoriteSQL
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface FavoriteDao : JpaRepository<FavoriteSQL, Long> {
    fun existsByUserMailAndMaterialId(userMail: String, materialId: Long): Boolean
    fun findByUserMail(userMail: String): List<FavoriteSQL>
    fun deleteByUserMailAndMaterialId(userMail: String, materialId: Long): Long
}

