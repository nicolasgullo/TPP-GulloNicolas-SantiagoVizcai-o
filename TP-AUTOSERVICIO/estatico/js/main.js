const contenedorProductos = document.getElementById("lista-productos");
const btnAnterior = document.querySelector(".anterior");
const btnSiguiente = document.querySelector(".siguiente");
const btnOrden = document.getElementById("btnOrden");
const btnOrdenAlf = document.getElementById("btnOrdenAlf");
const iconDownAZ = btnOrdenAlf ? btnOrdenAlf.querySelector(".fa-arrow-down-a-z") : null;
const iconUpZA   = btnOrdenAlf ? btnOrdenAlf.querySelector(".fa-arrow-up-z-a") : null;

let productos = [];
let productosFiltrados = [];
let paginaActual = 1;
const productosPorPagina = 6;
let ordenPrecioAsc = true;
let ordenNombreAsc = true;
let filtroActual = "todos"; 

async function cargarProductos() {
    try {
        const respuesta = await fetch("/api/productos?activos=true");

        if (!respuesta.ok) {
            throw new Error("Error al obtener productos");
        }

        productos = await respuesta.json();

        productosFiltrados = [...productos];
        paginaActual = 1;
        renderizarPagina();
    } catch (error) {
        console.error(error);
        contenedorProductos.innerHTML =
            "<p>Ocurrió un error al cargar los productos.</p>";
    }
}

function renderizarPagina() {
    const totalPaginas = Math.ceil(productosFiltrados.length / productosPorPagina);
    if (paginaActual > totalPaginas && totalPaginas > 0) {
        paginaActual = totalPaginas;
    }

    const inicio = (paginaActual - 1) * productosPorPagina;
    const fin = inicio + productosPorPagina;

    const productosPagina = productosFiltrados.slice(inicio, fin);

    contenedorProductos.innerHTML = "";

    productosPagina.forEach((p) => {
        const card = crearCardProducto(p);
        contenedorProductos.appendChild(card);
    });

    actualizarBotones();
}

function actualizarBotones() {
    const totalPaginas = Math.ceil(productosFiltrados.length / productosPorPagina);

    btnAnterior.disabled = paginaActual === 1 || totalPaginas === 0;
    btnSiguiente.disabled = paginaActual === totalPaginas || totalPaginas === 0;
}

function crearCardProducto(p) {
    const card = document.createElement("article");
    card.classList.add("card-producto", "producto");

    card.dataset.tipo = (p.tipo || "").toLowerCase();

    const imgWrap = document.createElement("div");
    imgWrap.classList.add("card-img-wrap");

    const imgFront = document.createElement("img");
    imgFront.classList.add("img-front");
    imgFront.src = p.imagenPrincipal;
    imgFront.alt = p.name;

    const imgBack = document.createElement("img");
    imgBack.classList.add("img-back");
    imgBack.src = p.imagenHover;
    imgBack.alt = p.name;

    imgWrap.appendChild(imgFront);
    imgWrap.appendChild(imgBack);

    const nombre = document.createElement("h3");
    nombre.classList.add("nombre-producto");
    nombre.textContent = p.name;

    const talle = document.createElement("p");
    talle.classList.add("talle-producto");
    talle.textContent = `Talle: ${p.talle}`;

    const precio = document.createElement("p");
    precio.classList.add("precio-producto");
    precio.textContent = `$${p.precio}`;

    const btnCarrito = document.createElement("button");
    btnCarrito.type = "button";
    btnCarrito.className = "btn-carrito-agregar";
    btnCarrito.textContent = "Agregar al carrito";
    btnCarrito.dataset.id = p.id;
    btnCarrito.addEventListener("click", () => agregarAlCarrito(p));

    card.appendChild(imgWrap);
    card.appendChild(nombre);
    card.appendChild(talle);
    card.appendChild(precio);
    card.appendChild(btnCarrito);

    return card;
}

function agregarAlCarrito(p) {
    const KEY = "carrito";
    const carrito = JSON.parse(localStorage.getItem(KEY)) || [];
    const idx = carrito.findIndex(item => item.id === p.id);
    if (idx >= 0) {
        carrito[idx].cantidad += 1;
    } else {
        carrito.push({
            id: p.id,
            name: p.name,
            precio: p.precio,
            imagenPrincipal: p.imagenPrincipal,
            talle: p.talle,
            cantidad: 1
        });
    }
    localStorage.setItem(KEY, JSON.stringify(carrito));
    alert(`Producto agregado: ${p.name}`);
}

btnAnterior.addEventListener("click", () => {
    if (paginaActual > 1) {
        paginaActual--;
        renderizarPagina();
    }
});

btnSiguiente.addEventListener("click", () => {
    const totalPaginas = Math.ceil(productosFiltrados.length / productosPorPagina);
    if (paginaActual < totalPaginas) {
        paginaActual++;
        renderizarPagina();
    }
});

btnOrden.addEventListener("click", () => {
    ordenPrecioAsc = !ordenPrecioAsc;
    productosFiltrados.sort((a, b) => {
        const pa = Number(a.precio);
        const pb = Number(b.precio);
        return ordenPrecioAsc ? pa - pb : pb - pa;
    });
    paginaActual = 1;
    renderizarPagina();
});

if (iconDownAZ && iconUpZA) {
    iconDownAZ.style.display = "inline";
    iconUpZA.style.display = "none";
}

btnOrdenAlf.addEventListener("click", () => {
    ordenNombreAsc = !ordenNombreAsc;
    productosFiltrados.sort((a, b) => {
        const nameA = a.name.toUpperCase();
        const nameB = b.name.toUpperCase();
        if (nameA < nameB) return ordenNombreAsc ? -1 : 1;
        if (nameA > nameB) return ordenNombreAsc ? 1 : -1;
        return 0;
    });

    if (iconDownAZ && iconUpZA) {
        if (ordenNombreAsc) {
            iconDownAZ.style.display = "inline";
            iconUpZA.style.display = "none";
        } else {
            iconDownAZ.style.display = "none";
            iconUpZA.style.display = "inline";
        }
    }

    paginaActual = 1;
    renderizarPagina();
});

function aplicarFiltroPorTipo(tipo) {
    filtroActual = tipo;

    if (filtroActual === "todos") {
        productosFiltrados = [...productos];
    } else {
        const t = filtroActual.toLowerCase();
        productosFiltrados = productos.filter(p => (p.tipo || "").toLowerCase() === t);
    }

    paginaActual = 1;
    renderizarPagina();
}

cargarProductos();