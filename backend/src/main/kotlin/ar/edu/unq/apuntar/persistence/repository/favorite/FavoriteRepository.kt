package ar.edu.unq.apuntar.persistence.repository.favorite

interface FavoriteRepository {
    fun isFavorite(userMail: String, materialId: Long): Boolean
    fun add(userMail: String, materialId: Long)
    fun remove(userMail: String, materialId: Long)
    fun findMaterialIdsByUserMail(userMail: String): List<Long>
}

