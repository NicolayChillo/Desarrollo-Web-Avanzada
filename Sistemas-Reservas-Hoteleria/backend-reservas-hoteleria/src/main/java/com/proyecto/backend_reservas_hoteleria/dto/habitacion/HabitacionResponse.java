package com.proyecto.backend_reservas_hoteleria.dto.habitacion;

import com.proyecto.backend_reservas_hoteleria.model.enums.EstadoHabitacion;

public class HabitacionResponse {

    private Long idHabitacion;
    private String codigo;
    private String descripcion;
    private String imagen;
    private EstadoHabitacion estado;
    private Long idTipoHabitacion;
    private String tipoHabitacionNombre;

    public HabitacionResponse() {
    }

    public HabitacionResponse(Long idHabitacion,
                              String codigo,
                              String descripcion,
                              String imagen,
                              EstadoHabitacion estado,
                              Long idTipoHabitacion,
                              String tipoHabitacionNombre) {
        this.idHabitacion = idHabitacion;
        this.codigo = codigo;
        this.descripcion = descripcion;
        this.imagen = imagen;
        this.estado = estado;
        this.idTipoHabitacion = idTipoHabitacion;
        this.tipoHabitacionNombre = tipoHabitacionNombre;
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
}
