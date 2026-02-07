package com.proyecto.backend_reservas_hoteleria.controller;

import com.proyecto.backend_reservas_hoteleria.dto.auth.LoginRequest;
import com.proyecto.backend_reservas_hoteleria.dto.auth.LoginResponse;
import com.proyecto.backend_reservas_hoteleria.dto.auth.RegisterRequest;
import com.proyecto.backend_reservas_hoteleria.dto.auth.RegisterResponse;
import com.proyecto.backend_reservas_hoteleria.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/registro")
    // Registro publico, crea usuario con rol CLIENTE.
    public ResponseEntity<RegisterResponse> registrar(@Valid @RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authService.registrar(request));
    }

    @PostMapping("/login")
    // Login devuelve JWT para usar en endpoints protegidos.
    public ResponseEntity<LoginResponse> iniciarSesion(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.iniciarSesion(request));
    }
}
