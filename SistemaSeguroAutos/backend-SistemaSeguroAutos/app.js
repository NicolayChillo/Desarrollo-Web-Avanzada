import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import vehiculoRoutes from './src/Routes/vehiculoRoutes.js';
import { dbConection, sequelize } from './src/Models/Config/database.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

//rutas
app.use('/api/vehiculos', vehiculoRoutes);

// Conectar a la base de datos y sincronizar modelos
await dbConection();
if (process.env.NODE_ENV !== 'production') {
    try {
        await sequelize.sync({ alter: true });
        console.log('Modelos sincronizados con la base de datos');
    } catch (error) {
        console.error('Error al sincronizar los modelos:', error);
    }
}
// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});