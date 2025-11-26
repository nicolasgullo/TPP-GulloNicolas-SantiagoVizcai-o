import { User } from "../models/index.js";
import bcrypt from "bcrypt";

const SALT_ROUNDS = 10;

export const createUsuario = async (req, res) => {
    try {
        const { nombre, email, password } = req.body;

        if (!nombre || !email || !password) {
            return res.status(400).send({ error: "Faltan datos obligatorios" });
        }

        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

        const usuario = await User.create({
            nombre,
            email,
            password: hashedPassword,
        });

        const { password: _, ...usuarioSinPassword } = usuario.toJSON();

        res.status(201).send(usuarioSinPassword);
    } catch (error) {
        console.error(error);
        res.status(500).send(error);
    }
};

export const getUsuarios = async (req, res) => {
    try {
        const usuarios = await User.findAll();
        res.send(usuarios);
    } catch (error) {
        console.error(error);
        res.status(500).send(error);
    }
};

export const loginUsuario = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: "Faltan datos" });
        }

        const usuario = await User.findOne({ where: { email } });
        if (!usuario) {
            return res.status(401).json({ error: "Credenciales inválidas" });
        }

        const coincide = await bcrypt.compare(password, usuario.password);
        if (!coincide) {
            return res.status(401).json({ error: "Credenciales inválidas" });
        }

        const payload = { id: usuario.idUser, email: usuario.email };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "24h" });

        return res.json({
            mensaje: "Login exitoso",
            token
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Error en el login" });
    }
};