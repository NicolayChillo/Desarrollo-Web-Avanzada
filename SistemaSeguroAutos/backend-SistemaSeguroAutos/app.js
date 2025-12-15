import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { dbConnection, sequelize } from "./src/config/database.js";
import { iniciarRelaciones } from "./src/Models/relaciones.js";

import usuarioRouter from "./src/Routes/usuarioRouter.js";
import conductorRouter from "./src/Routes/conductorRouter.js";
import vehiculoRouter from "./src/Routes/vehiculoRouter.js";
import accidenteRouter from "./src/Routes/accidenteRouter.js";
import cotizacionRouter from "./src/Routes/cotizacionRouter.js";
import pagoRouter from "./src/Routes/pagoRouter.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

iniciarRelaciones();

// Ruta raíz
app.get("/", (_req, res) => {
    res.send("Sistemaseguroautos");
});

app.use("/api/usuarios", usuarioRouter);
app.use("/api/conductores", conductorRouter);
app.use("/api/vehiculos", vehiculoRouter);
app.use("/api/accidentes", accidenteRouter);
app.use("/api/cotizaciones", cotizacionRouter);
app.use("/api/pagos", pagoRouter);

//arrancar el servidor
const PORT = process.env.PORT || 3000;

//conectar a la base de datos
await dbConnection();
if (process.env.NODE_ENV !== "production") {
    try {
        await sequelize.sync({ alter: true });
        console.log("Tablas sincronizadas con la base de datos");
    } catch (err) {
        console.error("Error al sincronizar tablas:", err.message);
    }
}
// iniciar el servidor
app.listen(PORT, () => {
    const baseUrl = `http://localhost:${PORT}`;
    console.log(`Servidor corriendo en ${baseUrl}`);
});