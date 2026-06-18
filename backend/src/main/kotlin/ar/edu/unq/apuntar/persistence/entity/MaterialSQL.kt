package ar.edu.unq.apuntar.persistence.entity

import ar.edu.unq.apuntar.model.material.Category
import jakarta.persistence.*
import java.time.Instant

@Entity
@Table(name = "materiales")
class MaterialSQL(
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    var id: Long?,
    @Column(nullable = false)
    var ownerMail: String,
    var title: String,
    var description: String,
    var subject: String,
    var career: String,
    @Enumerated(EnumType.STRING)
    var category: Category,
    var topic: String,
    @OneToMany(mappedBy = "material", cascade = [CascadeType.ALL], orphanRemoval = true, fetch = FetchType.LAZY)
    var files: MutableList<MaterialFileSQL> = mutableListOf(),
    @OneToMany(mappedBy = "material", cascade = [CascadeType.ALL], orphanRemoval = true, fetch = FetchType.LAZY)
    var videos: MutableList<MaterialVideoSQL> = mutableListOf(),
    var likes: Long = 0,
    var dislikes: Long = 0,
    var createdAt: Instant = Instant.now()
)
