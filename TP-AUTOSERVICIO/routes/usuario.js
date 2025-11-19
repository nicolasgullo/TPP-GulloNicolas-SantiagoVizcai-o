import {Router} from 'express';
import { createUsuario, getUsuarios } from '../controllers/usuario.js';

const router = Router();

router.post('/', createUsuario);
router.get('/usuarios', getUsuarios);

export default router;
