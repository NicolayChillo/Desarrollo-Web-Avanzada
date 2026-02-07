package com.proyecto.backend_reservas_hoteleria.controller;

import com.proyecto.backend_reservas_hoteleria.dto.habitacion.HabitacionRequest;
import com.proyecto.backend_reservas_hoteleria.dto.habitacion.HabitacionResponse;
import com.proyecto.backend_reservas_hoteleria.model.enums.EstadoHabitacion;
import com.proyecto.backend_reservas_hoteleria.service.CloudinaryService;
import com.proyecto.backend_reservas_hoteleria.service.HabitacionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/habitaciones")
public class HabitacionController {

    private final HabitacionService habitacionService;
    private final CloudinaryService cloudinaryService;

    public HabitacionController(HabitacionService habitacionService, CloudinaryService cloudinaryService) {
        this.habitacionService = habitacionService;
        this.cloudinaryService = cloudinaryService;
    }

    @PostMapping
    // Crea habitacion y sube imagen en una sola solicitud multipart.
    public ResponseEntity<HabitacionResponse> crear(@RequestParam("codigo") String codigo,
                                                    @RequestParam("descripcion") String descripcion,
                                                    @RequestParam("estado") EstadoHabitacion estado,
                                                    @RequestParam("idTipoHabitacion") Long idTipoHabitacion,
                                                    @RequestParam("imagen") MultipartFile imagen) {
        String imagenUrl = cloudinaryService.subirImagen(imagen);
        HabitacionRequest request = new HabitacionRequest(codigo, descripcion, imagenUrl, estado, idTipoHabitacion);
        return ResponseEntity.ok(habitacionService.crear(request));
    }

    @GetMapping
    public ResponseEntity<List<HabitacionResponse>> listar() {
        return ResponseEntity.ok(habitacionService.listar());
    }

    @GetMapping("/{idHabitacion}")
    public ResponseEntity<HabitacionResponse> obtener(@PathVariable Long idHabitacion) {
        return ResponseEntity.ok(habitacionService.obtener(idHabitacion));
    }

    @PutMapping("/{idHabitacion}")
    // Actualiza datos y opcionalmente la imagen si se envia el archivo.
    public ResponseEntity<HabitacionResponse> actualizar(@PathVariable Long idHabitacion,
                                                         @RequestParam("codigo") String codigo,
                                                         @RequestParam("descripcion") String descripcion,
                                                         @RequestParam("estado") EstadoHabitacion estado,
                                                         @RequestParam("idTipoHabitacion") Long idTipoHabitacion,
                                                         @RequestParam(value = "imagen", required = false) MultipartFile imagen) {
        String imagenUrl = null;
        if (imagen != null && !imagen.isEmpty()) {
            imagenUrl = cloudinaryService.subirImagen(imagen);
        }

        HabitacionResponse actualizada = habitacionService.actualizar(idHabitacion, codigo, descripcion, estado, idTipoHabitacion, imagenUrl);
        return ResponseEntity.ok(actualizada);
    }

    @DeleteMapping("/{idHabitacion}")
    public ResponseEntity<Void> eliminar(@PathVariable Long idHabitacion) {
        habitacionService.eliminar(idHabitacion);
        return ResponseEntity.noContent().build();
    }
}
