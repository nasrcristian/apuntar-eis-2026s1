package ar.edu.unq.apuntar.controller

import ar.edu.unq.apuntar.dto.ReactionSummaryDTO
import ar.edu.unq.apuntar.model.material.Reaction
import ar.edu.unq.apuntar.model.material.VoteType
import ar.edu.unq.apuntar.service.ReactionService
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/materials/{materialId}/reactions")
class ReactionController(private val reactionService: ReactionService) {

    @PostMapping
    fun react(
        @PathVariable materialId: Long,
        @RequestParam userId: Long,
        @RequestParam type: VoteType
    ): ResponseEntity<Reaction> =
        ResponseEntity.ok(reactionService.react(materialId, userId, type))

    @DeleteMapping
    fun removeReaction(
        @PathVariable materialId: Long,
        @RequestParam userId: Long
    ): ResponseEntity<Void> {
        reactionService.removeReaction(materialId, userId)
        return ResponseEntity.noContent().build()
    }

    @GetMapping("/counts")
    fun getCounts(
        @PathVariable materialId: Long
    ): ResponseEntity<Map<String, Long>> =
        ResponseEntity.ok(reactionService.getCounts(materialId))

    @GetMapping("/summary")
    fun getSummary(
        @PathVariable materialId: Long
    ): ResponseEntity<ReactionSummaryDTO> =
        ResponseEntity.ok(reactionService.getReactionSummary(materialId))
}