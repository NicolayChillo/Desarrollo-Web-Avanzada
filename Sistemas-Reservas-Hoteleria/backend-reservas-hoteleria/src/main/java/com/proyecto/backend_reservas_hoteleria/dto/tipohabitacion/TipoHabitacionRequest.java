package com.proyecto.backend_reservas_hoteleria.dto.tipohabitacion;

import com.proyecto.backend_reservas_hoteleria.model.enums.Estado;
import com.proyecto.backend_reservas_hoteleria.model.enums.NombreTipoHabitacion;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public class TipoHabitacionRequest {

    @NotNull
    private NombreTipoHabitacion nombre;

    @NotBlank
    private String descripcion;

    @NotNull
    private Integer capacidadMaxima;

    @NotNull
    private BigDecimal precioBase;

    @NotNull
    private Estado estado;

    public TipoHabitacionRequest() {
    }

    public TipoHabitacionRequest(NombreTipoHabitacion nombre,
                                 String descripcion,
                                 Integer capacidadMaxima,
                                 BigDecimal precioBase,
                                 Estado estado) {
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.capacidadMaxima = capacidadMaxima;
        this.precioBase = precioBase;
        this.estado = estado;
    }

    public NombreTipoHabitacion getNombre() {
        return nombre;
    }

    public void setNombre(NombreTipoHabitacion nombre) {
        this.nombre = nombre;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public Integer getCapacidadMaxima() {
        return capacidadMaxima;
    }

    public void setCapacidadMaxima(Integer capacidadMaxima) {
        this.capacidadMaxima = capacidadMaxima;
    }

    public BigDecimal getPrecioBase() {
        return precioBase;
    }

    public void setPrecioBase(BigDecimal precioBase) {
        this.precioBase = precioBase;
    }

    public Estado getEstado() {
        return estado;
    }

    public void setEstado(Estado estado) {
        this.estado = estado;
    }
}
