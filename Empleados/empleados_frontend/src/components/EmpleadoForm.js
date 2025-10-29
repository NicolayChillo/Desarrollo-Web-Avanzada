// src/components/EmpleadoForm.js
import React, { useState, useEffect } from "react";
import empleadosService from "../services/empleadosService";

const EmpleadoForm = ({ empleadoSeleccionado, onGuardar }) => {
  const [nombre, setNombre] = useState("");
  const [pagoHora, setPagoHora] = useState("");

  useEffect(() => {
    if (empleadoSeleccionado) {
      setNombre(empleadoSeleccionado.nombre);
      setPagoHora(empleadoSeleccionado.pago_hora);
    } else {
      setNombre("");
      setPagoHora("");
    }
  }, [empleadoSeleccionado]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (empleadoSeleccionado) {
        await empleadosService.actualizar(empleadoSeleccionado.id, {
          nombre,
          pago_hora: parseFloat(pagoHora),
        });
      } else {
        await empleadosService.crear({
          nombre,
          pago_hora: parseFloat(pagoHora),
        });
      }
      onGuardar();
    } catch (error) {
      console.error("Error al guardar empleado:", error);
    }
  };

  return (
    <div className="empleado-form">
      <h2>{empleadoSeleccionado ? "Editar Empleado" : "Nuevo Empleado"}</h2>
      <form onSubmit={handleSubmit}>
        <label>Nombre:</label>
        <input
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
        />
        <label>Pago por hora ($):</label>
        <input
          type="number"
          value={pagoHora}
          onChange={(e) => setPagoHora(e.target.value)}
          required
        />
        <button type="submit">💾 Guardar</button>
      </form>
    </div>
  );
};

export default EmpleadoForm;