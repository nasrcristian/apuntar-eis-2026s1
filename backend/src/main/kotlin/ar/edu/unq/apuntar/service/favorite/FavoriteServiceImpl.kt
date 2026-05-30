package ar.edu.unq.apuntar.service.favorite

import ar.edu.unq.apuntar.model.material.Material
import ar.edu.unq.apuntar.persistence.repository.favorite.FavoriteRepository
import ar.edu.unq.apuntar.persistence.repository.MaterialRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
@Transactional
class FavoriteServiceImpl(
    private val favoriteRepository: FavoriteRepository,
    private val materialRepository: MaterialRepository
) : FavoriteService {

    override fun toggleFavorite(materialId: Long, userMail: String): Boolean {
        val alreadyFavorite = favoriteRepository.isFavorite(userMail, materialId)
        return if (alreadyFavorite) {
            favoriteRepository.remove(userMail, materialId)
            false
        } else {
            materialRepository.findById(materialId)
            favoriteRepository.add(userMail, materialId)
            true
        }
    }

    @Transactional(readOnly = true)
    override fun isFavorite(materialId: Long, userMail: String): Boolean =
        favoriteRepository.isFavorite(userMail, materialId)

    @Transactional(readOnly = true)
    override fun getFavorites(userMail: String): List<Material> {
        val materialIds = favoriteRepository.findMaterialIdsByUserMail(userMail)
        if (materialIds.isEmpty()) return emptyList()
        return materialRepository.findByIds(materialIds)
            .sortedByDescending { it.createdAt }
    }
}

