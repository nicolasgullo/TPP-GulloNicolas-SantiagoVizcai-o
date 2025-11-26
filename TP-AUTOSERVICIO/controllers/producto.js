import { Producto } from "../models/productos.js";

export const createProducto = async (req, res) => {
    try {
        const { name, imagenPrincipal, imagenHover, precio, tipo, activo, talle} = req.body;

        const producto = await Producto.create({ name, imagenPrincipal, imagenHover, precio, tipo, activo, talle });

        res.send(producto);
    } catch (error) {
        res.send(error);
    }
};

export const getProducto = async (req, res) => {
    try {
        const { id } = req.params;

        const producto = await Producto.findByPk(id);

        if (!producto) {
            return res.status(404).send("Producto no encontrado");
        }

        res.send(producto);
    } catch (error) {
        res.send(error);
    }
};

export const getProductos = async (req, res) => {
    try {
        const { activos } = req.query;

        const where = {};
        if (activos === 'true') {
            where.activo = true;
        } else if (activos === 'false') {
            where.activo = false;
        }

        const productos = await Producto.findAll(Object.keys(where).length ? { where } : undefined);
        res.send(productos);
    } catch (error) {
        res.status(500).send(error);
    }
};

export const updateProducto = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, imagenPrincipal, imagenHover, precio, tipo, activo, talle } = req.body;

        const producto = await Producto.findByPk(id);

        if (!producto) {
            return res.status(404).send("Producto no encontrado");
        }

        await producto.update({ name, imagenPrincipal, imagenHover, precio, tipo, activo, talle });

        res.send(producto);
    } catch (error) {
        res.send(error);
    }
};
