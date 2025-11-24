const CARRITO_KEY = "carrito";

const contenedorCarrito = document.getElementById("lista-carrito");
const totalCarritoSpan = document.getElementById("total-carrito");
const btnVaciar = document.getElementById("btnVaciar");
const btnFinalizar = document.getElementById("btnFinalizar");

function obtenerCarrito() {
    return JSON.parse(localStorage.getItem(CARRITO_KEY)) || [];
}

function guardarCarrito(carrito) {
    localStorage.setItem(CARRITO_KEY, JSON.stringify(carrito));
}

function calcularTotal(carrito) {
    return carrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0);
}

function renderizarCarrito() {
    const carrito = obtenerCarrito();

    contenedorCarrito.innerHTML = "";

    if (carrito.length === 0) {
        contenedorCarrito.innerHTML = "<p>Tu carrito está vacío.</p>";
        totalCarritoSpan.textContent = "0";
        btnFinalizar.disabled = true;
        btnVaciar.disabled = true;
        return;
    }

    btnFinalizar.disabled = false;
    btnVaciar.disabled = false;

    carrito.forEach((item, index) => {
        const fila = document.createElement("article");
        fila.classList.add("carrito-item");

        const img = document.createElement("img");
        img.src = item.imagenPrincipal;
        img.alt = item.name;
        img.classList.add("carrito-img");

        const info = document.createElement("div");
        info.classList.add("carrito-info");

        const nombre = document.createElement("h3");
        nombre.textContent = item.name;

        const talle = document.createElement("p");
        talle.textContent = `Talle: ${item.talle}`;

        const precioUnit = document.createElement("p");
        precioUnit.textContent = `Precio: $${item.precio}`;

        const cantidadWrap = document.createElement("div");
        cantidadWrap.classList.add("carrito-cantidad");

        const btnMenos = document.createElement("button");
        btnMenos.textContent = "-";
        btnMenos.addEventListener("click", () => cambiarCantidad(index, -1));

        const spanCantidad = document.createElement("span");
        spanCantidad.textContent = item.cantidad;

        const btnMas = document.createElement("button");
        btnMas.textContent = "+";
        btnMas.addEventListener("click", () => cambiarCantidad(index, 1));

        cantidadWrap.appendChild(btnMenos);
        cantidadWrap.appendChild(spanCantidad);
        cantidadWrap.appendChild(btnMas);

        const subtotal = document.createElement("p");
        subtotal.textContent = `Subtotal: $${item.precio * item.cantidad}`;

        const btnEliminar = document.createElement("button");
        btnEliminar.textContent = "Eliminar";
        btnEliminar.classList.add("btn-eliminar");
        btnEliminar.addEventListener("click", () => eliminarItem(index));

        info.appendChild(nombre);
        info.appendChild(talle);
        info.appendChild(precioUnit);
        info.appendChild(cantidadWrap);
        info.appendChild(subtotal);
        info.appendChild(btnEliminar);

        fila.appendChild(img);
        fila.appendChild(info);

        contenedorCarrito.appendChild(fila);
    });

    const total = calcularTotal(carrito);
    totalCarritoSpan.textContent = total;
}

function cambiarCantidad(index, delta) {
    const carrito = obtenerCarrito();
    const item = carrito[index];
    if (!item) return;

    item.cantidad += delta;
    if (item.cantidad <= 0) {
        carrito.splice(index, 1);
    }
    guardarCarrito(carrito);
    renderizarCarrito();
}

function eliminarItem(index) {
    const carrito = obtenerCarrito();
    carrito.splice(index, 1);
    guardarCarrito(carrito);
    renderizarCarrito();
}

btnVaciar.addEventListener("click", () => {
    if (confirm("¿Vaciar carrito?")) {
        localStorage.removeItem(CARRITO_KEY);
        renderizarCarrito();
    }
});

btnFinalizar.addEventListener("click", () => {
    const carrito = obtenerCarrito();
    if (carrito.length === 0) return;

    const total = calcularTotal(carrito);

    localStorage.setItem("ticketCarrito", JSON.stringify(carrito));
    localStorage.setItem("ticketTotal", String(total));

    localStorage.removeItem(CARRITO_KEY);

    window.location.href = "./ticket.html";
});

renderizarCarrito();