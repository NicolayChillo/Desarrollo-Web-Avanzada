package com.proyecto.backend_reservas_hoteleria.dto.dashboard;

import java.math.BigDecimal;

/**
 * DTO para las estadísticas generales del dashboard
 * Contiene KPIs (Key Performance Indicators) principales
 */
public class EstadisticasGeneralesDTO {
    
    private BigDecimal totalIngresos;           // Suma de todos los ingresos históricos
    private BigDecimal totalIngresosMes;        // Ingresos del mes actual
    private Long totalReservas;                  // Total de todas las reservas
    private Long totalReservasConfirmadas;       // Solo reservas confirmadas
    private Long totalHabitaciones;              // Total de habitaciones en el sistema
    private Long habitacionesDisponibles;        // Habitaciones con estado DISPONIBLE
    private Double tasaOcupacionPromedio;        // Promedio de ocupación histórica

    public EstadisticasGeneralesDTO() {}

    public EstadisticasGeneralesDTO(BigDecimal totalIngresos, BigDecimal totalIngresosMes, 
                                    Long totalReservas, Long totalReservasConfirmadas, 
                                    Long totalHabitaciones, Long habitacionesDisponibles, 
                                    Double tasaOcupacionPromedio) {
        this.totalIngresos = totalIngresos;
        this.totalIngresosMes = totalIngresosMes;
        this.totalReservas = totalReservas;
        this.totalReservasConfirmadas = totalReservasConfirmadas;
        this.totalHabitaciones = totalHabitaciones;
        this.habitacionesDisponibles = habitacionesDisponibles;
        this.tasaOcupacionPromedio = tasaOcupacionPromedio;
    }

    // Getters y Setters
    public BigDecimal getTotalIngresos() {
        return totalIngresos;
    }

    public void setTotalIngresos(BigDecimal totalIngresos) {
        this.totalIngresos = totalIngresos;
    }

    public BigDecimal getTotalIngresosMes() {
        return totalIngresosMes;
    }

    public void setTotalIngresosMes(BigDecimal totalIngresosMes) {
        this.totalIngresosMes = totalIngresosMes;
    }

    public Long getTotalReservas() {
        return totalReservas;
    }

    public void setTotalReservas(Long totalReservas) {
        this.totalReservas = totalReservas;
    }

    public Long getTotalReservasConfirmadas() {
        return totalReservasConfirmadas;
    }

    public void setTotalReservasConfirmadas(Long totalReservasConfirmadas) {
        this.totalReservasConfirmadas = totalReservasConfirmadas;
    }

    public Long getTotalHabitaciones() {
        return totalHabitaciones;
    }

    public void setTotalHabitaciones(Long totalHabitaciones) {
        this.totalHabitaciones = totalHabitaciones;
    }

    public Long getHabitacionesDisponibles() {
        return habitacionesDisponibles;
    }

    public void setHabitacionesDisponibles(Long habitacionesDisponibles) {
        this.habitacionesDisponibles = habitacionesDisponibles;
    }

    public Double getTasaOcupacionPromedio() {
        return tasaOcupacionPromedio;
    }

    public void setTasaOcupacionPromedio(Double tasaOcupacionPromedio) {
        this.tasaOcupacionPromedio = tasaOcupacionPromedio;
    }
}
