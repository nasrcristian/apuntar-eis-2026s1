package ar.edu.unq.apuntar

import ar.edu.unq.apuntar.model.User
import ar.edu.unq.apuntar.persistence.dao.UserDao
import com.fasterxml.jackson.databind.ObjectMapper
import org.junit.jupiter.api.AfterEach
import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.boot.test.web.server.LocalServerPort
import org.springframework.context.annotation.Import
import org.springframework.test.context.TestPropertySource
import java.net.URI
import java.net.http.HttpClient
import java.net.http.HttpRequest
import java.net.http.HttpResponse

@Import(TestcontainersConfiguration::class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@TestPropertySource(properties = [
    "jwt.secret=RBCj+ZLbXkK8ifj1ApAJ8gUwUdvZdL0kE3zRYyxm/f9NfbJwWhTnQJayYLX3mdfF",
    "jwt.expiration=86400000"
])
class AuthControllerIntegrationTest {

    @LocalServerPort
    var port: Int = 0

    @Autowired
    lateinit var userDao: UserDao

    private val client = HttpClient.newHttpClient()
    private val mapper = ObjectMapper()

    @BeforeEach
    fun setup() {
        userDao.save(User(
            name = "Test",
            surname = "User",
            mail = "test@test.com",
            password = "123456"
        ))
    }

    @AfterEach
    fun cleanup() {
        userDao.deleteAll()
    }

    // ============ CASOS EXITOSOS ============

    @Test
    fun `login exitoso devuelve 200 y un token`() {
        val response = postLogin("test@test.com", "123456")

        assertEquals(200, response.statusCode())

        val body = mapper.readTree(response.body())
        assertNotNull(body.get("token"), "La respuesta debe contener un token")
        assertTrue(body.get("token").asText().isNotBlank(), "El token no debe estar vacío")
    }

    @Test
    fun `login exitoso devuelve un JWT con tres partes`() {
        val response = postLogin("test@test.com", "123456")

        val token = mapper.readTree(response.body()).get("token").asText()
        val partes = token.split(".")

        assertEquals(3, partes.size, "Un JWT debe tener header.payload.signature")
    }

    // ============ USUARIO NO EXISTE ============

    @Test
    fun `login con email inexistente devuelve 404`() {
        val response = postLogin("noexiste@test.com", "123456")

        assertEquals(404, response.statusCode())
    }

    @Test
    fun `login con email inexistente devuelve mensaje de error`() {
        val response = postLogin("noexiste@test.com", "123456")

        val body = mapper.readTree(response.body())
        assertNotNull(body.get("error"), "La respuesta debe contener un campo error")
        assertTrue(body.get("error").asText().isNotBlank())
    }

    // ============ CONTRASEÑA INCORRECTA ============

    @Test
    fun `login con contraseña incorrecta devuelve 401`() {
        val response = postLogin("test@test.com", "wrongpass")

        assertEquals(401, response.statusCode())
    }

    @Test
    fun `login con contraseña incorrecta devuelve mensaje de error`() {
        val response = postLogin("test@test.com", "wrongpass")

        val body = mapper.readTree(response.body())
        assertNotNull(body.get("error"), "La respuesta debe contener un campo error")
        assertTrue(body.get("error").asText().isNotBlank())
    }

    // ============ VALIDACIONES DE CAMPOS ============

    @Test
    fun `login con email vacio devuelve error`() {
        val response = postLogin("", "123456")

        assertTrue(
            response.statusCode() == 400 || response.statusCode() == 404,
            "Email vacío debe devolver 400 o 404, no 200"
        )
    }

    @Test
    fun `login con password vacio devuelve error`() {
        val response = postLogin("test@test.com", "")

        assertTrue(
            response.statusCode() == 400 || response.statusCode() == 401,
            "Password vacío debe devolver error, no 200"
        )
    }

    // ============ HELPER ============

    private fun postLogin(mail: String, password: String): HttpResponse<String> {
        val body = mapper.writeValueAsString(mapOf("mail" to mail, "password" to password))

        val request = HttpRequest.newBuilder()
            .uri(URI.create("http://localhost:$port/api/auth/login"))
            .header("Content-Type", "application/json")
            .POST(HttpRequest.BodyPublishers.ofString(body))
            .build()

        return client.send(request, HttpResponse.BodyHandlers.ofString())
    }
}