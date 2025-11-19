import {Router} from 'express';
import { createProducto, getProductos, getProducto, updateProducto } from '../controllers/producto.js';

const router = Router();

router.post('/', createProducto);
router.get('/', getProductos);
router.get('/:id', getProducto);
router.put('/:id', updateProducto);

export default router;