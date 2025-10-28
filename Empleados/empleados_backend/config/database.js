import { Sequelize } from "sequelize";
import dotenv from "dotenv"; // Trabaja con las variables de entorno

// Cargar variables de .env
dotenv.config();


export const sequelize = new Sequelize(
    process.env.DB_NAME,  // Nombre de la base de datos
    process.env.DB_USER,  // Usuario de MySQL
    process.env.DB_PASS,  // Contraseña de MySQL
    {
        host: process.env.DB_HOST,      // localhost
        port: process.env.DB_PORT,      // 3306 (puerto de MySQL)
        dialect: "mysql",               // Tipo de base de datos
        logging: false,                 // Desactiva logs SQL en consola
        timezone: "-05:00",             // Zona horaria de Ecuador (UTC-5)
        dialectOptions: {
            timezone: "-05:00"
        }
    }
);