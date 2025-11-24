import { Sequelize } from "sequelize";

export const sequelize = new Sequelize(
    "tp_autoservicio",
    "root",            
    "root",            
    {
        host: "localhost",
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