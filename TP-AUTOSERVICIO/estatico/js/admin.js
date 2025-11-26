const btnCliente = document.getElementById("btnCliente");

if (btnCliente) {
    btnCliente.addEventListener("click", () => {
        window.location.href = "/estatico/index.html";
    });
}

document.addEventListener("DOMContentLoaded", () => {
    const btnAuto = document.getElementById("btnAutocompletar");
    const emailInput = document.getElementById("email");
    const passInput = document.getElementById("password");

    if (btnAuto) {
        btnAuto.addEventListener("click", () => {
            emailInput.value = "admin@admin.com";
            passInput.value = "123456";
        });
    }
});