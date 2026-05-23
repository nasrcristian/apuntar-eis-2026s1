package ar.edu.unq.apuntar.service
import ar.edu.unq.apuntar.model.material.Comment
import ar.edu.unq.apuntar.persistence.repository.CommentRepository
import org.springframework.stereotype.Service


@Service
class CommentServiceImpl(private val commentRepository: CommentRepository) : CommentService {

    override fun addComment(materialId: Long, userId: Long, text: String): Comment =
        commentRepository.save(Comment(materialId = materialId, userId = userId, text = text))

    override fun getComments(materialId: Long): List<Comment> =
        commentRepository.findAllByMaterialIdOrderByCreatedAtDesc(materialId)
}