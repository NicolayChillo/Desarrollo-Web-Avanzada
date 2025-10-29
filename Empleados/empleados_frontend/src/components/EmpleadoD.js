import React, { useEffect, useState, useCallback } from "react";
import empleadosService from "../services/empleadosService";
import EmpleadoHoras from "./EmpleadoHoras";

const EmpleadoD = ({ empleado, onRefrescar }) => {
  const [detalle, setDetalle] = useState(null);
  const [mostrarHoras, setMostrarHoras] = useState(false);
  const [salarioData, setSalarioData] = useState(null);
  const [salarioLoading, setSalarioLoading] = useState(false);

  const cargarDetalle = useCallback(async () => {
    if (!empleado) return;
    try {
      const data = await empleadosService.resumenSemana(empleado.id);
      setDetalle(data);
    } catch (error) {
      console.error("Error al cargar detalle:", error);
    }
  }, [empleado]);

  useEffect(() => {
    if (empleado) cargarDetalle();
  }, [empleado, cargarDetalle]);

  const verSalario = async () => {
    try {
      setSalarioLoading(true);
      const data = await empleadosService.salario(empleado.id);
      const salarioSemana = Math.round((data.salarioSemanal || data.salario || 0) * 100) / 100;
      setSalarioData({ salarioSemana, totalHoras: data.totalHoras || 0 });
      setSalarioLoading(false);
    } catch (err) {
      console.error("Error al calcular salario:", err);
      setSalarioLoading(false);
      setSalarioData({ error: err?.response?.data?.message || 'Error al calcular salario' });
    }
  };

  if (!empleado) return <p>Selecciona un empleado para ver detalles.</p>;
  if (!detalle) return <p>Cargando detalle...</p>;

  return (
    <div className="empleado-detalle">
      <h2>Resumen Semanal - {empleado.nombre}</h2>
      <p>Pago por hora: ${empleado.pago_hora}</p>
      <p>Horas totales: {detalle.totalHoras}</p>
      <p>Salario semanal: ${detalle.salarioSemana}</p>
      <h3>Horas por día:</h3>
      <ul>
        {detalle.dias.map((d) => (
          <li key={d.fecha}>
            {d.dia} ({d.fecha}): {d.horas} horas
          </li>
        ))}
      </ul>

      <div style={{ marginTop: 12 }}>
        <button onClick={() => setMostrarHoras((s) => !s)}>
          {mostrarHoras ? "Ocultar registros" : "Registrar / Ver horas"}
        </button>
        <button onClick={verSalario} style={{ marginLeft: 8 }}>
          Calcular salario
        </button>
      </div>

      {salarioLoading && <p>Cálculo en curso...</p>}
      {salarioData && (
        <div style={{ marginTop: 8 }}>
          {salarioData.error ? (
            <p style={{ color: 'red' }}>{salarioData.error}</p>
          ) : (
            <p>
              <strong>Salario semanal:</strong> ${salarioData.salarioSemana} — <strong>Horas:</strong> {salarioData.totalHoras}
            </p>
          )}
        </div>
      )}

      {mostrarHoras && (
        <div style={{ marginTop: 12 }}>
          <EmpleadoHoras
            empleadoId={empleado.id}
            onGuardado={() => {
              cargarDetalle();
              if (onRefrescar) onRefrescar();
            }}
          />
        </div>
      )}
    </div>
  );
};

export default EmpleadoD;