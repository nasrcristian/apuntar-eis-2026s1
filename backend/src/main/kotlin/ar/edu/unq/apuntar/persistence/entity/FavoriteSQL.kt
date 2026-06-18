package ar.edu.unq.apuntar.persistence.entity

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.Table
import jakarta.persistence.UniqueConstraint

@Entity
@Table(
    name = "favoritos",
    uniqueConstraints = [UniqueConstraint(columnNames = ["user_mail", "material_id"])]
)
class FavoriteSQL(
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    var id: Long?,
    @Column(name = "user_mail", nullable = false)
    var userMail: String,
    @Column(name = "material_id", nullable = false)
    var materialId: Long
)

