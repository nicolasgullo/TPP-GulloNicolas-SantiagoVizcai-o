import { DataTypes } from"sequelize";
import { sequelize } from "../database/index.js";

export const Producto = sequelize.define(
    "Producto",
    {
        id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        },
        name: {
        type: DataTypes.STRING,
        allowNull: false, // NOT NULL
        },
        // imagen principal
        imagenPrincipal: {
        type: DataTypes.STRING,
        allowNull: false,
        },
        // imagen que se verá en el hover
        imagenHover: {
        type: DataTypes.STRING,
        allowNull: false,
        },
        precio: {
        type: DataTypes.INTEGER,
        allowNull: false, // NOT NULL
        },
        tipo: {
        type: DataTypes.ENUM('remera', 'pantalon'),
        allowNull: false,
        },
        activo: {
        defaultValue: true,
        type: DataTypes.BOOLEAN,
        allowNull: false,
        },
        talle: {
        type: DataTypes.ENUM("M", "L", "XL"),
        allowNull: false,
        },
        descripcion: {
        type: DataTypes.STRING,
        allowNull: false,
        }
    }
);