package com.proyecto.backend_reservas_hoteleria.controller;

import com.proyecto.backend_reservas_hoteleria.dto.dashboard.DashboardResumenDTO;
import com.proyecto.backend_reservas_hoteleria.dto.dashboard.EstadisticasGeneralesDTO;
import com.proyecto.backend_reservas_hoteleria.dto.dashboard.OcupacionMensualDTO;
import com.proyecto.backend_reservas_hoteleria.dto.dashboard.TopHabitacionDTO;
import com.proyecto.backend_reservas_hoteleria.service.DashboardService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controlador REST para el módulo Dashboard
 * Proporciona endpoints para obtener estadísticas, ocupación y rankings
 * 
 * NOTA: Todos los endpoints requieren autenticación JWT y rol ADMIN o GERENTE
 */
@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = "*", maxAge = 3600)
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    /**
     * Endpoint principal: Obtiene todos los datos del dashboard
     * 
     * GET /api/dashboard/resumen
     * 
     * @return JSON con estadísticas, ocupación mensual y top habitaciones
     * 
     * Ejemplo de respuesta:
     * {
     *   "estadisticasGenerales": { ... },
     *   "ocupacionMensual": [ ... ],
     *   "topHabitaciones": [ ... ]
     * }
     */
    @GetMapping("/resumen")
    @PreAuthorize("hasAnyRole('ADMIN', 'GERENTE')")
    public ResponseEntity<DashboardResumenDTO> obtenerResumenDashboard() {
        DashboardResumenDTO resumen = dashboardService.obtenerResumenDashboard();
        return ResponseEntity.ok(resumen);
    }

    /**
     * Obtiene solo las estadísticas generales (KPIs)
     * 
     * GET /api/dashboard/estadisticas
     * 
     * @return JSON con totalIngresos, totalReservas, habitacionesDisponibles, etc.
     */
    @GetMapping("/estadisticas")
    @PreAuthorize("hasAnyRole('ADMIN', 'GERENTE')")
    public ResponseEntity<EstadisticasGeneralesDTO> obtenerEstadisticasGenerales() {
        EstadisticasGeneralesDTO estadisticas = dashboardService.obtenerEstadisticasGenerales();
        return ResponseEntity.ok(estadisticas);
    }

    /**
     * Obtiene la ocupación mensual de los últimos 12 meses
     * 
     * GET /api/dashboard/ocupacion-mensual
     * 
     * @return Lista con datos de ocupación mes por mes
     */
    @GetMapping("/ocupacion-mensual")
    @PreAuthorize("hasAnyRole('ADMIN', 'GERENTE')")
    public ResponseEntity<List<OcupacionMensualDTO>> obtenerOcupacionMensual() {
        List<OcupacionMensualDTO> ocupacion = dashboardService.obtenerOcupacionMensualUltimos12Meses();
        return ResponseEntity.ok(ocupacion);
    }

    /**
     * Obtiene ocupación para un mes específico
     * 
     * GET /api/dashboard/ocupacion-mensual/mes?mes=2&año=2026
     * 
     * @param mes Mes (1-12)
     * @param año Año (ej: 2026)
     * @return Datos de ocupación del mes solicitado
     */
    @GetMapping("/ocupacion-mensual/mes")
    @PreAuthorize("hasAnyRole('ADMIN', 'GERENTE')")
    public ResponseEntity<OcupacionMensualDTO> obtenerOcupacionPorMes(
            @RequestParam Integer mes,
            @RequestParam Integer año) {
        OcupacionMensualDTO ocupacion = dashboardService.obtenerOcupacionPorMes(mes, año);
        return ResponseEntity.ok(ocupacion);
    }

    /**
     * Obtiene el top de habitaciones más reservadas
     * 
     * GET /api/dashboard/top-habitaciones?limite=5
     * 
     * @param limite Cantidad de habitaciones a retornar (default: 5)
     * @return Lista con el ranking de habitaciones
     */
    @GetMapping("/top-habitaciones")
    @PreAuthorize("hasAnyRole('ADMIN', 'GERENTE')")
    public ResponseEntity<List<TopHabitacionDTO>> obtenerTopHabitaciones(
            @RequestParam(defaultValue = "5") Integer limite) {
        List<TopHabitacionDTO> topHabitaciones = dashboardService.obtenerTopHabitaciones(limite);
        return ResponseEntity.ok(topHabitaciones);
    }
}
