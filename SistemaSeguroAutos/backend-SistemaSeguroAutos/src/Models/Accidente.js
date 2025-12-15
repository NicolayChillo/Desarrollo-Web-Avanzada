import { DataTypes } from "sequelize";
import {sequelize} from "../config/database.js";

export const Accidente = sequelize.define(
    //Nombre del modelo
    "Accidente",
    {
        idAccidente: { 
            type: DataTypes.INTEGER, 
            primaryKey: true,
            autoIncrement: true 
        },
        conductorId:{
            type: DataTypes.INTEGER,
            allowNull: false,
            references: { model: "conductores", key: "idConductor" }
        },
        vehiculoId:{
            type: DataTypes.INTEGER,
            allowNull: false,
            references: { model: "vehiculos", key: "idVehiculo" }
        },
        fechaAccidente: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },
        descripcion: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        gravedad: {
            type: DataTypes.ENUM("leve", "moderada", "grave"),
            allowNull: false
        } 
    },
    {
        tableName: "accidentes",
        timestamps: false
    }
);

export default Accidente;