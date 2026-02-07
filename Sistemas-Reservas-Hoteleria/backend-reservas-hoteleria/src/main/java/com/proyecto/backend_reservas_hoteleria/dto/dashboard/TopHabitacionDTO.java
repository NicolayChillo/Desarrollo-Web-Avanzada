package com.proyecto.backend_reservas_hoteleria.dto.dashboard;

import java.math.BigDecimal;

/**
 * DTO para representar el top de habitaciones más reservadas
 * Se usa para rankings y comparativas
 */
public class TopHabitacionDTO {
    
    private Long idHabitacion;           // ID de la habitación
    private String codigoHabitacion;     // Código ej: "HAB-101"
    private String tipoHabitacion;       // Tipo: SIMPLE, DOBLE, SUITE
    private Long cantidadReservas;       // Cuántas veces fue reservada
    private BigDecimal ingresosTotales;  // Suma de todos los ingresos de esta habitación
    private BigDecimal ingresoPromedio;  // Promedio: ingresosTotales / cantidadReservas

    public TopHabitacionDTO() {}

    public TopHabitacionDTO(Long idHabitacion, String codigoHabitacion, String tipoHabitacion, 
                           Long cantidadReservas, BigDecimal ingresosTotales, 
                           BigDecimal ingresoPromedio) {
        this.idHabitacion = idHabitacion;
        this.codigoHabitacion = codigoHabitacion;
        this.tipoHabitacion = tipoHabitacion;
        this.cantidadReservas = cantidadReservas;
        this.ingresosTotales = ingresosTotales;
        this.ingresoPromedio = ingresoPromedio;
    }

    // Getters y Setters
    public Long getIdHabitacion() {
        return idHabitacion;
    }

    public void setIdHabitacion(Long idHabitacion) {
        this.idHabitacion = idHabitacion;
    }

    public String getCodigoHabitacion() {
        return codigoHabitacion;
    }

    public void setCodigoHabitacion(String codigoHabitacion) {
        this.codigoHabitacion = codigoHabitacion;
    }

    public String getTipoHabitacion() {
        return tipoHabitacion;
    }

    public void setTipoHabitacion(String tipoHabitacion) {
        this.tipoHabitacion = tipoHabitacion;
    }

    public Long getCantidadReservas() {
        return cantidadReservas;
    }

    public void setCantidadReservas(Long cantidadReservas) {
        this.cantidadReservas = cantidadReservas;
    }

    public BigDecimal getIngresosTotales() {
        return ingresosTotales;
    }

    public void setIngresosTotales(BigDecimal ingresosTotales) {
        this.ingresosTotales = ingresosTotales;
    }

    public BigDecimal getIngresoPromedio() {
        return ingresoPromedio;
    }

    public void setIngresoPromedio(BigDecimal ingresoPromedio) {
        this.ingresoPromedio = ingresoPromedio;
    }
}
