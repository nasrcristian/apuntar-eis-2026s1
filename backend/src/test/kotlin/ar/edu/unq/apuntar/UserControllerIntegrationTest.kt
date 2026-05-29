package ar.edu.unq.apuntar;

import ar.edu.unq.apuntar.model.User
import ar.edu.unq.apuntar.persistence.dao.UserDao
import ar.edu.unq.apuntar.security.JwtUtil
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
class UserControllerIntegrationTest {

    @LocalServerPort
    var port: Int = 0

    @Autowired
    lateinit var userDao: UserDao

    @Autowired
    lateinit var jwtUtil: JwtUtil

    private val client = HttpClient.newHttpClient()
    private val mapper = ObjectMapper()

    private lateinit var testUser: User
    private lateinit var testToken: String

    @BeforeEach
    fun setup() {
        testUser = User(
                name = "Juan",
                surname = "Perez",
                mail = "juan@example.com",
                password = "password123"
        )
        userDao.save(testUser)
        testToken = jwtUtil.generateToken(testUser.mail)
    }

    @AfterEach
    fun cleanup() {
        userDao.deleteAll()
    }

    @Test
    fun `GET user me sin autenticacion devuelve 403`() {
        val response = getMe(null)
        assertEquals(403, response.statusCode(), "Sin token debe retornar 403 Forbidden")
    }

    @Test
    fun `GET user me sin autenticacion devuelve respuesta de error`() {
        val response = getMe(null)
        assertEquals(403, response.statusCode(), "Sin token debe retornar 403 Forbidden")
        val body = response.body()
        assertNotNull(body, "Debe tener un body de respuesta")
    }

    @Test
    fun `GET user me con token valido devuelve 200`() {
        val response = getMe(testToken)
        assertEquals(200, response.statusCode(), "Con token válido debe retornar 200")
    }

    @Test
    fun `GET user me con token valido devuelve datos del usuario`() {
        val response = getMe(testToken)

        assertEquals(200, response.statusCode())
        val body = mapper.readTree(response.body())

        assertEquals("Juan", body.get("name").asText())
        assertEquals("Perez", body.get("surname").asText())
        assertEquals("juan@example.com", body.get("mail").asText())
    }

    @Test
    fun `GET user me con token valido devuelve todos los campos requeridos`() {
        val response = getMe(testToken)

        val body = mapper.readTree(response.body())
        assertNotNull(body.get("name"), "Debe contener name")
        assertNotNull(body.get("surname"), "Debe contener surname")
        assertNotNull(body.get("mail"), "Debe contener mail")
    }

    @Test
    fun `GET user me con token invalido devuelve 403`() {
        val response = getMe("token-invalido")
        assertEquals(403, response.statusCode(), "Con token inválido debe retornar 403")
    }

    @Test
    fun `GET user me con token expirado devuelve 403`() {
        // Generamos un token con un secret diferente (simulando expiración)
        val invalidToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.invalidpayload.invalidsignature"
        val response = getMe(invalidToken)
        assertEquals(403, response.statusCode(), "Con token expirado debe retornar 403")
    }

    @Test
    fun `GET user me retorna nombre y correo del usuario logueado`() {
        val response = getMe(testToken)

        assertEquals(200, response.statusCode())
        val body = mapper.readTree(response.body())

        // Verificar que contiene la información personal del usuario
        assertTrue(body.has("name"), "La respuesta debe contener el nombre")
        assertTrue(body.has("mail"), "La respuesta debe contener el correo")

        val nombre = body.get("name").asText()
        val correo = body.get("mail").asText()

        assertTrue(nombre.isNotBlank(), "El nombre no debe estar vacío")
        assertTrue(correo.isNotBlank(), "El correo no debe estar vacío")
    }

    @Test
    fun `GET user me devuelve datos correctos para multiple usuarios`() {
        // Crear segundo usuario
        val user2 = User(
                name = "Maria",
                surname = "Garcia",
                mail = "maria@example.com",
                password = "password456"
        )
        userDao.save(user2)
        val token2 = jwtUtil.generateToken(user2.mail)

        // Obtener datos del usuario 1
        val response1 = getMe(testToken)
        val body1 = mapper.readTree(response1.body())

        // Obtener datos del usuario 2
        val response2 = getMe(token2)
        val body2 = mapper.readTree(response2.body())

        // Verificar que cada uno recibe sus propios datos
        assertEquals("Juan", body1.get("name").asText())
        assertEquals("juan@example.com", body1.get("mail").asText())

        assertEquals("Maria", body2.get("name").asText())
        assertEquals("maria@example.com", body2.get("mail").asText())
    }

    @Test
    fun `GET user me no retorna la contrasenia`() {
        val response = getMe(testToken)

        val body = mapper.readTree(response.body())
        // La contraseña no debe incluirse en la respuesta
        assertNull(body.get("password"), "No debe contener el campo password por seguridad")
    }

    @Test
    fun `GET user me devuelve 200 y estructura correcta`() {
        val response = getMe(testToken)

        assertEquals(200, response.statusCode())
        val body = mapper.readTree(response.body())

        // Verificar estructura
        assertTrue(body.isObject)
        assertEquals(3, body.size(), "Debe tener exactamente 3 campos: name, surname, mail")
    }

    private fun getMe(token: String?): HttpResponse<String> {
        val builder = HttpRequest.newBuilder()
                .uri(URI.create("http://localhost:$port/user/me"))
                .GET()

        if (token != null) {
            builder.header("Authorization", "Bearer $token")
        }

        val request = builder.build()
        return client.send(request, HttpResponse.BodyHandlers.ofString())
    }
}