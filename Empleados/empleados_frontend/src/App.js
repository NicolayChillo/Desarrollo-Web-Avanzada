// src/App.js
import React, { useState } from "react";
import "./App.css";
import EmpleadoList from "./components/EmpleadoList";
import EmpleadoForm from "./components/EmpleadoForm";
import EmpleadoD from "./components/EmpleadoD";
import Estadisticas from "./components/Estadisticas";

function App() {
  const [empleadoSeleccionado, setEmpleadoSeleccionado] = useState(null);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [refrescar, setRefrescar] = useState(false);

  const handleGuardar = () => {
    setModoEdicion(false);
    setEmpleadoSeleccionado(null);
    setRefrescar(!refrescar);
  };

  return (
    <div className="App">
  <h1>Gestión de Empleados</h1>
      <EmpleadoForm
        empleadoSeleccionado={modoEdicion ? empleadoSeleccionado : null}
        onGuardar={handleGuardar}
      />
      <EmpleadoList
        key={refrescar}
        onSelectEmpleado={setEmpleadoSeleccionado}
        onEditEmpleado={(emp) => {
          setEmpleadoSeleccionado(emp);
          setModoEdicion(true);
        }}
      />
      <EmpleadoD empleado={empleadoSeleccionado} onRefrescar={() => setRefrescar((s) => !s)} />

      <hr />
      <Estadisticas />
    </div>
  );
}

export default App;