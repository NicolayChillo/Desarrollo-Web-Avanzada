package com.proyecto.backend_reservas_hoteleria.dto.habitacion;

import java.math.BigDecimal;

import com.proyecto.backend_reservas_hoteleria.model.enums.EstadoHabitacion;

public class HabitacionResponse {

    private Long idHabitacion;
    private String codigo;
    private String descripcion;
    private String imagen;
    private Integer nBathroom;
    private EstadoHabitacion estado;
    private Long idTipoHabitacion;
    private String tipoHabitacionNombre;
    private BigDecimal precioBase;
    private Integer capacidadMaxima;

    public HabitacionResponse() {
    }

    public HabitacionResponse(Long idHabitacion,
                              String codigo,
                              String descripcion,
                              String imagen,
                              Integer nBathroom,
                              EstadoHabitacion estado,
                              Long idTipoHabitacion,
                              String tipoHabitacionNombre,
                              BigDecimal precioBase,
                              Integer capacidadMaxima) {
        this.idHabitacion = idHabitacion;
        this.codigo = codigo;
        this.descripcion = descripcion;
        this.imagen = imagen;
        this.nBathroom = nBathroom;
        this.estado = estado;
        this.idTipoHabitacion = idTipoHabitacion;
        this.tipoHabitacionNombre = tipoHabitacionNombre;
        this.precioBase = precioBase;
        this.capacidadMaxima = capacidadMaxima;
    }

    public Long getIdHabitacion() {
        return idHabitacion;
    }

    public void setIdHabitacion(Long idHabitacion) {
        this.idHabitacion = idHabitacion;
    }

    public String getCodigo() {
        return codigo;
    }

    public void setCodigo(String codigo) {
        this.codigo = codigo;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public String getImagen() {
        return imagen;
    }

    public void setImagen(String imagen) {
        this.imagen = imagen;
    }

    public Integer getNBathroom() {
        return nBathroom;
    }

    public void setNBathroom(Integer nBathroom) {
        this.nBathroom = nBathroom;
    }

    public EstadoHabitacion getEstado() {
        return estado;
    }

    public void setEstado(EstadoHabitacion estado) {
        this.estado = estado;
    }

    public Long getIdTipoHabitacion() {
        return idTipoHabitacion;
    }

    public void setIdTipoHabitacion(Long idTipoHabitacion) {
        this.idTipoHabitacion = idTipoHabitacion;
    }

    public String getTipoHabitacionNombre() {
        return tipoHabitacionNombre;
    }

    public void setTipoHabitacionNombre(String tipoHabitacionNombre) {
        this.tipoHabitacionNombre = tipoHabitacionNombre;
    }

    public BigDecimal getPrecioBase() {
        return precioBase;
    }

    public void setPrecioBase(BigDecimal precioBase) {
        this.precioBase = precioBase;
    }

    public Integer getCapacidadMaxima() {
        return capacidadMaxima;
    }

    public void setCapacidadMaxima(Integer capacidadMaxima) {
        this.capacidadMaxima = capacidadMaxima;
    }
}
