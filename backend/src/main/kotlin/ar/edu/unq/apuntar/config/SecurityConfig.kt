package ar.edu.unq.apuntar.config

import ar.edu.unq.apuntar.security.JwtAuthFilter
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.http.HttpMethod
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity
import org.springframework.security.config.http.SessionCreationPolicy
import org.springframework.security.web.SecurityFilterChain
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter
import org.springframework.web.cors.CorsConfiguration
import org.springframework.web.cors.CorsConfigurationSource
import org.springframework.web.cors.UrlBasedCorsConfigurationSource

@Configuration
@EnableWebSecurity //Seguridad y CORS
class SecurityConfig(private val jwtAuthFilter: JwtAuthFilter) {

    @Bean
    fun corsConfigurationSource(): CorsConfigurationSource {
        val configuration = CorsConfiguration()
        configuration.allowedOrigins = listOf("http://localhost:5173") // El puerto de tu Frontend
        configuration.allowedMethods = listOf("GET", "POST", "PUT", "DELETE", "OPTIONS")
        configuration.allowedHeaders = listOf("Authorization", "Content-Type")
        configuration.allowCredentials = true
        val source = UrlBasedCorsConfigurationSource()
        source.registerCorsConfiguration("/**", configuration)
        return source
    }

    @Bean
    fun securityFilterChain(http: HttpSecurity): SecurityFilterChain {
        http
            .cors { it.configurationSource(corsConfigurationSource()) }
            .csrf { it.disable() }
            .sessionManagement { it.sessionCreationPolicy(SessionCreationPolicy.STATELESS) }
            .authorizeHttpRequests { auth ->
                auth.requestMatchers("/api/auth/**").permitAll()
                auth.requestMatchers("/swagger-ui/", "/v3/api-docs/").permitAll()
                // Home y listado público — sin login
                auth.requestMatchers(HttpMethod.GET, "/materiales").permitAll()
                auth.requestMatchers(HttpMethod.GET, "/materiales/{id}").permitAll()
                // Subir material requiere login
                auth.requestMatchers(HttpMethod.POST, "/materiales").authenticated()
                auth.requestMatchers(HttpMethod.DELETE, "/materiales/{id}").authenticated()
                auth.requestMatchers(HttpMethod.POST, "/materiales/{id}/like").authenticated()
                auth.requestMatchers(HttpMethod.POST, "/materiales/{id}/dislike").authenticated()
                auth.requestMatchers("/user/**").authenticated()
                auth.anyRequest().authenticated()
            }
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter::class.java)
        return http.build()
    }
}
