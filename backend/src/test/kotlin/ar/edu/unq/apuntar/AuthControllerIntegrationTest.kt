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
import ar.edu.unq.apuntar.model.PasswordResetToken
import ar.edu.unq.apuntar.persistence.dao.PasswordResetTokenDao
import java.util.UUID
import java.time.LocalDateTime

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

    @Autowired
    lateinit var tokenDao: PasswordResetTokenDao

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
        tokenDao.deleteAll()
        userDao.deleteAll()
    }

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

    @Test
    fun `login con email inexistente devuelve 404`() {
        val response = postLogin("noexiste@test.com", "123456")
        assertEquals(404, response.statusCode())
    }

    @Test
    fun `login con email inexistente devuelve mensaje de error`() {
        val response = postLogin("noexiste@test.com", "123456")

        val body = mapper.readTree(response.body())
        assertNotNull(body.get("message"), "La respuesta debe contener un campo error")
        assertTrue(body.get("message").asText().isNotBlank())
    }

    @Test
    fun `login con contraseña incorrecta devuelve 401`() {
        val response = postLogin("test@test.com", "wrongpass")

        assertEquals(401, response.statusCode())
    }

    @Test
    fun `login con contraseña incorrecta devuelve mensaje de error`() {
        val response = postLogin("test@test.com", "wrongpass")

        val body = mapper.readTree(response.body())
        assertNotNull(body.get("message"), "La respuesta debe contener un campo error")
        assertTrue(body.get("message").asText().isNotBlank())
    }

    @Test
    fun `login con email vacio devuelve error`() {
        val response = postLogin("", "123456")

        assertTrue(
            response.statusCode() == 400 || response.statusCode() == 404,
            "Email vacío debe devolver 400 o 401, no 200"
        )
    }

    @Test
    fun `login con password vacio devuelve error`() {
        val response = postLogin("test@test.com", "")

        assertTrue(
            response.statusCode() == 401 || response.statusCode() == 404,
            "Password vacío debe devolver error, no 200"
        )
    }

    @Test
    fun `forgot password con mail existente devuelve 200`() {
        val response = postForgot("test@test.com")
        assertEquals(200, response.statusCode())
    }

    @Test
    fun `forgot password con mail existente devuelve un token no vacio`() {
        val response = postForgot("test@test.com")
        val body = mapper.readTree(response.body())
        assertNotNull(body.get("token"))
        assertTrue(body.get("token").asText().isNotBlank())
    }

    @Test
    fun `forgot password persiste el token en la base`() {
        val response = postForgot("test@test.com")
        val token = mapper.readTree(response.body()).get("token").asText()
        assertNotNull(tokenDao.findByToken(token))
    }

    @Test
    fun `forgot password con mail inexistente devuelve 200 sin token`() {
        val response = postForgot("noexiste@test.com")
        assertEquals(200, response.statusCode())
        val body = mapper.readTree(response.body())
        val tokenNode = body.get("token")
        assertTrue(
            tokenNode == null || tokenNode.isNull,
            "El token debe ser null o estar ausente para no filtrar si el mail existe"
        )
    }

    @Test
    fun `forgot password con body vacio devuelve 400`() {
        val response = postForgot("")
        assertEquals(400, response.statusCode())
    }

    @Test
    fun `reset password con token valido devuelve 200`() {
        val token = pedirResetTokenPara("test@test.com")
        val response = postReset(token, "nuevapass123")
        assertEquals(200, response.statusCode())
    }

    @Test
    fun `reset password con token valido cambia la contrasenia y permite loguearse con la nueva`() {
        val token = pedirResetTokenPara("test@test.com")
        postReset(token, "nuevapass123")

        val loginResponse = postLogin("test@test.com", "nuevapass123")
        assertEquals(200, loginResponse.statusCode())
    }

    @Test
    fun `despues de reset, la contrasenia vieja ya no funciona`() {
        val token = pedirResetTokenPara("test@test.com")
        postReset(token, "nuevapass123")

        val loginResponse = postLogin("test@test.com", "123456") // la pass original
        assertNotEquals(200, loginResponse.statusCode())
    }

    @Test
    fun `reset password marca el token como usado`() {
        val token = pedirResetTokenPara("test@test.com")
        postReset(token, "nuevapass123")

        val saved = tokenDao.findByToken(token)
        assertNotNull(saved?.usedAt, "El token debe quedar marcado con usedAt despues de usarlo")
    }

    @Test
    fun `reset password con token inexistente devuelve 400`() {
        val response = postReset("token-que-no-existe", "nuevapass123")
        assertEquals(400, response.statusCode())
    }

    @Test
    fun `reset password con token ya usado devuelve 400`() {
        val token = pedirResetTokenPara("test@test.com")
        postReset(token, "nuevapass123") // primer uso ok

        val segundoUso = postReset(token, "otrapass123")
        assertEquals(400, segundoUso.statusCode())
    }

    @Test
    fun `reset password con token expirado devuelve 400`() {
        // Insertamos un token ya vencido directamente en la base
        val expiredToken = PasswordResetToken(
            userMail = "test@test.com",
            token = UUID.randomUUID().toString(),
            expiresAt = LocalDateTime.now().minusMinutes(1)
        )
        tokenDao.save(expiredToken)

        val response = postReset(expiredToken.token, "nuevapass123")
        assertEquals(400, response.statusCode())
    }

    @Test
    fun `reset password con contrasenia muy corta devuelve 400`() {
        val token = pedirResetTokenPara("test@test.com")
        val response = postReset(token, "corta") // menos de 8 chars
        assertEquals(400, response.statusCode())
    }

    private fun pedirResetTokenPara(mail: String): String {
        val response = postForgot(mail)
        return mapper.readTree(response.body()).get("token").asText()
    }

    private fun postForgot(mail: String): HttpResponse<String> {
        val body = mapper.writeValueAsString(mapOf("mail" to mail))
        val request = HttpRequest.newBuilder()
            .uri(URI.create("http://localhost:$port/api/auth/forgot-password"))
            .header("Content-Type", "application/json")
            .POST(HttpRequest.BodyPublishers.ofString(body))
            .build()
        return client.send(request, HttpResponse.BodyHandlers.ofString())
    }

    private fun postReset(token: String, newPassword: String): HttpResponse<String> {
        val body = mapper.writeValueAsString(mapOf("token" to token, "newPassword" to newPassword))
        val request = HttpRequest.newBuilder()
            .uri(URI.create("http://localhost:$port/api/auth/reset-password"))
            .header("Content-Type", "application/json")
            .POST(HttpRequest.BodyPublishers.ofString(body))
            .build()
        return client.send(request, HttpResponse.BodyHandlers.ofString())
    }

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