import { DataTypes } from "sequelize";
import {sequelize } from "../config/database.js";

export const Pago = sequelize.define(
    //Nombre del modelo
    "Pago",
    {
        idPago: { 
            type: DataTypes.INTEGER, 
            primaryKey: true,
            autoIncrement: true 
        },
        cotizacionId:{
            type: DataTypes.INTEGER,
            allowNull: false,
            references: { model: "cotizaciones", key: "idCotizacion" }
        },
        fechaPago: {
            type: DataTypes.DATEONLY,
            allowNull: false,
            defaultValue: DataTypes.NOW
        },
        tipoPago: {
            type: DataTypes.ENUM("credito", "debito"),
            allowNull: false
        },
        formaPago: {
            type: DataTypes.ENUM("contado", "cuotas"),
            allowNull: false
        },
        monto: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        },
        estado: {
            type: DataTypes.ENUM("aprobado", "rechazado", "pendiente"),
            allowNull: false,
            defaultValue: "pendiente"
        }
    },
    {
        tableName: "pagos",
        timestamps: false
    }
);

export default Pago;