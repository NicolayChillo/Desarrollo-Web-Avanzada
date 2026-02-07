package com.proyecto.backend_reservas_hoteleria.dto.auth;

public class RegisterResponse {

    private Long idUsuario;
    private String correo;
    private String rol;

    public RegisterResponse() {
    }

    public RegisterResponse(Long idUsuario, String correo, String rol) {
        this.idUsuario = idUsuario;
        this.correo = correo;
        this.rol = rol;
    }

    public Long getIdUsuario() {
        return idUsuario;
    }

    public void setIdUsuario(Long idUsuario) {
        this.idUsuario = idUsuario;
    }

    public String getCorreo() {
        return correo;
    }

    public void setCorreo(String correo) {
        this.correo = correo;
    }

    public String getRol() {
        return rol;
    }

    public void setRol(String rol) {
        this.rol = rol;
    }
}
