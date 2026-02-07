package com.proyecto.backend_reservas_hoteleria.service;

import com.proyecto.backend_reservas_hoteleria.dto.dashboard.DashboardResumenDTO;
import com.proyecto.backend_reservas_hoteleria.dto.dashboard.EstadisticasGeneralesDTO;
import com.proyecto.backend_reservas_hoteleria.dto.dashboard.OcupacionMensualDTO;
import com.proyecto.backend_reservas_hoteleria.dto.dashboard.TopHabitacionDTO;
import com.proyecto.backend_reservas_hoteleria.model.enums.EstadoHabitacion;
import com.proyecto.backend_reservas_hoteleria.model.enums.EstadoReserva;
import com.proyecto.backend_reservas_hoteleria.repository.HabitacionRepository;
import com.proyecto.backend_reservas_hoteleria.repository.ReservaRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Servicio que gestiona la lógica de negocio del Dashboard
 * Procesa datos de reservas y habitaciones para generar reportes
 */
@Service
public class DashboardService {

    private final ReservaRepository reservaRepository;
    private final HabitacionRepository habitacionRepository;

    public DashboardService(ReservaRepository reservaRepository, 
                            HabitacionRepository habitacionRepository) {
        this.reservaRepository = reservaRepository;
        this.habitacionRepository = habitacionRepository;
    }

    /**
     * MÉTODO PRINCIPAL: Obtiene todos los datos del dashboard en una sola llamada
     * @return Objeto con estadísticas, ocupación y top habitaciones
     */
    public DashboardResumenDTO obtenerResumenDashboard() {
        DashboardResumenDTO dashboard = new DashboardResumenDTO();
        
        dashboard.setEstadisticasGenerales(obtenerEstadisticasGenerales());
        dashboard.setOcupacionMensual(obtenerOcupacionMensualUltimos12Meses());
        dashboard.setTopHabitaciones(obtenerTopHabitaciones(5)); // Top 5
        
        return dashboard;
    }

    /**
     * Calcula todas las estadísticas generales (KPIs)
     */
    public EstadisticasGeneralesDTO obtenerEstadisticasGenerales() {
        EstadisticasGeneralesDTO estadisticas = new EstadisticasGeneralesDTO();
        
        // 1. Total ingresos históricos (todas las reservas confirmadas)
        BigDecimal totalIngresos = reservaRepository.obtenerTotalIngresos();
        estadisticas.setTotalIngresos(totalIngresos != null ? totalIngresos : BigDecimal.ZERO);
        
        // 2. Ingresos del mes actual
        LocalDate hoy = LocalDate.now();
        BigDecimal ingresosMes = reservaRepository.obtenerIngresosPorMesYAño(
            hoy.getMonthValue(), 
            hoy.getYear()
        );
        estadisticas.setTotalIngresosMes(ingresosMes != null ? ingresosMes : BigDecimal.ZERO);
        
        // 3. Total de reservas (todas)
        long totalReservas = reservaRepository.count();
        estadisticas.setTotalReservas(totalReservas);
        
        // 4. Total de reservas confirmadas
        long reservasConfirmadas = reservaRepository.findByEstado(EstadoReserva.CONFIRMADA).size();
        estadisticas.setTotalReservasConfirmadas(reservasConfirmadas);
        
        // 5. Total de habitaciones
        long totalHabitaciones = habitacionRepository.count();
        estadisticas.setTotalHabitaciones(totalHabitaciones);
        
        // 6. Habitaciones disponibles (estado = DISPONIBLE)
        long habitacionesDisponibles = habitacionRepository
                .findAll()
                .stream()
                .filter(h -> h.getEstado() == EstadoHabitacion.DISPONIBLE)
                .count();
        estadisticas.setHabitacionesDisponibles(habitacionesDisponibles);
        
        // 7. Tasa de ocupación promedio histórica
        Double tasaOcupacion = calcularTasaOcupacionPromedio();
        estadisticas.setTasaOcupacionPromedio(tasaOcupacion);
        
        return estadisticas;
    }

    /**
     * Obtiene la ocupación mensual de los últimos 12 meses
     * Calcula el porcentaje de ocupación para cada mes
     */
    public List<OcupacionMensualDTO> obtenerOcupacionMensualUltimos12Meses() {
        List<OcupacionMensualDTO> ocupacionList = new ArrayList<>();
        
        long totalHabitaciones = habitacionRepository.count();
        
        // Generar los últimos 12 meses
        for (int i = 11; i >= 0; i--) {
            YearMonth yearMonth = YearMonth.now().minusMonths(i);
            int mes = yearMonth.getMonthValue();
            int año = yearMonth.getYear();
            
            // Obtener datos del mes
            BigDecimal ingresos = reservaRepository.obtenerIngresosPorMesYAño(mes, año);
            Long diasOcupados = reservaRepository.obtenerDiasOcupadosPorMes(mes, año);
            
            if (diasOcupados == null) {
                diasOcupados = 0L;
            }
            
            // Calcular porcentaje de ocupación
            // Fórmula: (días ocupados / (total habitaciones * días del mes)) * 100
            int diasEnMes = yearMonth.atEndOfMonth().getDayOfMonth();
            Double porcentajeOcupacion = totalHabitaciones > 0 
                ? (double) diasOcupados / (totalHabitaciones * diasEnMes) * 100 
                : 0.0;
            
            OcupacionMensualDTO ocupacion = new OcupacionMensualDTO();
            ocupacion.setMes(mes);
            ocupacion.setAño(año);
            ocupacion.setHabitacionesOcupadas(diasOcupados);
            ocupacion.setTotalHabitaciones(totalHabitaciones);
            ocupacion.setPorcentajeOcupacion(Math.min(100.0, porcentajeOcupacion)); // Max 100%
            ocupacion.setLabel(obtenerNombreMes(mes) + " " + año);
            
            ocupacionList.add(ocupacion);
        }
        
        return ocupacionList;
    }

    /**
     * Obtiene el top de habitaciones más reservadas
     * @param limite Cantidad de habitaciones a retornar (ej: top 5)
     */
    public List<TopHabitacionDTO> obtenerTopHabitaciones(int limite) {
        List<Object[]> resultados = reservaRepository.obtenerTopHabitacionesReservadas();
        
        return resultados.stream()
                .limit(limite)
                .map(row -> {
                    // Convertir el array de objetos en DTO
                    TopHabitacionDTO dto = new TopHabitacionDTO();
                    dto.setIdHabitacion((Long) row[0]);
                    dto.setCodigoHabitacion((String) row[1]);
                    dto.setTipoHabitacion(row[2] != null ? row[2].toString() : "N/A");
                    dto.setCantidadReservas((Long) row[3]);
                    dto.setIngresosTotales((BigDecimal) row[4]);
                    
                    // Calcular ingreso promedio
                    BigDecimal ingresoPromedio = BigDecimal.ZERO;
                    if (dto.getCantidadReservas() > 0) {
                        ingresoPromedio = dto.getIngresosTotales()
                                .divide(BigDecimal.valueOf(dto.getCantidadReservas()), 
                                       2, 
                                       RoundingMode.HALF_UP);
                    }
                    dto.setIngresoPromedio(ingresoPromedio);
                    
                    return dto;
                })
                .collect(Collectors.toList());
    }

    /**
     * Obtiene datos de ocupación para un mes específico
     */
    public OcupacionMensualDTO obtenerOcupacionPorMes(Integer mes, Integer año) {
        Long diasOcupados = reservaRepository.obtenerDiasOcupadosPorMes(mes, año);
        long totalHabitaciones = habitacionRepository.count();
        
        if (diasOcupados == null) {
            diasOcupados = 0L;
        }
        
        YearMonth yearMonth = YearMonth.of(año, mes);
        int diasEnMes = yearMonth.atEndOfMonth().getDayOfMonth();
        
        Double porcentajeOcupacion = totalHabitaciones > 0 
            ? (double) diasOcupados / (totalHabitaciones * diasEnMes) * 100 
            : 0.0;
        
        OcupacionMensualDTO ocupacion = new OcupacionMensualDTO();
        ocupacion.setMes(mes);
        ocupacion.setAño(año);
        ocupacion.setHabitacionesOcupadas(diasOcupados);
        ocupacion.setTotalHabitaciones(totalHabitaciones);
        ocupacion.setPorcentajeOcupacion(Math.min(100.0, porcentajeOcupacion));
        ocupacion.setLabel(obtenerNombreMes(mes) + " " + año);
        
        return ocupacion;
    }

    /**
     * Calcula la tasa de ocupación promedio de todos los meses con datos
     */
    private Double calcularTasaOcupacionPromedio() {
        List<Object[]> resultados = reservaRepository.obtenerOcupacionMensual();
        
        if (resultados.isEmpty()) {
            return 0.0;
        }
        
        long totalHabitaciones = habitacionRepository.count();
        if (totalHabitaciones == 0) {
            return 0.0;
        }
        
        double sumaOcupacion = 0.0;
        
        // Calcular porcentaje de cada mes y promediar
        for (Object[] row : resultados) {
            Integer mes = ((Number) row[0]).intValue();
            Integer año = ((Number) row[1]).intValue();
            
            YearMonth yearMonth = YearMonth.of(año, mes);
            int diasEnMes = yearMonth.atEndOfMonth().getDayOfMonth();
            
            Long diasOcupados = reservaRepository.obtenerDiasOcupadosPorMes(mes, año);
            if (diasOcupados == null) {
                diasOcupados = 0L;
            }
            
            double porcentaje = (double) diasOcupados / (totalHabitaciones * diasEnMes) * 100;
            sumaOcupacion += Math.min(100.0, porcentaje);
        }
        
        return sumaOcupacion / resultados.size();
    }

    /**
     * Helper: Convierte número de mes a nombre en español
     */
    private String obtenerNombreMes(Integer mes) {
        String[] meses = {
            "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
            "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
        };
        return mes >= 1 && mes <= 12 ? meses[mes - 1] : "Mes inválido";
    }
}
