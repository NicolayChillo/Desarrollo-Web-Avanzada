import React, { useState } from "react";
import "./App.css";
import EstudianteForm from "./components/EstudianteForm";
import EstudianteList from "./components/EstudianteList";
import EstudianteD from "./components/EstudianteD";
import AsignaturaList from "./components/AsignaturaList";
import DocenteList from "./components/DocenteList";

function App() {
  const [estudianteSeleccionado, setEstudianteSeleccionado] = useState(null);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [refrescar, setRefrescar] = useState(false);

  const handleGuardar = () => {
    setModoEdicion(false);
    setEstudianteSeleccionado(null);
    setRefrescar((s) => !s);
  };

  return (
    <div className="App">
      <h1 style={{ textAlign: "center", fontWeight: "bold" }}>GESTIÓN DE NOTAS</h1>

      <div className="layout-columns">
        <div className="left-column">
          <EstudianteForm
            estudianteSeleccionado={modoEdicion ? estudianteSeleccionado : null}
            onGuardar={handleGuardar}
          />

          <EstudianteList
            key={refrescar}
            onSelectEstudiante={(e) => setEstudianteSeleccionado(e)}
            onEditEstudiante={(e) => {
              setEstudianteSeleccionado(e);
              setModoEdicion(true);
            }}
          />

          {/* Mover asignaturas y docentes debajo de la lista de estudiantes (izquierda) */}
          <AsignaturaList />
          <DocenteList />
        </div>

        <div className="right-column">
          <EstudianteD
            estudiante={estudianteSeleccionado}
            onRefrescar={() => setRefrescar((s) => !s)}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
