package ar.edu.unq.apuntar.model.material

class FileMetadata private constructor(
    val originalFileName: String,
    val storedFileName: String,
    val contentType: String,
    val size: Long
) {
    companion object {
        // Para crear desde un archivo nuevo (viene de PendingFile ya validado)
        fun of(pending: PendingFile, storedFileName: String): FileMetadata {
            return FileMetadata(pending.originalFileName, storedFileName, pending.contentType, pending.size)
        }

        // Para reconstruir desde la DB (ya fue validado al guardarse)
        fun fromPersistence(
            originalFileName: String,
            storedFileName: String,
            contentType: String,
            size: Long
        ): FileMetadata {
            return FileMetadata(originalFileName, storedFileName, contentType, size)
        }
    }
}