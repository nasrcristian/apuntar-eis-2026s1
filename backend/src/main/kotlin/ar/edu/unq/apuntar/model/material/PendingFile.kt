package ar.edu.unq.apuntar.model.material;

import ar.edu.unq.apuntar.exception.InvalidMaterialException

data class PendingFile(
        val originalFileName: String,
        val contentType: String,
        val size: Long
) {
    companion object {
        private val ALLOWED = setOf(
                "application/pdf",
                "application/msword",
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        )
        private const val MAX_BYTES = 20L * 1024L * 1024L // 20MB
    }

    init {
        if (size > MAX_BYTES) throw InvalidMaterialException("El archivo supera el tamaño máximo de 20MB")
        if (!ALLOWED.contains(contentType.lowercase())) throw InvalidMaterialException("Tipo de archivo no permitido: $contentType")
    }
}
