import { Venta, VentaProducto } from "../models/index.js";

export const createVenta = async (req, res) => {
    try {
        const { nombreComprador, fecha, total, productos } = req.body;

        const venta = await Venta.create({ nombreComprador, fecha, total });

        await Promise.all(
        productos.map((p) =>
            VentaProducto.create({
            ventaId: venta.idVenta,
            productoId: p.productoId,
            cantidad: p.cantidad,
            precioUnitario: p.precioUnitario,
            })
        )
        );

        res.status(201).send(venta);
    } catch (error) {
        console.error(error);
        res.status(500).send(error);
    }
};

export const getVenta = async (req, res) => {
    try {
        const { id } = req.params;
        const venta = await Venta.findByPk(id);
        if (!venta) {
            return res.status(404).send({ message: "Venta no encontrada" });
        }
        res.send(venta);
    } catch (error) {
        res.status(500).send(error);
    }
};

export const getVentas = async (req, res) => {
    try {
        const ventas = await Venta.findAll();
        res.send(ventas);
    } catch (error) {
        res.status(500).send(error);
    }
};

export const updateVenta = async (req, res) => {
    try {
        const { id } = req.params;
        const { fecha, total, productos } = req.body;

        const venta = await Venta.findByPk(id);
        if (!venta) {
            return res.status(404).send({ message: "Venta no encontrada" });
        }

        await venta.update({ fecha, total, productos });
        res.send(venta);
    } catch (error) {
        res.status(500).send(error);
    }
};

export const deleteVenta = async (req, res) => {
    try {
        const { id } = req.params;
        
        const venta = await Venta.findByPk(id);
        if (!venta) {
            return res.status(404).send({ message: "Venta no encontrada" });
        }

        await venta.destroy();
        res.send({ message: "Venta eliminada correctamente" });
    } catch (error) {
        res.status(500).send(error);
    }
};
