import { DataTypes } from "sequelize";
import { sequelize } from "../database/index.js";

export const User = sequelize.define("User", {
    idUser: { 
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
    },
    email: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
    field: 'Email',
    validate: {
    isEmail: true,
    notEmpty: true
    }
    },
    password: {
    type: DataTypes.STRING(255),
    allowNull: false,
    field: 'Password',
    validate: {
    notEmpty: true
    }
    },
    nombre: {
    type: DataTypes.STRING(100),
    allowNull: false,
    field: 'Nombre',
    validate: {
    notEmpty: true
    }
    }
});