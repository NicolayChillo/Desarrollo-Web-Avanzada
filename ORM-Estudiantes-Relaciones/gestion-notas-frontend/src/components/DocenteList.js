import React, { useEffect, useState } from "react";
import docentesService from "../services/docentesService";
import DocenteForm from "./DocenteForm";

const DocenteList = () => {
  const [docentes, setDocentes] = useState([]);
  const [edit, setEdit] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const cargar = async () => {
    try { const data = await docentesService.listar(); setDocentes(data); } catch (err) { console.error(err); }
  };

  useEffect(() => { cargar(); }, []);

  const eliminar = async (id) => {
    if (!window.confirm('Eliminar docente?')) return;
    try { await docentesService.eliminar(id); cargar(); } catch (err) { console.error(err); }
  };

  return (
    <div className="docente-list">
      <h2>Docentes</h2>
      <button onClick={() => { setEdit(null); setShowForm((s)=>!s); }} style={{ marginBottom: 8 }}>{showForm? 'Ocultar' : 'Nuevo docente'}</button>
      {showForm && <DocenteForm docenteSeleccionado={edit} onGuardar={() => { cargar(); setShowForm(false); }} />}

      <table>
        <thead><tr><th>ID</th><th>Nombre</th><th>Departamento</th><th>Acciones</th></tr></thead>
        <tbody>
          {docentes.map(d => (
            <tr key={d.id}><td>{d.id}</td><td>{d.nombreDocente}</td><td>{d.departamento}</td><td>
              <button className="icon-btn btn-primary" title="Editar docente" onClick={() => { setEdit(d); setShowForm(true); }}>✏️</button>
              <button className="icon-btn btn-danger" title="Eliminar docente" onClick={() => eliminar(d.id)}>🗑️</button>
            </td></tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DocenteList;
