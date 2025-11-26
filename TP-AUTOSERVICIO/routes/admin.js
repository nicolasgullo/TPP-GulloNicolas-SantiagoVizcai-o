import { Router } from "express";
import multer from "multer";
import bcrypt from "bcrypt";
import { Producto, User } from "../models/index.js";
import {validarLoginAdmin, validarProductoAlta, validarProductoEditar} from "../middleware/validaciones.js";
import { verificarToken } from "../middleware/auth.js";
import jwt from "jsonwebtoken";

const router = Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "estatico/uploads");
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname);
    },
});

const upload = multer({ storage });

/* ========== LOGIN ADMIN ========== */

router.get("/login", (req, res) => {
    res.render("login", { error: null });
});

router.post("/login", validarLoginAdmin, async (req, res) => {
    try {
        const { email, password } = req.body;

        const admin = await User.findOne({ where: { email } });

        if (!admin) {
        return res
            .status(401)
            .render("login", { error: "Credenciales inválidas" });
        }

        const ok = await bcrypt.compare(password, admin.password);

        if (!ok) {
        return res
            .status(401)
            .render("login", { error: "Credenciales inválidas" });
        }

        const payload = {
        id: admin.idUser,
        email: admin.email,
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: "24h",
        });

        res.cookie("adminToken", token, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000, // 24hs
        });

        return res.redirect("/admin/dashboard");
    } catch (error) {
        console.error(error);
        return res
        .status(500)
        .render("login", { error: "Error al procesar el login" });
    }
});

/* ========== DASHBOARD ========== */

router.get("/dashboard", verificarToken, async (req, res) => {
    try {
        const productos = await Producto.findAll();
        res.render("dashboard", { productos });
    } catch (error) {
        console.error(error);
        res.status(500).send("Error al cargar el dashboard");
    }
});

/* ========== ALTA PRODUCTO ========== */

router.get("/productos/alta", verificarToken, (req, res) => {
    res.render("producto-alta", { error: null });
});

router.post(
    "/productos/alta", verificarToken, validarProductoAlta,
    upload.fields([
        { name: "imagenPrincipal", maxCount: 1 },
        { name: "imagenHover", maxCount: 1 },
    ]),
    async (req, res) => {
        try {
        const { name, precio, tipo, activo, descripcion, talle } = req.body;

        const imagenPrincipalFile =
            req.files?.imagenPrincipal?.[0] || null;
        const imagenHoverFile =
            req.files?.imagenHover?.[0] || null;

        if (!imagenPrincipalFile || !imagenHoverFile) {
            return res.status(400).render("producto-alta", {
            error: "Debes subir las dos imágenes del producto.",
            });
        }

        const imagenPrincipalPath =
            "/estatico/uploads/" + imagenPrincipalFile.filename;
        const imagenHoverPath =
            "/estatico/uploads/" + imagenHoverFile.filename;

        const activoBool =
            activo === "on" || activo === "true" || activo === "1";

        await Producto.create({
            name,
            precio,
            tipo,
            activo: activoBool,
            descripcion,
            talle,
            imagenPrincipal: imagenPrincipalPath,
            imagenHover: imagenHoverPath,
        });

        return res.redirect("/admin/dashboard");
        } catch (error) {
        console.error(error);
        res.status(500).render("producto-alta", {
            error: "Error al crear el producto",
        });
        }
    }
);

router.get("/productos/:id/editar", verificarToken, async (req, res) => {
    try {
        const { id } = req.params;
        const producto = await Producto.findByPk(id);

        if (!producto) {
        return res.status(404).send("Producto no encontrado");
        }

        res.render("producto-editar", { producto, error: null });
    } catch (error) {
        console.error(error);
        res.status(500).send("Error al cargar el producto para editar");
    }
});

router.post(
    "/productos/:id/editar", verificarToken, validarProductoEditar,
    upload.fields([
        { name: "imagenPrincipal", maxCount: 1 },
        { name: "imagenHover", maxCount: 1 },
    ]),
    async (req, res) => {
        try {
        const { id } = req.params;
        const { name, precio, tipo, activo, descripcion, talle } = req.body;

        const producto = await Producto.findByPk(id);
        if (!producto) {
            return res.status(404).send("Producto no encontrado");
        }

        let imagenPrincipalPath = producto.imagenPrincipal;
        let imagenHoverPath = producto.imagenHover;

        const imagenPrincipalFile = req.files?.imagenPrincipal?.[0] || null;
        if (imagenPrincipalFile) {
            imagenPrincipalPath = "/estatico/uploads/" + imagenPrincipalFile.filename;
        }

        const imagenHoverFile = req.files?.imagenHover?.[0] || null;
        if (imagenHoverFile) {
            imagenHoverPath = "/estatico/uploads/" + imagenHoverFile.filename;
        }

        const activoBool =
            activo === "on" || activo === "true" || activo === "1";

        await producto.update({
            name,
            precio,
            tipo,
            activo: activoBool,
            descripcion,
            talle,
            imagenPrincipal: imagenPrincipalPath,
            imagenHover: imagenHoverPath,
        });

        return res.redirect("/admin/dashboard");
        } catch (error) {
        console.error(error);
        res.status(500).render("producto-editar", {
            producto: { ...req.body, id: req.params.id },
            error: "Error al actualizar el producto",
        });
        }
    }
);

/* ========== LOGOUT ADMIN ========== */

router.get("/logout", (req, res) => {
    res.clearCookie("adminToken");
    res.redirect("/admin/login");
});

export default router;