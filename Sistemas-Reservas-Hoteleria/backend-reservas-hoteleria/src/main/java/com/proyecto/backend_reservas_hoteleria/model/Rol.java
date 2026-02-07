package com.proyecto.backend_reservas_hoteleria.model;

import com.proyecto.backend_reservas_hoteleria.model.enums.Estado;
import com.proyecto.backend_reservas_hoteleria.model.enums.TipoRol;
import jakarta.persistence.*;

@Entity
public class Rol {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idRol;

    private String descripcion;

    @Enumerated(EnumType.STRING)
    private TipoRol tipoRol;

    @Enumerated(EnumType.STRING)
    private Estado estado;

    public Rol() {}

    public Rol(String descripcion, TipoRol tipoRol, Estado estado) {
        this.descripcion = descripcion;
        this.tipoRol = tipoRol;
        this.estado = estado;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public Long getIdRol() {
        return idRol;
    }

    public void setIdRol(Long idRol) {
        this.idRol = idRol;
    }

    public TipoRol getTipoRol() {
        return tipoRol;
    }

    public void setTipoRol(TipoRol tipoRol) {
        this.tipoRol = tipoRol;
    }

    public Estado getEstado() {
        return estado;
    }

    public void setEstado(Estado estado) {
        this.estado = estado;
    }
}
