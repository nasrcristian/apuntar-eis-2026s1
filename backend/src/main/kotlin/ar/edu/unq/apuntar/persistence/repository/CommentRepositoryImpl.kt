package ar.edu.unq.apuntar.persistence.repository

import ar.edu.unq.apuntar.model.material.Comment
import org.springframework.data.domain.Sort
import org.springframework.data.mongodb.core.MongoTemplate
import org.springframework.data.mongodb.core.query.Criteria
import org.springframework.data.mongodb.core.query.Query
import org.springframework.stereotype.Repository

@Repository
class CommentRepositoryImpl(private val mongoTemplate: MongoTemplate) {

    fun findAllByMaterialIdOrderByCreatedAtDesc(materialId: Long): List<Comment> {
        val query = Query(Criteria.where("materialId").`is`(materialId))
            .with(Sort.by(Sort.Direction.DESC, "createdAt"))
        return mongoTemplate.find(query, Comment::class.java)
    }

    fun save(comment: Comment): Comment =
        mongoTemplate.save(comment)
}