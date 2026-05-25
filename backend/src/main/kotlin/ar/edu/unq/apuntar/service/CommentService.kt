package ar.edu.unq.apuntar.service

import ar.edu.unq.apuntar.model.material.Comment

interface CommentService {
    fun addComment(materialId: Long,  text: String, authorName: String): Comment
    fun getComments(materialId: Long): List<Comment>
    fun deleteComment(materialId: Long, commentId: String)
}