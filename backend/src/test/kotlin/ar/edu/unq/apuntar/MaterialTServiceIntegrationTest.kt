package ar.edu.unq.apuntar

import ar.edu.unq.apuntar.controller.dto.CreateFileDTO
import ar.edu.unq.apuntar.exception.InvalidMaterialException
import ar.edu.unq.apuntar.model.material.teorico.MaterialT
import ar.edu.unq.apuntar.service.MaterialTService
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
@TestPropertySource(properties = ["storage.path=uploads-test"])
class MaterialTServiceIntegrationTest{

    @Autowired
    lateinit var materialTService: MaterialTService

    private val uploadsDir: Path = Paths.get("uploads-test")

    @AfterEach
    fun cleanup() {
        if (Files.exists(uploadsDir) && Files.isDirectory(uploadsDir)) {
            Files.list(uploadsDir).use { stream ->
                stream.forEach { p -> Files.deleteIfExists(p) }
            }
        }
    }

    @Test
    fun `create and read material saves entity and file on disk`() {
        val content = "%PDF-1.4\nTest PDF content".toByteArray()
        val multipart = MockMultipartFile("file", "test.pdf", "application/pdf", content)

        val fileData = CreateFileDTO(
            title = "Título de prueba",
            description = "Descripción suficientemente larga para pasar la validación",
            subject = "Programación",
            faculty = "Ingeniería",
            file = multipart
        )

        val materialT: MaterialT = materialTService.create(fileData)

        val id = materialT.id ?: Assertions.fail("El ID del material creado no debe ser nulo")
        Assertions.assertNotNull(id)

        val persisted = materialTService.findById(id)
        Assertions.assertNotNull(persisted)

        Assertions.assertEquals("Título de prueba", persisted.title)
        Assertions.assertEquals("Programación", persisted.subject)
        Assertions.assertEquals("Ingeniería", persisted.faculty)
        Assertions.assertEquals("test.pdf", persisted.fileMetadata.originalFileName)

        // Comprobar que el archivo fue guardado en el filesystem
        val storedName = persisted.fileMetadata.storedFileName
        val storedPath = uploadsDir.resolve(storedName)
        Assertions.assertTrue(Files.exists(storedPath), "El archivo almacenado no existe en: $storedPath")

        val diskBytes = Files.readAllBytes(storedPath)
        Assertions.assertArrayEquals(content, diskBytes, "El contenido del archivo en disco no coincide con el enviado")
    }

    @Test
    fun `findAll returns created materials`() {
        val content = "dummy".toByteArray()
        val multipart = MockMultipartFile("file", "a.pdf", "application/pdf", content)

        val fileData = CreateFileDTO(
            title = "Otro título",
            description = "Otra descripción suficientemente larga",
            subject = "Matemática",
            faculty = "Ciencias",
            file = multipart
        )

        val created = materialTService.create(fileData)
        val id = created.id
        Assertions.assertNotNull(id)
        val all = materialTService.findAll()
        Assertions.assertTrue(all.any { it.id == id }, "La lista de materiales no contiene el creado")
    }

    @Test
    fun `invalid file is rejected before storing on disk`() {
        val content = "not allowed".toByteArray()
        val multipart = MockMultipartFile("file", "test.txt", "text/plain", content)

        val fileData = CreateFileDTO(
            title = "Título válido",
            description = "Descripción suficientemente larga para pasar la validación",
            subject = "Programación",
            faculty = "Ingeniería",
            file = multipart
        )

        Assertions.assertThrows(InvalidMaterialException::class.java) {
            materialTService.create(fileData)
        }

        if (Files.exists(uploadsDir) && Files.isDirectory(uploadsDir)) {
            Files.list(uploadsDir).use { stream ->
                Assertions.assertEquals(0, stream.count(), "No debería haberse guardado ningún archivo en disco")
            }
        }
    }
}