const token = sessionStorage.getItem('token');

const contenedor = document.querySelector('tbody');
let resultados = '';

const verDetalleEstadoCero = (AGEN23) => {
    fetch(`http://localhost:5000/api/detallesAnalisisCero/${AGEN23}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },

    })
        .then(response => response.json())
        .then(data => {
            if (data.mensaje || data.length === 0) {
                Swal.fire({
                    icon: 'info',
                    title: 'Sin resultados',
                    text: 'No hay análisis.',
                    confirmButtonColor: '#3085d6',
                    confirmButtonText: 'Entendido'
                });
                return;
            }


            if ($.fn.DataTable.isDataTable('#tablaDetalles')) {
                $('#tablaDetalles').DataTable().clear().destroy();
            }

            let contenido = '';



            data.forEach((detalle, index) => {
                let fechaFormateada = formatearFecha(detalle.FECH23);
                let saldoCapital = Number(detalle.CAPI23 || 0).toLocaleString("es-CO");
                contenido += `
                    <tr>
                        <td class="text-center" style="color: #000 !important; font-weight: 525 !important">${index + 1}</td>
                        <td class="text-center" style="color: #000 !important; font-weight: 525 !important">${fechaFormateada}</td>
                        <td class="text-center" style="color: #000 !important; font-weight: 525 !important">${detalle.NANA23}</td>
                        <td class="text-center" style="color: #000 !important; font-weight: 525 !important">${detalle.NCTA23}</td>
                        <td class="text-center" style="color: #000 !important; font-weight: 525 !important">${detalle.DESC05}</td>
                        <td class="text-center" style="color: #000 !important; font-weight: 525 !important">$${saldoCapital}</td>
                        <td class="text-center" style="color: #000 !important; font-weight: 525 !important">${detalle.TCRE23}</td>
                        <td class="text-center font-weight-bold" 
                            style="${detalle.Score === 'F/D' ? 'color:#fd7e14' :
                        detalle.Score < 650 ? 'color:red' : 'color:#007bff'}">
                            ${detalle.Score}
                        </td>
                        <td class="text-center" style="color: #000 !important; font-weight: 525 !important">${detalle.AGEN23}</td>
                        <td class="text-center" style="color: #000 !important; font-weight: 525 !important">${detalle.DESC03}</td>
                        <td class="text-center" style="color: #000 !important; font-weight: 525 !important">${detalle.DESC04}</td>
                        <td class="text-center" style="color: #000 !important; font-weight: 525 !important">${detalle.USER23}</td>
                    </tr>`;
            });

            document.getElementById('detalleContenido').innerHTML = contenido;


            $('#tablaDetalles').DataTable({
                destroy: true,
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

            // 4️⃣ Mostrar la modal después de inicializar DataTables
            let modal = new bootstrap.Modal(document.getElementById('detalleModal'));
            modal.show();
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
const verDetalleEstadoUno = (AGEN23) => {
    fetch(`http://localhost:5000/api/detallesAnalisisUno/${AGEN23}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },

    })
        .then(response => response.json())
        .then(data => {
            if (data.mensaje || data.length === 0) {
                Swal.fire({
                    icon: 'info',
                    title: 'Sin resultados',
                    text: 'No hay análisis.',
                    confirmButtonColor: '#3085d6',
                    confirmButtonText: 'Entendido'
                });
                return;
            }

            if ($.fn.DataTable.isDataTable('#tablaDetalles')) {
                $('#tablaDetalles').DataTable().clear().destroy();
            }

            let contenido = '';

            data.forEach((detalle, index) => {
                let fechaFormateada = formatearFecha(detalle.FECH23);
                let saldoCapital = Number(detalle.CAPI23 || 0).toLocaleString("es-CO");
                contenido += `
                    <tr>
                        <td class="text-center" style="color: #000 !important; font-weight: 525 !important">${index + 1}</td>
                        <td class="text-center" style="color: #000 !important; font-weight: 525 !important">${fechaFormateada}</td>
                        <td class="text-center" style="color: #000 !important; font-weight: 525 !important">${detalle.NANA23}</td>
                        <td class="text-center" style="color: #000 !important; font-weight: 525 !important">${detalle.NCTA23}</td>
                        <td class="text-center" style="color: #000 !important; font-weight: 525 !important">${detalle.DESC05}</td>
                        <td class="text-center" style="color: #000 !important; font-weight: 525 !important">$${saldoCapital}</td>
                        <td class="text-center" style="color: #000 !important; font-weight: 525 !important">${detalle.TCRE23}</td>
                        <td class="text-center font-weight-bold" 
                            style="${detalle.Score === 'F/D' ? 'color:#fd7e14' :
                        detalle.Score < 650 ? 'color:red' : 'color:#007bff'}">
                            ${detalle.Score}
                        </td>
                        <td class="text-center" style="color: #000 !important; font-weight: 525 !important">${detalle.AGEN23}</td>
                        <td class="text-center" style="color: #000 !important; font-weight: 525 !important">${detalle.DESC03}</td>
                        <td class="text-center" style="color: #000 !important; font-weight: 525 !important">${detalle.DESC04}</td>
                        <td class="text-center" style="color: #000 !important; font-weight: 525 !important">${detalle.USER23}</td>
                    </tr>`;
            });

            document.getElementById('detalleContenido').innerHTML = contenido;
            let modal = new bootstrap.Modal(document.getElementById('detalleModal'));
            modal.show();

            // Inicializar DataTables con exportación a Excel
            if ($.fn.DataTable.isDataTable('#tablaDetalles')) {
                $('#tablaDetalles').DataTable().destroy();
            }

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
const verDetalleEstadoDos = (AGEN23) => {


    fetch(`http://localhost:5000/api/detallesAnalisisDos/${AGEN23}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },

    })
        .then(response => response.json())
        .then(data => {
            if (data.mensaje || data.length === 0) {
                Swal.fire({
                    icon: 'info',
                    title: 'Sin resultados',
                    text: 'No hay analisis.',
                    confirmButtonColor: '#3085d6',
                    confirmButtonText: 'Entendido'
                });
                return;
            }
            if ($.fn.DataTable.isDataTable('#tablaDetalles')) {
                $('#tablaDetalles').DataTable().clear().destroy();
            }


            let contenido = '';

            data.forEach((detalle, index) => {
                let fechaFormateada = formatearFecha(detalle.FECH23);
                let saldoCapital = Number(detalle.CAPI23 || 0).toLocaleString("es-CO");
                contenido += `
                    <tr>
                        <td class="text-center" style="color: #000 !important; font-weight: 525 !important">${index + 1}</td>
                        <td class="text-center" style="color: #000 !important; font-weight: 525 !important">${fechaFormateada}</td>
                        <td class="text-center" style="color: #000 !important; font-weight: 525 !important">${detalle.NANA23}</td>
                        <td class="text-center" style="color: #000 !important; font-weight: 525 !important">${detalle.NCTA23}</td>
                        <td class="text-center" style="color: #000 !important; font-weight: 525 !important">${detalle.DESC05}</td>
                        <td class="text-center" style="color: #000 !important; font-weight: 525 !important">$${saldoCapital}</td>
                        <td class="text-center" style="color: #000 !important; font-weight: 525 !important">${detalle.TCRE23}</td>
                        <td class="text-center font-weight-bold" 
                            style="${detalle.Score === 'F/D' ? 'color:#fd7e14' :
                        detalle.Score < 650 ? 'color:red' : 'color:#007bff'}">
                            ${detalle.Score}
                        </td>
                        <td class="text-center" style="color: #000 !important; font-weight: 525 !important">${detalle.AGEN23}</td>
                        <td class="text-center" style="color: #000 !important; font-weight: 525 !important">${detalle.DESC03}</td>
                        <td class="text-center" style="color: #000 !important; font-weight: 525 !important">${detalle.DESC04}</td>
                        <td class="text-center" style="color: #000 !important; font-weight: 525 !important">${detalle.USER23}</td>
                    </tr>`;
            });

            document.getElementById('detalleContenido').innerHTML = contenido;
            let modal = new bootstrap.Modal(document.getElementById('detalleModal'));
            modal.show();

            // Inicializar DataTables con exportación a Excel
            if ($.fn.DataTable.isDataTable('#tablaDetalles')) {
                $('#tablaDetalles').DataTable().destroy();
            }

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
const verDetalleEstadoTres = (AGEN23) => {


    fetch(`http://localhost:5000/api/detallesAnalisisTres/${AGEN23}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },

    })
        .then(response => response.json())
        .then(data => {
            if (data.mensaje || data.length === 0) {
                Swal.fire({
                    icon: 'info',
                    title: 'Sin resultados',
                    text: 'No hay analisis.',
                    confirmButtonColor: '#3085d6',
                    confirmButtonText: 'Entendido'
                });
                return;
            }

            if ($.fn.DataTable.isDataTable('#tablaDetalles')) {
                $('#tablaDetalles').DataTable().clear().destroy();
            }


            let contenido = '';

            data.forEach((detalle, index) => {
                let fechaFormateada = formatearFecha(detalle.FECH23);
                let saldoCapital = Number(detalle.CAPI23 || 0).toLocaleString("es-CO");
                contenido += `
                    <tr>
                        <td class="text-center" style="color: #000 !important; font-weight: 525 !important">${index + 1}</td>
                        <td class="text-center" style="color: #000 !important; font-weight: 525 !important">${fechaFormateada}</td>
                        <td class="text-center" style="color: #000 !important; font-weight: 525 !important">${detalle.NANA23}</td>
                        <td class="text-center" style="color: #000 !important; font-weight: 525 !important">${detalle.NCTA23}</td>
                        <td class="text-center" style="color: #000 !important; font-weight: 525 !important">${detalle.DESC05}</td>
                        <td class="text-center" style="color: #000 !important; font-weight: 525 !important">$${saldoCapital}</td>
                        <td class="text-center" style="color: #000 !important; font-weight: 525 !important">${detalle.TCRE23}</td>
                        <td class="text-center font-weight-bold" 
                            style="${detalle.Score === 'F/D' ? 'color:#fd7e14' :
                        detalle.Score < 650 ? 'color:red' : 'color:#007bff'}">
                            ${detalle.Score}
                        </td>
                        <td class="text-center" style="color: #000 !important; font-weight: 525 !important">${detalle.AGEN23}</td>
                        <td class="text-center" style="color: #000 !important; font-weight: 525 !important">${detalle.DESC03}</td>
                        <td class="text-center" style="color: #000 !important; font-weight: 525 !important">${detalle.DESC04}</td>
                        <td class="text-center" style="color: #000 !important; font-weight: 525 !important">${detalle.USER23}</td>
                    </tr>`;
            });

            document.getElementById('detalleContenido').innerHTML = contenido;
            let modal = new bootstrap.Modal(document.getElementById('detalleModal'));
            modal.show();

            // Inicializar DataTables con exportación a Excel
            if ($.fn.DataTable.isDataTable('#tablaDetalles')) {
                $('#tablaDetalles').DataTable().destroy();
            }

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


const formatearFecha = (fechaRaw) => {
    if (!fechaRaw) return "Fecha inválida";

    const fechaCalculada = fechaRaw + 19000000;
    const año = Math.floor(fechaCalculada / 10000);
    const mesNumero = Math.floor((fechaCalculada % 10000) / 100);
    const dia = String(fechaCalculada % 100).padStart(2, '0');

    return `${dia} ${obtenerNombreMes(mesNumero)} del ${año}`;
};


const obtenerNombreMes = (mes) => {
    const meses = [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    return meses[mes - 1];
};

document.getElementById("formFechas").addEventListener("submit", function (e) {
    e.preventDefault();

    const fechaInicio = document.getElementById("fechaInicio").value;
    const fechaFin = document.getElementById("fechaFin").value;

    fetch("/api/analisis", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ fechaInicio, fechaFin })
    })
        .then(response => response.json())
        .then(data => {
            console.log("Datos recibidos:", data);
            // Aquí puedes actualizar la tabla con los nuevos datos
        })
        .catch(error => console.error("Error:", error));
});




if (!token) {
    window.location.href = '../../SotfwareCreditos/login-form-02/login.html';
}

Promise.all([
    fetch('http://localhost:5000/api/analisis/ultimo-consecutivo', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
    }).then(response => {
        if (!response.ok) throw new Error('Error en la solicitud 1');
        return response.json();
    }),

    fetch('http://localhost:5000/api/analisis/ultimo-consecutivo/mes-actual', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
    }).then(response => {
        if (!response.ok) throw new Error('Error en la solicitud 2');
        return response.json();
    }),

    fetch('http://localhost:5000/api/analisis-cero', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
    }).then(response => {
        if (!response.ok) throw new Error('Error en la solicitud 2');
        return response.json();
    }),

    fetch('http://localhost:5000/api/analisis-uno', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
    }).then(response => {
        if (!response.ok) throw new Error('Error en la solicitud 3');
        return response.json();
    }),

    fetch('http://localhost:5000/api/analisis-dos', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
    }).then(response => {
        if (!response.ok) throw new Error('Error en la solicitud 4');
        return response.json();
    }),

    fetch('http://localhost:5000/api/analisis-tres', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
    }).then(response => {
        if (!response.ok) throw new Error('Error en la solicitud 5');
        return response.json();
    })
])
    .then(([analisisGeneral, analisisMesActual, analisisCero, analisisUno, analisisDos, analisisTres]) => {
        const datosCombinados = [
            ...analisisGeneral.ultimoConsecutivo.map(d => ({ ...d, origen: "General" })),
            ...analisisMesActual.ultimoConsecutivo.map(d => ({ ...d, origen: "MesActual" })),
            ...analisisCero.map(d => ({ ...d, origen: "Cero" })),
            ...analisisUno.map(d => ({ ...d, origen: "Uno" })),
            ...analisisDos.map(d => ({ ...d, origen: "Dos" })),
            ...analisisTres.map(d => ({ ...d, origen: "Tres" }))
        ];

        mostrar(datosCombinados);

    })
    .catch(error => console.error('Error:', error));

function manejarRespuesta(response, mensajeError) {
    if (response.status === 401) {
        mostrarAlertaSesionExpirada();
        throw new Error("Token inválido o expirado, redirigiendo...");
    }
    if (!response.ok) throw new Error(mensajeError);
    return response.json();
}

function mostrarAlertaSesionExpirada() {
    Swal.fire({
        icon: 'warning',
        title: 'Sesión expirada',
        text: 'Por favor, inicie sesión nuevamente.',
        confirmButtonText: 'OK'
    }).then(() => {
        sessionStorage.removeItem('token');
        window.location.href = '../../SotfwareCreditos/login-form-02/login.html';
    });
}



const ciudades = [
    { codigo: 31, nombre: "CALI" },
    { codigo: 32, nombre: "PALMIRA" },
    { codigo: 33, nombre: "BUENAVENTURA" },
    { codigo: 34, nombre: "BUGA" },
    { codigo: 35, nombre: "TULUA" },
    { codigo: 36, nombre: "SEVILLA" },
    { codigo: 37, nombre: "LA UNION" },
    { codigo: 38, nombre: "ROLDANILLO" },
    { codigo: 39, nombre: "CARTAGO" },
    { codigo: 40, nombre: "ZARZAL" },
    { codigo: 41, nombre: "CAICEDONIA" },
    { codigo: 21, nombre: "ZONA CENTRO" },
    { codigo: 80, nombre: "MEDELLIN" },
    { codigo: 90, nombre: "BOGOTA CENTRO" },
    { codigo: 70, nombre: "MANIZALES" },
    { codigo: 74, nombre: "PEREIRA" },
    { codigo: 78, nombre: "ARMENIA" },
    { codigo: 87, nombre: "BARRANQUILLA" },
    { codigo: 86, nombre: "CARTAGENA" },
    { codigo: 95, nombre: "IBAGUE" },
    { codigo: 45, nombre: "PASTO" },
    { codigo: 94, nombre: "TUNJA" },
    { codigo: 97, nombre: "BUCARAMANGA" },
    { codigo: 98, nombre: "CUCUTA" },
    { codigo: 10, nombre: "CALI" },
    { codigo: 91, nombre: "BOGOTA T.C." },
    { codigo: 48, nombre: "LETICIA" },
    { codigo: 81, nombre: "MONTERIA" },
    { codigo: 92, nombre: "BOGOTA NORTE" },
    { codigo: 82, nombre: "SINCELEJO" },
    { codigo: 43, nombre: "YUMBO" },
    { codigo: 44, nombre: "JAMUNDI" },
    { codigo: 83, nombre: "YOPAL" },
    { codigo: 46, nombre: "POPAYAN" },
    { codigo: 93, nombre: "VILLAVICENCIO" },
    { codigo: 96, nombre: "NEIVA" },
    { codigo: 84, nombre: "RIOHACHA" },
    { codigo: 85, nombre: "VALLEDUPAR" },
    { codigo: 88, nombre: "SANTA MARTA" },
    { codigo: 89, nombre: "DUITAMA" },
    { codigo: 79, nombre: "APARTADO" },
    { codigo: 42, nombre: "S/DER DE QUILICHAO" },
    { codigo: 47, nombre: "IPIALES" },
    { codigo: 77, nombre: "SAN ANDRES" },
    { codigo: 76, nombre: "GIRARDOT" },
    { codigo: 73, nombre: "ZIPAQUIRA" },
    { codigo: 68, nombre: "SOACHA" },
    { codigo: 13, nombre: "BOGOTA ELEMENTO" },
    { codigo: 30, nombre: "CALI BC" }
];


const mostrar = (analisis) => {
    let resultados = '';
    let agrupados = {};

    analisis.forEach(analisis => {
        const agencia = analisis.AGEN23;

        if (!agrupados[agencia]) {
            agrupados[agencia] = {
                AGEN23: agencia,
                nombreCiudad: ciudades.find(c => c.codigo == agencia)?.nombre || 'Desconocido',
                ULTIMO_CONSECUTIVO: '',
                ULTIMO_CONSECUTIVONOW: '',
                CANTIDAD_REALIZADA: 0,
                ANALISIS_CERO: 0,
                ANALISIS_UNO: 0,
                ANALISIS_DOS: 0,
                ANALISIS_TRES: 0
            };
        }

        if (analisis.origen === 'General') {
            agrupados[agencia].ULTIMO_CONSECUTIVO = analisis.ULTIMO_CONSECUTIVO + 1;
        }

        if (analisis.origen === 'MesActual') {
            agrupados[agencia].ULTIMO_CONSECUTIVONOW = analisis.ULTIMO_CONSECUTIVONOW;
        }

        if (analisis.origen === 'Cero') {
            agrupados[agencia].ANALISIS_CERO = analisis.ANALISIS_CERO;
        }

        if (analisis.origen === 'Uno') {
            agrupados[agencia].ANALISIS_UNO = analisis.ANALISIS_UNO;
        }

        if (analisis.origen === 'Dos') {
            agrupados[agencia].ANALISIS_DOS = analisis.ANALISIS_DOS;
        }

        if (analisis.origen === 'Tres') {
            agrupados[agencia].ANALISIS_TRES = analisis.ANALISIS_TRES;
        }
    });



    Object.keys(agrupados).forEach(agencia => {
        agrupados[agencia].CANTIDAD_REALIZADA = agrupados[agencia].ULTIMO_CONSECUTIVONOW - agrupados[agencia].ULTIMO_CONSECUTIVO + 1;
        agrupados[agencia].analisisPendientes = agrupados[agencia].ANALISIS_CERO + agrupados[agencia].ANALISIS_UNO;
    });


    Object.values(agrupados).forEach(analisis => {
        analisis.verificacion =
            analisis.ANALISIS_CERO +
            analisis.ANALISIS_UNO +
            analisis.ANALISIS_DOS +
            analisis.ANALISIS_TRES -
            analisis.CANTIDAD_REALIZADA;

        let efectividadValor = analisis.CANTIDAD_REALIZADA !== 0
            ? (analisis.ANALISIS_TRES / analisis.CANTIDAD_REALIZADA) * 100
            : 0;

        analisis.efectividad = efectividadValor.toFixed(2) + '%';
        analisis.efectividadClass = efectividadValor < 50 ? 'text-danger fw-bold' : 'text-success fw-bold';
    });

    Object.values(agrupados).forEach(analisis => {
        resultados += `
            <tr>
                <td class="text-center" style="color: #000 !important; font-weight: 525 !important">${analisis.AGEN23}</td>
                <td class="text-center" style="color: #000 !important; font-weight: 525 !important">${analisis.nombreCiudad}</td>
                <td class="text-center" style="color: #000 !important; font-weight: 525 !important">${analisis.ULTIMO_CONSECUTIVO}</td>
                <td class="text-center" style="color: #000 !important; font-weight: 525 !important">${analisis.ULTIMO_CONSECUTIVONOW}</td>
                <td class="text-center" style="color: #000 !important; font-weight: 525 !important">${analisis.CANTIDAD_REALIZADA}</td>
                <td class="text-center" style="color: #000 !important; font-weight: 525 !important">
                    ${analisis.ANALISIS_CERO}
                    <button class="btn btn-link text-primary" onclick="verDetalleEstadoCero('${analisis.AGEN23}')">
                        <i class="fas fa-eye"></i>
                    </button>
                </td>
                <td class="text-center" style="color: #000 !important; font-weight: 525 !important">
                    ${analisis.ANALISIS_UNO}
                    <button class="btn btn-link text-primary" onclick="verDetalleEstadoUno('${analisis.AGEN23}')">
                        <i class="fas fa-eye"></i>
                    </button>
                </td>
                <td class="text-center" style="color: #000 !important; font-weight: 525 !important">
                    ${analisis.ANALISIS_DOS}
                    <button class="btn btn-link text-primary" onclick="verDetalleEstadoDos('${analisis.AGEN23}')">
                        <i class="fas fa-eye"></i>
                    </button>
                </td>
                <td class="text-center" style="color: #000 !important; font-weight: 525 !important">
                    ${analisis.ANALISIS_TRES}
                    <button class="btn btn-link text-primary" onclick="verDetalleEstadoTres('${analisis.AGEN23}')">
                        <i class="fas fa-eye"></i>
                    </button>
                </td>
                <td class="text-center" style="color: #000 !important; font-weight: 525 !important">${analisis.verificacion}</td>
                <td class="text-center font-weight-bold ${analisis.efectividadClass}">${analisis.efectividad}</td>
                <td class="text-center" style="color: #000 !important; font-weight: 525 !important">
                    ${analisis.analisisPendientes}
                </td>
            </tr>`;
    });

    contenedor.innerHTML = resultados;

    // Inicializar DataTables con exportación a Excel
    if ($.fn.DataTable.isDataTable('#tablaAnalisis')) {
        $('#tablaAnalisis').DataTable().destroy();
    }

    $('#tablaAnalisis').DataTable({
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
        "lengthMenu": [[10, 15, 20, 25], [10, 15, 20, 25]],
        dom: '<"top"lfB>rtip',
        buttons: [
            {
                extend: 'excelHtml5',
                text: '<i class="fas fa-file-excel"></i> Exportar a Excel',
                title: 'Reporte_Analisis_Mes',
                exportOptions: {
                    columns: ':visible'
                },
                className: 'btn-success text-dark fw-bold'
            }
        ],
        initComplete: function () {
            // Asegurarnos de que el botón tome el estilo correctamente
            $('.dt-buttons button').removeClass('dt-button').addClass('btn btn-success btn-m text-white');
        }
    });



};


document.addEventListener('DOMContentLoaded', function () {
    const thCorte = document.getElementById('corte');
    const thActual = document.getElementById('actual');

    const hoy = new Date();
    const mesActual = hoy.getMonth(); // Mes actual (0 = enero, 11 = diciembre)
    const añoActual = hoy.getFullYear();

    // Obtener el 1 del mes actual
    const fechaCorte = new Date(añoActual, mesActual, 1);
    const fechaActual = hoy; // Fecha actual

    // Array con nombres de los meses
    const meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

    // Formatear fechas en "DD-Mes"
    const formatoFecha = (fecha) => {
        const dia = fecha.getDate();
        const mesNombre = meses[fecha.getMonth()];
        return `${dia}-${mesNombre}`;
    };

    thCorte.textContent = formatoFecha(fechaCorte);
    thActual.textContent = formatoFecha(fechaActual);
});

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
