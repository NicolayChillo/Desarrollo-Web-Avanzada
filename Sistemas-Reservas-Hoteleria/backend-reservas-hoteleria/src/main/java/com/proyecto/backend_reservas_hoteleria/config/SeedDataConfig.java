package com.proyecto.backend_reservas_hoteleria.config;

import com.proyecto.backend_reservas_hoteleria.model.Rol;
import com.proyecto.backend_reservas_hoteleria.model.enums.Estado;
import com.proyecto.backend_reservas_hoteleria.model.enums.TipoRol;
import com.proyecto.backend_reservas_hoteleria.repository.RolRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SeedDataConfig {

    @Bean
    public CommandLineRunner sembrarRoles(RolRepository rolRepository) {
        return args -> {
            Rol rolAdmin = rolRepository.findByTipoRol(TipoRol.ADMINISTRADOR)
                    .orElseGet(() -> rolRepository.save(new Rol("Administrador", TipoRol.ADMINISTRADOR, Estado.ACTIVO)));

            rolRepository.findByTipoRol(TipoRol.CLIENTE)
                    .orElseGet(() -> rolRepository.save(new Rol("Cliente", TipoRol.CLIENTE, Estado.ACTIVO)));
        };
    }
}
