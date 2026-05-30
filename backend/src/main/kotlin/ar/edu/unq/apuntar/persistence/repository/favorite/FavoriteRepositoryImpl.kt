package ar.edu.unq.apuntar.persistence.repository.favorite

import ar.edu.unq.apuntar.persistence.dao.FavoriteDao
import ar.edu.unq.apuntar.persistence.entity.FavoriteSQL
import org.springframework.stereotype.Repository

@Repository
class FavoriteRepositoryImpl(private val dao: FavoriteDao) : FavoriteRepository {
    override fun isFavorite(userMail: String, materialId: Long): Boolean =
        dao.existsByUserMailAndMaterialId(userMail, materialId)

    override fun add(userMail: String, materialId: Long) {
        dao.save(FavoriteSQL(id = null, userMail = userMail, materialId = materialId))
    }

    override fun remove(userMail: String, materialId: Long) {
        dao.deleteByUserMailAndMaterialId(userMail, materialId)
    }

    override fun findMaterialIdsByUserMail(userMail: String): List<Long> =
        dao.findByUserMail(userMail).map { it.materialId }
}

