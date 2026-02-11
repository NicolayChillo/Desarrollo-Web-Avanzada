package com.proyecto.backend_reservas_hoteleria.controller;

import java.util.HashMap;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.proyecto.backend_reservas_hoteleria.service.JwtService;
import com.proyecto.backend_reservas_hoteleria.repository.UsuarioRepository;

@RestController
@RequestMapping("/auth/debug")
public class AuthDebugController {

    private final JwtService jwtService;
    private final UsuarioRepository usuarioRepository;
    private static final Logger logger = LoggerFactory.getLogger(AuthDebugController.class);

    public AuthDebugController(JwtService jwtService, UsuarioRepository usuarioRepository) {
        this.jwtService = jwtService;
        this.usuarioRepository = usuarioRepository;
    }

    @GetMapping("/token")
    public ResponseEntity<Map<String, Object>> debugToken(@RequestHeader(value = "Authorization", required = false) String authorization) {
        Map<String, Object> resp = new HashMap<>();
        if (authorization == null || !authorization.startsWith("Bearer ")) {
            resp.put("ok", false);
            resp.put("message", "Authorization header missing or invalid");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(resp);
        }

        String token = authorization.substring(7);
        try {
            String username = jwtService.extraerUsuario(token);
            resp.put("ok", true);
            resp.put("username", username);
            return ResponseEntity.ok(resp);
        } catch (Exception e) {
            logger.warn("Token parse error: {}", e.getMessage());
            resp.put("ok", false);
            resp.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(resp);
        }
    }

    @GetMapping("/role")
    public ResponseEntity<Map<String, Object>> debugRole(@RequestHeader(value = "Authorization", required = false) String authorization) {
        Map<String, Object> resp = new HashMap<>();
        if (authorization == null || !authorization.startsWith("Bearer ")) {
            resp.put("ok", false);
            resp.put("message", "Authorization header missing or invalid");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(resp);
        }

        String token = authorization.substring(7);
        try {
            String username = jwtService.extraerUsuario(token);
            var usuarioOpt = usuarioRepository.findByCorreo(username);
            if (usuarioOpt.isEmpty()) {
                resp.put("ok", false);
                resp.put("message", "Usuario no encontrado");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(resp);
            }
            var usuario = usuarioOpt.get();
            resp.put("ok", true);
            resp.put("username", username);
            resp.put("role", usuario.getRol() != null ? usuario.getRol().getTipoRol().name() : null);
            return ResponseEntity.ok(resp);
        } catch (Exception e) {
            logger.warn("Token parse error: {}", e.getMessage());
            resp.put("ok", false);
            resp.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(resp);
        }
    }
}
