package com.proyecto.backend_reservas_hoteleria.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.proyecto.backend_reservas_hoteleria.model.Habitacion;
import com.proyecto.backend_reservas_hoteleria.model.enums.EstadoHabitacion;
import com.proyecto.backend_reservas_hoteleria.model.enums.NombreTipoHabitacion;

public interface HabitacionRepository extends JpaRepository<Habitacion, Long> {

    List<Habitacion> findByEstado(EstadoHabitacion estado);
    
    @Query("SELECT h FROM Habitacion h WHERE h.tipoHabitacion.nombre = :nombreTipo")
    List<Habitacion> findByTipoHabitacionNombre(@Param("nombreTipo") NombreTipoHabitacion nombreTipo);
}
