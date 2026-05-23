package ar.edu.unq.apuntar.service

import ar.edu.unq.apuntar.model.material.Reaction
import ar.edu.unq.apuntar.model.material.VoteType

interface ReactionService {
    fun react(materialId: Long, userId: Long, type: VoteType): Reaction
    fun removeReaction(materialId: Long, userId: Long)
    fun getCounts(materialId: Long): Map<String, Long>
}