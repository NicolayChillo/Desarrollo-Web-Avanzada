// el costo base depende del tipo de vehiculo:
// - Sedán costo base estandar: 10000
// - SUB / Camieneta costo base incrementado
// Vehiculos son uso comercial tienen recargo obligatorio.
// Vehiculos con mas de 20 años no pueden ser cotizados.
// El valor del vehiculo influye directamente en el costo final
import { DataTypes } from "sequelize";
import { sequelize } from "./Config/database.js";

export const Vehiculo = sequelize.define("Vehiculo", {
    id: {
        type: DataTypes.INTEGER,    
        primaryKey: true,
        autoIncrement: true,
    },
    placa: {
        type: DataTypes.STRING(10),
        allowNull: false,
        unique: true,
    },
    tipo: {
        type: DataTypes.ENUM("Sedan", "SUV", "Camioneta"),  
        allowNull: false,
    },
    usoComercial: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
    anioFabricacion: {
        type: DataTypes.INTEGER,

        allowNull: false,
    },
    valorVehiculo: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
}, {
    tableName: "Vehiculos",
    timestamps: false,
});
