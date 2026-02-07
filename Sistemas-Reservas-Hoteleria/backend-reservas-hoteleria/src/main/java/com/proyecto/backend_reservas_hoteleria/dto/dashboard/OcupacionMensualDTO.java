package com.proyecto.backend_reservas_hoteleria.dto.dashboard;

import java.math.BigDecimal;

/**
 * DTO para representar la ocupación mensual de habitaciones
 * Se usa para el gráfico de ocupación en el dashboard
 */
public class OcupacionMensualDTO {
    
    private Integer mes;              // 1-12 (Enero = 1, Diciembre = 12)
    private Integer año;              // Año ej: 2024, 2025
    private Long habitacionesOcupadas; // Número de reservas confirmadas en ese mes
    private Long totalHabitaciones;    // Total de habitaciones disponibles
    private Double porcentajeOcupacion; // Calculado: (ocupadas / total) * 100
    private String label;             // Para mostrar: "Enero 2025", "Febrero 2025"

    public OcupacionMensualDTO() {}

    public OcupacionMensualDTO(Integer mes, Integer año, Long habitacionesOcupadas, 
                               Long totalHabitaciones, Double porcentajeOcupacion, String label) {
        this.mes = mes;
        this.año = año;
        this.habitacionesOcupadas = habitacionesOcupadas;
        this.totalHabitaciones = totalHabitaciones;
        this.porcentajeOcupacion = porcentajeOcupacion;
        this.label = label;
    }

    // Getters y Setters
    public Integer getMes() {
        return mes;
    }

    public void setMes(Integer mes) {
        this.mes = mes;
    }

    public Integer getAño() {
        return año;
    }

    public void setAño(Integer año) {
        this.año = año;
    }

    public Long getHabitacionesOcupadas() {
        return habitacionesOcupadas;
    }

    public void setHabitacionesOcupadas(Long habitacionesOcupadas) {
        this.habitacionesOcupadas = habitacionesOcupadas;
    }

    public Long getTotalHabitaciones() {
        return totalHabitaciones;
    }

    public void setTotalHabitaciones(Long totalHabitaciones) {
        this.totalHabitaciones = totalHabitaciones;
    }

    public Double getPorcentajeOcupacion() {
        return porcentajeOcupacion;
    }

    public void setPorcentajeOcupacion(Double porcentajeOcupacion) {
        this.porcentajeOcupacion = porcentajeOcupacion;
    }

    public String getLabel() {
        return label;
    }

    public void setLabel(String label) {
        this.label = label;
    }
}
