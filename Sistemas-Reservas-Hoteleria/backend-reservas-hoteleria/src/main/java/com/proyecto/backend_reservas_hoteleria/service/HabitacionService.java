package com.proyecto.backend_reservas_hoteleria.service;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.proyecto.backend_reservas_hoteleria.dto.habitacion.HabitacionRequest;
import com.proyecto.backend_reservas_hoteleria.dto.habitacion.HabitacionResponse;
import com.proyecto.backend_reservas_hoteleria.model.Habitacion;
import com.proyecto.backend_reservas_hoteleria.model.TipoHabitacion;
import com.proyecto.backend_reservas_hoteleria.model.enums.EstadoHabitacion;
import com.proyecto.backend_reservas_hoteleria.model.enums.NombreTipoHabitacion;
import com.proyecto.backend_reservas_hoteleria.repository.HabitacionRepository;
import com.proyecto.backend_reservas_hoteleria.repository.TipoHabitacionRepository;

@Service
public class HabitacionService {

    private final HabitacionRepository habitacionRepository;
    private final TipoHabitacionRepository tipoHabitacionRepository;

    public HabitacionService(HabitacionRepository habitacionRepository,
                             TipoHabitacionRepository tipoHabitacionRepository) {
        this.habitacionRepository = habitacionRepository;
        this.tipoHabitacionRepository = tipoHabitacionRepository;
    }

    public HabitacionResponse crear(HabitacionRequest request) {
        // Vincula la habitacion al tipo indicado y guarda.
        TipoHabitacion tipoHabitacion = obtenerTipoHabitacion(request.getIdTipoHabitacion());

        Habitacion habitacion = new Habitacion();
        habitacion.setCodigo(request.getCodigo());
        habitacion.setDescripcion(request.getDescripcion());
        habitacion.setImagen(request.getImagen());
        habitacion.setNBathroom(request.getNBathroom());
        habitacion.setEstado(request.getEstado());
        habitacion.setTipoHabitacion(tipoHabitacion);

        Habitacion guardada = habitacionRepository.save(habitacion);
        return mapearRespuesta(guardada);
    }

    public List<HabitacionResponse> listar() {
        System.out.println("\ud83d\udd0d [SERVICE] === listar() - Inicio ===");
        List<Habitacion> todasLasHabitaciones = habitacionRepository.findAll();
        System.out.println("\ud83d\udd0d [SERVICE] Habitaciones encontradas en BD: " + todasLasHabitaciones.size());
        
        List<HabitacionResponse> respuestas = todasLasHabitaciones.stream()
                .map(habitacion -> {
                    System.out.println("\ud83d\udd0d [SERVICE] Procesando habitacion: " + habitacion.getCodigo() + 
                                     " | Estado: " + habitacion.getEstado() + 
                                     " | Tipo: " + (habitacion.getTipoHabitacion() != null ? 
                                                     habitacion.getTipoHabitacion().getNombre() : "NULL"));
                    return mapearRespuesta(habitacion);
                })
                .toList();
        
        System.out.println("\ud83d\udd0d [SERVICE] Respuestas mapeadas: " + respuestas.size());
        System.out.println("\ud83d\udd0d [SERVICE] === listar() - Fin ===");
        return respuestas;
    }

    public HabitacionResponse obtener(Long idHabitacion) {
        Habitacion habitacion = habitacionRepository.findById(idHabitacion)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Habitacion no encontrada"));
        return mapearRespuesta(habitacion);
    }

    public HabitacionResponse actualizar(Long idHabitacion,
                                         String codigo,
                                         String descripcion,
                                         Integer nBathroom,
                                         EstadoHabitacion estado,
                                         Long idTipoHabitacion,
                                         String imagenUrl) {
        Habitacion habitacion = habitacionRepository.findById(idHabitacion)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Habitacion no encontrada"));

        TipoHabitacion tipoHabitacion = obtenerTipoHabitacion(idTipoHabitacion);

        habitacion.setCodigo(codigo);
        habitacion.setDescripcion(descripcion);
        // Si no se envia nueva imagen, conserva la actual.
        if (imagenUrl != null && !imagenUrl.isBlank()) {
            habitacion.setImagen(imagenUrl);
        }
        habitacion.setNBathroom(nBathroom);
        habitacion.setEstado(estado);
        habitacion.setTipoHabitacion(tipoHabitacion);

        Habitacion guardada = habitacionRepository.save(habitacion);
        return mapearRespuesta(guardada);
    }

    public void eliminar(Long idHabitacion) {
        Habitacion habitacion = habitacionRepository.findById(idHabitacion)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Habitacion no encontrada"));
        habitacionRepository.delete(habitacion);
    }

    public List<HabitacionResponse> listarPorTipo(NombreTipoHabitacion nombreTipo) {
        List<Habitacion> habitaciones = habitacionRepository.findByTipoHabitacionNombre(nombreTipo);
        return habitaciones.stream()
                .map(this::mapearRespuesta)
                .toList();
    }


    private TipoHabitacion obtenerTipoHabitacion(Long idTipoHabitacion) {
        return tipoHabitacionRepository.findById(idTipoHabitacion)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Tipo de habitacion no existe"));
    }

    private HabitacionResponse mapearRespuesta(Habitacion habitacion) {
        Long idTipoHabitacion = null;
        String nombreTipo = null;
        BigDecimal precioBase = null;
        Integer capacidadMaxima = null;
        if (habitacion.getTipoHabitacion() != null) {
            idTipoHabitacion = habitacion.getTipoHabitacion().getIdTipoHabitacion();
            precioBase = habitacion.getTipoHabitacion().getPrecioBase();
            capacidadMaxima = habitacion.getTipoHabitacion().getCapacidadMaxima();
            if (habitacion.getTipoHabitacion().getNombre() != null) {
                nombreTipo = habitacion.getTipoHabitacion().getNombre().name();
            }
        }

        return new HabitacionResponse(
                habitacion.getIdHabitacion(),
                habitacion.getCodigo(),
                habitacion.getDescripcion(),
                habitacion.getImagen(),
                habitacion.getNBathroom(),
                habitacion.getEstado(),
                idTipoHabitacion,
                nombreTipo,
                precioBase,
                capacidadMaxima
        );
    }
}
