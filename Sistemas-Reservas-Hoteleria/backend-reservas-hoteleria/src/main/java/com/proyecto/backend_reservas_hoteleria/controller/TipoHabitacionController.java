package com.proyecto.backend_reservas_hoteleria.controller;

import com.proyecto.backend_reservas_hoteleria.dto.tipohabitacion.TipoHabitacionRequest;
import com.proyecto.backend_reservas_hoteleria.dto.tipohabitacion.TipoHabitacionResponse;
import com.proyecto.backend_reservas_hoteleria.service.TipoHabitacionService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/tipos-habitacion")
public class TipoHabitacionController {

    private final TipoHabitacionService tipoHabitacionService;

    public TipoHabitacionController(TipoHabitacionService tipoHabitacionService) {
        this.tipoHabitacionService = tipoHabitacionService;
    }

    @PostMapping
    // CRUD basico de tipos de habitacion.
    public ResponseEntity<TipoHabitacionResponse> crear(@Valid @RequestBody TipoHabitacionRequest request) {
        return ResponseEntity.ok(tipoHabitacionService.crear(request));
    }

    @GetMapping
    public ResponseEntity<List<TipoHabitacionResponse>> listar() {
        return ResponseEntity.ok(tipoHabitacionService.listar());
    }

    @GetMapping("/{idTipoHabitacion}")
    public ResponseEntity<TipoHabitacionResponse> obtener(@PathVariable Long idTipoHabitacion) {
        return ResponseEntity.ok(tipoHabitacionService.obtener(idTipoHabitacion));
    }

    @PutMapping("/{idTipoHabitacion}")
    public ResponseEntity<TipoHabitacionResponse> actualizar(@PathVariable Long idTipoHabitacion,
                                                             @Valid @RequestBody TipoHabitacionRequest request) {
        return ResponseEntity.ok(tipoHabitacionService.actualizar(idTipoHabitacion, request));
    }

    @DeleteMapping("/{idTipoHabitacion}")
    public ResponseEntity<Void> eliminar(@PathVariable Long idTipoHabitacion) {
        tipoHabitacionService.eliminar(idTipoHabitacion);
        return ResponseEntity.noContent().build();
    }
}
