import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { dbConnection, sequelize } from "./src/config/database.js";
import estudianteRoutes from "./src/routes/estudianteRoutes.js";
import notaRoutes from "./src/routes/notaRoutes.js";
import asignaturaRoutes from "./src/routes/asignaturaRoutes.js";
import docenteRoutes from "./src/routes/docenteRoutes.js";

dotenv.config();

//inicializar app con express
const app = express();
app.use(cors());
app.use(express.json());

//rutas
app.use("/api/estudiantes", estudianteRoutes);
app.use("/api/notas", notaRoutes);
app.use("/api/asignaturas", asignaturaRoutes);
app.use("/api/docentes", docenteRoutes);

//arrancar el servidor
const PORT = process.env.PORT || 3000;

//conectar a la base de datos
await dbConnection();
if (process.env.NODE_ENV !== "production") {
    try {
        await sequelize.sync({ alter: true }); // crea/ajusta tablas según los modelos
        console.log("Tablas sincronizadas con la base de datos");
    } catch (err) {
        console.error("Error al sincronizar tablas:", err.message);
    }
}
// iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});