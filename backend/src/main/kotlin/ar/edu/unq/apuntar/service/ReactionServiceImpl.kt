package ar.edu.unq.apuntar.service
import ar.edu.unq.apuntar.dto.ReactionSummaryDTO
import ar.edu.unq.apuntar.model.material.Reaction
import ar.edu.unq.apuntar.model.material.VoteType
import ar.edu.unq.apuntar.persistence.repository.ReactionRepository
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.stereotype.Service

@Service
class ReactionServiceImpl(private val reactionRepository: ReactionRepository) : ReactionService  {

    override fun react(materialId: Long, type: VoteType): Reaction {
        val userId = SecurityContextHolder.getContext().authentication?.name
        val existing = reactionRepository.findByMaterialIdAndUserId(materialId, userId)
        return if (existing != null) {
            reactionRepository.save(existing.copy(type = type))
        } else {
            reactionRepository.save(Reaction(materialId = materialId, userId = userId, type = type))
        }
    }

    override fun getReactionSummary(materialId: Long): ReactionSummaryDTO {
        val likes = reactionRepository.countByMaterialIdAndType(materialId, VoteType.LIKE)
        val dislikes = reactionRepository.countByMaterialIdAndType(materialId, VoteType.DISLIKE)

        val authentication = SecurityContextHolder.getContext().authentication
        val userReaction = if (authentication != null && authentication.isAuthenticated && authentication.name != "anonymousUser") {
            reactionRepository.findByMaterialIdAndUserId(materialId, authentication.name)?.type
        } else {
            null
        }

        return ReactionSummaryDTO(
            likes = likes,
            dislikes = dislikes,
            userReaction = userReaction
        )
    }

    override fun removeReaction(materialId: Long) {
        val userId = SecurityContextHolder.getContext().authentication?.name
        reactionRepository.deleteByMaterialIdAndUserId(materialId, userId)
    }

    override fun getCounts(materialId: Long): Map<String, Long> = mapOf(
        "likes"    to reactionRepository.countByMaterialIdAndType(materialId, VoteType.LIKE),
        "dislikes" to reactionRepository.countByMaterialIdAndType(materialId, VoteType.DISLIKE)
    )
}