document.getElementById("imprime").addEventListener("click", function () {
    var contentElement = document.getElementById("printContent");

    if (!contentElement) {
        console.error("Elemento 'printContent' no encontrado.");
        return;
    }



    var printContent = contentElement.innerHTML;
    var styles = `
        <style>
            @media print {
                body::before {
        content: "DOCUMENTO INFORMATIVO NO VÁLIDO PARA TRANSACCIONES";
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 60px;
        color: rgba(0, 0, 0, 0.3); 
        font-weight: bold;
        text-transform: uppercase;
        white-space: pre-line; /* Permite el salto de línea */
        text-align: center;
        z-index: 9999;
        pointer-events: none;
    }
                body {
                    margin: 2cm;
                    padding: 1cm;
                }
                .no-print {
                    display: none;
                }
            }
        </style>
    `;

    var originalContent = document.body.innerHTML;

    document.body.innerHTML = "<html><head><title>Estado de Cuenta</title>" + styles + "</head><body>" + printContent + "</body></html>";
    window.print();
    document.body.innerHTML = originalContent;
    location.reload();
});
// Generar QR solo si van a imprimir
// var qrContainer = document.getElementById("qrCode");
// qrContainer.innerHTML = ""; // Limpiar contenido previo
// new QRCode(qrContainer, {
//     text: "https://www.coopserp.com/wp1/",
//     width: 100,
//     height: 100
// });