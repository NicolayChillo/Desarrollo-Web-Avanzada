import React, { useEffect, useState } from "react";
import asignaturasService from "../services/asignaturasService";
import AsignaturaForm from "./AsignaturaForm";

const AsignaturaList = () => {
  const [asignaturas, setAsignaturas] = useState([]);
  const [edit, setEdit] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const cargar = async () => {
    try {
      const data = await asignaturasService.listar();
      setAsignaturas(data);
    } catch (err) { console.error(err); }
  };

  useEffect(() => { cargar(); }, []);

  const eliminar = async (id) => {
    if (!window.confirm("Eliminar asignatura?")) return;
    try { await asignaturasService.eliminar(id); cargar(); } catch (err) { console.error(err); }
  };

  return (
    <div className="asignatura-list">
      <h2>Asignaturas</h2>
      <button onClick={() => { setEdit(null); setShowForm((s)=>!s); }} style={{ marginBottom: 8 }}>{showForm? 'Ocultar' : 'Nueva asignatura'}</button>
      {showForm && <AsignaturaForm asignaturaSeleccionada={edit} onGuardar={() => { cargar(); setShowForm(false); }} />}

      <table>
        <thead>
          <tr><th>ID</th><th>Nombre</th><th>Créditos</th><th>Docente</th><th>Acciones</th></tr>
        </thead>
        <tbody>
          {asignaturas.map(a => (
            <tr key={a.id}><td>{a.id}</td><td>{a.nombreAsignatura}</td><td>{a.creditos}</td><td>{a.Docente?.nombreDocente || '-'}</td><td>
              <button className="icon-btn btn-primary" title="Editar asignatura" onClick={() => { setEdit(a); setShowForm(true); }}>✏️</button>
              <button className="icon-btn btn-danger" title="Eliminar asignatura" onClick={() => eliminar(a.id)}>🗑️</button>
            </td></tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AsignaturaList;
