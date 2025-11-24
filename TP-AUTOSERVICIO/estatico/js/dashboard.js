document.addEventListener("DOMContentLoaded", () => {
    document.addEventListener("click", async (e) => {
        const btn = e.target.closest(".btn-desactivar, .btn-activar");
        if (!btn) return;

        const id = btn.dataset.id;
        if (!id) return;

        const esDesactivar = btn.classList.contains("btn-desactivar");
        const accion = esDesactivar ? "desactivar" : "activar";
        const url = `/api/productos/${id}/${accion}`;

        if (esDesactivar) {
            const confirmacion = confirm("¿Seguro que querés desactivar este producto?");
            if (!confirmacion) return;
        }

        if (btn.dataset.loading === "true") return;
        btn.dataset.loading = "true";
        const textoOriginal = btn.textContent.trim();
        btn.textContent = esDesactivar ? "Desactivando..." : "Activando...";

        try {
            const resp = await fetch(url, { method: "PUT", headers: { "Content-Type": "application/json" } });
            const data = await resp.json().catch(() => ({}));
            console.log(`Respuesta ${accion}:`, resp.status, data);
            if (!resp.ok) throw new Error(data.message || data.error || `Error al ${accion}`);

            const tdActivo = btn.closest("tr").querySelector("td:nth-child(6)");
            if (tdActivo) tdActivo.textContent = esDesactivar ? "No" : "Sí";

            btn.outerHTML = esDesactivar
                ? `<button class="btn-admin btn-admin-small btn-activar" data-id="${id}">Activar</button>`
                : `<button class="btn-admin btn-admin-small btn-desactivar" data-id="${id}">Desactivar</button>`;
        } catch (error) {
            console.error(error);
            alert(error.message);
            btn.textContent = textoOriginal;
        } finally {
            btn.dataset.loading = "false";
        }
    });
});