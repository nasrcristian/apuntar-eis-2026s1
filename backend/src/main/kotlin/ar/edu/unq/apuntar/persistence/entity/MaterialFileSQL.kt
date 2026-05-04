package ar.edu.unq.apuntar.persistence.entity

import jakarta.persistence.*

@Entity
@Table(name = "material_files")
class MaterialFileSQL(
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    var id: Long?,
    var originalFileName: String,
    var storedFileName: String,
    var contentType: String,
    var size: Long,
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "material_id")
    var material: MaterialSQL?
)

