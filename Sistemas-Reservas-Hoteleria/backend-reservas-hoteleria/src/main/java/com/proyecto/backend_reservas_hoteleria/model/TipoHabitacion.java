package com.proyecto.backend_reservas_hoteleria.model;

import com.proyecto.backend_reservas_hoteleria.model.enums.Estado;
import com.proyecto.backend_reservas_hoteleria.model.enums.NombreTipoHabitacion;
import jakarta.persistence.*;

import java.math.BigDecimal;

@Entity
public class TipoHabitacion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idTipoHabitacion;

    @Enumerated(EnumType.STRING)
    private NombreTipoHabitacion nombre;

    private String descripcion;

    private Integer capacidadMaxima;

    private BigDecimal precioBase;

    @Enumerated(EnumType.STRING)
    private Estado estado;

    public TipoHabitacion() {}

    public TipoHabitacion(NombreTipoHabitacion nombre, String descripcion, Integer capacidadMaxima, BigDecimal precioBase, Estado estado) {
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
