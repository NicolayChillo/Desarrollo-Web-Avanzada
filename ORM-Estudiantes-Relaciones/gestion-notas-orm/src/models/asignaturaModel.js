import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";
import { Docente } from "./docenteModel.js";

// Definicion del modelo Asignatura
export const Asignatura = sequelize.define(
    "Asignatura",
    {
        idAsignatura: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        nombreAsignatura: { type: DataTypes.STRING(100), allowNull: false },
        creditos: { type: DataTypes.INTEGER, allowNull: false }
    },
    {
        tableName: "asignaturas",
        timestamps: false
    }
);

// Relaciones: un docente puede tener muchas asignaturas
Docente.hasMany(Asignatura, { foreignKey: "idDocente", onDelete: "SET NULL", onUpdate: "CASCADE" });
Asignatura.Docente = Asignatura.belongsTo(Docente, { foreignKey: "idDocente" });

export default Asignatura;
