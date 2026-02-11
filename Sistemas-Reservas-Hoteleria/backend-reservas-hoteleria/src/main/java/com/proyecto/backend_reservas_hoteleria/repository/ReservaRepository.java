package com.proyecto.backend_reservas_hoteleria.repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.proyecto.backend_reservas_hoteleria.model.Reserva;
import com.proyecto.backend_reservas_hoteleria.model.Usuario;
import com.proyecto.backend_reservas_hoteleria.model.enums.EstadoReserva;

public interface ReservaRepository extends JpaRepository<Reserva, Long> {

    List<Reserva> findByHabitacionIdHabitacionAndFechaInicioLessThanEqualAndFechaFinGreaterThanEqual(
            Long idHabitacion,
            LocalDate fechaFin,
            LocalDate fechaInicio
    );

    List<Reserva> findByUsuarioIdUsuario(Long idUsuario);

    List<Reserva> findByUsuarioAndFechaReservaAfter(Usuario usuario, LocalDateTime  fechaReserva);

    // ==================== MÉTODOS PARA DASHBOARD ====================
    
    /**
     * Busca reservas por estado (para filtrar CONFIRMADAS)
     */
    List<Reserva> findByEstado(EstadoReserva estado);

    /**
     * Calcula el total de ingresos históricos de todas las reservas confirmadas
     * @return Suma total de ingresos o 0 si no hay datos
     */
    @Query("SELECT COALESCE(SUM(r.total), 0) FROM Reserva r WHERE r.estado = 'CONFIRMADA'")
    BigDecimal obtenerTotalIngresos();

    /**
     * Calcula el total de ingresos de un mes específico
     * @param mes Mes (1-12)
     * @param año Año (ej: 2025)
     * @return Suma de ingresos del mes
     */
    @Query("SELECT COALESCE(SUM(r.total), 0) FROM Reserva r " +
           "WHERE r.estado = 'CONFIRMADA' " +
           "AND EXTRACT(MONTH FROM r.fechaReserva) = :mes " +
           "AND EXTRACT(YEAR FROM r.fechaReserva) = :año")
    BigDecimal obtenerIngresosPorMesYAño(@Param("mes") Integer mes, @Param("año") Integer año);

    /**
     * Obtiene la ocupación mensual agrupada por mes y año
     * @return Array de objetos [mes, año, totalReservas]
     */
    @Query("SELECT EXTRACT(MONTH FROM r.fechaReserva) as mes, " +
           "EXTRACT(YEAR FROM r.fechaReserva) as año, " +
           "COUNT(DISTINCT r.idReserva) as totalReservas " +
           "FROM Reserva r " +
           "WHERE r.estado = 'CONFIRMADA' " +
           "GROUP BY EXTRACT(YEAR FROM r.fechaReserva), EXTRACT(MONTH FROM r.fechaReserva) " +
           "ORDER BY año DESC, mes DESC")
    List<Object[]> obtenerOcupacionMensual();

    /**
     * Obtiene el top de habitaciones más reservadas con sus ingresos
     * @return Array de objetos [idHabitacion, codigo, tipoNombre, cantidadReservas, ingresosTotales]
     */
    @Query("SELECT r.habitacion.idHabitacion, " +
           "r.habitacion.codigo, " +
           "r.habitacion.tipoHabitacion.nombre, " +
           "COUNT(r.idReserva) as cantidadReservas, " +
           "COALESCE(SUM(r.total), 0) as ingresosTotales " +
           "FROM Reserva r " +
           "WHERE r.estado = 'CONFIRMADA' " +
           "GROUP BY r.habitacion.idHabitacion, r.habitacion.codigo, r.habitacion.tipoHabitacion.nombre " +
           "ORDER BY cantidadReservas DESC")
    List<Object[]> obtenerTopHabitacionesReservadas();

    /**
     * Cuenta los días ocupados en un mes específico
     * @param mes Mes (1-12)
     * @param año Año
     * @return Número de días con reservas
     */
    @Query("SELECT COUNT(DISTINCT DATE(r.fechaInicio)) as diasOcupados " +
           "FROM Reserva r " +
           "WHERE r.estado = 'CONFIRMADA' " +
           "AND EXTRACT(MONTH FROM r.fechaReserva) = :mes " +
           "AND EXTRACT(YEAR FROM r.fechaReserva) = :año")
    Long obtenerDiasOcupadosPorMes(@Param("mes") Integer mes, @Param("año") Integer año);
}
