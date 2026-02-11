package com.proyecto.backend_reservas_hoteleria.dto.auth;

public class LoginResponse {

    private String token;
    private String tokenType;
    private Long idUsuario;
    private String rol;

    public LoginResponse() {
        this.tokenType = "Bearer";
    }

    public LoginResponse(String token) {
        this.token = token;
        this.tokenType = "Bearer";
    }

    public LoginResponse(String token, String tokenType) {
        this.token = token;
        this.tokenType = tokenType;
    }

    public LoginResponse(String token, Long idUsuario, String rol) {
        this.token = token;
        this.tokenType = "Bearer";
        this.idUsuario = idUsuario;
        this.rol = rol;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getTokenType() {
        return tokenType;
    }

    public void setTokenType(String tokenType) {
        this.tokenType = tokenType;
    }

    public Long getIdUsuario() {
        return idUsuario;
    }

    public void setIdUsuario(Long idUsuario) {
        this.idUsuario = idUsuario;
    }

    public String getRol() {
        return rol;
    }

    public void setRol(String rol) {
        this.rol = rol;
    }
}
