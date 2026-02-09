package com.proyecto.backend_reservas_hoteleria.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.proyecto.backend_reservas_hoteleria.dto.habitacion.HabitacionRequest;
import com.proyecto.backend_reservas_hoteleria.dto.habitacion.HabitacionResponse;
import com.proyecto.backend_reservas_hoteleria.model.enums.EstadoHabitacion;
import com.proyecto.backend_reservas_hoteleria.model.enums.NombreTipoHabitacion;
import com.proyecto.backend_reservas_hoteleria.service.CloudinaryService;
import com.proyecto.backend_reservas_hoteleria.service.HabitacionService;

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
                                                    @RequestParam("nBathroom") Integer nBathroom,
                                                    @RequestParam("estado") EstadoHabitacion estado,
                                                    @RequestParam("idTipoHabitacion") Long idTipoHabitacion,
                                                    @RequestParam("imagen") MultipartFile imagen) {
        String imagenUrl = cloudinaryService.subirImagen(imagen);
        HabitacionRequest request = new HabitacionRequest(codigo, descripcion, imagenUrl, nBathroom, estado, idTipoHabitacion);
        return ResponseEntity.ok(habitacionService.crear(request));
    }

    @GetMapping
    public ResponseEntity<List<HabitacionResponse>> listar() {
        return ResponseEntity.ok(habitacionService.listar());
    }

    @GetMapping("/tipo/{nombreTipo}")
    public ResponseEntity<List<HabitacionResponse>> listarPorTipo(@PathVariable NombreTipoHabitacion nombreTipo) {
        return ResponseEntity.ok(habitacionService.listarPorTipo(nombreTipo));
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
                                                         @RequestParam("nBathroom") Integer nBathroom,
                                                         @RequestParam("estado") EstadoHabitacion estado,
                                                         @RequestParam("idTipoHabitacion") Long idTipoHabitacion,
                                                         @RequestParam(value = "imagen", required = false) MultipartFile imagen) {
        String imagenUrl = null;
        if (imagen != null && !imagen.isEmpty()) {
            imagenUrl = cloudinaryService.subirImagen(imagen);
        }

        HabitacionResponse actualizada = habitacionService.actualizar(idHabitacion, codigo, descripcion, nBathroom, estado, idTipoHabitacion, imagenUrl);
        return ResponseEntity.ok(actualizada);
    }

    @DeleteMapping("/{idHabitacion}")
    public ResponseEntity<Void> eliminar(@PathVariable Long idHabitacion) {
        habitacionService.eliminar(idHabitacion);
        return ResponseEntity.noContent().build();
    }
}
