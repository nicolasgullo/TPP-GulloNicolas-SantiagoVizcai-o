const btnCliente = document.getElementById("btnCliente");

if (btnCliente) {
    btnCliente.addEventListener("click", () => {
        window.location.href = "/estatico/index.html";
    });
}