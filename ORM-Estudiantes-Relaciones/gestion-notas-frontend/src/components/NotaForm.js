import React, { useEffect, useState } from "react";
import asignaturasService from "../services/asignaturasService";
import notasService from "../services/notasService";

const NotaForm = ({ idEstudiante, notaSeleccionada, onGuardado, onCancel }) => {
  const [asignaturas, setAsignaturas] = useState([]);
  const [idAsignatura, setIdAsignatura] = useState("");
  const [nota1, setNota1] = useState(0);
  const [nota2, setNota2] = useState(0);
  const [nota3, setNota3] = useState(0);

  useEffect(() => {
    cargarAsignaturas();
  }, []);

  useEffect(() => {
    if (notaSeleccionada) {
      setIdAsignatura(notaSeleccionada.idAsignatura || "");
      setNota1(notaSeleccionada.nota1 || 0);
      setNota2(notaSeleccionada.nota2 || 0);
      setNota3(notaSeleccionada.nota3 || 0);
    } else {
      // si no hay selección, precargar asignatura si existe
      if (asignaturas.length && !idAsignatura) setIdAsignatura(asignaturas[0].id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [notaSeleccionada, asignaturas]);

  const cargarAsignaturas = async () => {
    try {
      const data = await asignaturasService.listar();
      setAsignaturas(data);
      if (data.length && !idAsignatura) setIdAsignatura(data[0].id);
    } catch (err) {
      console.error("Error al cargar asignaturas:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (notaSeleccionada) {
        await notasService.actualizar(notaSeleccionada.id, { idAsignatura, nota1: Number(nota1), nota2: Number(nota2), nota3: Number(nota3) });
      } else {
        await notasService.crear({ idEstudiante, idAsignatura, nota1: Number(nota1), nota2: Number(nota2), nota3: Number(nota3) });
      }
      setNota1(0); setNota2(0); setNota3(0);
      if (onGuardado) onGuardado();
    } catch (err) {
      console.error("Error al guardar nota:", err);
      alert(err?.response?.data?.mensaje || "Error al guardar nota");
    }
  };

  return (
    <div className="nota-form">
      <h3>{notaSeleccionada ? `Editar nota #${notaSeleccionada.id}` : `Registrar nota para estudiante #${idEstudiante}`}</h3>
      <form onSubmit={handleSubmit}>
        <label>Asignatura:</label>
        <select value={idAsignatura} onChange={(e) => setIdAsignatura(e.target.value)}>
          {asignaturas.map(a => (
            <option key={a.id} value={a.id}>{a.nombreAsignatura}</option>
          ))}
        </select>

        <label>Nota 1 (0-20):</label>
        <input type="number" min="0" max="20" step="0.01" value={nota1} onChange={(e) => setNota1(e.target.value)} required />

        <label>Nota 2 (0-20):</label>
        <input type="number" min="0" max="20" step="0.01" value={nota2} onChange={(e) => setNota2(e.target.value)} required />

        <label>Nota 3 (0-20):</label>
        <input type="number" min="0" max="20" step="0.01" value={nota3} onChange={(e) => setNota3(e.target.value)} required />

        <div style={{ marginTop: 8 }}>
          <button type="submit">{notaSeleccionada ? 'Actualizar' : 'Registrar'}</button>
          {onCancel && <button type="button" onClick={onCancel} style={{ marginLeft: 8, background: '#6c757d' }}>Cancelar</button>}
        </div>
      </form>
    </div>
  );
};

export default NotaForm;
