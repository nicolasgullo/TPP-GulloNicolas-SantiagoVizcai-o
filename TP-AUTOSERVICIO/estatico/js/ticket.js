function cargarTicket() {
    const nombreCliente = localStorage.getItem("clienteNombre") || "Cliente";
    const carritoStr = localStorage.getItem("ticketCarrito");
    const totalStr = localStorage.getItem("ticketTotal") || "0";

    const nombreSpan = document.getElementById("ticket-nombre-cliente");
    const fechaSpan = document.getElementById("ticket-fecha");
    const totalSpan = document.getElementById("ticket-total");
    const tbody = document.getElementById("ticket-body");

    nombreSpan.textContent = nombreCliente;

    const hoy = new Date();
    fechaSpan.textContent = hoy.toLocaleDateString("es-AR");

    let carrito = [];
    try {
        carrito = carritoStr ? JSON.parse(carritoStr) : [];
    } catch (e) {
        carrito = [];
    }

    tbody.innerHTML = "";

    if (!carrito || carrito.length === 0) {
        const fila = document.createElement("tr");
        const celda = document.createElement("td");
        celda.colSpan = 5;
        celda.textContent = "No hay productos para mostrar en el ticket.";
        fila.appendChild(celda);
        tbody.appendChild(fila);
        totalSpan.textContent = "0";
        return;
    }

    carrito.forEach(item => {
        const fila = document.createElement("tr");

        const tdNombre = document.createElement("td");
        tdNombre.textContent = item.name;

        const tdTalle = document.createElement("td");
        tdTalle.textContent = item.talle;

        const tdCant = document.createElement("td");
        tdCant.textContent = item.cantidad;

        const tdPrecio = document.createElement("td");
        tdPrecio.textContent = `$${item.precio}`;

        const tdSubtotal = document.createElement("td");
        tdSubtotal.textContent = `$${item.precio * item.cantidad}`;

        fila.appendChild(tdNombre);
        fila.appendChild(tdTalle);
        fila.appendChild(tdCant);
        fila.appendChild(tdPrecio);
        fila.appendChild(tdSubtotal);

        tbody.appendChild(fila);
    });

    totalSpan.textContent = totalStr;
}

const btnDescargarPdf = document.getElementById("btnDescargarPdf");
const btnSalir = document.getElementById("btnSalir");

btnDescargarPdf.addEventListener("click", async () => {
    const nombreCliente = localStorage.getItem("clienteNombre") || "Cliente";
    const carritoStr = localStorage.getItem("ticketCarrito");
    const totalStr = localStorage.getItem("ticketTotal") || "0";

    let carrito = [];
    try {
        carrito = carritoStr ? JSON.parse(carritoStr) : [];
    } catch (e) {
        carrito = [];
    }

    try {
        const resp = await fetch("/api/ticket/pdf", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                nombreCliente,
                carrito,
                total: Number(totalStr),
            }),
        });

        if (!resp.ok) {
            throw new Error("Error al generar PDF");
        }

        const blob = await resp.blob();
        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = "ticket.pdf";
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
    } catch (err) {
        console.error(err);
        alert("Ocurrió un error al generar el PDF");
    }
});

btnSalir.addEventListener("click", () => {
    localStorage.removeItem("ticketCarrito");
    localStorage.removeItem("ticketTotal");
    localStorage.removeItem("carrito");
    localStorage.removeItem("clienteNombre");

    window.location.href = "./index.html";
});

cargarTicket();