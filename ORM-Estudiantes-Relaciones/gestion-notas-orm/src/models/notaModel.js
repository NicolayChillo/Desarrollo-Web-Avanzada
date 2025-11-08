import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";
import { Estudiante } from "./estudianteModel.js";
import { Asignatura } from "./asignaturaModel.js";

export const Nota = sequelize.define(
    //Nombre del modelo
    "Nota",
    {
        idNota: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        nota1: { type: DataTypes.FLOAT, allowNull: false, validate:{min: 0, max: 20} },
        nota2: { type: DataTypes.FLOAT, allowNull: false, validate:{min: 0, max: 20} },
        nota3: { type: DataTypes.FLOAT, allowNull: false, validate:{min: 0, max: 20} },
        promedio: { type: DataTypes.FLOAT, allowNull: false},
        categoria: { type: DataTypes.STRING(50), allowNull: false}
    },
    {
        tableName: "notas",
        timestamps: false // desactivar campos createdAt y updatedAt
    }
);

//Relaciones: 1 estudiante puede tener muchas notas
Estudiante.hasMany(Nota, { foreignKey: "idEstudiante", onDelete: "CASCADE", onUpdate: "CASCADE" });
Nota.Estudiante = Nota.belongsTo(Estudiante, { foreignKey: "idEstudiante" });

// Relacion: 1 asignatura puede tener muchas notas
Asignatura.hasMany(Nota, { foreignKey: "idAsignatura", onDelete: "SET NULL", onUpdate: "CASCADE" });
Nota.Asignatura = Nota.belongsTo(Asignatura, { foreignKey: "idAsignatura" });