import { DataTypes } from "sequelize";
import {sequelize} from "../config/database.js";

export const Cotizacion = sequelize.define(
    //Nombre del modelo
    "Cotizacion",
    {
        idCotizacion: { 
            type: DataTypes.INTEGER, 
            primaryKey: true,
            autoIncrement: true 
        },
        conductorId:{
            type: DataTypes.INTEGER,
            allowNull: false,
            references: { model: "conductores", key: "idConductor" }
        },
        usuarioId:{
            type: DataTypes.INTEGER,
            allowNull: false,
            references: { model: "usuarios", key: "idUsuario" }
        },
        vehiculoId:{
            type: DataTypes.INTEGER,
            allowNull: false,
            references: { model: "vehiculos", key: "idVehiculo" }
        },
        fechaCreacion: {
            type: DataTypes.DATEONLY,
            allowNull: false,
            defaultValue: DataTypes.NOW
        },
        costoBase: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        },
        costoFinal: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        },
        descuentos: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            defaultValue: 0
        },
        recargos: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            defaultValue: 0
        },
        estado: {
            type: DataTypes.ENUM("pendiente", "aprobada", "rechazada"),
            allowNull: false
        },
        aceptaTerminos: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        }
    },
    {
        tableName: "cotizaciones",
        timestamps: false
    }
);

export default Cotizacion;