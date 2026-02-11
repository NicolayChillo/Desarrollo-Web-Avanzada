package com.proyecto.backend_reservas_hoteleria.service;

import com.proyecto.backend_reservas_hoteleria.dto.auth.LoginRequest;
import com.proyecto.backend_reservas_hoteleria.dto.auth.LoginResponse;
import com.proyecto.backend_reservas_hoteleria.dto.auth.RegisterRequest;
import com.proyecto.backend_reservas_hoteleria.dto.auth.RegisterResponse;
import com.proyecto.backend_reservas_hoteleria.model.Rol;
import com.proyecto.backend_reservas_hoteleria.model.Usuario;
import com.proyecto.backend_reservas_hoteleria.model.enums.Estado;
import com.proyecto.backend_reservas_hoteleria.model.enums.TipoRol;
import com.proyecto.backend_reservas_hoteleria.repository.RolRepository;
import com.proyecto.backend_reservas_hoteleria.repository.UsuarioRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;

@Service
public class AuthService {

    private final UsuarioRepository usuarioRepository;
    private final RolRepository rolRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    public AuthService(UsuarioRepository usuarioRepository,
                       RolRepository rolRepository,
                       PasswordEncoder passwordEncoder,
                       AuthenticationManager authenticationManager,
                       JwtService jwtService) {
        this.usuarioRepository = usuarioRepository;
        this.rolRepository = rolRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
    }

    public RegisterResponse registrar(RegisterRequest request) {
        // Valida correo unico y registra cliente.
        if (usuarioRepository.existsByCorreo(request.getCorreo())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El correo ya esta registrado");
        }

        Rol rolCliente = rolRepository.findByTipoRol(TipoRol.CLIENTE)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Rol CLIENTE no encontrado"));

        Usuario usuario = new Usuario();
        usuario.setNombre(request.getNombre());
        usuario.setCorreo(request.getCorreo());
        usuario.setContrasena(passwordEncoder.encode(request.getContrasena()));
        usuario.setEstado(Estado.ACTIVO);
        usuario.setFechaRegistro(LocalDate.now());
        usuario.setRol(rolCliente);

        Usuario saved = usuarioRepository.save(usuario);

        return new RegisterResponse(saved.getIdUsuario(), saved.getCorreo(), rolCliente.getTipoRol().name());
    }

    public LoginResponse iniciarSesion(LoginRequest request) {
        // Autentica con Spring Security y genera JWT.
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getCorreo(), request.getContrasena())
        );

        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        String token = jwtService.generarToken(userDetails);

        // Obtener información adicional del usuario
        Usuario usuario = usuarioRepository.findByCorreo(request.getCorreo())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuario no encontrado"));

        return new LoginResponse(token, usuario.getIdUsuario(), usuario.getRol().getTipoRol().name());
    }
}
