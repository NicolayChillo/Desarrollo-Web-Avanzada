package com.proyecto.backend_reservas_hoteleria.service;

import com.proyecto.backend_reservas_hoteleria.dto.tipohabitacion.TipoHabitacionRequest;
import com.proyecto.backend_reservas_hoteleria.dto.tipohabitacion.TipoHabitacionResponse;
import com.proyecto.backend_reservas_hoteleria.model.TipoHabitacion;
import com.proyecto.backend_reservas_hoteleria.repository.TipoHabitacionRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class TipoHabitacionService {

    private final TipoHabitacionRepository tipoHabitacionRepository;

    public TipoHabitacionService(TipoHabitacionRepository tipoHabitacionRepository) {
        this.tipoHabitacionRepository = tipoHabitacionRepository;
    }

    public TipoHabitacionResponse crear(TipoHabitacionRequest request) {
        // Guarda tipo de habitacion en BD.
        TipoHabitacion tipo = new TipoHabitacion();
        tipo.setNombre(request.getNombre());
        tipo.setDescripcion(request.getDescripcion());
        tipo.setCapacidadMaxima(request.getCapacidadMaxima());
        tipo.setPrecioBase(request.getPrecioBase());
        tipo.setEstado(request.getEstado());

        TipoHabitacion guardado = tipoHabitacionRepository.save(tipo);
        return mapearRespuesta(guardado);
    }

    public List<TipoHabitacionResponse> listar() {
        return tipoHabitacionRepository.findAll().stream()
                .map(this::mapearRespuesta)
                .toList();
    }

    public TipoHabitacionResponse obtener(Long idTipoHabitacion) {
        TipoHabitacion tipo = tipoHabitacionRepository.findById(idTipoHabitacion)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Tipo de habitacion no encontrado"));
        return mapearRespuesta(tipo);
    }

    public TipoHabitacionResponse actualizar(Long idTipoHabitacion, TipoHabitacionRequest request) {
        TipoHabitacion tipo = tipoHabitacionRepository.findById(idTipoHabitacion)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Tipo de habitacion no encontrado"));

        tipo.setNombre(request.getNombre());
        tipo.setDescripcion(request.getDescripcion());
        tipo.setCapacidadMaxima(request.getCapacidadMaxima());
        tipo.setPrecioBase(request.getPrecioBase());
        tipo.setEstado(request.getEstado());

        TipoHabitacion guardado = tipoHabitacionRepository.save(tipo);
        return mapearRespuesta(guardado);
    }

    public void eliminar(Long idTipoHabitacion) {
        TipoHabitacion tipo = tipoHabitacionRepository.findById(idTipoHabitacion)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Tipo de habitacion no encontrado"));
        tipoHabitacionRepository.delete(tipo);
    }

    private TipoHabitacionResponse mapearRespuesta(TipoHabitacion tipo) {
        return new TipoHabitacionResponse(
                tipo.getIdTipoHabitacion(),
                tipo.getNombre(),
                tipo.getDescripcion(),
                tipo.getCapacidadMaxima(),
                tipo.getPrecioBase(),
                tipo.getEstado()
        );
    }
}
