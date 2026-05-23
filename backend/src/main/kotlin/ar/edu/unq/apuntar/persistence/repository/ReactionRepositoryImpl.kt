package ar.edu.unq.apuntar.persistence.repository

import ar.edu.unq.apuntar.model.material.Reaction
import ar.edu.unq.apuntar.model.material.VoteType
import org.springframework.data.mongodb.core.MongoTemplate
import org.springframework.data.mongodb.core.query.Criteria
import org.springframework.data.mongodb.core.query.Query
import org.springframework.stereotype.Repository

@Repository
class ReactionRepositoryImpl(private val mongoTemplate: MongoTemplate) {

    fun findByMaterialIdAndUserId(materialId: Long, userId: Long): Reaction? {
        val query = Query(
            Criteria.where("materialId").`is`(materialId)
                .and("userId").`is`(userId)
        )
        return mongoTemplate.findOne(query, Reaction::class.java)
    }

    fun countByMaterialIdAndType(materialId: Long, type: VoteType): Long {
        val query = Query(
            Criteria.where("materialId").`is`(materialId)
                .and("type").`is`(type)
        )
        return mongoTemplate.count(query, Reaction::class.java)
    }

    fun deleteByMaterialIdAndUserId(materialId: Long, userId: Long) {
        val query = Query(
            Criteria.where("materialId").`is`(materialId)
                .and("userId").`is`(userId)
        )
        mongoTemplate.remove(query, Reaction::class.java)
    }

    fun save(reaction: Reaction): Reaction =
        mongoTemplate.save(reaction)
}