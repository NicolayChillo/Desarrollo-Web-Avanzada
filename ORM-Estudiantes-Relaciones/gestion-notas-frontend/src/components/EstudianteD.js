import React, { useEffect, useState, useCallback } from "react";
import notasService from "../services/notasService";
import NotaForm from "./NotaForm";

const EstudianteD = ({ estudiante, onRefrescar }) => {
  const [notas, setNotas] = useState([]);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [notaEdit, setNotaEdit] = useState(null);

  const cargarNotas = useCallback(async () => {
    if (!estudiante) return;
    try {
      const data = await notasService.listar();
      const studentId = Number(estudiante.idEstudiante ?? estudiante.id);
      const filtradas = (data || []).filter(n => Number(n.idEstudiante) === studentId || Number(n.idEstudiante) === studentId);
      setNotas(filtradas);
    } catch (err) {
      console.error("Error al cargar notas:", err);
    }
  }, [estudiante]);

  useEffect(() => {
    if (estudiante) cargarNotas();
    else setNotas([]);
  }, [estudiante, cargarNotas]);

  const eliminarNota = async (id) => {
    if (!window.confirm("Eliminar esta nota?")) return;
    try {
      await notasService.eliminar(id);
      await cargarNotas();
      if (onRefrescar) onRefrescar();
    } catch (err) {
      console.error("Error al eliminar nota:", err);
    }
  };

  const abrirEditar = (nota) => {
    setNotaEdit(nota);
    setMostrarForm(true);
  };

  if (!estudiante) return <p className="empty">Selecciona un estudiante para ver detalles.</p>;

  return (
    <div className="estudiante-detalle">
      <h2>{estudiante.nombreEstudiante}</h2>
      <p className="small">Carrera: {estudiante.carrera}</p>

      <div style={{ marginTop: 12 }}>
        <button onClick={() => { setNotaEdit(null); setMostrarForm((s) => !s); }}>
          {mostrarForm ? "Ocultar formulario" : "Registrar nota"}
        </button>
      </div>

      {mostrarForm && (
        <div style={{ marginTop: 12 }}>
          <NotaForm
            idEstudiante={estudiante.idEstudiante ?? estudiante.id}
            notaSeleccionada={notaEdit}
            onGuardado={async () => { await cargarNotas(); setMostrarForm(false); setNotaEdit(null); if (onRefrescar) onRefrescar(); }}
            onCancel={() => { setMostrarForm(false); setNotaEdit(null); }}
          />
        </div>
      )}

      <h3 style={{ marginTop: 12 }}>Notas</h3>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Asignatura</th>
            <th>Nota1</th>
            <th>Nota2</th>
            <th>Nota3</th>
            <th>Promedio</th>
            <th>Categoría</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {notas.map((n) => (
            <tr key={n.id}>
              <td>{n.id}</td>
              <td>{n.Asignatura?.nombreAsignatura || n.idAsignatura}</td>
              <td>{n.nota1}</td>
              <td>{n.nota2}</td>
              <td>{n.nota3}</td>
              <td>{n.promedio}</td>
              <td>{n.categoria}</td>
              <td className="actions notas-actions">
                <button className="icon-btn btn-primary" title="Editar" onClick={() => abrirEditar(n)}>✏️</button>
                <button className="icon-btn btn-danger" title="Eliminar" onClick={() => eliminarNota(n.id)}>🗑️</button>
              </td>
            </tr>
          ))}
          {notas.length === 0 && (
            <tr><td colSpan={8} className="empty">No hay notas registradas para este estudiante.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default EstudianteD;
