package com.proyecto.backend_reservas_hoteleria.dto.reserva;

import com.proyecto.backend_reservas_hoteleria.model.enums.EstadoReserva;

import java.math.BigDecimal;
import java.time.LocalDate;

public class ReservaResponse {

    private Long idReserva;
    private LocalDate fechaReserva;
    private LocalDate fechaInicio;
    private LocalDate fechaFin;
    private Integer numeroHuespedes;
    private EstadoReserva estado;
    private BigDecimal total;
    private String observacion;
    private Long idUsuario;
    private Long idHabitacion;

    public ReservaResponse() {
    }

    public ReservaResponse(Long idReserva,
                           LocalDate fechaReserva,
                           LocalDate fechaInicio,
                           LocalDate fechaFin,
                           Integer numeroHuespedes,
                           EstadoReserva estado,
                           BigDecimal total,
                           String observacion,
                           Long idUsuario,
                           Long idHabitacion) {
        this.idReserva = idReserva;
        this.fechaReserva = fechaReserva;
        this.fechaInicio = fechaInicio;
        this.fechaFin = fechaFin;
        this.numeroHuespedes = numeroHuespedes;
        this.estado = estado;
        this.total = total;
        this.observacion = observacion;
        this.idUsuario = idUsuario;
        this.idHabitacion = idHabitacion;
    }

    public Long getIdReserva() {
        return idReserva;
    }

    public void setIdReserva(Long idReserva) {
        this.idReserva = idReserva;
    }

    public LocalDate getFechaReserva() {
        return fechaReserva;
    }

    public void setFechaReserva(LocalDate fechaReserva) {
        this.fechaReserva = fechaReserva;
    }

    public LocalDate getFechaInicio() {
        return fechaInicio;
    }

    public void setFechaInicio(LocalDate fechaInicio) {
        this.fechaInicio = fechaInicio;
    }

    public LocalDate getFechaFin() {
        return fechaFin;
    }

    public void setFechaFin(LocalDate fechaFin) {
        this.fechaFin = fechaFin;
    }

    public Integer getNumeroHuespedes() {
        return numeroHuespedes;
    }

    public void setNumeroHuespedes(Integer numeroHuespedes) {
        this.numeroHuespedes = numeroHuespedes;
    }

    public EstadoReserva getEstado() {
        return estado;
    }

    public void setEstado(EstadoReserva estado) {
        this.estado = estado;
    }

    public BigDecimal getTotal() {
        return total;
    }

    public void setTotal(BigDecimal total) {
        this.total = total;
    }

    public String getObservacion() {
        return observacion;
    }

    public void setObservacion(String observacion) {
        this.observacion = observacion;
    }

    public Long getIdUsuario() {
        return idUsuario;
    }

    public void setIdUsuario(Long idUsuario) {
        this.idUsuario = idUsuario;
    }

    public Long getIdHabitacion() {
        return idHabitacion;
    }

    public void setIdHabitacion(Long idHabitacion) {
        this.idHabitacion = idHabitacion;
    }
}
