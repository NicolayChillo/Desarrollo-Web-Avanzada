import { DataTypes } from "sequelize";
import {sequelize} from "../config/database.js";

export const Conductor = sequelize.define(
    //Nombre del modelo
    "Conductor",
    {
        idConductor: { 
            type: DataTypes.INTEGER, 
            primaryKey: true, 
            autoIncrement: true 
        },
        nombreConductor: { 
            type: DataTypes.STRING(100), 
            allowNull: false 
        },
        numeroLicenia: { 
            type: DataTypes.STRING(50),
            allowNull: false 
        },
        fechaNacimiento: { 
            type: DataTypes.DATEONLY, 
            allowNull: false 
        },
        numeroAccidentes: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        }
    },
    {
        tableName: "conductores",
        timestamps: false
    }
);

export default Conductor;