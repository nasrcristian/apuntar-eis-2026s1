package ar.edu.unq.apuntar.service

import ar.edu.unq.apuntar.model.material.Comment

interface CommentService {
    fun addComment(materialId: Long, userId: Long, text: String): Comment
    fun getComments(materialId: Long): List<Comment>
}