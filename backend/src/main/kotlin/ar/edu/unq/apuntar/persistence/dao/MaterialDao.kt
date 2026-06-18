package ar.edu.unq.apuntar.persistence.dao

import ar.edu.unq.apuntar.model.material.Material
import ar.edu.unq.apuntar.persistence.entity.MaterialSQL
import org.springframework.data.jpa.repository.Modifying
import org.springframework.data.jpa.repository.Query
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.repository.query.Param
import org.springframework.stereotype.Repository

@Repository
interface MaterialDao : JpaRepository<MaterialSQL, Long> {
	@Modifying
	@Query(
		value = "UPDATE materiales SET likes = CASE WHEN :isAdding THEN likes + 1 ELSE GREATEST(likes - 1, 0) END WHERE id = :id",
		nativeQuery = true
	)
	fun toggleLike(@Param("id") id: Long, @Param("isAdding") isAdding: Boolean): Int

	@Modifying
	@Query(
		value = "UPDATE materiales SET dislikes = CASE WHEN :isAdding THEN dislikes + 1 ELSE GREATEST(dislikes - 1, 0) END WHERE id = :id",
		nativeQuery = true
	)
	fun toggleDislike(@Param("id") id: Long, @Param("isAdding") isAdding: Boolean): Int

	@Query(
		value = "SELECT * FROM materiales WHERE title LIKE CONCAT('%', :detalle, '%') OR description LIKE CONCAT('%', :detalle, '%')",
		nativeQuery = true
	)
	fun findByName(@Param("detalle") name: String): List<MaterialSQL>

    fun findByOwnerMail(ownerMail: String): List<MaterialSQL>

}
