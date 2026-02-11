package com.proyecto.backend_reservas_hoteleria.dto.usuario;

import java.time.LocalDate;

import com.proyecto.backend_reservas_hoteleria.model.enums.Estado;

public class UsuarioResponse {
    private Long idUsuario;
    private String nombre;
    private String correo;
    private LocalDate fechaRegistro;
    private Estado estado;
    private RolDTO rol;

    public UsuarioResponse() {}

    public UsuarioResponse(Long idUsuario, String nombre, String correo, LocalDate fechaRegistro, Estado estado, RolDTO rol) {
        this.idUsuario = idUsuario;
        this.nombre = nombre;
        this.correo = correo;
        this.fechaRegistro = fechaRegistro;
        this.estado = estado;
        this.rol = rol;
    }

    public Long getIdUsuario() {
        return idUsuario;
    }

    public void setIdUsuario(Long idUsuario) {
        this.idUsuario = idUsuario;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getCorreo() {
        return correo;
    }

    public void setCorreo(String correo) {
        this.correo = correo;
    }

    public LocalDate getFechaRegistro() {
        return fechaRegistro;
    }

    public void setFechaRegistro(LocalDate fechaRegistro) {
        this.fechaRegistro = fechaRegistro;
    }

    public Estado getEstado() {
        return estado;
    }

    public void setEstado(Estado estado) {
        this.estado = estado;
    }

    public RolDTO getRol() {
        return rol;
    }

    public void setRol(RolDTO rol) {
        this.rol = rol;
    }

    public static class RolDTO {
        private Long idRol;
        private String tipoRol;
        private String descripcion;

        public RolDTO() {}

        public RolDTO(Long idRol, String tipoRol, String descripcion) {
            this.idRol = idRol;
            this.tipoRol = tipoRol;
            this.descripcion = descripcion;
        }

        public Long getIdRol() {
            return idRol;
        }

        public void setIdRol(Long idRol) {
            this.idRol = idRol;
        }

        public String getTipoRol() {
            return tipoRol;
        }

        public void setTipoRol(String tipoRol) {
            this.tipoRol = tipoRol;
        }

        public String getDescripcion() {
            return descripcion;
        }

        public void setDescripcion(String descripcion) {
            this.descripcion = descripcion;
        }
    }
}
