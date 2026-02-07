package com.proyecto.backend_reservas_hoteleria.service;

import com.proyecto.backend_reservas_hoteleria.dto.reserva.ReservaRequest;
import com.proyecto.backend_reservas_hoteleria.dto.reserva.ReservaResponse;
import com.proyecto.backend_reservas_hoteleria.model.Habitacion;
import com.proyecto.backend_reservas_hoteleria.model.Reserva;
import com.proyecto.backend_reservas_hoteleria.model.TipoHabitacion;
import com.proyecto.backend_reservas_hoteleria.model.Usuario;
import com.proyecto.backend_reservas_hoteleria.model.enums.EstadoHabitacion;
import com.proyecto.backend_reservas_hoteleria.model.enums.EstadoReserva;
import com.proyecto.backend_reservas_hoteleria.repository.HabitacionRepository;
import com.proyecto.backend_reservas_hoteleria.repository.ReservaRepository;
import com.proyecto.backend_reservas_hoteleria.repository.UsuarioRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
public class ReservaService {

    private final ReservaRepository reservaRepository;
    private final HabitacionRepository habitacionRepository;
    private final UsuarioRepository usuarioRepository;

    public ReservaService(ReservaRepository reservaRepository,
                          HabitacionRepository habitacionRepository,
                          UsuarioRepository usuarioRepository) {
        this.reservaRepository = reservaRepository;
        this.habitacionRepository = habitacionRepository;
        this.usuarioRepository = usuarioRepository;
    }

    public ReservaResponse crear(ReservaRequest request) {
        if (!request.getFechaInicio().isBefore(request.getFechaFin())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "La fecha de inicio debe ser menor a la fecha fin");
        }

        Habitacion habitacion = habitacionRepository.findById(request.getIdHabitacion())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Habitacion no encontrada"));

        if (habitacion.getEstado() != EstadoHabitacion.DISPONIBLE) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Habitacion no disponible");
        }

        Usuario usuario = usuarioRepository.findById(request.getIdUsuario())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuario no encontrado"));

        List<Reserva> traslapos = reservaRepository
                .findByHabitacionIdHabitacionAndFechaInicioLessThanEqualAndFechaFinGreaterThanEqual(
                        request.getIdHabitacion(),
                        request.getFechaFin(),
                        request.getFechaInicio()
                );

        // Solo bloquea si ya existe una reserva confirmada en esas fechas.
        boolean existeConflicto = traslapos.stream()
            .anyMatch(reserva -> reserva.getEstado() == EstadoReserva.CONFIRMADA);

        if (existeConflicto) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Habitacion no disponible en esas fechas");
        }

        TipoHabitacion tipo = habitacion.getTipoHabitacion();
        if (tipo != null && tipo.getCapacidadMaxima() != null && request.getNumeroHuespedes() > tipo.getCapacidadMaxima()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Numero de huespedes supera la capacidad");
        }

        long noches = ChronoUnit.DAYS.between(request.getFechaInicio(), request.getFechaFin());
        if (noches <= 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Las fechas no generan noches validas");
        }

        BigDecimal total = BigDecimal.ZERO;
        if (tipo != null && tipo.getPrecioBase() != null) {
            total = tipo.getPrecioBase().multiply(BigDecimal.valueOf(noches));
        }

        Reserva reserva = new Reserva();
        reserva.setFechaReserva(LocalDate.now());
        reserva.setFechaInicio(request.getFechaInicio());
        reserva.setFechaFin(request.getFechaFin());
        reserva.setNumeroHuespedes(request.getNumeroHuespedes());
        reserva.setEstado(EstadoReserva.PENDIENTE);
        reserva.setTotal(total);
        reserva.setObservacion(request.getObservacion());
        reserva.setUsuario(usuario);
        reserva.setHabitacion(habitacion);

        Reserva guardada = reservaRepository.save(reserva);
        return mapearRespuesta(guardada);
    }

    public List<ReservaResponse> listar() {
        return reservaRepository.findAll().stream()
                .map(this::mapearRespuesta)
                .toList();
    }

        public List<ReservaResponse> listarPorCorreoUsuario(String correo) {
        Usuario usuario = usuarioRepository.findByCorreo(correo)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuario no encontrado"));

        return reservaRepository.findByUsuarioIdUsuario(usuario.getIdUsuario()).stream()
            .map(this::mapearRespuesta)
            .toList();
        }

    public ReservaResponse obtener(Long idReserva) {
        Reserva reserva = reservaRepository.findById(idReserva)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Reserva no encontrada"));
        return mapearRespuesta(reserva);
    }

    public void confirmar(Long idReserva) {
        Reserva reserva = reservaRepository.findById(idReserva)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Reserva no encontrada"));
        if (reserva.getEstado() == EstadoReserva.CANCELADA) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "La reserva esta cancelada");
        }

        List<Reserva> traslapos = reservaRepository
                .findByHabitacionIdHabitacionAndFechaInicioLessThanEqualAndFechaFinGreaterThanEqual(
                        reserva.getHabitacion().getIdHabitacion(),
                        reserva.getFechaFin(),
                        reserva.getFechaInicio()
                );

        boolean existeConfirmada = traslapos.stream()
                .anyMatch(item -> item.getEstado() == EstadoReserva.CONFIRMADA && !item.getIdReserva().equals(reserva.getIdReserva()));

        if (existeConfirmada) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Ya existe una reserva confirmada en esas fechas");
        }

        // Confirma y cancela pendientes traslapadas.
        reserva.setEstado(EstadoReserva.CONFIRMADA);
        reservaRepository.save(reserva);

        for (Reserva item : traslapos) {
            if (!item.getIdReserva().equals(reserva.getIdReserva()) && item.getEstado() == EstadoReserva.PENDIENTE) {
                item.setEstado(EstadoReserva.CANCELADA);
                reservaRepository.save(item);
            }
        }
    }

    public void cancelar(Long idReserva) {
        Reserva reserva = reservaRepository.findById(idReserva)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Reserva no encontrada"));
        reserva.setEstado(EstadoReserva.CANCELADA);
        reservaRepository.save(reserva);
    }

    private ReservaResponse mapearRespuesta(Reserva reserva) {
        Long idUsuario = reserva.getUsuario() != null ? reserva.getUsuario().getIdUsuario() : null;
        Long idHabitacion = reserva.getHabitacion() != null ? reserva.getHabitacion().getIdHabitacion() : null;

        return new ReservaResponse(
                reserva.getIdReserva(),
                reserva.getFechaReserva(),
                reserva.getFechaInicio(),
                reserva.getFechaFin(),
                reserva.getNumeroHuespedes(),
                reserva.getEstado(),
                reserva.getTotal(),
                reserva.getObservacion(),
                idUsuario,
                idHabitacion
        );
    }
}
