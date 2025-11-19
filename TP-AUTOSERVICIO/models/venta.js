import { DataTypes } from "sequelize";
import { sequelize } from "../database/index.js";

export const Venta = sequelize.define("Venta", {
    idVenta: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    nombreComprador: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    fecha: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
    total: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
});