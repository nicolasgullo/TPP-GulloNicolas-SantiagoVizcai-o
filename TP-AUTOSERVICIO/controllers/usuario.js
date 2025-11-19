import { User } from "../models/index.js";

export const createUsuario = async (req, res) => {
    try {
        const { nombre, email, password } = req.body;

        const usuario = await User.create({ nombre, email, password });

        res.status(201).send(usuario);
    } catch (error) {
        res.status(500).send(error);
    }
};

export const getUsuarios = async (req, res) => {
    try {
        const usuarios = await User.findAll();
        res.send(usuarios);
    } catch (error) {
        res.status(500).send(error);
    }
};