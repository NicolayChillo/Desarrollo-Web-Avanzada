package com.proyecto.backend_reservas_hoteleria.dto.habitacion;

import com.proyecto.backend_reservas_hoteleria.model.enums.EstadoHabitacion;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class HabitacionRequest {

    @NotBlank
    private String codigo;

    @NotBlank
    private String descripcion;

    @NotBlank
    private String imagen;

    @NotNull
    private EstadoHabitacion estado;

    @NotNull
    private Long idTipoHabitacion;

    public HabitacionRequest() {
    }

    public HabitacionRequest(String codigo, String descripcion, String imagen, EstadoHabitacion estado, Long idTipoHabitacion) {
        this.codigo = codigo;
        this.descripcion = descripcion;
        this.imagen = imagen;
        this.estado = estado;
        this.idTipoHabitacion = idTipoHabitacion;
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
}
