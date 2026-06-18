package ar.edu.unq.apuntar.controller

import ar.edu.unq.apuntar.dto.ReactionSummaryDTO
import ar.edu.unq.apuntar.dto.interaction.ReactDTO
import ar.edu.unq.apuntar.model.material.Reaction
import ar.edu.unq.apuntar.service.ReactionService
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/materiales/{materialId}/reactions")
class ReactionController(private val reactionService: ReactionService) {

    @PostMapping
    fun react(
        @PathVariable materialId: Long,
        @RequestBody request: ReactDTO
    ): ResponseEntity<Reaction> =
        ResponseEntity.ok(reactionService.react(materialId, request.type))

    @DeleteMapping
    fun removeReaction(
        @PathVariable materialId: Long,
    ): ResponseEntity<Void> {
        reactionService.removeReaction(materialId)
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