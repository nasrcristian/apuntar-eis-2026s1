package ar.edu.unq.apuntar.persistence.repository
import ar.edu.unq.apuntar.model.material.Reaction
import ar.edu.unq.apuntar.model.material.VoteType
import org.bson.types.ObjectId
import org.springframework.data.mongodb.repository.MongoRepository
import org.springframework.stereotype.Repository

@Repository
interface ReactionRepository : MongoRepository<Reaction, ObjectId> {
    fun findByMaterialIdAndUserId(materialId: Long, userId: String?): Reaction?
    fun countByMaterialIdAndType(materialId: Long, type: VoteType): Long
    fun deleteByMaterialIdAndUserId(materialId: Long, userId: String?)
}