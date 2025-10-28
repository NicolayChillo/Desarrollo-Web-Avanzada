import express from "express";
import cors from "cors";// Middleware para permitir peticiones desde (frontend)

import dotenv from "dotenv";// Librería para leer variables de entorno desde el archivo .env

import {sequelize} from "./config/database.js";// Importar la conexión a la base de datos MySQL
import empleadoRoutes from "./routes/empleadoRoutes.js";// Importar las rutas de empleados

// Importar modelos con relaciones
import './models/index.js';

dotenv.config();
const app = express();

// Middleware (para manejar JSON y CORS)
app.use(cors());
app.use(express.json());

// ruta raiz
app.get("/", (_req, res) => res.send("Servidor de empleados funcionando correctamenten ."));

// Registrar rutas de routes
app.use("/api/empleados", empleadoRoutes);


const iniciarServidor = async () => {
  try {
    await sequelize.authenticate();//intenta conectar con la base de datos
    await sequelize.sync(); // Crea tablas si no existen
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`Servidor ejecutándose en el puerto ${PORT}`));
  } catch (error) {
    console.error("Error al conectar con la base de datos:", error.message);
    console.error("Detalles del error:", error);
  }
};
iniciarServidor();