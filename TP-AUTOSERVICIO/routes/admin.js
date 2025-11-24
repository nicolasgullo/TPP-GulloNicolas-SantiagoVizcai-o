import { Router } from "express";
import multer from "multer";
import { Producto } from "../models/index.js";

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

router.post("/login", (req, res) => {
    const { email, password } = req.body;

    if (email === "admin@admin.com" && password === "123456") {
        return res.redirect("/admin/dashboard");
    }

    res.status(401).render("login", { error: "Credenciales inválidas" });
});

/* ========== DASHBOARD ========== */

router.get("/dashboard", async (req, res) => {
    try {
        const productos = await Producto.findAll();
        res.render("dashboard", { productos });
    } catch (error) {
        console.error(error);
        res.status(500).send("Error al cargar el dashboard");
    }
});

/* ========== ALTA PRODUCTO ========== */

router.get("/productos/alta", (req, res) => {
    res.render("producto-alta", { error: null });
});

router.post(
    "/productos/alta",
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

router.get("/productos/:id/editar", async (req, res) => {
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
    "/productos/:id/editar",
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

export default router;