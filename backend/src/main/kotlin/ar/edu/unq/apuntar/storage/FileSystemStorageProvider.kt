package ar.edu.unq.apuntar.storage

import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Component
import org.springframework.web.multipart.MultipartFile
import java.nio.file.Files
import java.nio.file.Path
import java.nio.file.Paths
import java.util.UUID

@Component
class FileSystemStorageProvider(
    @Value("\${storage.path:uploads}") storagePathStr: String
) : StorageProvider {
    private val storagePath: Path = Paths.get(storagePathStr)

    init {
        if (!Files.exists(storagePath)) {
            Files.createDirectories(storagePath)
        }
    }

    override fun store(file: MultipartFile): StorageProvider.StoredFile {
        val storedFileName = UUID.randomUUID().toString() + "_" + (file.originalFilename ?: "file")
        val target = storagePath.resolve(storedFileName)
        file.inputStream.use { input ->
            Files.copy(input, target)
        }
        return StorageProvider.StoredFile(storedFileName, file.contentType, file.size)
    }
}

