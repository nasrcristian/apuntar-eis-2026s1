package ar.edu.unq.apuntar.service
import ar.edu.unq.apuntar.dto.ReactionSummaryDTO
import ar.edu.unq.apuntar.model.material.Reaction
import ar.edu.unq.apuntar.model.material.VoteType
import ar.edu.unq.apuntar.persistence.repository.ReactionRepository
import ar.edu.unq.apuntar.persistence.repository.UserRepository
import org.springframework.stereotype.Service

@Service
class ReactionServiceImpl(private val reactionRepository: ReactionRepository, private val userRepository: UserRepository) : ReactionService  {

    override fun react(materialId: Long, userId: Long, type: VoteType): Reaction {
        val existing = reactionRepository.findByMaterialIdAndUserId(materialId, userId)
        return if (existing != null) {
            reactionRepository.save(existing.copy(type = type))
        } else {
            reactionRepository.save(Reaction(materialId = materialId, userId = userId, type = type))
        }
    }

    override fun getReactionSummary(materialId: Long): ReactionSummaryDTO {
        val email = SecurityContextHolder.getContext().authentication.name
        val likes = reactionRepository.countByMaterialIdAndType(materialId, VoteType.LIKE)
        val dislikes = reactionRepository.countByMaterialIdAndType(materialId, VoteType.DISLIKE)
        val userReaction = reactionRepository.findByMaterialIdAndUserId(materialId, email)?.type

        return ReactionSummaryDTO(
            likes = likes,
            dislikes = dislikes,
            userReaction = userReaction
        )
    }

    override fun removeReaction(materialId: Long, userId: Long) {
        reactionRepository.deleteByMaterialIdAndUserId(materialId, userId)
    }

    override fun getCounts(materialId: Long): Map<String, Long> = mapOf(
        "likes"    to reactionRepository.countByMaterialIdAndType(materialId, VoteType.LIKE),
        "dislikes" to reactionRepository.countByMaterialIdAndType(materialId, VoteType.DISLIKE)
    )
}