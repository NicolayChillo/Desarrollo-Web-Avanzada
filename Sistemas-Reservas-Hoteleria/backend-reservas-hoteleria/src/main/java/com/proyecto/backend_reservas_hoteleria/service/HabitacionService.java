package com.proyecto.backend_reservas_hoteleria.service;

import com.proyecto.backend_reservas_hoteleria.dto.habitacion.HabitacionRequest;
import com.proyecto.backend_reservas_hoteleria.dto.habitacion.HabitacionResponse;
import com.proyecto.backend_reservas_hoteleria.model.Habitacion;
import com.proyecto.backend_reservas_hoteleria.model.TipoHabitacion;
import com.proyecto.backend_reservas_hoteleria.model.enums.EstadoHabitacion;
import com.proyecto.backend_reservas_hoteleria.repository.HabitacionRepository;
import com.proyecto.backend_reservas_hoteleria.repository.TipoHabitacionRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

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
        habitacion.setEstado(request.getEstado());
        habitacion.setTipoHabitacion(tipoHabitacion);

        Habitacion guardada = habitacionRepository.save(habitacion);
        return mapearRespuesta(guardada);
    }

    public List<HabitacionResponse> listar() {
        return habitacionRepository.findAll().stream()
                .map(this::mapearRespuesta)
                .toList();
    }

    public HabitacionResponse obtener(Long idHabitacion) {
        Habitacion habitacion = habitacionRepository.findById(idHabitacion)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Habitacion no encontrada"));
        return mapearRespuesta(habitacion);
    }

    public HabitacionResponse actualizar(Long idHabitacion,
                                         String codigo,
                                         String descripcion,
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


    private TipoHabitacion obtenerTipoHabitacion(Long idTipoHabitacion) {
        return tipoHabitacionRepository.findById(idTipoHabitacion)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Tipo de habitacion no existe"));
    }

    private HabitacionResponse mapearRespuesta(Habitacion habitacion) {
        Long idTipoHabitacion = null;
        String nombreTipo = null;
        if (habitacion.getTipoHabitacion() != null) {
            idTipoHabitacion = habitacion.getTipoHabitacion().getIdTipoHabitacion();
            if (habitacion.getTipoHabitacion().getNombre() != null) {
                nombreTipo = habitacion.getTipoHabitacion().getNombre().name();
            }
        }

        return new HabitacionResponse(
                habitacion.getIdHabitacion(),
                habitacion.getCodigo(),
                habitacion.getDescripcion(),
                habitacion.getImagen(),
                habitacion.getEstado(),
                idTipoHabitacion,
                nombreTipo
        );
    }
}
