package ar.edu.unq.apuntar.controller
import ar.edu.unq.apuntar.dto.CommentDTO
import ar.edu.unq.apuntar.model.material.Comment
import ar.edu.unq.apuntar.service.CommentService
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/materials/{materialId}/comments")
class CommentController(private val commentService: CommentService) {

    @PostMapping
    fun addComment(
        @PathVariable materialId: Long,
        @RequestBody request: CommentDTO
    ): ResponseEntity<Comment> =
        ResponseEntity.status(HttpStatus.CREATED)
            .body(commentService.addComment(materialId, request.userId, request.text))

    @GetMapping
    fun getComments(
        @PathVariable materialId: Long
    ): ResponseEntity<List<Comment>> =
        ResponseEntity.ok(commentService.getComments(materialId))
}