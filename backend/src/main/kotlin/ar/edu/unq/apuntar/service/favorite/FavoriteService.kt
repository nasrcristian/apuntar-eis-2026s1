package ar.edu.unq.apuntar.service.favorite

import ar.edu.unq.apuntar.model.material.Material

interface FavoriteService {
    fun toggleFavorite(materialId: Long, userMail: String): Boolean
    fun isFavorite(materialId: Long, userMail: String): Boolean
    fun getFavorites(userMail: String): List<Material>
}

