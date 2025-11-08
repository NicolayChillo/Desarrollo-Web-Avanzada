import React, { useEffect, useState } from "react";
import estudiantesService from "../services/estudiantesService";

const EstudianteList = ({ onSelectEstudiante, onEditEstudiante }) => {
  const [estudiantes, setEstudiantes] = useState([]);

  useEffect(() => {
    cargarEstudiantes();
  }, []);

  const cargarEstudiantes = async () => {
    try {
      const data = await estudiantesService.listar();
      setEstudiantes(data);
    } catch (err) {
      console.error("Error al cargar estudiantes:", err);
    }
  };

  const eliminar = async (id) => {
    if (!window.confirm("¿Eliminar este estudiante?")) return;
    try {
      await estudiantesService.eliminar(id);
      cargarEstudiantes();
    } catch (err) {
      console.error("Error al eliminar estudiante:", err);
    }
  };

  return (
    <div className="estudiante-list">
      <h2>Lista de Estudiantes</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Carrera</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {estudiantes.map((e) => (
            <tr key={e.id}>
              <td>{e.id}</td>
              <td>{e.nombreEstudiante}</td>
              <td>{e.carrera}</td>
              <td className="actions estudiante-actions">
                <button className="icon-btn btn-primary" title="Ver" onClick={() => onSelectEstudiante(e)}>📋</button>
                <button className="icon-btn btn-primary" title="Editar" onClick={() => onEditEstudiante(e)}>✏️</button>
                <button className="icon-btn btn-danger" title="Eliminar" onClick={() => eliminar(e.id)}>🗑️</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EstudianteList;
