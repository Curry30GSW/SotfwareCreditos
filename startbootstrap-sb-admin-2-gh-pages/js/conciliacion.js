document.addEventListener('DOMContentLoaded', async function () {
    try {
        // Obtener el total de créditos pagados en plataforma
        const responsePlataforma = await fetch('http://localhost:5000/api/creditos/count');
        const responseSoftware = await fetch('http://localhost:5000/api/pagados/creditos');

        if (responsePlataforma.ok && responseSoftware.ok) {
            const resultPlataforma = await responsePlataforma.json();
            const resultSoftware = await responseSoftware.json();

            const pagadosPlataforma = resultPlataforma.total || 0;
            const pagadosSoftware = resultSoftware.pagados || 0;

            // Calcular la diferencia
            const diferencia = pagadosPlataforma - pagadosSoftware;

            // Mostrar los valores en el frontend
            document.getElementById('pagadosAS400').innerHTML = `<strong>${pagadosPlataforma}</strong>`;
            document.getElementById('pagadosPagare').innerHTML = `<strong>${pagadosSoftware}</strong>`;
            document.getElementById('diferenciaPagos').innerHTML = `<strong>${diferencia}</strong>`;
        } else {
            console.error('❌ Error al obtener los datos de los pagos.');
        }
    } catch (error) {
        console.error('❌ Error al obtener los datos:', error);
    }
});




const contenedor = document.querySelector('#Resultadopendientes');



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
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    return `${month}-${year}`;
}

// Función para obtener el nombre del mes y año en formato "Mes-Año"
function getMonthYear(date) {
    const months = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    return `${month}-${year}`;
}

// Función para obtener el nombre del mes y año en formato "Mes-Año"
function getMonthYear(date) {
    const months = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
    const month = months[date.getMonth()];
    const year = date.getFullYear();
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
document.addEventListener('DOMContentLoaded', () => {
    updateMonths();
    creditosPendientesAS400();
});




const obtenerConsecutivos = async () => {
    try {
        const response = await fetch('http://localhost:5000/api/conciliacion/primer-credito');
        const data = await response.json();

        if (data.MinimoID && data.MaximoID) {
            const consecutivoInicial = data.MinimoID;
            const consecutivoFinal = data.MaximoID;
            const registradosPagares = consecutivoFinal - consecutivoInicial;
            const creditosAnulados = data.Anulados;
            const creditosRechazados = data.Rechazados
            const creditosAprobados = data.Aprobados

            document.getElementById('consecutivoInicial').textContent = consecutivoInicial;
            document.getElementById('consecutivoFinal').textContent = consecutivoFinal;
            document.getElementById('registradosPagares').textContent = registradosPagares;
            document.getElementById('anulados').textContent = creditosAnulados;
            document.getElementById('rechazados').textContent = creditosRechazados;
            document.getElementById('aprobados').textContent = creditosAprobados;


        } else {
            document.getElementById('consecutivoInicial').textContent = 'No disponible';
            document.getElementById('consecutivoFinal').textContent = 'No disponible';
            document.getElementById('registradosPagares').textContent = 'No disponible';
            document.getElementById('anulados').textContent = 'No disponible';
            document.getElementById('aprobados').textContent = 'No disponible';
        }
    } catch (error) {
        console.error('❌ Error al obtener los consecutivos:', error);
    }
};
// 🔹 Ejecutar función al cargar la página
document.addEventListener('DOMContentLoaded', obtenerConsecutivos);


const creditosPendientesAS400 = async () => {
    try {
        // Hacer todas las peticiones al mismo tiempo
        const responses = await Promise.all([
            fetch('http://localhost:5000/api/creditos-pendientes/contar/2'),
            fetch('http://localhost:5000/api/creditos-pendientes/contar/1'),
            fetch('http://localhost:5000/api/creditos-pendientes/contar/0')
        ]);

        // Convertir todas las respuestas a JSON
        const data = await Promise.all(responses.map(response => response.json()));

        // Asignar los valores a cada celda
        document.getElementById('pendientesPrimerMes').textContent = data[2].total_cuentas || '0';
        document.getElementById('pendientesTwoMes').textContent = data[1].total_cuentas || '0';
        document.getElementById('pendientesTercerMes').textContent = data[0].total_cuentas || '0';

    } catch (error) {
        console.error('Error al obtener créditos pendientes:', error);
        document.getElementById('pendientesPrimerMes').textContent = 'Error';
        document.getElementById('pendientesTwoMes').textContent = 'Error';
        document.getElementById('pendientesTercerMes').textContent = 'Error';
    }
};




//Mostrar Resultados
fetch('http://localhost:5000/api/creditos-pendientes/2', {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json',
    },
})
    .then(response => {
        if (!response.ok) {
            throw new Error('Error en la solicitud');
        }
        return response.json();
    })
    .then(creditosPendientes => {
        mostrar(creditosPendientes);
    })
    .catch(error => {
        console.error('Error:', error);
    });

const mostrar = (creditosPendientes) => {
    let resultados = '';
    let contador = 1;

    creditosPendientes.forEach(creditosPendientes => {
        // Convertir fecha de registro a un formato legible
        const rawFecha = creditosPendientes.FECI26;
        const fechaCalculada = rawFecha + 19000000;
        const año = Math.floor(fechaCalculada / 10000);
        const mesNumero = Math.floor((fechaCalculada % 10000) / 100);
        const dia = String(fechaCalculada % 100).padStart(2, '0');
        const fechaFormateada = `${dia} de ${obtenerNombreMes(mesNumero)} de ${año}`;

        function obtenerNombreMes(mes) {
            const meses = [
                'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
                'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
            ];
            return meses[mes - 1];
        }

        let saldoCapital = Number(creditosPendientes.SCAP26 || 0).toLocaleString("es-CO");

        resultados +=
            `<tr>
                    <td class="text-center text-dark ">${contador}</td> 
                    <td class="text-center text-dark ">${fechaFormateada}</td>
                    <td class="text-center text-dark ">${creditosPendientes.DESC03}</td>
                    <td class="text-center text-dark ">${creditosPendientes.NCTA26}</td>
                    <td class="text-center text-dark ">${creditosPendientes.DESC05}</td> 
                    <td class="text-center text-dark ">${creditosPendientes.TCRE26}</td>
                    <td class="text-center text-dark ">${creditosPendientes.CPTO26}</td>
                    <td class="text-center text-dark ">${saldoCapital}</td>
                    <td class="text-center text-dark ">${creditosPendientes.DESC04}</td>
                </tr>`;

        contador++; // Aumenta el contador en cada iteración
    });

    contenedor.innerHTML = resultados;

    // Inicializar DataTables
    if ($.fn.DataTable.isDataTable('#tablaPendientes')) {
        $('#tablaPendientes').DataTable().destroy();
    }

    $('#tablaPendientes').DataTable({
        language: {
            "sProcessing": "Procesando...",
            "sLengthMenu": "Mostrar _MENU_ Registros",
            "sZeroRecords": "No se encontraron resultados",
            "sEmptyTable": "Ningún dato disponible en esta tabla",
            "sInfo": "Datos del _START_ al _END_ para un total de _TOTAL_ registros",
            "sInfoEmpty": "Mostrando registros del 0 al 0 de un total de 0 registros",
            "sInfoFiltered": "(filtrado de un total de _MAX_ registros)",
            "sSearch": "Buscar:",
            "oPaginate": {
                "sNext": "Siguiente",
                "sPrevious": "Anterior"
            }
        },
        "lengthMenu": [[5, 10, 15, 20, 25], [5, 10, 15, 20, 25]]
    });
};
