import React, { useState } from "react";
import asignaturasService from "../services/asignaturasService";
import docentesService from "../services/docentesService";

const AsignaturaForm = ({ asignaturaSeleccionada, onGuardar }) => {
  const [nombre, setNombre] = useState(asignaturaSeleccionada?.nombreAsignatura || "");
  const [creditos, setCreditos] = useState(asignaturaSeleccionada?.creditos || 3);
  const [idDocente, setIdDocente] = useState(asignaturaSeleccionada?.idDocente || "");
  const [docentes, setDocentes] = useState([]);

  React.useEffect(() => {
    docentesService.listar().then(setDocentes).catch(console.error);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { nombreAsignatura: nombre, creditos: Number(creditos), idDocente: idDocente || null };
      if (asignaturaSeleccionada) await asignaturasService.actualizar(asignaturaSeleccionada.id, payload);
      else await asignaturasService.crear(payload);
      if (onGuardar) onGuardar();
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.mensaje || "Error al guardar asignatura");
    }
  };

  return (
    <div className="asignatura-form">
      <h3>{asignaturaSeleccionada ? "Editar asignatura" : "Nueva asignatura"}</h3>
      <form onSubmit={handleSubmit}>
        <label>Nombre:</label>
        <input value={nombre} onChange={(e) => setNombre(e.target.value)} required />

        <label>Créditos:</label>
        <input type="number" min="1" value={creditos} onChange={(e) => setCreditos(e.target.value)} required />

        <label>Docente (opcional):</label>
        <select value={idDocente} onChange={(e) => setIdDocente(e.target.value)}>
          <option value="">-- Ninguno --</option>
          {docentes.map(d => (
            <option key={d.id} value={d.id}>{d.nombreDocente}</option>
          ))}
        </select>

        <div style={{ marginTop: 8 }}>
          <button type="submit">Guardar</button>
        </div>
      </form>
    </div>
  );
};

export default AsignaturaForm;
