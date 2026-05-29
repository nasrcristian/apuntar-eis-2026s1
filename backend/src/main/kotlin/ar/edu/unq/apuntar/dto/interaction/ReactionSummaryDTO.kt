package ar.edu.unq.apuntar.dto

import ar.edu.unq.apuntar.model.material.VoteType

data class ReactionSummaryDTO(
    val likes: Long,
    val dislikes: Long,
    val userReaction: VoteType?
)