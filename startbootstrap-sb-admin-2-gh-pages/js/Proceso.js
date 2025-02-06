document.getElementById("consultar").addEventListener("click", async function () {
    let cuenta = document.getElementById("slt-cuenta").value;
    let servicio = document.getElementById("slt-servicio").value;
    let token = localStorage.getItem("jwt"); // Obtener el token del localStorage

    if (!token) {
        document.getElementById("EstadoCta").innerHTML = "Error: No se encontró el token de autenticación.";
        return;
    }

    let url_servicio = "";
    let mensaje = "";

    if (servicio == 1) {
        url_servicio = "http://localhost:5000/api/cuenta/58";
        mensaje = "Generando Estado de Cuenta...";
    } else if (servicio == 2) {
        url_servicio = "src/Certificado.php";
        mensaje = "Generando Certificado...";
    }

    document.getElementById("EstadoCta").innerHTML = mensaje;

    let formData = new FormData();
    formData.append("cuenta", cuenta);
    formData.append("servicio", servicio);

    try {
        const response = await fetch(url_servicio, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`
            },
            body: formData,
        });

        const data = await response.text();
        document.getElementById("EstadoCta").innerHTML = data;
    } catch (error) {
        console.error("Error en la petición:", error);
        document.getElementById("EstadoCta").innerHTML = "Error al cargar el servicio.";
    }
});
