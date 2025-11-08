import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

// Definicion del modelo Estudiante
export const Estudiante = sequelize.define(
    //Nombre del modelo
    "Estudiante", 
    {
        idEstudiante: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        nombreEstudiante: { type: DataTypes.STRING(100), allowNull: false },
        carrera: { type: DataTypes.STRING(100), allowNull: false }
    },
    {
        tableName: "estudiantes",
        timestamps: false // desactivar campos createdAt y updatedAt
    }
);