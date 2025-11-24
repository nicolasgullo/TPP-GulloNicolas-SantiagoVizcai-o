import express from "express";
import path from "path";
import { fileURLToPath } from "url";

import productosRouter from "./routes/producto.js";
import usuariosRouter from "./routes/usuario.js";
import ventasRouter from "./routes/venta.js";
import adminRouter from "./routes/admin.js";
import ticketRouter from "./routes/ticket.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use("/estatico", express.static(path.join(__dirname, "estatico")));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/admin", adminRouter);

app.use("/api/productos", productosRouter);
app.use("/api/usuarios", usuariosRouter);
app.use("/api/ventas", ventasRouter);
app.use("/api/ticket", ticketRouter);

app.get("/", (req, res) => {
    res.redirect("/estatico/index.html");
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});