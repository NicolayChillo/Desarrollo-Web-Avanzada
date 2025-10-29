import React, { useEffect, useState } from "react";
import empleadosService from "../services/empleadosService";

const EmpleadoHoras = ({ empleadoId, onGuardado }) => {
  const [registros, setRegistros] = useState([]);
  const [fecha, setFecha] = useState("");
  const [horas, setHoras] = useState(0);
  const [cargando, setCargando] = useState(false);
  const [lastRegistro, setLastRegistro] = useState(null);

  useEffect(() => {
    if (empleadoId) cargarRegistros();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [empleadoId]);

  const cargarRegistros = async () => {
    try {
      setCargando(true);
      const data = await empleadosService.obtenerRegistros(empleadoId);
      const regs = data.registros || [];
      setRegistros(regs);
      setLastRegistro(regs.length ? regs[regs.length - 1] : null);
      // si no hay fecha seleccionada, prellenar con hoy
      if (!fecha) setFecha(formatDate(new Date()));
    } catch (err) {
      console.error("Error al cargar registros:", err);
    } finally {
      setCargando(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!fecha) return alert("Selecciona una fecha");
    // Validación: horas deben estar entre 0 y 24 (horas laborales por día)
    const horasNum = parseFloat(horas || 0);
    if (isNaN(horasNum) || horasNum < 0) return alert("Ingresa un número de horas válido (>= 0)");
    if (horasNum > 24) return alert("No se puede registrar más de 24 horas en un día");

    try {
      await empleadosService.registrarHoras(empleadoId, { fecha, horas });
      // Mantener la fecha para permitir registros rápidos sucesivos; limpiar horas para evitar reenvíos accidentales
      setHoras(0);
      cargarRegistros();
      if (onGuardado) onGuardado();
    } catch (err) {
      console.error("Error al guardar registro:", err);
      alert(err?.response?.data?.message || "Error al guardar registro");
    }
  };

  // Helpers para fechas
  const formatDate = (d) => {
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };

  // Helpers para fechas (se usa formatDate para prefill)

  return (
    <div className="empleado-horas">
      <h3>Registros de horas</h3>
      {lastRegistro && (
        <p style={{ fontSize: 12, color: '#555' }}>Último: {lastRegistro.fecha} — {lastRegistro.horas}h</p>
      )}
      {cargando ? (
        <p>Cargando registros...</p>
      ) : (
        <div>
          <form onSubmit={handleSubmit} style={{ marginBottom: 12 }}>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 6 }}>
              <div>
                <label>Fecha:</label>
                <input
                  type="date"
                  value={fecha}
                  onChange={(e) => setFecha(e.target.value)}
                  required
                />
              </div>

              {/* botones rápidos de fecha eliminados por simplicidad */}
            </div>

            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <div>
                <label>Horas:</label>
                <input
                  type="number"
                  min="0"
                  max="24"
                  step="0.25"
                  value={horas}
                  onChange={(e) => setHoras(parseFloat(e.target.value))}
                  required
                />
              </div>

              <div>
                <button type="submit">Registrar</button>
              </div>
            </div>

          </form>

          <table>
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Día</th>
                <th>Horas</th>
              </tr>
            </thead>
            <tbody>
              {registros.map((r) => (
                <tr key={r.id || r.fecha}>
                  <td>{r.fecha}</td>
                  <td>{r.dia}</td>
                  <td>{r.horas}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default EmpleadoHoras;
