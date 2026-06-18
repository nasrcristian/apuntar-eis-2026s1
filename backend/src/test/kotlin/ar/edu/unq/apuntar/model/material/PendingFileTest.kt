package ar.edu.unq.apuntar.model.material

import ar.edu.unq.apuntar.exception.InvalidMaterialException
import org.junit.jupiter.api.Assertions
import org.junit.jupiter.api.Test

class PendingFileTest {
    private val ONE_MB: Long = 1024L * 1024L

    @Test
    fun `video de 350MB exactos es aceptado (limite inclusivo)`() {
        val pending = PendingFile(
            originalFileName = "clase.mp4",
            contentType = "video/mp4",
            size = 350L * ONE_MB
        )
        Assertions.assertTrue(pending.isVideo)
    }

    @Test
    fun `video de 351MB es rechazado`() {
        val ex = Assertions.assertThrows(InvalidMaterialException::class.java) {
            PendingFile(
                originalFileName = "clase.mp4",
                contentType = "video/mp4",
                size = 351L * ONE_MB
            )
        }
        Assertions.assertTrue(
            ex.message!!.contains("350"),
            "El mensaje de error debe mencionar el nuevo límite de 350MB, pero fue: ${ex.message}"
        )
    }

    @Test
    fun `video de 320MB es aceptado (antes con limite 300MB era rechazado)`() {
        val pending = PendingFile(
            originalFileName = "presentacion.mp4",
            contentType = "video/mp4",
            size = 320L * ONE_MB
        )
        Assertions.assertEquals(320L * ONE_MB, pending.size)
    }

    @Test
    fun `video de 100MB sigue siendo aceptado (sin regresion)`() {
        val pending = PendingFile(
            originalFileName = "corto.mp4",
            contentType = "video/mp4",
            size = 100L * ONE_MB
        )
        Assertions.assertTrue(pending.isVideo)
    }

    @Test
    fun `video de 1GB es rechazado con mensaje claro`() {
        val ex = Assertions.assertThrows(InvalidMaterialException::class.java) {
            PendingFile(
                originalFileName = "pelicula.mp4",
                contentType = "video/mp4",
                size = 1024L * ONE_MB
            )
        }
        Assertions.assertTrue(
            ex.message!!.contains("video", ignoreCase = true),
            "El mensaje debe identificar al tipo como video, pero fue: ${ex.message}"
        )
    }

    @Test
    fun `documento PDF de 10MB sigue siendo aceptado`() {
        val pending = PendingFile(
            originalFileName = "apunte.pdf",
            contentType = "application/pdf",
            size = 10L * ONE_MB
        )
        Assertions.assertFalse(pending.isVideo)
    }

    @Test
    fun `documento PDF de 11MB sigue siendo rechazado`() {
        Assertions.assertThrows(InvalidMaterialException::class.java) {
            PendingFile(
                originalFileName = "apunte.pdf",
                contentType = "application/pdf",
                size = 11L * ONE_MB
            )
        }
    }
}