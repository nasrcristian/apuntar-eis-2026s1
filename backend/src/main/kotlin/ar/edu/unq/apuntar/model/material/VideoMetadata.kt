package ar.edu.unq.apuntar.model.material

import java.time.Duration

class VideoMetadata private constructor(
    val originalFileName: String,
    val storedFileName: String,
    val contentType: String,
    val size: Long,
    val duracion: Duration?,
    val bitrate: Int?,
    val resolucion: String?,
    val codec: String?
) {
    companion object {
        fun of(
            pending: PendingFile,
            storedFileName: String,
            duracion: Duration? = null,
            bitrate: Int? = null,
            resolucion: String? = null,
            codec: String? = null
        ): VideoMetadata {
            return VideoMetadata(
                pending.originalFileName,
                storedFileName,
                pending.contentType,
                pending.size,
                duracion,
                bitrate,
                resolucion,
                codec
            )
        }

        fun fromPersistence(
            originalFileName: String,
            storedFileName: String,
            contentType: String,
            size: Long,
            duracion: Duration?,
            bitrate: Int?,
            resolucion: String?,
            codec: String?
        ): VideoMetadata {
            return VideoMetadata(originalFileName, storedFileName, contentType, size, duracion, bitrate, resolucion, codec)
        }
    }
}
