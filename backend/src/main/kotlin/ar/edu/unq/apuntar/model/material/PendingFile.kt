package ar.edu.unq.apuntar.model.material;

import ar.edu.unq.apuntar.exception.InvalidMaterialException

data class PendingFile(
        val originalFileName: String,
        val contentType: String,
        val size: Long
) {
    companion object {
        private val ALLOWED_DOCUMENT_TYPES = setOf(
                "application/pdf",
                "application/msword",
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        )
        private const val MAX_DOCUMENT_BYTES = 10L * 1024L * 1024L
        private const val MAX_VIDEO_BYTES = 300L * 1024L * 1024L
    }

    val isVideo: Boolean
        get() = contentType.startsWith("video/")

    init {
        val maxBytes = if (isVideo) MAX_VIDEO_BYTES else MAX_DOCUMENT_BYTES
        if (size > maxBytes) {
            val typeLabel = if (isVideo) "video" else "documento"
            val maxMB = maxBytes / (1024 * 1024)
            throw InvalidMaterialException("El $typeLabel supera el tamaño máximo de ${maxMB}MB")
        }
        if (!isVideo && !ALLOWED_DOCUMENT_TYPES.contains(contentType.lowercase())) {
            throw InvalidMaterialException("Tipo de archivo no permitido: $contentType")
        }
    }
}
