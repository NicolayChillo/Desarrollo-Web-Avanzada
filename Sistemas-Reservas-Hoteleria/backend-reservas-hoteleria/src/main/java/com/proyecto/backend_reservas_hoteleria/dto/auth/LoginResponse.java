package com.proyecto.backend_reservas_hoteleria.dto.auth;

public class LoginResponse {

    private String token;
    private String tokenType;

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
}
