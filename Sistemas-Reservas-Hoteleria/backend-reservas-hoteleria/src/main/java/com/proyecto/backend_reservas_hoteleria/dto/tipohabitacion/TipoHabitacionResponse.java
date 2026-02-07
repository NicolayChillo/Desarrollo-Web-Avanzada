package com.proyecto.backend_reservas_hoteleria.dto.tipohabitacion;

import com.proyecto.backend_reservas_hoteleria.model.enums.Estado;
import com.proyecto.backend_reservas_hoteleria.model.enums.NombreTipoHabitacion;

import java.math.BigDecimal;

public class TipoHabitacionResponse {

    private Long idTipoHabitacion;
    private NombreTipoHabitacion nombre;
    private String descripcion;
    private Integer capacidadMaxima;
    private BigDecimal precioBase;
    private Estado estado;

    public TipoHabitacionResponse() {
    }

    public TipoHabitacionResponse(Long idTipoHabitacion,
                                  NombreTipoHabitacion nombre,
                                  String descripcion,
                                  Integer capacidadMaxima,
                                  BigDecimal precioBase,
                                  Estado estado) {
        this.idTipoHabitacion = idTipoHabitacion;
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.capacidadMaxima = capacidadMaxima;
        this.precioBase = precioBase;
        this.estado = estado;
    }

    public Long getIdTipoHabitacion() {
        return idTipoHabitacion;
    }

    public void setIdTipoHabitacion(Long idTipoHabitacion) {
        this.idTipoHabitacion = idTipoHabitacion;
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
