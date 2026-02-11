package com.proyecto.backend_reservas_hoteleria.config;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.proyecto.backend_reservas_hoteleria.service.CustomUserDetailsService;
import com.proyecto.backend_reservas_hoteleria.service.JwtService;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final CustomUserDetailsService userDetailsService;

    private static final Logger logger = LoggerFactory.getLogger(JwtAuthenticationFilter.class);

    // Rutas públicas que no requieren JWT
    private static final List<String> RUTAS_PUBLICAS = Arrays.asList(
            "/auth/",
            "/habitaciones",
            "/tipos-habitacion"
    );

    public JwtAuthenticationFilter(JwtService jwtService, CustomUserDetailsService userDetailsService) {
        this.jwtService = jwtService;
        this.userDetailsService = userDetailsService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {
        // Si es una ruta pública y es GET, continúa sin validar JWT
        String requestPath = request.getRequestURI();
        String method = request.getMethod();
        
        if ("GET".equals(method) && RUTAS_PUBLICAS.stream().anyMatch(requestPath::startsWith)) {
            filterChain.doFilter(request, response);
            return;
        }
        
        // Si es /auth/*, siempre permitir sin JWT
        if (requestPath.startsWith("/auth/")) {
            filterChain.doFilter(request, response);
            return;
        }
        
        // Valida JWT en cada request protegido.
            String authHeader = request.getHeader("Authorization");

            if (authHeader == null) {
                logger.warn("[JWT] Falta Authorization header para request {} {}", method, requestPath);
                filterChain.doFilter(request, response);
                return;
            }
            if (!authHeader.startsWith("Bearer ")) {
                logger.warn("[JWT] Authorization header presente pero formato inválido: '{}' para request {} {}", authHeader, method, requestPath);
                filterChain.doFilter(request, response);
                return;
            }

            logger.info("[JWT] Authorization header presente (longitud={}) para request {} {}", authHeader.length(), method, requestPath);

            String token = authHeader.substring(7);
            String username = jwtService.extraerUsuario(token);

            logger.info("[JWT] Usuario extraído del token: {} para request {} {}", username, method, requestPath);

            if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                UserDetails userDetails = userDetailsService.loadUserByUsername(username);
                boolean valido = jwtService.esTokenValido(token, userDetails);
                logger.info("[JWT] ¿Token válido?: {} para usuario {} en {} {}", valido, username, method, requestPath);
                if (valido) {
                    UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                            userDetails,
                            null,
                            userDetails.getAuthorities()
                    );
                    authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authentication);
                } else {
                    logger.warn("[JWT] Token inválido para usuario {} en {} {}", username, method, requestPath);
                }
            } else if (username == null) {
                logger.warn("[JWT] No se pudo extraer usuario del token para request {} {}", method, requestPath);
            }

            filterChain.doFilter(request, response);
    }
}
