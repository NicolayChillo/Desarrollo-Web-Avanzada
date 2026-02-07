package com.proyecto.backend_reservas_hoteleria.config;

import com.proyecto.backend_reservas_hoteleria.service.CustomUserDetailsService;
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
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@EnableConfigurationProperties(JwtProperties.class)
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
        http.csrf(csrf -> csrf.disable())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/auth/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/tipos-habitacion/**", "/habitaciones/**").hasRole("ADMINISTRADOR")
                        .requestMatchers(HttpMethod.PUT, "/tipos-habitacion/**", "/habitaciones/**").hasRole("ADMINISTRADOR")
                        .requestMatchers(HttpMethod.DELETE, "/tipos-habitacion/**", "/habitaciones/**").hasRole("ADMINISTRADOR")
                    .requestMatchers(HttpMethod.GET, "/reservas/mias").authenticated()
                    .requestMatchers(HttpMethod.GET, "/reservas/**").hasRole("ADMINISTRADOR")
                        .requestMatchers(HttpMethod.PUT, "/reservas/*/confirmar", "/reservas/*/cancelar").hasRole("ADMINISTRADOR")
                        .anyRequest().authenticated()
                )
                .authenticationProvider(proveedorAutenticacion())
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
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
