package com.proyecto.backend_reservas_hoteleria.dto.reserva;

import java.math.BigDecimal;
import java.time.LocalDate;

import com.proyecto.backend_reservas_hoteleria.model.enums.EstadoReserva;

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
    private HabitacionInfo habitacion;
    private UsuarioInfo usuario;

    public static class HabitacionInfo {
        private String codigo;
        private TipoHabitacionInfo tipoHabitacion;

        public HabitacionInfo() {}

        public HabitacionInfo(String codigo, TipoHabitacionInfo tipoHabitacion) {
            this.codigo = codigo;
            this.tipoHabitacion = tipoHabitacion;
        }

        public String getCodigo() { return codigo; }
        public void setCodigo(String codigo) { this.codigo = codigo; }
        public TipoHabitacionInfo getTipoHabitacion() { return tipoHabitacion; }
        public void setTipoHabitacion(TipoHabitacionInfo tipoHabitacion) { this.tipoHabitacion = tipoHabitacion; }
    }

    public static class TipoHabitacionInfo {
        private String nombreTipo;

        public TipoHabitacionInfo() {}

        public TipoHabitacionInfo(String nombreTipo) {
            this.nombreTipo = nombreTipo;
        }

        public String getNombreTipo() { return nombreTipo; }
        public void setNombreTipo(String nombreTipo) { this.nombreTipo = nombreTipo; }
    }

    public static class UsuarioInfo {
        private String nombre;
        private String correo;

        public UsuarioInfo() {}

        public UsuarioInfo(String nombre, String correo) {
            this.nombre = nombre;
            this.correo = correo;
        }

        public String getNombre() { return nombre; }
        public void setNombre(String nombre) { this.nombre = nombre; }
        public String getCorreo() { return correo; }
        public void setCorreo(String correo) { this.correo = correo; }
    }

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

    public HabitacionInfo getHabitacion() {
        return habitacion;
    }

    public void setHabitacion(HabitacionInfo habitacion) {
        this.habitacion = habitacion;
    }

    public UsuarioInfo getUsuario() {
        return usuario;
    }

    public void setUsuario(UsuarioInfo usuario) {
        this.usuario = usuario;
    }
}
