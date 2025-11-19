import { User } from "./usuarios.js";
import { Producto } from "./productos.js";
import { Venta } from "./venta.js";
import { VentaProducto } from "./ventaProducto.js";

Producto.belongsToMany(Venta, {
    through: VentaProducto,
    foreignKey: "productoId",
});

Venta.belongsToMany(Producto, {
    through: VentaProducto,
    foreignKey: "ventaId",
});

export { User, Producto, Venta, VentaProducto };