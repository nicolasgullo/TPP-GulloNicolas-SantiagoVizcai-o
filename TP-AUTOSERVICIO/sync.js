import { sequelize } from "./database/index.js";
import "./models/index.js";

const sincronizar = async () => {
    try {
        await sequelize.sync({ alter: true });
        console.log("Tablas creadas/actualizadas correctamente");
    } catch (error) {
        console.error("Error al sincronizar:", error);
    } finally {
        process.exit();
    }
};

sincronizar();