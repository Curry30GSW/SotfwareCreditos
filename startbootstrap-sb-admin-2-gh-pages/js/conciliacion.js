// document.addEventListener('DOMContentLoaded', async function () {
//     try {
//         // Obtener el total de créditos pagados en plataforma
//         const responsePlataforma = await fetch('http://localhost:5000/api/creditos/count');
//         const responseSoftware = await fetch('http://localhost:5000/api/pagados/creditos');

//         if (responsePlataforma.ok && responseSoftware.ok) {
//             const resultPlataforma = await responsePlataforma.json();
//             const resultSoftware = await responseSoftware.json();

//             const pagadosPlataforma = resultPlataforma.total || 0;
//             const pagadosSoftware = resultSoftware.pagados || 0;

//             // Calcular la diferencia
//             const diferencia = pagadosPlataforma - pagadosSoftware;

//             // Mostrar los valores en el frontend
//             document.getElementById('pagadosAS400').innerHTML = `<strong>${pagadosPlataforma}</strong>`;
//             document.getElementById('pagadosPagare').innerHTML = `<strong>${pagadosSoftware}</strong>`;
//             document.getElementById('diferenciaPagos').innerHTML = `<strong>${diferencia}</strong>`;
//         } else {
//             console.error('❌ Error al obtener los datos de los pagos.');
//         }
//     } catch (error) {
//         console.error('❌ Error al obtener los datos:', error);
//     }
// });

const token = sessionStorage.getItem('token');


document.addEventListener('DOMContentLoaded', async function () {
    if (!token) {
        window.location.href = '../../SotfwareCreditos/login-form-02/login.html';
        return;
    }

    // Obtener la fecha actual
    const hoy = new Date();
    const primerDiaMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1);

    // Formatear las fechas en formato YYYY-MM-DD para los inputs
    const formatoFecha = (fecha) => fecha.toISOString().split('T')[0];

    // Asignar fechas por defecto
    document.getElementById('fechaInicio').value = formatoFecha(primerDiaMes);
    document.getElementById('fechaFin').value = formatoFecha(hoy);

    // Función para hacer la petición con las fechas actuales
    async function obtenerDatos(fechaInicio, fechaFin) {
        try {
            const url = `http://localhost:5000/api/pagados/creditos?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`;

            const responseSoftware = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
            });

            if (responseSoftware.status === 401) {
                const data = await responseSoftware.json();
                window.location.href = data.redirect || '../../SotfwareCreditos/login-form-02/login.html';
                return;
            }

            if (responseSoftware.ok) {
                const resultSoftware = await responseSoftware.json();
                const pagadosSoftware = resultSoftware.pagados || 0;

                document.getElementById('pagadosAS400').innerHTML = `<strong>${pagadosSoftware}</strong>`;
            } else {
                console.error('❌ Error al obtener los datos de los pagos en el software.');
            }
        } catch (error) {
            console.error('❌ Error al obtener los datos:', error);
        }
    }

    // Hacer la consulta con las fechas predeterminadas al cargar la página
    await obtenerDatos(formatoFecha(primerDiaMes), formatoFecha(hoy));

    // Evento cuando el usuario presiona "Guardar" para hacer otra consulta
    document.getElementById('guardarFechas').addEventListener('click', async function () {
        const fechaInicio = document.getElementById('fechaInicio').value;
        const fechaFin = document.getElementById('fechaFin').value;

        if (!fechaInicio || !fechaFin) {
            alert("Por favor, selecciona ambas fechas antes de continuar.");
            return;
        }

        await obtenerDatos(fechaInicio, fechaFin);

        Swal.fire({
            icon: 'success',
            title: 'Éxito ✅',
            text: 'Fechas enviadas correctamente.',
            confirmButtonColor: '#3085d6'
        });
    });
});





const creditoPendienteMes = (mes) => {
    fetch(`http://localhost:5000/api/creditos-pendientes/${mes}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` // Enviar el token en la cabecera
        }
    })
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
                      <td class="text-center font-weight-bold" 
                        style="${detalle.Score === 'F/D' || detalle.Score === 'S/E' ? 'color:#fd7e14' :
                        detalle.Score < 650 ? 'color:red' : 'color:#007bff'}">
                        ${detalle.Score}
                            </td>
                        <td class="text-center text-dark">${calcularEdad(detalle.FECN05)}</td>
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
                buttons: [
                    {
                        extend: 'excelHtml5',
                        text: '<i class="fas fa-file-excel"></i> Exportar a Excel',
                        title: 'Créditos Pendientes Por Pagar',
                        exportOptions: {
                            columns: ':visible'
                        },
                        className: 'btn-success' // Aplicamos Bootstrap directamente
                    }
                ],
                initComplete: function () {
                    // Asegurarnos de que el botón tome el estilo correctamente
                    $('.dt-buttons button').removeClass('dt-button').addClass('btn btn-success btn-m text-white');
                }
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



function obtenerFechaHoraActual() {
    const fechaHoy = new Date();


    // Formatear la hora
    let horas = fechaHoy.getHours();
    const minutos = String(fechaHoy.getMinutes()).padStart(2, '0');
    const segundos = String(fechaHoy.getSeconds()).padStart(2, '0');
    const periodo = horas >= 12 ? "P.M" : "A.M";

    horas = horas % 12 || 12;

    // Concatenar en el formato requerido
    return `${horas}:${minutos}:${segundos} ${periodo}`;
}

// Función para obtener el nombre abreviado del mes
function obtenerMesAbreviado(mes) {
    const meses = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
    return meses[mes];
}


setInterval(actualizarConcepto, 1000);


actualizarConcepto();


// Función auxiliar para obtener el nombre del mes
function obtenerMesNombre(mes) {
    const meses = [
        "Ene", "Feb", "Mar", "Abr", "May", "Jun",
        "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"
    ];
    return meses[mes];
}

actualizarConcepto();



// Función para actualizar los seis meses en los <td> correspondientes
function updateMonths() {
    const currentDate = new Date();

    for (let i = 1; i <= 7; i++) {
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

        if (i === 7) {
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


document.addEventListener('DOMContentLoaded', () => {
    const fechaInicioInput = document.getElementById('fechaInicio');
    const fechaFinInput = document.getElementById('fechaFin');

    const hoy = new Date();
    const primerDiaMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1).toISOString().split('T')[0];
    const fechaActual = hoy.toISOString().split('T')[0];

    // Si los campos están vacíos, asignar las fechas predeterminadas
    if (!fechaInicioInput.value) fechaInicioInput.value = primerDiaMes;
    if (!fechaFinInput.value) fechaFinInput.value = fechaActual;

    // Llamar a la función para actualizar el concepto solo al cargar la página
    actualizarConcepto(fechaInicioInput.value, fechaFinInput.value);
    obtenerConsecutivos(fechaInicioInput.value, fechaFinInput.value);
});

// Al hacer clic en "Guardar", actualizar concepto y obtener consecutivos
document.getElementById('guardarFechas').addEventListener('click', () => {
    const fechaInicio = document.getElementById('fechaInicio').value;
    const fechaFin = document.getElementById('fechaFin').value;
    const hoy = new Date().toISOString().split('T')[0];

    if (fechaInicio > fechaFin) {
        Swal.fire({
            icon: 'error',
            title: 'Fechas inválidas ❌',
            html: 'La fecha de inicio no puede ser mayor que la fecha final.',
            confirmButtonColor: '#d33'
        });
        return;
    }

    if (fechaInicio > hoy || fechaFin > hoy) {
        Swal.fire({
            icon: 'error',
            title: 'Fechas inválidas ❌',
            html: 'Por favor usa fechas correctas. No puedes seleccionar <b>Fechas Futuras</b>.',
            confirmButtonColor: '#d33'
        });
        return;
    }

    // Ahora sí actualizar el concepto y obtener los consecutivos
    actualizarConcepto(fechaInicio, fechaFin);
    obtenerConsecutivos(fechaInicio, fechaFin);
});

function actualizarConcepto(fechaInicio, fechaFin) {
    if (!fechaInicio || !fechaFin) return; // Evita errores si las fechas están vacías

    const fechaInicioObj = new Date(fechaInicio + "T00:00:00");
    const fechaFinObj = new Date(fechaFin + "T00:00:00");

    const diaInicio = fechaInicioObj.getDate().toString().padStart(2, '0');
    const mesInicio = obtenerMesNombre(fechaInicioObj.getMonth());
    const diaFin = fechaFinObj.getDate();
    const mesFin = obtenerMesNombre(fechaFinObj.getMonth());
    const anioFin = fechaFinObj.getFullYear();

    // Formato: 01 Febrero - 17 Febrero 2025
    const fechaFormateada = `${diaInicio} ${mesInicio} - ${diaFin} ${mesFin} ${anioFin}`;

    // Obtener la fecha y hora actual
    const fechaHoraActual = obtenerFechaHoraActual();

    // Actualizar la celda con el concepto y la fecha/hora actual
    document.getElementById('conceptoFecha').innerHTML = `${fechaFormateada} <br> <span id="horaActual"><b>${fechaHoraActual}</b></span>`;

    // Actualizar los spans en la tabla
    document.getElementById('mesActual').innerText = `(${mesInicio})`;
    document.getElementById('mesActualFinal').innerText = `(${mesFin})`;
}
function actualizarHoraEnTiempoReal() {
    setInterval(() => {
        const fechaHoraActual = obtenerFechaHoraActual();
        document.getElementById('horaActual').innerHTML = `<b>${fechaHoraActual}</b>`;
    }, 1000); // Se ejecuta cada segundo
}

// Llamar a la función cuando se cargue la página
document.addEventListener('DOMContentLoaded', () => {
    actualizarHoraEnTiempoReal();
});

const fechaModal = $('#fechaModal');

const obtenerConsecutivos = async (fechaInicio, fechaFin) => {
    const url = `http://localhost:5000/api/conciliacion/primer-credito?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`;

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await response.json();

        if (response.ok) {
            fechaModal.modal('hide');

            fechaModal.on('hidden.bs.modal', function () {

            });


            if (data.MinimoID && data.MaximoID) {
                document.getElementById('consecutivoInicial').textContent = data.MinimoID;
                document.getElementById('consecutivoFinal').textContent = data.MaximoID;
                document.getElementById('registradosPagares').textContent = data.MaximoID - data.MinimoID + 1;
                document.getElementById('anulados').textContent = data.Anulados;
                document.getElementById('rechazados').textContent = data.Rechazados;
                document.getElementById('aprobados').textContent = data.Aprobados;
            } else {
                document.getElementById('consecutivoInicial').textContent = 'No disponible';
                document.getElementById('consecutivoFinal').textContent = 'No disponible';
                document.getElementById('registradosPagares').textContent = 'No disponible';
                document.getElementById('anulados').textContent = 'No disponible';
                document.getElementById('rechazados').textContent = 'No disponible';
                document.getElementById('aprobados').textContent = 'No disponible';
            }
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Error ❌',
                text: data.mensaje || 'No se pudo obtener la información.',
                confirmButtonColor: '#d33'
            });
        }
    } catch (error) {
        console.error(' Error al obtener los consecutivos:', error);
        Swal.fire({
            icon: 'error',
            title: ' Error de conexión ❌',
            text: 'No se pudo conectar con el servidor.',
            confirmButtonColor: '#d33'
        });
    }
};



const creditosPendientesAS400 = async () => {
    try {

        const responses = await Promise.all([
            fetch('http://localhost:5000/api/creditos-pendientes/contar/6', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            }),
            fetch('http://localhost:5000/api/creditos-pendientes/contar/5', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            }),
            fetch('http://localhost:5000/api/creditos-pendientes/contar/4', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            }),
            fetch('http://localhost:5000/api/creditos-pendientes/contar/3', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            }),
            fetch('http://localhost:5000/api/creditos-pendientes/contar/2', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            }),
            fetch('http://localhost:5000/api/creditos-pendientes/contar/1', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            }),
            fetch('http://localhost:5000/api/creditos-pendientes/contar/0', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            })
        ]);


        // Convertir todas las respuestas a JSON
        const data = await Promise.all(responses.map(response => response.json()));

        // Asignar los valores a cada celda
        document.getElementById('pendientesSeptimoMes').textContent = data[0].total_cuentas || '0'; // mes=5
        document.getElementById('pendientesSextoMes').textContent = data[1].total_cuentas || '0'; // mes=5
        document.getElementById('pendientesQuintoMes').textContent = data[2].total_cuentas || '0'; // mes=4
        document.getElementById('pendientesCuartoMes').textContent = data[3].total_cuentas || '0'; // mes=3
        document.getElementById('pendientesTercerMes').textContent = data[4].total_cuentas || '0'; // mes=2
        document.getElementById('pendientesTwoMes').textContent = data[5].total_cuentas || '0'; // mes=1
        document.getElementById('pendientesPrimerMes').textContent = data[6].total_cuentas || '0'; // mes=0


    } catch (error) {
        console.error('Error al obtener créditos pendientes:', error);
        document.getElementById('pendientesPrimerMes').textContent = 'Error';
        document.getElementById('pendientesSextoMes').textContent = 'Error';
        document.getElementById('pendientesQuintoMes').textContent = 'Error';
        document.getElementById('pendientesCuartoMes').textContent = 'Error';
        document.getElementById('pendientesTercerMes').textContent = 'Error';
        document.getElementById('pendientesTwoMes').textContent = 'Error';
        document.getElementById('pendientesSeptimoMes').textContent = 'Error';
    }
};




//Mostrar Resultados
fetch('http://localhost:5000/api/creditos-pendientes/5', {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
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
                    <td class="text-dark ">${creditosPendientes.DESC05}</td> 
                    <td class="text-center text-dark ">${creditosPendientes.TCRE26}</td>
                    <td class="text-center text-dark "> ${creditosPendientes.CPTO26}</td>
                    <td class="text-center font-weight-bold" 
                        style="${creditosPendientes.Score === 'F/D' || creditosPendientes.Score === 'S/E' ? 'color:#fd7e14' :
                creditosPendientes.Score < 650 ? 'color:red' : 'color:#007bff'}">
                                    ${creditosPendientes.Score}
                        </td>
                    <td class="text-center text-dark">${calcularEdad(creditosPendientes.FECN05)}</td> 
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
        "lengthMenu": [[5, 10, 15, 20, 25], [5, 10, 15, 20, 25]],
        dom: '<"top"lfB>rtip',
        buttons: [
            {
                extend: 'excelHtml5',
                text: '<i class="fas fa-file-excel"></i> Exportar a Excel',
                title: 'Creditos Pendientes Por Pagar',
                exportOptions: {
                    columns: ':visible'
                },
                className: 'btn-success' // Aplicamos Bootstrap directamente
            }
        ],
        initComplete: function () {
            // Asegurarnos de que el botón tome el estilo correctamente
            $('.dt-buttons button').removeClass('dt-button').addClass('btn btn-success btn-m text-white');
        }
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


function calcularEdad(fechaNacimiento) {
    if (!fechaNacimiento) return 'N/A'; // Validar si el dato es nulo o vacío

    // Convertir a cadena y asegurarse de que tenga 8 caracteres
    fechaNacimiento = fechaNacimiento.toString().trim();

    if (fechaNacimiento.length !== 8) {
        console.warn('Formato incorrecto de fecha:', fechaNacimiento);
        return 'N/A';
    }

    const hoy = new Date();

    // Extraer año, mes y día desde el formato YYYYMMDD
    const año = parseInt(fechaNacimiento.substring(0, 4), 10);
    const mes = parseInt(fechaNacimiento.substring(4, 6), 10) - 1; // Mes en JS va de 0 a 11
    const dia = parseInt(fechaNacimiento.substring(6, 8), 10);

    // Validar que los valores extraídos sean correctos
    if (isNaN(año) || isNaN(mes) || isNaN(dia)) {
        console.warn('Fecha con valores inválidos:', fechaNacimiento);
        return 'N/A';
    }

    const fechaNac = new Date(año, mes, dia);
    let edad = hoy.getFullYear() - fechaNac.getFullYear();

    // Ajustar si aún no ha cumplido años en este año
    if (hoy.getMonth() < mes || (hoy.getMonth() === mes && hoy.getDate() < dia)) {
        edad--;
    }

    return edad >= 0 ? edad : 'N/A';
}


function confirmLogout() {
    Swal.fire({
        title: '¿Cerrar sesión?',
        text: '¿Estás seguro que deseas cerrar tu sesión?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#6c757d',
        confirmButtonText: 'Sí, cerrar sesión',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {

            sessionStorage.clear();

            setTimeout(() => {
                window.location.href = '../../../SotfwareCreditos/login-form-02/login.html';
            }, 500);
        }
    });
}