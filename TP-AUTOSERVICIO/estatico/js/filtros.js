const enlacesFiltro = document.querySelectorAll(".filtro-tipo");

enlacesFiltro.forEach(enlace => {
    enlace.addEventListener("click", (e) => {
        e.preventDefault();

        const tipo = (enlace.dataset.tipo || "todos").toLowerCase();

        if (typeof window.aplicarFiltroPorTipo === "function") {
            window.aplicarFiltroPorTipo(tipo);
        }

        enlacesFiltro.forEach(a => a.classList.remove("activo"));
        enlace.classList.add("activo");
    });
});