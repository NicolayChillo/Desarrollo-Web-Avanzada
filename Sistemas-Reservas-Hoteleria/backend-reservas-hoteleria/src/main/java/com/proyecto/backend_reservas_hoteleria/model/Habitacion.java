package com.proyecto.backend_reservas_hoteleria.model;

import com.proyecto.backend_reservas_hoteleria.model.enums.EstadoHabitacion;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity
public class Habitacion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idHabitacion;

    private String codigo;

    private String descripcion;

    private String imagen;

    private Integer nBathroom;

    @Enumerated(EnumType.STRING)
    private EstadoHabitacion estado;

    @ManyToOne
    @JoinColumn(name = "id_tipo_habitacion")
    private TipoHabitacion tipoHabitacion;

    public Habitacion() {}

    public Habitacion(String codigo, String descripcion, String imagen, Integer nBathroom, EstadoHabitacion estado, TipoHabitacion tipoHabitacion) {
        this.codigo = codigo;
        this.descripcion = descripcion;
        this.imagen = imagen;
        this.nBathroom = nBathroom;
        this.estado = estado;
        this.tipoHabitacion = tipoHabitacion;
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

    public TipoHabitacion getTipoHabitacion() {
        return tipoHabitacion;
    }

    public void setTipoHabitacion(TipoHabitacion tipoHabitacion) {
        this.tipoHabitacion = tipoHabitacion;
    }
}
