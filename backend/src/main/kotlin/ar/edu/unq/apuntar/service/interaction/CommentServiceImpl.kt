package ar.edu.unq.apuntar.service
import ar.edu.unq.apuntar.model.material.Comment
import ar.edu.unq.apuntar.persistence.repository.CommentRepository
import org.bson.types.ObjectId
import org.springframework.http.HttpStatus
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.stereotype.Service
import org.springframework.web.server.ResponseStatusException


@Service
class CommentServiceImpl(private val commentRepository: CommentRepository) : CommentService {

    override fun addComment(materialId: Long, text: String, authorName: String): Comment {
        val userId = SecurityContextHolder.getContext().authentication?.name
       return commentRepository.save(Comment(materialId = materialId, userId = userId, text = text, authorName = authorName))
    }
    override fun getComments(materialId: Long): List<Comment> =
        commentRepository.findAllByMaterialIdOrderByCreatedAtDesc(materialId)

    override fun deleteComment(materialId: Long, commentId: String) {
        try {
            // Convertimos el String que viene de la API a un ObjectId de Mongo
            val commentId = ObjectId(commentId)

            val deletedCount = commentRepository.deleteByIdAndMaterialId(commentId, materialId)

            if (deletedCount == 0L) {
                throw ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "El comentario no fue encontrado o no pertenece al material"
                )
            }
        } catch (e: IllegalArgumentException) {
            // Por si el string que mandaron en la URL no tiene el formato válido de un ObjectId
            throw ResponseStatusException(HttpStatus.BAD_REQUEST, "El formato del id no es valido")
        }
    }
}