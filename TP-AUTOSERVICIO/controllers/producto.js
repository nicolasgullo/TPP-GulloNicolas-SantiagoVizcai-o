import { Producto } from "../models/productos.js";

export const createProducto = async (req, res) => {
    try {
        const { name, imagen, precio, tipo, activo, descripcion} = req.body;

        console.log({ name, imagen, precio, tipo, activo, descripcion });

        const producto = await Producto.create({ name, imagen, precio, tipo, activo, descripcion });

        console.log({ producto });

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
        const productos = await Producto.findAll();
        res.send(productos);
    } catch (error) {
        res.send(error);
    }
};

export const updateProducto = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, imagen, precio, tipo, activo, descripcion } = req.body;

        const producto = await Producto.findByPk(id);

        if (!producto) {
            return res.status(404).send("Producto no encontrado");
        }

        await producto.update({ name, imagen, precio, tipo, activo, descripcion });

        res.send(producto);
    } catch (error) {
        res.send(error);
    }
};
