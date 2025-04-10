const token = sessionStorage.getItem('token');
const contenedor = document.querySelector('tbody');
let resultados = '';

//BOTONES DE ACCIONES EN EL DATATABLE, POR DEFECTO MOSTRAR NO PAGADO

// Mostrar alerta de carga antes de hacer la petición
Swal.fire({
    title: 'Cargando información...',
    text: 'Por favor, espera mientras se cargan los datos.',
    allowOutsideClick: false,
    didOpen: () => {
        Swal.showLoading();
    }
});
setTimeout(() => {
    Swal.close();
}, 2500);

if (!token) {
    window.location.href = '../../SotfwareCreditos/login-form-02/login.html';
}



document.addEventListener('DOMContentLoaded', async function () {
    if (!token) {
        window.location.href = '../../SotfwareCreditos/login-form-02/login.html';
        return;
    }

    const hoy = new Date();
    const primerDiaMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1);

    function formatoFecha(fecha) {
        const dia = String(fecha.getDate()).padStart(2, '0');
        const mes = String(fecha.getMonth() + 1).padStart(2, '0');
        const año = fecha.getFullYear();
        return `${dia}-${mes}-${año}`;
    }

    const agenciasMap = [
        { codigo: 31, nombre: "Cali" },
        { codigo: 32, nombre: "Palmira" },
        { codigo: 33, nombre: "Buenaventura" },
        { codigo: 34, nombre: "Buga" },
        { codigo: 35, nombre: "Tuluá" },
        { codigo: 36, nombre: "Sevilla" },
        { codigo: 37, nombre: "La Unión" },
        { codigo: 38, nombre: "Roldanillo" },
        { codigo: 39, nombre: "Cartago" },
        { codigo: 40, nombre: "Zarzal" },
        { codigo: 41, nombre: "Caicedonia" },
        { codigo: 80, nombre: "Medellin" },
        { codigo: 90, nombre: "Bogotá Centro" },
        { codigo: 70, nombre: "Manizales" },
        { codigo: 74, nombre: "Pereira" },
        { codigo: 78, nombre: "Armenia" },
        { codigo: 87, nombre: "Barranquilla" },
        { codigo: 86, nombre: "Cartagena" },
        { codigo: 95, nombre: "Ibagué" },
        { codigo: 45, nombre: "Pasto" },
        { codigo: 94, nombre: "Tunja" },
        { codigo: 97, nombre: "Bucaramanga" },
        { codigo: 98, nombre: "Cúcuta" },
        { codigo: 91, nombre: "Bogotá TC" },
        { codigo: 48, nombre: "Leticia" },
        { codigo: 81, nombre: "Monteria" },
        { codigo: 92, nombre: "Bogotá Norte" },
        { codigo: 82, nombre: "Sincelejo" },
        { codigo: 43, nombre: "Yumbo" },
        { codigo: 44, nombre: "Jamundí" },
        { codigo: 83, nombre: "Yopal" },
        { codigo: 46, nombre: "Popayán" },
        { codigo: 93, nombre: "Villavicencio" },
        { codigo: 96, nombre: "Neiva" },
        { codigo: 84, nombre: "Riohacha" },
        { codigo: 85, nombre: "Valledupar" },
        { codigo: 88, nombre: "Santa Marta" },
        { codigo: 89, nombre: "Duitama" },
        { codigo: 42, nombre: "S Quilichao" },
        { codigo: 47, nombre: "Ipiales" },
        { codigo: 77, nombre: "San Andrés" },
        { codigo: 76, nombre: "Girardot" },
        { codigo: 73, nombre: "Zipaquirá" },
        { codigo: 68, nombre: "Soacha" },
        { codigo: 13, nombre: "Bogotá Elemento" },
        { codigo: 30, nombre: "CaliBC" }
    ];

    async function obtenerDatos(fechaInicio, fechaFin) {
        try {
            const nombreAgencia = sessionStorage.getItem('agenciau')?.trim().toUpperCase();
            const agenciaEncontrada = agenciasMap.find(a => a.nombre.toUpperCase().trim() === nombreAgencia);
            const codigoAgencia = agenciaEncontrada?.codigo || '';

            const url = `http://localhost:5000/api/creditos?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}&agencia=${codigoAgencia}`;

            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) throw new Error('Error en la solicitud');

            creditos = await response.json();

            if (creditos.length === 0) {
                Swal.fire({
                    title: 'Sin registros',
                    text: 'No se encontraron créditos para esta agencia en el rango de fechas.',
                    icon: 'info',
                    confirmButtonText: 'Entendido',
                    allowOutsideClick: false,
                    allowEscapeKey: false
                });
                return;
            }

            mostrar(creditos);

        } catch (error) {
            console.error('❌ Error:', error);
            Swal.fire('Error', 'No se pudo obtener la información.', 'error');
        }
    }





    await obtenerDatos(formatoFecha(primerDiaMes), formatoFecha(hoy));

    document.getElementById('guardarFechas').addEventListener('click', async function () {
        const fechaInicioStr = document.getElementById('fechaInicio').value.trim();
        const fechaFinStr = document.getElementById('fechaFin').value.trim();

        if (!fechaInicioStr || !fechaFinStr) {
            Swal.fire('Error', 'Por favor, selecciona ambas fechas antes de continuar.', 'error');
            return;
        }

        // Convertir fechas a objetos Date
        const fechaInicio = new Date(fechaInicioStr.split('-').reverse().join('-'));
        const fechaFin = new Date(fechaFinStr.split('-').reverse().join('-'));

        // **VALIDACIONES**
        if (fechaInicio > hoy || fechaFin > hoy) {
            Swal.fire('Error', 'Las fechas no pueden ser superiores al día de hoy.', 'error');
            return;
        }

        if (fechaInicio > fechaFin) {
            Swal.fire('Error', 'La fecha de inicio no puede ser mayor que la fecha final.', 'error');
            return;
        }

        await obtenerDatos(fechaInicioStr, fechaFinStr);

        Swal.fire({
            icon: 'success',
            title: 'Éxito ✅',
            text: 'Fechas enviadas correctamente.',
            confirmButtonColor: '#3085d6'
        });
    });
});





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



const mostrar = (creditos) => {
    let resultados = '';
    creditos.forEach((creditos) => {
        const rawFecha = creditos.FECI13;
        const fechaCalculada = rawFecha + 19000000;
        const año = Math.floor(fechaCalculada / 10000);
        const mesNumero = Math.floor((fechaCalculada % 10000) / 100);
        const dia = String(fechaCalculada % 100).padStart(2, '0');
        const fechaFormateada = `${dia} ${obtenerNombreMes(mesNumero)} ${año}`;

        function obtenerNombreMes(mes) {
            const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
                'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
            return meses[mes - 1];
        }

        const rawFechaFECH23 = creditos.FECH23;
        const fechaCalculadaFECH23 = rawFechaFECH23 + 19000000;
        const añoFECH23 = Math.floor(fechaCalculadaFECH23 / 10000);
        const mesNumeroFECH23 = Math.floor((fechaCalculadaFECH23 % 10000) / 100);
        const diaFECH23 = String(fechaCalculadaFECH23 % 100).padStart(2, '0');
        const fechaFormateadaFECH23 = `${diaFECH23} ${obtenerNombreMes(mesNumeroFECH23)} ${añoFECH23}`;

        let capitalInicial = Number(creditos.CAPI13 || 0).toLocaleString("es-CO");

        resultados += `<tr>
                <td class="text-center" style="color: #000 !important; font-weight: 525 !important">${creditos.DIRE03}</td>
                <td style="color: #000 !important; font-weight: 525 !important">${creditos.AGOP13}-${creditos.DESC03}</td>
                <td class="text-center" style="color: #000 !important; font-weight: 525 !important">${creditos.NCTA13}</td>
                <td style="color: #000 !important; font-weight: 525 !important">${creditos.NNIT05}</td>
                <td style="color: #000 !important; font-weight: 525 !important width: 50px; white-space: nowrap;">${creditos.DESC05}</td>
                 <td class="text-center font-weight-bold" 
                            style="${creditos.Score === 'F/D' ? 'color:#fd7e14' :
                creditos.Score < 650 ? 'color:red' : 'color:#007bff'}">
                            ${creditos.Score}
                        </td>
                <td class="text-center" style="color: #000 !important; font-weight: 525 !important">${calcularEdad(creditos.FECN05)}</td>
                <td class="text-center" style="color: #000 !important; font-weight: 525 !important">${creditos.NANA13}</td>
                <td class="text-center" style="color: #000 !important; font-weight: 525 !important">${fechaFormateadaFECH23}</td>
                <td class="text-center" style="color: #000 !important; font-weight: 525 !important">${creditos.STAT23}</td>
                <td class="text-center" style="color: #000 !important; font-weight: 525 !important">${creditos.NCRE13}</td>
                <td class="text-center" style="color: #000 !important; font-weight: 525 !important width: 50px; white-space: nowrap;">${fechaFormateada}</td> 
                <td class="text-center" style="color: #000 !important; font-weight: 525 !important">${creditos.TCRE13}</td>
                <td class="text-center" style="color: #000 !important; font-weight: 525 !important">${creditos.CPTO13}</td>
                <td class="text-center" style="color: #000 !important; font-weight: 525 !important">$${capitalInicial}</td>
                <td class="text-center" style="color: #000 !important; font-weight: 525 !important">${creditos.TASA13} %</td>
                <td class="text-center" style="color: #000 !important; font-weight: 525 !important">${creditos.DESC04}</td>
                <td class="text-center pagado-columna 
                ${creditos.Estado == 1
                ? 'parpadeo-verde'
                : creditos.Estado == 0
                    ? 'parpadeo-rojo'
                    : creditos.Estado == 2
                        ? 'parpadeo-amarillo'
                        : ''}">
                        ${creditos.Estado == 1
                ? 'SI'
                : creditos.Estado == 0
                    ? 'NO'
                    : creditos.Estado == 2
                        ? 'TESORERÍA'
                        : ''}
                                            </td>
                <td  style="color: #000 !important; font-weight: 525 !important">${creditos.MedioPago}</td>
                <td class="text-center" style="white-space: nowrap;">
            <button class="btn btn-success btn-lg me-2 insertar-credito" data-estado="1" data-cuenta="${creditos.NCTA13}" data-pagare="${creditos.NCRE13}" data-nit="${creditos.NNIT05}">
                <i class="fas fa-check"></i> SI
            </button>
            <button class="btn btn-danger btn-lg me-2 insertar-credito" data-estado="0" data-cuenta="${creditos.NCTA13}" data-pagare="${creditos.NCRE13}" data-nit="${creditos.NNIT05}">
                <i class="fas fa-times"></i> NO
            </button> 
            <button class="btn btn-warning btn-lg text-dark fw-bold insertar-credito" data-estado="2" data-cuenta="${creditos.NCTA13}" data-pagare="${creditos.NCRE13}" data-nit="${creditos.NNIT05}">
                <i class="fas fa-pencil-alt"></i> TESORERÍA
            </button>
                    </td>
                <td class= "modulo-restringido" style="color: #000 !important; font-weight: 525 !important width: 50px; white-space: nowrap;">${creditos.fecha_pago}</td>
                <td class= "modulo-restringido" style="color: #000 !important; font-weight: 525 !important">${creditos.usuario_pagador}</td>

            </tr>`;
    });

    if ($.fn.DataTable.isDataTable('#tablaAS400')) {
        $('#tablaAS400').DataTable().clear().destroy();
    }
    $("#tablaAS400 tbody").html(resultados);

    if (sessionStorage.getItem('hideOnbush') === 'true') {
        document.querySelectorAll('.modulo-restringido').forEach(element => {
            element.style.display = 'none';
        });
    }

    $('#tablaAS400').DataTable({
        order: [[1, 'asc']],
        scrollY: "700px",
        scrollX: true,
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
        "lengthMenu": [[-1], ["Todos"]],
        dom: '<"top"lfB>rtip',
        buttons: [
            {
                extend: 'excelHtml5',
                text: '<i class="fas fa-file-excel"></i> Exportar a Excel',
                title: 'Creditos No Registrados En Software',
                exportOptions: { columns: ':visible' },
                className: 'btn-success text-dark fw-bold'
            }
        ],
        initComplete: function () {
            $('.dt-buttons button').removeClass('dt-button').addClass('btn btn-success btn-m text-white');
        }
    });
};

document.addEventListener("DOMContentLoaded", function () {
    const hideOnbush = sessionStorage.getItem('hideOnbush');

    if (hideOnbush === 'true') {
        // Oculta los módulos restringidos
        document.querySelectorAll('.modulo-restringido').forEach(element => {
            element.style.display = 'none';
        });
    }
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

function calcularEdad(fechaNacimiento) {
    if (!fechaNacimiento) return 'N/A';

    fechaNacimiento = fechaNacimiento.toString().trim();

    if (fechaNacimiento.length !== 8) {
        console.warn('Formato incorrecto de fecha:', fechaNacimiento);
        return 'N/A';
    }

    const hoy = new Date();


    const año = parseInt(fechaNacimiento.substring(0, 4), 10);
    const mes = parseInt(fechaNacimiento.substring(4, 6), 10) - 1;
    const dia = parseInt(fechaNacimiento.substring(6, 8), 10);


    if (isNaN(año) || isNaN(mes) || isNaN(dia)) {
        console.warn('Fecha con valores inválidos:', fechaNacimiento);
        return 'N/A';
    }

    const fechaNac = new Date(año, mes, dia);
    let edad = hoy.getFullYear() - fechaNac.getFullYear();


    if (hoy.getMonth() < mes || (hoy.getMonth() === mes && hoy.getDate() < dia)) {
        edad--;
    }

    return edad >= 0 ? edad : 'N/A';
}

document.getElementById("refreshBtn").addEventListener("click", function () {
    location.reload();
});



let creditos = [];

function convertirFechaAS400(fechaAS400) {
    if (!fechaAS400 || isNaN(fechaAS400)) return null;

    const fechaCalculada = Number(fechaAS400) + 19000000;
    const año = Math.floor(fechaCalculada / 10000);
    const mes = String(Math.floor((fechaCalculada % 10000) / 100)).padStart(2, '0');
    const dia = String(fechaCalculada % 100).padStart(2, '0');

    return `${año}-${mes}-${dia}`; // ← Este es el formato que necesita tu base de datos
}


let creditoSeleccionado = null;
let medioPagoConfirmado = false;

document.addEventListener('click', async function (e) {
    if (e.target.closest('.insertar-credito')) {
        const boton = e.target.closest('.insertar-credito');
        const estado = boton.dataset.estado;
        const cuenta = boton.dataset.cuenta;
        const pagare = boton.dataset.pagare;
        const cedula = boton.dataset.nit;

        const credito = creditos.find(c =>
            String(c.NCTA13).trim() === cuenta.trim() &&
            String(c.NCRE13).trim() === pagare.trim() &&
            String(c.NNIT05).trim() === cedula.trim()
        );

        if (!credito) {
            Swal.fire('Error', 'No se encontró el crédito en la base de datos.', 'error');
            return;
        }

        creditoSeleccionado = {
            centroCosto: credito.AGOP13,
            agencia: credito.DESC03,
            cuenta: credito.NCTA13,
            cedula: credito.NNIT05,
            nombre: credito.DESC05,
            score: credito.Score,
            edad: calcularEdad(credito.FECN05),
            analisis: credito.NANA13,
            fecha_analisis: convertirFechaAS400(credito.FECH23),
            estado_analisis: credito.STAT23,
            pagare: credito.NCRE13,
            fecha_credito: convertirFechaAS400(credito.FECI13),
            linea: credito.TCRE13,
            recogida: credito.CPTO13,
            capital: credito.CAPI13,
            tasa: credito.TASA13,
            nomina: credito.DESC04,
            estado: estado
        };

        medioPagoConfirmado = false;

        // Mostrar siempre el modal para seleccionar medio de pago
        document.getElementById('selectMedioPago').selectedIndex = 0; // Reinicia el select
        const modal = new bootstrap.Modal(document.getElementById('modalMedioPago'));
        modal.show();
    }
});



$('#modalMedioPago').on('hidden.bs.modal', function () {
    if (!medioPagoConfirmado && creditoSeleccionado) {
        Swal.fire('No se registró el crédito', 'La acción fue cancelada o no se seleccionó un medio de pago.', 'info');
        creditoSeleccionado = null;
    }
});


document.getElementById('confirmarPagoBtn').addEventListener('click', async function () {
    const selectMedioPago = document.getElementById('selectMedioPago');
    const medioPagoSeleccionado = selectMedioPago.value;

    if (!medioPagoSeleccionado || !creditoSeleccionado) {
        Swal.fire('⚠️ Atención', 'Debes seleccionar un medio de pago.', 'warning');
        return;
    }

    medioPagoConfirmado = true;

    const usuario = sessionStorage.getItem('nombreUsuario');

    const payload = {
        ...creditoSeleccionado,
        medio_pago: medioPagoSeleccionado,
        usuario: usuario
    };

    try {
        const resp = await fetch('http://localhost:5000/api/guardar/creditos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(payload)
        });

        const resultado = await resp.json();

        if (resultado.success) {
            Swal.fire('Cambio de estado ✅', 'Se cambió el estado del crédito', 'success');
        } else {
            Swal.fire('⚠️ Atención', resultado.message || 'No se pudo cambiar el estado, comunícate con Dpto. Sistemas.', 'warning');
        }

    } catch (error) {
        console.error('❌ Error insertando crédito:', error);
        Swal.fire('Error', 'No se pudo insertar el crédito.', 'error');
    } finally {
        creditoSeleccionado = null;
        medioPagoConfirmado = false;
    }
});



document.addEventListener("click", function (e) {
    const row = e.target.closest("tr");
    if (!row) return;

    const pagadoCell = row.querySelector(".pagado-columna");
    if (!pagadoCell) return;

    if (e.target.closest(".btn-success")) {
        pagadoCell.classList.remove("parpadeo-verde", "parpadeo-rojo");
        void pagadoCell.offsetWidth;
        pagadoCell.innerHTML = `SI`;
        pagadoCell.classList.add("parpadeo-verde");
    }

    if (e.target.closest(".btn-danger")) {
        pagadoCell.classList.remove("parpadeo-verde", "parpadeo-rojo");
        void pagadoCell.offsetWidth;
        pagadoCell.innerHTML = `NO`;
        pagadoCell.classList.add("parpadeo-rojo");
    }

    if (e.target.closest(".btn-warning")) {
        pagadoCell.classList.remove("parpadeo-verde", "parpadeo-rojo", "parpadeo-amarillo");
        void pagadoCell.offsetWidth;
        pagadoCell.innerHTML = `TESORERÍA`;
        pagadoCell.classList.add("parpadeo-amarillo");
    }

});

