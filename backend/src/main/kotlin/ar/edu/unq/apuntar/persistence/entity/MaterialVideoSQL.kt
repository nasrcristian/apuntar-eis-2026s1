package ar.edu.unq.apuntar.persistence.entity

import jakarta.persistence.*
import java.time.Duration

@Entity
@Table(name = "materiales_video")
class MaterialVideoSQL(
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    var id: Long?,
    var duracion: Long? = null,
    var bitrate: Int? = null,
    var resolucion: String? = null,
    var codec: String? = null,
    @OneToOne(fetch = FetchType.LAZY, cascade = [CascadeType.ALL], orphanRemoval = true)
    @JoinColumn(name = "file_id", nullable = false)
    var file: MaterialFileSQL?,
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_de_material", nullable = false)
    var material: MaterialSQL?
)