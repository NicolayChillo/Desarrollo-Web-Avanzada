package com.proyecto.backend_reservas_hoteleria.controller;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.proyecto.backend_reservas_hoteleria.dto.notificacion.NotificacionResponse;
import com.proyecto.backend_reservas_hoteleria.model.Reserva;
import com.proyecto.backend_reservas_hoteleria.model.enums.EstadoReserva;
import com.proyecto.backend_reservas_hoteleria.repository.ReservaRepository;
import com.proyecto.backend_reservas_hoteleria.repository.UsuarioRepository;

@RestController
@RequestMapping("/api/notificaciones")
@CrossOrigin(origins = "http://localhost:3000")
public class NotificacionController {

    @Autowired
    private ReservaRepository reservaRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @GetMapping("/cliente")
    @PreAuthorize("hasRole('CLIENTE')")
    public ResponseEntity<Map<String, Object>> getNotificacionesCliente(Authentication authentication) {
        String correo = authentication.getName();
        var usuario = usuarioRepository.findByCorreo(correo).orElseThrow();

        // Obtener reservas recientes del cliente (últimas 24 horas con cambios de estado)
        LocalDateTime hace24Horas = LocalDateTime.now().minusHours(24);
        List<Reserva> reservas = reservaRepository.findByUsuarioAndFechaReservaAfter(usuario, hace24Horas);

        List<NotificacionResponse> notificaciones = new ArrayList<>();
        int noLeidas = 0;

        for (Reserva reserva : reservas) {
            if (reserva.getEstado() == EstadoReserva.CONFIRMADA) {
                notificaciones.add(new NotificacionResponse(
                    reserva.getIdReserva(),
                    "Tu reserva ha sido confirmada",
                    "CONFIRMADA",
                    LocalDateTime.now(),
                    reserva.getHabitacion().getCodigo(),
                    null
                ));
                noLeidas++;
            } else if (reserva.getEstado() == EstadoReserva.CANCELADA) {
                notificaciones.add(new NotificacionResponse(
                    reserva.getIdReserva(),
                    "Tu reserva ha sido cancelada",
                    "CANCELADA",
                    LocalDateTime.now(),
                    reserva.getHabitacion().getCodigo(),
                    null
                ));
                noLeidas++;
            }
        }

        Map<String, Object> response = new HashMap<>();
        response.put("notificaciones", notificaciones);
        response.put("noLeidas", noLeidas);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/admin")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public ResponseEntity<Map<String, Object>> getNotificacionesAdmin() {
        // Obtener todas las reservas pendientes
        List<Reserva> reservasPendientes = reservaRepository.findByEstado(EstadoReserva.PENDIENTE);

        List<NotificacionResponse> notificaciones = new ArrayList<>();

        for (Reserva reserva : reservasPendientes) {
            notificaciones.add(new NotificacionResponse(
                reserva.getIdReserva(),
                "Nueva reserva pendiente de confirmación",
                "PENDIENTE",
                LocalDateTime.now(),
                reserva.getHabitacion().getCodigo(),
                reserva.getUsuario().getNombre()
            ));
        }

        Map<String, Object> response = new HashMap<>();
        response.put("notificaciones", notificaciones);
        response.put("noLeidas", notificaciones.size());

        return ResponseEntity.ok(response);
    }
}
