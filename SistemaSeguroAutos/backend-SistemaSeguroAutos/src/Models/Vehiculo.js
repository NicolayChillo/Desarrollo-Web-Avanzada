import { DataTypes } from "sequelize";
import {sequelize} from "../config/database.js";

export const Vehiculo = sequelize.define(
    //Nombre del modelo
    "Vehiculo",
    {
        idVehiculo: { 
            type: DataTypes.INTEGER, 
            primaryKey: true, 
            autoIncrement: true 
        },
        marca: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        modelo: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        anio: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        numeroPlaca: {
            type: DataTypes.STRING(20),
            allowNull: false,
            unique: true
        },
        tipo:{
            type: DataTypes.ENUM("sedan", "SUV", "camioneta"),
            allowNull: false
        },
        uso: {
            type: DataTypes.ENUM("personal", "comercial"),
            allowNull: false
        },
        valorComercial: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        }   
    },
    {
        tableName: "vehiculos",
        timestamps: false
    }
);

export default Vehiculo;