import {Router} from 'express';
import { createVenta, getVentas, getVenta, updateVenta, deleteVenta } from '../controllers/venta.js';

const router = Router();

router.post('/', createVenta);
router.get('/', getVentas);
router.get('/:id', getVenta);
router.put('/:id', updateVenta);
router.delete('/:id', deleteVenta);

export default router;