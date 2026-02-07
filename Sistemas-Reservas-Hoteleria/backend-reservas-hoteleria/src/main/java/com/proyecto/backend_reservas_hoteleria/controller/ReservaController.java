package com.proyecto.backend_reservas_hoteleria.controller;

import com.proyecto.backend_reservas_hoteleria.dto.reserva.ReservaRequest;
import com.proyecto.backend_reservas_hoteleria.dto.reserva.ReservaResponse;
import com.proyecto.backend_reservas_hoteleria.service.ReservaService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/reservas")
public class ReservaController {

    private final ReservaService reservaService;

    public ReservaController(ReservaService reservaService) {
        this.reservaService = reservaService;
    }

    @PostMapping
    // Crea reserva en estado PENDIENTE.
    public ResponseEntity<ReservaResponse> crear(@Valid @RequestBody ReservaRequest request) {
        return ResponseEntity.ok(reservaService.crear(request));
    }

    @GetMapping
    public ResponseEntity<List<ReservaResponse>> listar() {
        return ResponseEntity.ok(reservaService.listar());
    }

    @GetMapping("/mias")
    public ResponseEntity<List<ReservaResponse>> listarMias(Authentication authentication) {
        return ResponseEntity.ok(reservaService.listarPorCorreoUsuario(authentication.getName()));
    }

    @GetMapping("/{idReserva}")
    public ResponseEntity<ReservaResponse> obtener(@PathVariable Long idReserva) {
        return ResponseEntity.ok(reservaService.obtener(idReserva));
    }

    @PutMapping("/{idReserva}/cancelar")
    public ResponseEntity<Void> cancelar(@PathVariable Long idReserva) {
        reservaService.cancelar(idReserva);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{idReserva}/confirmar")
    public ResponseEntity<Void> confirmar(@PathVariable Long idReserva) {
        reservaService.confirmar(idReserva);
        return ResponseEntity.noContent().build();
    }
}
