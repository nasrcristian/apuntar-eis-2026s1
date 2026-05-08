package ar.edu.unq.apuntar

import ar.edu.unq.apuntar.dto.CreateFileDTO
import ar.edu.unq.apuntar.exception.InvalidMaterialException
import ar.edu.unq.apuntar.exception.MaterialNotFoundException
import ar.edu.unq.apuntar.model.material.Material
import ar.edu.unq.apuntar.service.MaterialService
import ar.edu.unq.apuntar.model.material.Category
import org.junit.jupiter.api.AfterEach
import org.junit.jupiter.api.Assertions
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.context.annotation.Import
import org.springframework.boot.test.web.server.LocalServerPort
import org.springframework.mock.web.MockMultipartFile
import org.springframework.test.context.TestPropertySource
import java.nio.file.Files
import java.nio.file.Path
import java.nio.file.Paths
import java.net.HttpURLConnection
import java.net.URI
import ar.edu.unq.apuntar.model.User
import ar.edu.unq.apuntar.persistence.dao.UserDao
import ar.edu.unq.apuntar.security.JwtUtil
import org.junit.jupiter.api.BeforeEach

@Import(TestcontainersConfiguration::class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@TestPropertySource(properties = [
    "storage.path=uploads-test",
    "jwt.secret=RBCj+ZLbXkK8ifj1ApAJ8gUwUdvZdL0kE3zRYyxm/f9NfbJwWhTnQJayYLX3mdfF",
    "jwt.expiration=86400000"
])
class MaterialServiceIntegrationTest{

    @Autowired
    lateinit var materialService: MaterialService

    @Autowired
    lateinit var jwtUtil: JwtUtil

    @Autowired
    lateinit var userDao: UserDao

    private lateinit var authToken: String

    @LocalServerPort
    var port: Int = 0

    private val uploadsDir: Path = Paths.get("uploads-test")

    @BeforeEach
    fun setupUser() {
        userDao.save(User(
            name = "Test",
            surname = "User",
            mail = "test@test.com",
            password = "123456"
        ))
        authToken = jwtUtil.generateToken("test@test.com")
    }

    @AfterEach
    fun cleanup() {
        userDao.deleteAll()
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

    @Test
    fun `delete material removes db record and all files from filesystem`() {
        val content1 = "%PDF-1.4\nDelete me 1".toByteArray()
        val content2 = "%PDF-1.4\nDelete me 2".toByteArray()
        val file1 = MockMultipartFile("files", "delete-1.pdf", "application/pdf", content1)
        val file2 = MockMultipartFile("files", "delete-2.pdf", "application/pdf", content2)

        val fileData = CreateFileDTO(
            title = "Material a borrar",
            description = "Descripción suficientemente larga para poder borrar",
            subject = "Programación",
            career = "Ingeniería",
            topic = "Borrado",
            category = Category.APUNTE,
            files = listOf(file1, file2)
        )

        val created = materialService.create(fileData)
        val id = created.id ?: Assertions.fail("El ID del material creado no debe ser nulo")

        val storedNames = created.fileMetadatas.map { it.storedFileName }
        storedNames.forEach { name ->
            Assertions.assertTrue(Files.exists(uploadsDir.resolve(name)), "El archivo debería existir antes de borrar: $name")
        }

        materialService.deleteById(id)

        Assertions.assertThrows(MaterialNotFoundException::class.java) {
            materialService.findById(id)
        }

        storedNames.forEach { name ->
            Assertions.assertFalse(Files.exists(uploadsDir.resolve(name)), "El archivo no debería existir después de borrar: $name")
        }
    }

    @Test
    fun `delete material with unknown id throws material not found`() {
        Assertions.assertThrows(MaterialNotFoundException::class.java) {
            materialService.deleteById(Long.MAX_VALUE)
        }
    }

    @Test
    fun `like endpoint toggles like counter on and off`() {
        val created = materialService.create(
            CreateFileDTO(
                title = "Material likes",
                description = "Descripción suficientemente larga para likes",
                subject = "Programación",
                career = "Ingeniería",
                topic = "Likes",
                category = Category.APUNTE,
                files = listOf(MockMultipartFile("file", "like.pdf", "application/pdf", "%PDF-1.4\nLike".toByteArray()))
            )
        )
        val id = created.id ?: Assertions.fail("El ID no debe ser nulo")

        Assertions.assertEquals(200, httpStatus("http://localhost:$port/materiales/$id/like?isAdding=true", "POST", authToken))
        Assertions.assertEquals(1, materialService.findById(id).likes)

        Assertions.assertEquals(200, httpStatus("http://localhost:$port/materiales/$id/like?isAdding=false", "POST", authToken))
        Assertions.assertEquals(0, materialService.findById(id).likes)
    }

    @Test
    fun `dislike endpoint toggles dislike counter on and off`() {
        val created = materialService.create(
            CreateFileDTO(
                title = "Material dislikes",
                description = "Descripción suficientemente larga para dislikes",
                subject = "Programación",
                career = "Ingeniería",
                topic = "Dislikes",
                category = Category.APUNTE,
                files = listOf(MockMultipartFile("file", "dislike.pdf", "application/pdf", "%PDF-1.4\nDislike".toByteArray()))
            )
        )
        val id = created.id ?: Assertions.fail("El ID no debe ser nulo")

        Assertions.assertEquals(200, httpStatus("http://localhost:$port/materiales/$id/dislike?isAdding=true", "POST", authToken))
        Assertions.assertEquals(1, materialService.findById(id).dislikes)

        Assertions.assertEquals(200, httpStatus("http://localhost:$port/materiales/$id/dislike?isAdding=false", "POST", authToken))
        Assertions.assertEquals(0, materialService.findById(id).dislikes)
    }

    private fun httpStatus(url: String, method: String, token: String? = null): Int {
        val connection = (URI.create(url).toURL().openConnection() as HttpURLConnection).apply {
            requestMethod = method
            doInput = true
            if (token != null) {
                setRequestProperty("Authorization", "Bearer $token")
            }
        }
        return try {
            connection.responseCode
        } finally {
            connection.disconnect()
        }
    }
}