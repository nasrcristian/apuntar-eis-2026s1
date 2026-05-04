package ar.edu.unq.apuntar

import ar.edu.unq.apuntar.dto.CreateFileDTO
import ar.edu.unq.apuntar.exception.InvalidMaterialException
import ar.edu.unq.apuntar.model.material.Material
import ar.edu.unq.apuntar.service.MaterialService
import ar.edu.unq.apuntar.model.material.Category
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
class MaterialServiceIntegrationTest{

    @Autowired
    lateinit var materialService: MaterialService

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
            career = "Ingeniería",
            topic = "Tema prueba",
            category = Category.APUNTE,
            files = listOf(multipart)
        )

        val material: Material = materialService.create(fileData)

        val id = material.id ?: Assertions.fail("El ID del material creado no debe ser nulo")
        Assertions.assertNotNull(id)

        val persisted = materialService.findById(id)
        Assertions.assertNotNull(persisted)

        Assertions.assertEquals("Título de prueba", persisted.title)
        Assertions.assertEquals("Programación", persisted.subject)
        Assertions.assertEquals("Ingeniería", persisted.career)
        Assertions.assertEquals("test.pdf", persisted.fileMetadatas[0].originalFileName)

        // Comprobar que el archivo fue guardado en el filesystem
        val storedName = persisted.fileMetadatas[0].storedFileName
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
            career = "Ciencias",
            topic = "Tema X",
            category = Category.APUNTE,
            files = listOf(multipart)
        )

        val created = materialService.create(fileData)
        val id = created.id
        Assertions.assertNotNull(id)
        val all = materialService.findAll()
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
            career = "Ingeniería",
            topic = "Tema Y",
            category = Category.APUNTE,
            files = listOf(multipart)
        )

        Assertions.assertThrows(InvalidMaterialException::class.java) {
            materialService.create(fileData)
        }

        if (Files.exists(uploadsDir) && Files.isDirectory(uploadsDir)) {
            Files.list(uploadsDir).use { stream ->
                Assertions.assertEquals(0, stream.count(), "No debería haberse guardado ningún archivo en disco")
            }
        }
    }

    @Test
    fun `create material with multiple valid files saves all files on disk`() {
        val pdfContent = "%PDF-1.4\nPDF content".toByteArray()
        val docxContent = "PK\u0003\u0004".toByteArray() // DOCX magic bytes
        
        val file1 = MockMultipartFile("files", "documento1.pdf", "application/pdf", pdfContent)
        val file2 = MockMultipartFile("files", "documento2.docx", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", docxContent)

        val fileData = CreateFileDTO(
            title = "Material con múltiples archivos",
            description = "Este material contiene dos archivos para demostrar soporte múltiple",
            subject = "Programación Avanzada",
            career = "Ingeniería",
            topic = "Patrones de diseño",
            category = Category.TRABAJO_PRACTICO,
            files = listOf(file1, file2)
        )

        val material: Material = materialService.create(fileData)
        val id = material.id ?: Assertions.fail("El ID del material creado no debe ser nulo")

        val persisted = materialService.findById(id)
        Assertions.assertNotNull(persisted)

        // Verificar que se crearon 2 archivos
        Assertions.assertEquals(2, persisted.fileMetadatas.size, "Debería haber 2 archivos asociados")

        // Verificar que cada archivo tiene su metadata correcta
        val file1Metadata = persisted.fileMetadatas.find { it.originalFileName == "documento1.pdf" }
        val file2Metadata = persisted.fileMetadatas.find { it.originalFileName == "documento2.docx" }

        Assertions.assertNotNull(file1Metadata, "Debería existir documento1.pdf en los metadatos")
        Assertions.assertNotNull(file2Metadata, "Debería existir documento2.docx en los metadatos")

        // Verificar que los archivos fueron guardados en el filesystem
        val storedPath1 = uploadsDir.resolve(file1Metadata!!.storedFileName)
        val storedPath2 = uploadsDir.resolve(file2Metadata!!.storedFileName)

        Assertions.assertTrue(Files.exists(storedPath1), "El archivo 1 no existe en: $storedPath1")
        Assertions.assertTrue(Files.exists(storedPath2), "El archivo 2 no existe en: $storedPath2")

        // Verificar el contenido de cada archivo
        val diskBytes1 = Files.readAllBytes(storedPath1)
        val diskBytes2 = Files.readAllBytes(storedPath2)

        Assertions.assertArrayEquals(pdfContent, diskBytes1, "El contenido del archivo 1 no coincide")
        Assertions.assertArrayEquals(docxContent, diskBytes2, "El contenido del archivo 2 no coincide")
    }

    @Test
    fun `create material with multiple files where one is invalid rejects all without storing any`() {
        val validPdfContent = "%PDF-1.4\nValid PDF".toByteArray()
        val invalidTxtContent = "This is a text file which is not allowed".toByteArray()

        // Primer archivo válido (PDF)
        val file1 = MockMultipartFile("files", "valido.pdf", "application/pdf", validPdfContent)
        // Segundo archivo inválido (TXT)
        val file2 = MockMultipartFile("files", "invalido.txt", "text/plain", invalidTxtContent)

        val fileData = CreateFileDTO(
            title = "Material con archivo inválido",
            description = "Este material intenta subir un archivo PDF y otro TXT (inválido)",
            subject = "Testing",
            career = "Ingeniería",
            topic = "Validación de archivos",
            category = Category.RESUMEN,
            files = listOf(file1, file2)
        )

        // La validación debe fallar y lanzar excepción sin guardar ningún archivo
        Assertions.assertThrows(InvalidMaterialException::class.java) {
            materialService.create(fileData)
        }

        // Verificar que NO se guardó nada en disco (carpeta uploads-test debe estar vacía)
        if (Files.exists(uploadsDir) && Files.isDirectory(uploadsDir)) {
            Files.list(uploadsDir).use { stream ->
                val fileCount = stream.count()
                Assertions.assertEquals(0, fileCount, "No debería haberse guardado ningún archivo cuando uno de los múltiples es inválido")
            }
        }
    }
}