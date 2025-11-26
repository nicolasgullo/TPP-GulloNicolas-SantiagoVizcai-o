import { Router } from "express";
import {createUsuario, getUsuarios, loginUsuario} from "../controllers/usuario.js";

const router = Router();

router.post("/", createUsuario);
router.get("/", getUsuarios);
router.post("/login", loginUsuario);

export default router;
