const inputNombre = document.getElementById("clienteNombre");
const btnContinuar = document.getElementById("btnContinuar");

btnContinuar.addEventListener("click", function (e) {
    const nombre = inputNombre.value.trim();

    if (nombre === "") {
        e.preventDefault();
        alert("Por favor, ingresá tu nombre antes de continuar.");
        return;
    }

    localStorage.setItem("clienteNombre", nombre);
});