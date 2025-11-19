import { DataTypes } from "sequelize";
import { sequelize } from "../database/index.js";

export const VentaProducto = sequelize.define("VentaProducto", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    cantidad: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    precioUnitario: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
});