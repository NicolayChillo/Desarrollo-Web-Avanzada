package com.proyecto.backend_reservas_hoteleria.dto.notificacion;

import java.time.LocalDateTime;

public class NotificacionResponse {
    private Long idReserva;
    private String mensaje;
    private String tipo; // CONFIRMADA, CANCELADA, PENDIENTE
    private LocalDateTime fecha;
    private String habitacionCodigo;
    private String clienteNombre;

    public NotificacionResponse() {}

    public NotificacionResponse(Long idReserva, String mensaje, String tipo, LocalDateTime fecha, String habitacionCodigo, String clienteNombre) {
        this.idReserva = idReserva;
        this.mensaje = mensaje;
        this.tipo = tipo;
        this.fecha = fecha;
        this.habitacionCodigo = habitacionCodigo;
        this.clienteNombre = clienteNombre;
    }

    public Long getIdReserva() {
        return idReserva;
    }

    public void setIdReserva(Long idReserva) {
        this.idReserva = idReserva;
    }

    public String getMensaje() {
        return mensaje;
    }

    public void setMensaje(String mensaje) {
        this.mensaje = mensaje;
    }

    public String getTipo() {
        return tipo;
    }

    public void setTipo(String tipo) {
        this.tipo = tipo;
    }

    public LocalDateTime getFecha() {
        return fecha;
    }

    public void setFecha(LocalDateTime fecha) {
        this.fecha = fecha;
    }

    public String getHabitacionCodigo() {
        return habitacionCodigo;
    }

    public void setHabitacionCodigo(String habitacionCodigo) {
        this.habitacionCodigo = habitacionCodigo;
    }

    public String getClienteNombre() {
        return clienteNombre;
    }

    public void setClienteNombre(String clienteNombre) {
        this.clienteNombre = clienteNombre;
    }
}
