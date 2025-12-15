import { DataTypes } from "sequelize";
import {sequelize} from "../config/database.js";

export const Usuario = sequelize.define(
    //Nombre del modelo
    "Usuario",
    {
        idUsuario: 
            { 
                type: DataTypes.INTEGER, 
                primaryKey: true, 
                autoIncrement: true 
            },
        nombreUsuario: 
            { 
                type: DataTypes.STRING(100), 
                allowNull: false 
            },
        email: 
            { 
                type: DataTypes.STRING(100), 
                allowNull: false, 
                unique: true, 
                validate: { isEmail: true } 
            },
        password: 
            { 
                type: DataTypes.STRING(100), 
                allowNull: false 
            }
    },
    {
        tableName: "usuarios",
        timestamps: false
    }
);

export default Usuario;