package ar.edu.unq.apuntar.persistence.repository
import ar.edu.unq.apuntar.model.material.Comment
import org.bson.types.ObjectId
import org.springframework.data.mongodb.repository.MongoRepository
import org.springframework.stereotype.Repository

@Repository
interface CommentRepository : MongoRepository<Comment, ObjectId> {
    fun findAllByMaterialIdOrderByCreatedAtDesc(materialId: Long): List<Comment>

    fun deleteByIdAndMaterialId(id: ObjectId, materialId: Long): Long

}