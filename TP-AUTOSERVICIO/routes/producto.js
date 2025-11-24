import {Router} from 'express';
import { Producto } from '../models/index.js';
import { createProducto, getProductos, getProducto, updateProducto } from '../controllers/producto.js';

const router = Router();

router.post('/', createProducto);
router.get('/', getProductos);
router.get('/:id', getProducto);
router.put('/:id', updateProducto);

router.put('/:id/desactivar', async (req, res) => {
    try {
        const { id } = req.params;
        const producto = await Producto.findByPk(id);

        if (!producto) {
            return res.status(404).json({ message: "Producto no encontrado" });
        }

        await producto.update({ activo: false });

        res.json({ message: "Producto desactivado correctamente" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put('/:id/activar', async (req, res) => {
    try {
        const { id } = req.params;
        const producto = await Producto.findByPk(id);

        if (!producto) {
            return res.status(404).json({ message: "Producto no encontrado" });
        }

        await producto.update({ activo: true });

        res.json({ message: "Producto activado correctamente" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;