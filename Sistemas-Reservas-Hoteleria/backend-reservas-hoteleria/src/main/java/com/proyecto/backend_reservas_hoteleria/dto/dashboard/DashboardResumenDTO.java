package com.proyecto.backend_reservas_hoteleria.dto.dashboard;

import java.util.List;

/**
 * DTO contenedor que agrupa todos los datos del dashboard
 * Este es el objeto principal que se devuelve al frontend
 */
public class DashboardResumenDTO {
    
    private EstadisticasGeneralesDTO estadisticasGenerales;  // KPIs principales
    private List<OcupacionMensualDTO> ocupacionMensual;      // Gráfico de ocupación (12 meses)
    private List<TopHabitacionDTO> topHabitaciones;          // Top 5 habitaciones

    public DashboardResumenDTO() {}

    public DashboardResumenDTO(EstadisticasGeneralesDTO estadisticasGenerales, 
                              List<OcupacionMensualDTO> ocupacionMensual, 
                              List<TopHabitacionDTO> topHabitaciones) {
        this.estadisticasGenerales = estadisticasGenerales;
        this.ocupacionMensual = ocupacionMensual;
        this.topHabitaciones = topHabitaciones;
    }

    // Getters y Setters
    public EstadisticasGeneralesDTO getEstadisticasGenerales() {
        return estadisticasGenerales;
    }

    public void setEstadisticasGenerales(EstadisticasGeneralesDTO estadisticasGenerales) {
        this.estadisticasGenerales = estadisticasGenerales;
    }

    public List<OcupacionMensualDTO> getOcupacionMensual() {
        return ocupacionMensual;
    }

    public void setOcupacionMensual(List<OcupacionMensualDTO> ocupacionMensual) {
        this.ocupacionMensual = ocupacionMensual;
    }

    public List<TopHabitacionDTO> getTopHabitaciones() {
        return topHabitaciones;
    }

    public void setTopHabitaciones(List<TopHabitacionDTO> topHabitaciones) {
        this.topHabitaciones = topHabitaciones;
    }
}
