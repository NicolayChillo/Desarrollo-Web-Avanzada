import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/database.js";

// Modelo para registrar horas trabajadas por día
export class RegistroHoras extends Model {}

RegistroHoras.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    empleadoId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Empleados',
        key: 'id'
      }
    },
    fecha: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    dia: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    horas: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
        min: 0,
        max: 24
      }
    }
  },
  {
    sequelize,
    modelName: "RegistroHoras",
    tableName: "RegistroHoras",
    timestamps: true
  }
);
