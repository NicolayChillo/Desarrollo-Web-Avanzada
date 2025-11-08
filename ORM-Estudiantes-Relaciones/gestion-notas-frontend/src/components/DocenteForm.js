import React, { useState } from "react";
import docentesService from "../services/docentesService";

const DocenteForm = ({ docenteSeleccionado, onGuardar }) => {
  const [nombre, setNombre] = useState(docenteSeleccionado?.nombreDocente || "");
  const [departamento, setDepartamento] = useState(docenteSeleccionado?.departamento || "");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { nombreDocente: nombre, departamento };
      if (docenteSeleccionado) await docentesService.actualizar(docenteSeleccionado.id, payload);
      else await docentesService.crear(payload);
      if (onGuardar) onGuardar();
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.mensaje || 'Error al guardar docente');
    }
  };

  return (
    <div className="docente-form">
      <h3>{docenteSeleccionado ? 'Editar docente' : 'Nuevo docente'}</h3>
      <form onSubmit={handleSubmit}>
        <label>Nombre:</label>
        <input value={nombre} onChange={(e) => setNombre(e.target.value)} required />

        <label>Departamento:</label>
        <input value={departamento} onChange={(e) => setDepartamento(e.target.value)} required />

        <div style={{ marginTop: 8 }}>
          <button type="submit">Guardar</button>
        </div>
      </form>
    </div>
  );
};

export default DocenteForm;
