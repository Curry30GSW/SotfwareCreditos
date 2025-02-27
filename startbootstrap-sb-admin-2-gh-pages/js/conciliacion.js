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

const creditoPendienteMes = (mes) => {
    console.log(`Consultando mes: ${mes}`);
    fetch(`http://localhost:5000/api/creditos-pendientes/${mes}`)
        .then(response => response.json())
        .then(data => {
            if (data.mensaje || data.length === 0) {
                Swal.fire({
                    icon: 'info',
                    title: 'Sin resultados',
                    text: 'No hay análisis para este mes.',
                    confirmButtonColor: '#3085d6',
                    confirmButtonText: 'Entendido'
                });
                return;
            }

            let contenido = '';

            data.forEach((detalle, index) => {
                let saldoCapital = Number(detalle.SCAP26 || 0).toLocaleString("es-CO");
                let fechaFormateada = formatearFecha(detalle.FECH23);
                contenido += `
                    <tr>
                        <td class="text-dark font-weight-bold">${index + 1}</td>
                        <td class="text-dark font-weight-bold">${fechaFormateada}</td>
                        <td class="text-center text-dark ">${detalle.NANA26}</td>
                        <td class="text-center text-dark ">${detalle.DIRE03}</td>
                        <td class="text-center text-dark ">${detalle.DIST03}</td>
                        <td class="text-center text-dark ">${detalle.DESC03}</td>
                        <td class="text-center text-dark ">${detalle.NCTA26}</td>
                        <td class="text-center text-dark ">${detalle.DESC05}</td> 
                        <td class="text-center text-dark ">${detalle.TCRE26}</td>
                        <td class="text-center text-dark "> ${detalle.CPTO26}</td>
                        <td class="text-center font-weight-bold 
                        ${detalle.Score === 'NO TIENE CONSULTA REALIZADA' ? 'text-warning' :
                        detalle.Score < 650 ? 'text-danger' : 'text-primary'}">
                        ${detalle.Score}
                        </td>
                        <td class="text-dark ">$${saldoCapital}</td>
                        <td class="text-center text-dark ">${detalle.TASA26} %</td>
                        <td class="text-center text-dark ">${detalle.DESC04}</td>
                    </tr>`;
            });

            // Asegurar que la tabla se limpie antes de agregar nuevos datos
            let table = $('#tablaDetalles').DataTable();
            table.clear().destroy();

            document.getElementById('detalleContenido').innerHTML = contenido;

            let modal = new bootstrap.Modal(document.getElementById('modalPendientes'));
            modal.show();

            $('#tablaDetalles').DataTable({
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
                "lengthMenu": [[5, 10, 15, 20], [5, 10, 15, 20]],
                dom: '<"top"lfB>rtip',
                buttons: [],
            });
        })
        .catch(error => {
            console.error('Error al obtener los detalles:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Ocurrió un problema al obtener los datos.',
                confirmButtonColor: '#d33',
                confirmButtonText: 'Cerrar'
            });
        });
};




const contenedor = document.querySelector('#Resultadopendientes');



// Función para obtener el nombre del mes
function obtenerMesNombre(mesNumero) {
    const meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
    return meses[mesNumero];
}

// Función para actualizar el concepto
function actualizarConcepto() {
    const fechaHoy = new Date();
    const mesHoy = fechaHoy.getMonth();
    const anioHoy = fechaHoy.getFullYear();

    const primerDiaMes = "01";
    const mesNombre = obtenerMesNombre(mesHoy);

    // Formato: 01 Febrero - 17 Febrero 2025
    const fechaFormateada = `${primerDiaMes} ${mesNombre} - ${fechaHoy.getDate()} ${mesNombre} ${anioHoy}`;

    // Actualizar la celda con el concepto
    document.getElementById('conceptoFecha').innerHTML = fechaFormateada;

    // Actualizar los spans en la tabla
    document.getElementById('mesActual').innerText = `(${mesNombre})`;
    document.getElementById('mesActualFinal').innerText = `(${mesNombre})`;
}

// Función auxiliar para obtener el nombre del mes
function obtenerMesNombre(mes) {
    const meses = [
        "Ene", "Feb", "Mar", "Abr", "May", "Jun",
        "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"
    ];
    return meses[mes];
}

actualizarConcepto();


// Función para obtener el nombre del mes y año en formato "Mes-Año"
function getMonthYear(date) {
    const months = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    return `${month}-${year}`;
}



// Función para actualizar los seis meses en los <td> correspondientes
function updateMonths() {
    const currentDate = new Date();

    for (let i = 1; i <= 6; i++) {
        const date = new Date(currentDate);
        date.setMonth(currentDate.getMonth() - i);

        const monthYear = getMonthYear(date);
        const tdElement = document.getElementsByClassName('month-' + i)[0];

        const button = document.createElement("button");
        button.className = "btn btn-link text-primary p-0 ms-2 ml-3";
        button.innerHTML = '<i class="fas fa-eye"></i>';


        // Usamos una función anónima para evitar el problema del closure
        button.onclick = ((mes) => () => creditoPendienteMes(mes))(i - 1);


        tdElement.innerHTML = "";
        tdElement.appendChild(document.createTextNode(monthYear));
        tdElement.appendChild(button);

        if (i === 6) {
            document.getElementById("monthCinco").textContent = `${monthYear}`;
        }
    }
}





// Función auxiliar para obtener el nombre del mes y año
function getMonthYear(date) {
    const meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
    return `${meses[date.getMonth()]}-${date.getFullYear()}`;
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
            fetch('http://localhost:5000/api/creditos-pendientes/contar/5'),
            fetch('http://localhost:5000/api/creditos-pendientes/contar/4'),
            fetch('http://localhost:5000/api/creditos-pendientes/contar/3'),
            fetch('http://localhost:5000/api/creditos-pendientes/contar/2'),
            fetch('http://localhost:5000/api/creditos-pendientes/contar/1'),
            fetch('http://localhost:5000/api/creditos-pendientes/contar/0')
        ]);

        // Convertir todas las respuestas a JSON
        const data = await Promise.all(responses.map(response => response.json()));

        // Asignar los valores a cada celda

        document.getElementById('pendientesSextoMes').textContent = data[0].total_cuentas || '0'; // mes=5
        document.getElementById('pendientesQuintoMes').textContent = data[1].total_cuentas || '0'; // mes=4
        document.getElementById('pendientesCuartoMes').textContent = data[2].total_cuentas || '0'; // mes=3
        document.getElementById('pendientesTercerMes').textContent = data[3].total_cuentas || '0'; // mes=2
        document.getElementById('pendientesTwoMes').textContent = data[4].total_cuentas || '0'; // mes=1
        document.getElementById('pendientesPrimerMes').textContent = data[5].total_cuentas || '0'; // mes=0


    } catch (error) {
        console.error('Error al obtener créditos pendientes:', error);
        document.getElementById('pendientesPrimerMes').textContent = 'Error';
        document.getElementById('pendientesSextoMes').textContent = 'Error';
        document.getElementById('pendientesQuintoMes').textContent = 'Error';
        document.getElementById('pendientesCuartoMes').textContent = 'Error';
        document.getElementById('pendientesTercerMes').textContent = 'Error';
        document.getElementById('pendientesTwoMes').textContent = 'Error';
    }
};




//Mostrar Resultados
fetch('http://localhost:5000/api/creditos-pendientes/5', {
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
        const rawFecha = creditosPendientes.FECH23;
        const fechaCalculada = rawFecha + 19000000;
        const año = Math.floor(fechaCalculada / 10000);
        const mesNumero = Math.floor((fechaCalculada % 10000) / 100);
        const dia = String(fechaCalculada % 100).padStart(2, '0');
        const fechaFormateada = `${dia} ${obtenerNombreMes(mesNumero)} del ${año}`;

        function obtenerNombreMes(mes) {
            const meses = [
                'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
                'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
            ];
            return meses[mes - 1];
        }

        let saldoCapital = Number(creditosPendientes.SCAP26 || 0).toLocaleString("es-CO");

        resultados +=
            `<tr>
                    <td class="text-center text-dark ">${contador}</td> 
                    <td class="text-dark ">${fechaFormateada}</td>
                    <td class="text-center text-dark ">${creditosPendientes.NANA26}</td>
                    <td class="text-center text-dark ">${creditosPendientes.DIRE03}</td>
                    <td class="text-center text-dark ">${creditosPendientes.DIST03}</td>
                    <td class="text-center text-dark ">${creditosPendientes.DESC03}</td>
                    <td class="text-center text-dark ">${creditosPendientes.NCTA26}</td>
                    <td class="text-center text-dark ">${creditosPendientes.DESC05}</td> 
                    <td class="text-center text-dark ">${creditosPendientes.TCRE26}</td>
                    <td class="text-center text-dark "> ${creditosPendientes.CPTO26}</td>
                    <td class="text-center font-weight-bold" 
                        style="${creditosPendientes.Score === 'NO TIENE CONSULTA REALIZADA' ? 'color:#fd7e14' :
                creditosPendientes.Score < 650 ? 'color:red' : 'color:#007bff'}">
                        ${creditosPendientes.Score}
                    </td>
                    <td class="text-dark ">$${saldoCapital}</td>
                    <td class="text-center text-dark ">${creditosPendientes.TASA26} %</td>
                    <td class="text-center text-dark ">${creditosPendientes.DESC04}</td>
          
                </tr>`;

        contador++;
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

const formatearFecha = (fechaRaw) => {
    if (!fechaRaw) return "Fecha inválida";

    const fechaCalculada = fechaRaw + 19000000;
    const año = Math.floor(fechaCalculada / 10000);
    const mesNumero = Math.floor((fechaCalculada % 10000) / 100);
    const dia = String(fechaCalculada % 100).padStart(2, '0');

    return `${dia} ${obtenerNombreMes(mesNumero)} del ${año}`;
};
// Función para obtener el nombre del mes en español
const obtenerNombreMes = (mes) => {
    const meses = [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    return meses[mes - 1];
};