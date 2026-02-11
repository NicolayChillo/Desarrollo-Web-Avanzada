package com.proyecto.backend_reservas_hoteleria.dto.usuario;

import jakarta.validation.constraints.NotNull;

public class CambiarRolRequest {
    @NotNull(message = "El tipo de rol es obligatorio")
    private String tipoRol;

    public CambiarRolRequest() {}

    public CambiarRolRequest(String tipoRol) {
        this.tipoRol = tipoRol;
    }

    public String getTipoRol() {
        return tipoRol;
    }

    public void setTipoRol(String tipoRol) {
        this.tipoRol = tipoRol;
    }
}
