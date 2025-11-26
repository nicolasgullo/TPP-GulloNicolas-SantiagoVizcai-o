import { Venta, VentaProducto, Producto } from "../models/index.js";

export const createVenta = async (req, res) => {
    try {
        const { nombreComprador, fecha, total, productos } = req.body;

        if (!productos || !Array.isArray(productos) || productos.length === 0) {
        return res
            .status(400)
            .send({ message: "La venta debe tener al menos un producto." });
        }

        const venta = await Venta.create({
        nombreComprador,
        fecha,
        total,
        });

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

        const venta = await Venta.findByPk(id, {
        include: [
            {
            model: Producto,
            through: {
                attributes: ["cantidad", "precioUnitario"],
            },
            },
        ],
        });

        if (!venta) {
        return res.status(404).send({ message: "Venta no encontrada" });
        }

        res.send(venta);
    } catch (error) {
        console.error(error);
        res.status(500).send(error);
    }
};

export const getVentas = async (req, res) => {
    try {
        const ventas = await Venta.findAll({
        include: [
            {
            model: Producto,
            through: {
                attributes: ["cantidad", "precioUnitario"],
            },
            },
        ],
        order: [["fecha", "DESC"]],
        });

        res.send(ventas);
    } catch (error) {
        console.error(error);
        res.status(500).send(error);
    }
};

export const updateVenta = async (req, res) => {
    try {
        const { id } = req.params;
        const { fecha, total } = req.body;

        const venta = await Venta.findByPk(id);
        if (!venta) {
        return res.status(404).send({ message: "Venta no encontrada" });
        }

        await venta.update({ fecha, total });

        res.send(venta);
    } catch (error) {
        console.error(error);
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

        await VentaProducto.destroy({ where: { ventaId: id } });

        await venta.destroy();
        res.send({ message: "Venta eliminada correctamente" });
    } catch (error) {
        console.error(error);
        res.status(500).send(error);
    }
};