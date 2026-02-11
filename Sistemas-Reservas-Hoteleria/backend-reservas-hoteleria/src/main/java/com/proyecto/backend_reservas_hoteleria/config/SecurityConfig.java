package com.proyecto.backend_reservas_hoteleria.config;

import java.util.Arrays;

import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import com.proyecto.backend_reservas_hoteleria.service.CustomUserDetailsService;

@Configuration
@EnableWebSecurity
@EnableConfigurationProperties(JwtProperties.class)
@org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final CustomUserDetailsService userDetailsService;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter,
                          CustomUserDetailsService userDetailsService) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
        this.userDetailsService = userDetailsService;
    }

    @Bean
    public SecurityFilterChain cadenaSeguridad(HttpSecurity http) throws Exception {
        // Define reglas de acceso y filtro JWT.
        http.cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(csrf -> csrf.disable())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/auth/**").permitAll()
                        // Permite GET público para consultar habitaciones y tipos
                        .requestMatchers(HttpMethod.GET, "/tipos-habitacion/**", "/habitaciones/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/tipos-habitacion/**", "/habitaciones/**").hasRole("ADMINISTRADOR")
                        .requestMatchers(HttpMethod.PUT, "/tipos-habitacion/**", "/habitaciones/**").hasRole("ADMINISTRADOR")
                        .requestMatchers(HttpMethod.DELETE, "/tipos-habitacion/**", "/habitaciones/**").hasRole("ADMINISTRADOR")
                        // Gestión de usuarios - solo ADMINISTRADOR
                        .requestMatchers("/api/usuarios/**").hasRole("ADMINISTRADOR")
                        // Gestión de dashboard - solo ADMINISTRADOR
                        .requestMatchers("/api/dashboard/**").hasRole("ADMINISTRADOR")
                        // Notificaciones
                        .requestMatchers("/api/notificaciones/admin").hasRole("ADMINISTRADOR")
                        .requestMatchers("/api/notificaciones/cliente").hasRole("CLIENTE")
                        // Reservas
                        .requestMatchers(HttpMethod.GET, "/reservas/mias").authenticated()
                        .requestMatchers(HttpMethod.GET, "/reservas/**").hasRole("ADMINISTRADOR")
                        .requestMatchers(HttpMethod.PUT, "/reservas/*/confirmar", "/reservas/*/cancelar").hasRole("ADMINISTRADOR")
                        .anyRequest().authenticated()
                )
                .authenticationProvider(proveedorAutenticacion())
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
                .exceptionHandling(ex -> ex
                        .authenticationEntryPoint(authenticationEntryPoint())
                        .accessDeniedHandler(accessDeniedHandler())
                );

        return http.build();
    }

    @Bean
    public AuthenticationEntryPoint authenticationEntryPoint() {
        return new RestAuthenticationEntryPoint();
    }

    @Bean
    public AccessDeniedHandler accessDeniedHandler() {
        return new RestAccessDeniedHandler();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        // Permitir orígenes de desarrollo y el header Authorization
        configuration.setAllowedOriginPatterns(Arrays.asList("http://localhost:3000", "http://127.0.0.1:3000", "http://localhost:3001"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("*", "Authorization"));
        configuration.setExposedHeaders(Arrays.asList("Authorization"));
        configuration.setAllowCredentials(true);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public AuthenticationManager gestorAutenticacion(AuthenticationConfiguration configuration) throws Exception {
        return configuration.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder codificadorContrasena() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationProvider proveedorAutenticacion() {
        // Usa UserDetailsService con BCrypt.
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider(userDetailsService);
        provider.setPasswordEncoder(codificadorContrasena());
        return provider;
    }
}
