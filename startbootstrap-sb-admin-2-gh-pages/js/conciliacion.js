document.getElementById('enviarLapso').addEventListener('click', async function () {
    const fechaInicio = document.getElementById('fechaInicio').value;
    const fechaFin = document.getElementById('fechaFin').value;

    // Asegurarse de que las fechas son números enteros
    const lapsoInicio = parseInt(fechaInicio, 10);  // Convierte el valor a número
    const lapsoFin = parseInt(fechaFin, 10);  // Convierte el valor a número

    if (!lapsoInicio || !lapsoFin) {
        alert("Por favor, complete ambas fechas.");
        return;
    }

    // Datos a enviar en el cuerpo de la solicitud
    const data = {
        lapsoInicio: lapsoInicio,  // Enviar como número
        lapsoFin: lapsoFin  // Enviar como número
    };

    try {
        // Enviar las fechas al backend a través de un POST
        const response = await fetch('http://localhost:5000/api/creditos/count', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data) // Enviar como JSON
        });

        // Verificar si la respuesta es correcta
        if (response.ok) {
            const result = await response.json();
            document.getElementById('pagadosAS400').innerHTML = `<strong>${result.total || 0}</strong>`;
            // Cerrar la modal después de enviar
            $('#lapsoModal').modal('hide');
        } else {
            alert('Error al obtener el conteo de créditos.');
        }
    } catch (error) {
        console.error('Error al enviar las fechas:', error);
    }
});


// Función para obtener el nombre del mes
function obtenerMesNombre(mesNumero) {
    const meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
    return meses[mesNumero];
}

// Función para actualizar el concepto
function actualizarConcepto() {
    const fechaHoy = new Date();
    const diaHoy = fechaHoy.getDate();
    const mesHoy = fechaHoy.getMonth();
    const anioHoy = fechaHoy.getFullYear();

    // Establecemos el primer día del mes para el inicio del rango (01 Febrero)
    const primerDiaMes = "01";

    // Formato: 01 Febrero - 17 Febrero 2025
    const fechaFormateada = `${primerDiaMes} ${obtenerMesNombre(mesHoy)} - ${String(diaHoy).padStart(2, '0')} ${obtenerMesNombre(mesHoy)} ${anioHoy}`;

    // Actualizar la celda con el concepto
    document.getElementById('conceptoFecha').innerHTML = fechaFormateada;
}

// Llamamos a la función para actualizar el concepto
actualizarConcepto();


// Función para obtener el nombre del mes y año en formato "Mes-Año"
function getMonthYear(date) {
    const months = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
    const month = months[date.getMonth()]; // Obtener el nombre del mes
    const year = date.getFullYear(); // Obtener el año
    return `${month}-${year}`;
}

// Función para obtener el nombre del mes y año en formato "Mes-Año"
function getMonthYear(date) {
    const months = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
    const month = months[date.getMonth()]; // Obtener el nombre del mes
    const year = date.getFullYear(); // Obtener el año
    return `${month}-${year}`;
}

// Función para obtener el nombre del mes y año en formato "Mes-Año"
function getMonthYear(date) {
    const months = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
    const month = months[date.getMonth()]; // Obtener el nombre del mes
    const year = date.getFullYear(); // Obtener el año
    return `${month}-${year}`;
}

// Función para actualizar los tres meses en los <td> correspondientes
function updateMonths() {
    // Obtener la fecha actual
    const currentDate = new Date();

    // Modificar el mes para que el primer mes mostrado sea el mes anterior al actual
    for (let i = 1; i <= 3; i++) {
        const date = new Date(currentDate);
        date.setMonth(currentDate.getMonth() - i); // Restar meses para los tres últimos

        const monthYear = getMonthYear(date); // Obtener el formato "Mes-Año"

        // Actualizar el contenido del <td> correspondiente
        document.getElementsByClassName('month-' + i)[0].textContent = monthYear;
    }
}

// Llamar a la función cuando la página cargue
window.onload = updateMonths;
