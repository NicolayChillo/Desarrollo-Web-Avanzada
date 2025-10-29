import React, { useEffect, useState } from "react";
import empleadosService from "../services/empleadosService";

const Estadisticas = () => {
  const [stats, setStats] = useState(null);
  const [cargando, setCargando] = useState(false);

  const cargar = async () => {
    try {
      setCargando(true);
      const data = await empleadosService.estadisticas();
      setStats(data);
    } catch (err) {
      console.error("Error al obtener estadísticas:", err);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargar();
  }, []);

  if (cargando) return <p>Cargando estadísticas...</p>;
  if (!stats) return <p>No hay estadísticas disponibles.</p>;

  return (
    <div className="estadisticas">
      <h2>Estadísticas de la empresa</h2>
      <p>Total empleados: {stats.totalEmpleados}</p>
      <p>Total horas (semana): {stats.totalHorasSemana}</p>
      <p>Total pago semanal: ${Math.round((stats.totalPagoSemanal || 0) * 100) / 100}</p>
      <p>Promedio horas por empleado: {stats.promedioHorasPorEmpleado}</p>

      <h3>Detalle por empleado</h3>
      <table>
        <thead>
          <tr>
            <th>Id</th>
            <th>Nombre</th>
            <th>Horas</th>
            <th>Días laborados</th>
            <th>Salario semanal</th>
          </tr>
        </thead>
        <tbody>
          {(stats.empleados || []).map((e) => (
            <tr key={e.id}>
              <td>{e.id}</td>
              <td>{e.nombre}</td>
              <td>{e.totalHoras}</td>
              <td>{e.diasLaborados}</td>
              <td>${Math.round((e.salarioSemanal || 0) * 100) / 100}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <button onClick={cargar} style={{ marginTop: 12 }}>
        Actualizar
      </button>
    </div>
  );
};

export default Estadisticas;
