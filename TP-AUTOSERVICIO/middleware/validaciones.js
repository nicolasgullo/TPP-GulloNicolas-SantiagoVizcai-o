const TIPOS_VALIDOS = ["remera", "pantalon"];
const TALLES_VALIDOS = ["M", "L", "XL"];

export function validarLoginAdmin(req, res, next) {
    const { email, password } = req.body;
    const errores = [];

    if (!email || !email.trim()) {
        errores.push("El email es obligatorio.");
    } else if (!email.includes("@")) {
        errores.push("El email no es válido.");
    }

    if (!password || !password.trim()) {
        errores.push("La contraseña es obligatoria.");
    } else if (password.length < 6) {
        errores.push("La contraseña debe tener al menos 6 caracteres.");
    }

    if (errores.length > 0) {
        return res.status(400).render("login", { error: errores.join(" | ") });
    }

    next();
}

export function validarProductoAlta(req, res, next) {
    const { name, precio, tipo, talle } = req.body;
    const errores = [];

    if (!name || name.trim() === "") {
        errores.push("El nombre es obligatorio.");
    }

    const precioNum = Number(precio);
    if (!precio || Number.isNaN(precioNum) || precioNum <= 0) {
        errores.push("El precio debe ser un número mayor a 0.");
    }

    if (!TIPOS_VALIDOS.includes(tipo)) {
        errores.push("El tipo de producto es inválido.");
    }

    if (!TALLES_VALIDOS.includes(talle)) {
        errores.push("El talle es inválido.");
    }

    if (errores.length > 0) {
        return res
        .status(400)
        .render("producto-alta", { error: errores.join(" | ") });
    }

    next();
}

export function validarProductoEditar(req, res, next) {
    const { name, precio, tipo, talle } = req.body;
    const errores = [];

    if (!name || name.trim() === "") {
        errores.push("El nombre es obligatorio.");
    }

    const precioNum = Number(precio);
    if (!precio || Number.isNaN(precioNum) || precioNum <= 0) {
        errores.push("El precio debe ser un número mayor a 0.");
    }

    if (!TIPOS_VALIDOS.includes(tipo)) {
        errores.push("El tipo de producto es inválido.");
    }

    if (!TALLES_VALIDOS.includes(talle)) {
        errores.push("El talle es inválido.");
    }

    if (errores.length > 0) {
        return res
        .status(400)
        .render("producto-editar", {
            error: errores.join(" | "),
            producto: { id: req.params.id, name, precio, tipo, talle },
        });
    }

    next();
}