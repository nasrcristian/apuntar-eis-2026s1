package ar.edu.unq.apuntar

import ar.edu.unq.apuntar.dto.CreateFileDTO
import ar.edu.unq.apuntar.model.User
import ar.edu.unq.apuntar.model.material.Category
import ar.edu.unq.apuntar.persistence.dao.FavoriteDao
import ar.edu.unq.apuntar.persistence.dao.MaterialDao
import ar.edu.unq.apuntar.persistence.dao.UserDao
import ar.edu.unq.apuntar.security.JwtUtil
import ar.edu.unq.apuntar.service.MaterialService
import com.fasterxml.jackson.databind.ObjectMapper
import org.junit.jupiter.api.AfterEach
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Assertions.assertFalse
import org.junit.jupiter.api.Assertions.assertNotNull
import org.junit.jupiter.api.Assertions.assertTrue
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.boot.test.web.server.LocalServerPort
import org.springframework.context.annotation.Import
import org.springframework.mock.web.MockMultipartFile
import org.springframework.test.context.TestPropertySource
import java.net.URI
import java.net.http.HttpClient
import java.net.http.HttpRequest
import java.net.http.HttpResponse
import java.nio.file.Files
import java.nio.file.Path
import java.nio.file.Paths

@Import(TestcontainersConfiguration::class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@TestPropertySource(properties = [
    "storage.path=uploads-test",
    "jwt.secret=RBCj+ZLbXkK8ifj1ApAJ8gUwUdvZdL0kE3zRYyxm/f9NfbJwWhTnQJayYLX3mdfF",
    "jwt.expiration=86400000"
])
class FavoriteMaterialIntegrationTest {

    @LocalServerPort
    var port: Int = 0

    @Autowired
    lateinit var materialService: MaterialService

    @Autowired
    lateinit var jwtUtil: JwtUtil

    @Autowired
    lateinit var userDao: UserDao

    @Autowired
    lateinit var materialDao: MaterialDao

    @Autowired
    lateinit var favoriteDao: FavoriteDao

    private val client = HttpClient.newHttpClient()
    private val mapper = ObjectMapper()
    private val uploadsDir: Path = Paths.get("uploads-test")

    private lateinit var authToken: String

    @BeforeEach
    fun setup() {
        userDao.save(
            User(
                name = "Test",
                surname = "User",
                mail = "test@test.com",
                password = "123456"
            )
        )
        authToken = jwtUtil.generateToken("test@test.com")
    }

    @AfterEach
    fun cleanup() {
        favoriteDao.deleteAll()
        materialDao.deleteAll()
        userDao.deleteAll()
        if (Files.exists(uploadsDir) && Files.isDirectory(uploadsDir)) {
            Files.list(uploadsDir).use { stream ->
                stream.forEach { p -> Files.deleteIfExists(p) }
            }
        }
    }

    @Test
    fun `toggle favorites adds and removes material`() {
        val materialId = createMaterial("Favorito 1")

        val added = toggleFavorite(materialId)
        assertEquals(200, added.statusCode())
        assertTrue(mapper.readTree(added.body()).get("isFavorite").asBoolean())

        val status = getFavoriteStatus(materialId)
        assertEquals(200, status.statusCode())
        assertTrue(mapper.readTree(status.body()).get("isFavorite").asBoolean())

        val removed = toggleFavorite(materialId)
        assertEquals(200, removed.statusCode())
        assertFalse(mapper.readTree(removed.body()).get("isFavorite").asBoolean())
    }

    @Test
    fun `favorites list is ordered by createdAt desc`() {
        val firstId = createMaterial("Material A")
        Thread.sleep(10)
        val secondId = createMaterial("Material B")

        toggleFavorite(firstId)
        toggleFavorite(secondId)

        val response = getFavorites()
        assertEquals(200, response.statusCode())
        val body = mapper.readTree(response.body())
        assertEquals(2, body.size())

        val firstListedId = body[0].get("id").asLong()
        val secondListedId = body[1].get("id").asLong()

        assertEquals(secondId, firstListedId)
        assertEquals(firstId, secondListedId)
    }

    @Test
    fun `favorites list empty returns empty array`() {
        val response = getFavorites()
        assertEquals(200, response.statusCode())
        val body = mapper.readTree(response.body())
        assertNotNull(body)
        assertEquals(0, body.size())
    }

    private fun createMaterial(title: String): Long {
        val pdf = MockMultipartFile(
            "files",
            "file.pdf",
            "application/pdf",
            "%PDF-1.4\ncontent".toByteArray()
        )
        val created = materialService.create(
            CreateFileDTO(
                ownerMail = "test@test.com",
                title = title,
                description = "Descripcion suficientemente larga para pasar validacion",
                subject = "Programacion",
                career = "Ingenieria",
                topic = "Tema",
                category = Category.APUNTE,
                files = listOf(pdf)
            )
        )
        return created.id ?: throw IllegalStateException("Material sin id")
    }

    private fun toggleFavorite(materialId: Long): HttpResponse<String> {
        val request = HttpRequest.newBuilder()
            .uri(URI.create("http://localhost:$port/materiales/$materialId/favoritos"))
            .header("Authorization", "Bearer $authToken")
            .POST(HttpRequest.BodyPublishers.noBody())
            .build()
        return client.send(request, HttpResponse.BodyHandlers.ofString())
    }

    private fun getFavoriteStatus(materialId: Long): HttpResponse<String> {
        val request = HttpRequest.newBuilder()
            .uri(URI.create("http://localhost:$port/materiales/$materialId/favoritos"))
            .header("Authorization", "Bearer $authToken")
            .GET()
            .build()
        return client.send(request, HttpResponse.BodyHandlers.ofString())
    }

    private fun getFavorites(): HttpResponse<String> {
        val request = HttpRequest.newBuilder()
            .uri(URI.create("http://localhost:$port/materiales/favoritos"))
            .header("Authorization", "Bearer $authToken")
            .GET()
            .build()
        return client.send(request, HttpResponse.BodyHandlers.ofString())
    }
}

