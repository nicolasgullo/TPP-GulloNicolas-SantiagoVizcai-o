import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

export const sequelize = new Sequelize(
    process.env.MYSQL_DB,
    process.env.MYSQL_USER,
    process.env.MYSQL_PASSWORD,            
    {
        host: process.env.MYSQL_HOST,
        dialect: "mysql",
        logging: false
    }
);

try {
    await sequelize.authenticate();
    console.log("Conexión exitosa a MySQL");
} catch (error) {
    console.error("Error al conectar a MySQL:", error);
};