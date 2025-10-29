import React, { useEffect, useState } from "react";
import empleadosService from "../services/empleadosService";

const EmpleadoList = ({ onSelectEmpleado, onEditEmpleado }) => {
  const [empleados, setEmpleados] = useState([]);
  const [salarioMap, setSalarioMap] = useState({}); 

  useEffect(() => {
    cargarEmpleados();
  }, []);

  const cargarEmpleados = async () => {
    try {
      const data = await empleadosService.listar();
      setEmpleados(data);
    } catch (error) {
      console.error("Error al cargar empleados:", error);
    }
  };

  const eliminarEmpleado = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar este empleado?")) return;
    try {
      await empleadosService.eliminar(id);
      cargarEmpleados();
    } catch (error) {
      console.error("Error al eliminar:", error);
    }
  };

  const calcularSalario = async (id) => {
    try {
      setSalarioMap((s) => ({ ...s, [id]: { loading: true } }));
      const data = await empleadosService.salario(id);
      const value = Math.round((data.salarioSemanal || data.salario || 0) * 100) / 100;
      setSalarioMap((s) => ({ ...s, [id]: { value, loading: false, updatedAt: Date.now() } }));

      setTimeout(() => {
        setSalarioMap((s) => {
          const copy = { ...s };
          delete copy[id];
          return copy;
        });
      }, 8000);
    } catch (err) {
      console.error("Error al calcular salario:", err);
      setSalarioMap((s) => ({ ...s, [id]: { value: 'Error', loading: false, updatedAt: Date.now() } }));
      setTimeout(() => {
        setSalarioMap((s) => {
          const copy = { ...s };
          delete copy[id];
          return copy;
        });
      }, 8000);
    }
  };

  return (
    <div className="empleado-list">
      <h2>Lista de Empleados</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Pago/Hora</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {empleados.map((emp) => (
            <tr key={emp.id}>
              <td>{emp.id}</td>
              <td>{emp.nombre}</td>
              <td>${emp.pago_hora}</td>
              <td>
                <button onClick={() => onSelectEmpleado(emp)}>📋 Ver</button>
                <button onClick={() => onEditEmpleado(emp)}>✏️ Editar</button>
                <button onClick={() => eliminarEmpleado(emp.id)}>🗑️ Eliminar</button>
                <button onClick={() => calcularSalario(emp.id)}>💰 Salario</button>
                {salarioMap[emp.id] && (
                  <div style={{ marginTop: 6 }}>
                    {salarioMap[emp.id].loading ? (
                      <small>Cargando salario...</small>
                    ) : (
                      <small>
                        Salario semanal: {salarioMap[emp.id].value === 'Error' ? (
                          <span style={{ color: 'red' }}>Error al calcular</span>
                        ) : (
                          <strong>${salarioMap[emp.id].value}</strong>
                        )}
                      </small>
                    )}
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EmpleadoList;