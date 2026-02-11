package com.proyecto.backend_reservas_hoteleria.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.proyecto.backend_reservas_hoteleria.dto.usuario.CambiarRolRequest;
import com.proyecto.backend_reservas_hoteleria.dto.usuario.UsuarioResponse;
import com.proyecto.backend_reservas_hoteleria.model.Rol;
import com.proyecto.backend_reservas_hoteleria.model.Usuario;
import com.proyecto.backend_reservas_hoteleria.model.enums.TipoRol;
import com.proyecto.backend_reservas_hoteleria.repository.RolRepository;
import com.proyecto.backend_reservas_hoteleria.repository.UsuarioRepository;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/usuarios")
@CrossOrigin(origins = "http://localhost:3000")
public class UsuarioController {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private RolRepository rolRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @GetMapping
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public ResponseEntity<List<UsuarioResponse>> getAllUsuarios() {
        List<Usuario> usuarios = usuarioRepository.findAll();
        List<UsuarioResponse> usuariosResponse = usuarios.stream()
                .map(this::convertirAUsuarioResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(usuariosResponse);
    }

    @PutMapping("/{id}/rol")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public ResponseEntity<?> cambiarRol(@PathVariable Long id, @Valid @RequestBody CambiarRolRequest request) {
        try {
            Usuario usuario = usuarioRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

            TipoRol tipoRol = TipoRol.valueOf(request.getTipoRol());

            Rol nuevoRol = rolRepository.findByTipoRol(tipoRol)
                    .orElseThrow(() -> new RuntimeException("Rol no encontrado"));

            usuario.setRol(nuevoRol);
            usuarioRepository.save(usuario);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Rol actualizado correctamente");
            response.put("usuario", convertirAUsuarioResponse(usuario));

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", "Error al cambiar el rol: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public ResponseEntity<?> eliminarUsuario(@PathVariable Long id) {
        try {
            Usuario usuario = usuarioRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

            usuarioRepository.delete(usuario);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Usuario eliminado correctamente");

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", "Error al eliminar el usuario: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @GetMapping("/perfil")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> obtenerPerfil(Authentication authentication) {
        try {
            String correo = authentication.getName();
            Usuario usuario = usuarioRepository.findByCorreo(correo)
                    .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

            return ResponseEntity.ok(convertirAUsuarioResponse(usuario));
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", "Error al obtener perfil: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @PutMapping("/perfil")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> actualizarPerfil(Authentication authentication, @RequestBody Map<String, String> datos) {
        try {
            String correo = authentication.getName();
            Usuario usuario = usuarioRepository.findByCorreo(correo)
                    .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

            // Actualizar nombre si está presente
            if (datos.containsKey("nombre") && datos.get("nombre") != null && !datos.get("nombre").isEmpty()) {
                usuario.setNombre(datos.get("nombre"));
            }

            // Actualizar correo si está presente y es diferente
            if (datos.containsKey("correo") && datos.get("correo") != null && !datos.get("correo").isEmpty() && !datos.get("correo").equals(correo)) {
                // Verificar que el nuevo correo no esté en uso
                if (usuarioRepository.findByCorreo(datos.get("correo")).isPresent()) {
                    Map<String, Object> error = new HashMap<>();
                    error.put("success", false);
                    error.put("message", "El correo ya está en uso");
                    return ResponseEntity.badRequest().body(error);
                }
                usuario.setCorreo(datos.get("correo"));
            }

            // Actualizar contraseña si está presente y no está vacía
            if (datos.containsKey("password") && datos.get("password") != null && !datos.get("password").isEmpty()) {
                usuario.setContrasena(passwordEncoder.encode(datos.get("password")));
            }

            usuarioRepository.save(usuario);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Perfil actualizado correctamente");
            response.put("usuario", convertirAUsuarioResponse(usuario));

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", "Error al actualizar perfil: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    private UsuarioResponse convertirAUsuarioResponse(Usuario usuario) {
        UsuarioResponse response = new UsuarioResponse();
        response.setIdUsuario(usuario.getIdUsuario());
        response.setNombre(usuario.getNombre());
        response.setCorreo(usuario.getCorreo());
        response.setFechaRegistro(usuario.getFechaRegistro());
        response.setEstado(usuario.getEstado());

        if (usuario.getRol() != null) {
            UsuarioResponse.RolDTO rolDTO = new UsuarioResponse.RolDTO();
            rolDTO.setIdRol(usuario.getRol().getIdRol());
            rolDTO.setTipoRol(usuario.getRol().getTipoRol().name());
            rolDTO.setDescripcion(usuario.getRol().getDescripcion());
            response.setRol(rolDTO);
        }

        return response;
    }
}
