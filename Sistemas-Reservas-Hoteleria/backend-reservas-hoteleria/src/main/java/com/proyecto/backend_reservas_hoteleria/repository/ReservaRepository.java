package com.proyecto.backend_reservas_hoteleria.repository;

import com.proyecto.backend_reservas_hoteleria.model.Reserva;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface ReservaRepository extends JpaRepository<Reserva, Long> {

    List<Reserva> findByHabitacionIdHabitacionAndFechaInicioLessThanEqualAndFechaFinGreaterThanEqual(
            Long idHabitacion,
            LocalDate fechaFin,
            LocalDate fechaInicio
    );

    List<Reserva> findByUsuarioIdUsuario(Long idUsuario);
}
