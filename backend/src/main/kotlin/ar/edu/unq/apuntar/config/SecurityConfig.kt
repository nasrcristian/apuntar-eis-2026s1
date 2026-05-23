package ar.edu.unq.apuntar.config

import ar.edu.unq.apuntar.security.JwtAuthFilter
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.http.HttpMethod
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity
import org.springframework.security.config.http.SessionCreationPolicy
import org.springframework.security.crypto.password.NoOpPasswordEncoder
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.security.web.SecurityFilterChain
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter
import org.springframework.web.cors.CorsConfiguration
import org.springframework.web.cors.CorsConfigurationSource
import org.springframework.web.cors.UrlBasedCorsConfigurationSource

@Configuration
@EnableWebSecurity
class SecurityConfig(private val jwtAuthFilter: JwtAuthFilter) {

    @Bean
    @Suppress("DEPRECATION")
    fun passwordEncoder(): PasswordEncoder = NoOpPasswordEncoder.getInstance()

    @Bean
    fun corsConfigurationSource(): CorsConfigurationSource {
        val configuration = CorsConfiguration()
        configuration.allowedOrigins = listOf("http://localhost:5173")
        configuration.allowedMethods = listOf("GET", "POST", "PUT", "DELETE", "OPTIONS")
        configuration.allowedHeaders = listOf("Authorization", "Content-Type")
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
                auth.requestMatchers(
                    "/swagger-ui/**",
                    "/swagger-ui.html",
                    "/v3/api-docs/**"
                ).permitAll()
                auth.requestMatchers(HttpMethod.GET, "/materiales").permitAll()
                auth.requestMatchers(HttpMethod.GET, "/materiales/mis-publicaciones").authenticated()
                auth.requestMatchers(HttpMethod.GET, "/materiales/{id}").permitAll()
                auth.requestMatchers(HttpMethod.POST, "/user").permitAll()
                auth.requestMatchers(HttpMethod.POST, "/materiales").authenticated()
                auth.requestMatchers(HttpMethod.PUT, "/materiales/{id}").authenticated()
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