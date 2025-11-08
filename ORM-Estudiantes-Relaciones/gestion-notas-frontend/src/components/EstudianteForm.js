import React, { useState, useEffect } from "react";
import estudiantesService from "../services/estudiantesService";

const EstudianteForm = ({ estudianteSeleccionado, onGuardar }) => {
  const [nombre, setNombre] = useState("");
  const [carrera, setCarrera] = useState("");

  useEffect(() => {
    if (estudianteSeleccionado) {
      setNombre(estudianteSeleccionado.nombreEstudiante || "");
      setCarrera(estudianteSeleccionado.carrera || "");
    } else {
      setNombre("");
      setCarrera("");
    }
  }, [estudianteSeleccionado]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { nombreEstudiante: nombre, carrera };
      if (estudianteSeleccionado) {
        await estudiantesService.actualizar(estudianteSeleccionado.id, payload);
      } else {
        await estudiantesService.crear(payload);
      }
      if (onGuardar) onGuardar();
    } catch (err) {
      console.error("Error al guardar estudiante:", err);
      alert(err?.response?.data?.mensaje || "Error al guardar estudiante");
    }
  };

  return (
    <div className="estudiante-form">
      <h2>{estudianteSeleccionado ? "Editar Estudiante" : "Nuevo Estudiante"}</h2>
      <form onSubmit={handleSubmit}>
        <label>Nombre del estudiante:</label>
        <input
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
        />

        <label>Carrera:</label>
        <input
          type="text"
          value={carrera}
          onChange={(e) => setCarrera(e.target.value)}
          required
        />

        <button type="submit">💾 Guardar</button>
      </form>
    </div>
  );
};

export default EstudianteForm;
