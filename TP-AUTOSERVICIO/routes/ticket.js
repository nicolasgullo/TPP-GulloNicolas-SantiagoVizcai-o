import { Router } from "express";
import puppeteer from "puppeteer";

const router = Router();

router.post("/pdf", async (req, res) => {
    try {
        const { nombreCliente, carrito, total } = req.body;

        const empresa = "Bussy Company";
        const fecha = new Date().toLocaleDateString("es-AR");

        const html = `
        <!doctype html>
        <html lang="es">
        <head>
            <meta charset="utf-8" />
            <title>Ticket de compra</title>
            <style>
            body {
                font-family: Arial, sans-serif;
                font-size: 12px;
                margin: 20px;
            }
            h1 {
                text-align: center;
                margin-bottom: 10px;
            }
            .datos {
                margin-bottom: 15px;
            }
            .datos p {
                margin: 2px 0;
            }
            table {
                width: 100%;
                border-collapse: collapse;
                margin-top: 10px;
            }
            th, td {
                padding: 4px 6px;
                text-align: left;
                border: none;
                border-bottom: none;
            }
            th {
                font-weight: 700;
                background: transparent;
            }
            .total {
                margin-top: 12px;
                text-align: right;
                font-weight: bold;
            }
            </style>
        </head>
        <body>
            <h1>Ticket de compra</h1>
            <div class="datos">
            <p><strong>Empresa:</strong> ${empresa}</p>
            <p><strong>Cliente:</strong> ${nombreCliente || "Cliente"}</p>
            <p><strong>Fecha:</strong> ${fecha}</p>
            </div>

            <table>
            <thead>
                <tr>
                <th>Producto</th>
                <th>Talle</th>
                <th>Cant.</th>
                <th>Precio</th>
                <th>Subtotal</th>
                </tr>
            </thead>
            <tbody>
                ${
                (carrito || [])
                    .map(
                    (item) => `
                        <tr>
                        <td>${item.name}</td>
                        <td>${item.talle}</td>
                        <td>${item.cantidad}</td>
                        <td>$${item.precio}</td>
                        <td>$${item.precio * item.cantidad}</td>
                        </tr>
                    `
                    )
                    .join("")
                }
            </tbody>
            </table>

            <p class="total">Total: $${total}</p>
        </body>
        </html>
        `;

        const browser = await puppeteer.launch({
        headless: "new",
        });
        const page = await browser.newPage();

        await page.setContent(html, { waitUntil: "networkidle0" });

        const pdfBuffer = await page.pdf({ format: "A4" });

        await browser.close();

        res.set({
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="ticket.pdf"',
        });
        res.send(pdfBuffer);
    } catch (error) {
        console.error("Error generando PDF:", error);
        res.status(500).send("Error al generar el PDF");
    }
});

export default router;