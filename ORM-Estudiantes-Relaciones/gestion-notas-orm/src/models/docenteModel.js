import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

// Definicion del modelo Docente
export const Docente = sequelize.define(
    "Docente",
    {
        idDocente: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        nombreDocente: { type: DataTypes.STRING(100), allowNull: false },
        departamento: { type: DataTypes.STRING(100), allowNull: false }
    },
    {
        tableName: "docentes",
        timestamps: false
    }
);

export default Docente;
