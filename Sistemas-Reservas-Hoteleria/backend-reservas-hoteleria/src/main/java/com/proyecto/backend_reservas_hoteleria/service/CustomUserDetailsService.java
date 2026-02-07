package com.proyecto.backend_reservas_hoteleria.service;

import com.proyecto.backend_reservas_hoteleria.model.Usuario;
import com.proyecto.backend_reservas_hoteleria.model.enums.Estado;
import com.proyecto.backend_reservas_hoteleria.repository.UsuarioRepository;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UsuarioRepository usuarioRepository;

    public CustomUserDetailsService(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String correo) throws UsernameNotFoundException {
        // Carga usuario para autenticacion de Spring Security.
        Usuario usuario = usuarioRepository.findByCorreo(correo)
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado"));

        if (usuario.getEstado() != Estado.ACTIVO) {
            throw new UsernameNotFoundException("Usuario inactivo");
        }

        List<SimpleGrantedAuthority> authorities = Collections.emptyList();
        if (usuario.getRol() != null && usuario.getRol().getTipoRol() != null) {
            authorities = List.of(new SimpleGrantedAuthority("ROLE_" + usuario.getRol().getTipoRol().name()));
        }

        return new User(usuario.getCorreo(), usuario.getContrasena(), authorities);
    }
}
