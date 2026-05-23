package ar.edu.unq.apuntar

import ar.edu.unq.apuntar.dto.CreateFileDTO
import ar.edu.unq.apuntar.dto.UpdateMaterialDto
import ar.edu.unq.apuntar.exception.InvalidMaterialException
import ar.edu.unq.apuntar.exception.MaterialNotFoundException
import ar.edu.unq.apuntar.model.material.Category
import ar.edu.unq.apuntar.service.MaterialService
import org.junit.jupiter.api.AfterEach
import org.junit.jupiter.api.Assertions
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.context.annotation.Import
import org.springframework.mock.web.MockMultipartFile
import org.springframework.test.context.TestPropertySource
import java.nio.file.Files
import java.nio.file.Path
import java.nio.file.Paths

@Import(TestcontainersConfiguration::class)
@SpringBootTest
@TestPropertySource(properties = [
    "storage.path=uploads-test"
])
class MaterialServiceUpdateTest {

    @Autowired
    lateinit var materialService: MaterialService

    private val uploadsDir: Path = Paths.get("uploads-test")

    @AfterEach
    fun cleanup() {
        if (Files.exists(uploadsDir) && Files.isDirectory(uploadsDir)) {
            Files.list(uploadsDir).use { stream ->
                stream.forEach { Files.deleteIfExists(it) }
            }
        }
    }

    @Test
    fun `update actualiza campos de texto manteniendo los archivos cuando no se envian nuevos`() {
        val id = crearMaterialBase()
        val original = materialService.findById(id)
        val originalStoredName = original.fileMetadatas.first().storedFileName

        val updated = materialService.update(
            id,
            UpdateMaterialDto(
                title = "Título actualizado",
                description = "Descripción actualizada con más de 10 caracteres",
                subject = "Matemática",
                career = "Ciencias",
                topic = "Nuevo tópico",
                category = Category.RESUMEN,
                files = null
            )
        )

        Assertions.assertEquals("Título actualizado", updated.title)
        Assertions.assertEquals("Matemática", updated.subject)
        Assertions.assertEquals(Category.RESUMEN, updated.category)
        Assertions.assertEquals(1, updated.fileMetadatas.size)
        Assertions.assertEquals(originalStoredName, updated.fileMetadatas.first().storedFileName)
        Assertions.assertTrue(Files.exists(uploadsDir.resolve(originalStoredName)))
    }

    @Test
    fun `update con archivos nuevos reemplaza los viejos y los borra del disco`() {
        val id = crearMaterialBase()
        val original = materialService.findById(id)
        val oldStoredName = original.fileMetadatas.first().storedFileName

        val updated = materialService.update(
            id,
            UpdateMaterialDto(
                title = "Material con archivo nuevo",
                description = "Descripción con más de 10 caracteres",
                subject = "Programación",
                career = "Ingeniería",
                topic = "Nuevo",
                category = Category.APUNTE,
                files = listOf(pdfFile("nuevo.pdf"))
            )
        )

        val newStoredName = updated.fileMetadatas.first().storedFileName
        Assertions.assertNotEquals(oldStoredName, newStoredName)
        Assertions.assertFalse(Files.exists(uploadsDir.resolve(oldStoredName)), "El archivo viejo debe borrarse")
        Assertions.assertTrue(Files.exists(uploadsDir.resolve(newStoredName)), "El archivo nuevo debe existir")
    }

    @Test
    fun `update con titulo vacio lanza InvalidMaterialException`() {
        val id = crearMaterialBase()
        Assertions.assertThrows(InvalidMaterialException::class.java) {
            materialService.update(id, datosValidos().copy(title = "   "))
        }
    }

    @Test
    fun `update con titulo de mas de 120 caracteres lanza InvalidMaterialException`() {
        val id = crearMaterialBase()
        Assertions.assertThrows(InvalidMaterialException::class.java) {
            materialService.update(id, datosValidos().copy(title = "x".repeat(121)))
        }
    }

    @Test
    fun `update con descripcion de menos de 10 caracteres lanza InvalidMaterialException`() {
        val id = crearMaterialBase()
        Assertions.assertThrows(InvalidMaterialException::class.java) {
            materialService.update(id, datosValidos().copy(description = "corto"))
        }
    }

    @Test
    fun `update con tema de mas de 80 caracteres lanza InvalidMaterialException`() {
        val id = crearMaterialBase()
        Assertions.assertThrows(InvalidMaterialException::class.java) {
            materialService.update(id, datosValidos().copy(topic = "x".repeat(81)))
        }
    }

    @Test
    fun `update de material inexistente lanza MaterialNotFoundException`() {
        Assertions.assertThrows(MaterialNotFoundException::class.java) {
            materialService.update(Long.MAX_VALUE, datosValidos())
        }
    }

    // Helpers

    private fun pdfFile(name: String = "doc.pdf", content: String = "%PDF-1.4\nhola"): MockMultipartFile =
        MockMultipartFile("files", name, "application/pdf", content.toByteArray())

    private fun crearMaterialBase(): Long {
        val created = materialService.create(
            CreateFileDTO(
                ownerMail = "test@test.com",
                title = "Material original",
                description = "Descripción original suficientemente larga",
                subject = "Programación",
                career = "Ingeniería",
                topic = "Original",
                category = Category.APUNTE,
                files = listOf(pdfFile("original.pdf"))
            )
        )
        return created.id ?: Assertions.fail("El ID no debe ser nulo")
    }

    private fun datosValidos() = UpdateMaterialDto(
        title = "Título válido",
        description = "Descripción suficientemente larga",
        subject = "Programación",
        career = "Ingeniería",
        topic = "Tema válido",
        category = Category.APUNTE,
        files = null
    )
}