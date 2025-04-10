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

    async function obtenerDatos() {
        try {
            const token = sessionStorage.getItem('token');
            const url = 'http://localhost:5000/api/obtener/pagados';

            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) throw new Error('Error en la solicitud');

            creditos = await response.json();
            console.log("Respuesta del backend:", creditos);


            if (!Array.isArray(creditos) || creditos.length === 0) {
                Swal.fire({
                    title: 'Sin registros',
                    text: 'No se encontraron créditos pagados con estado "Tesorería".',
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


    await obtenerDatos();

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
        let capitalInicial = Number(creditos.capital || 0).toLocaleString("es-CO");
        // Formatear fecha_credito
        let fechaOriginal = creditos.fecha_credito;
        let fechaFormateada = '';
        if (fechaOriginal) {
            const [anio, mes, dia] = fechaOriginal.split('-');
            const mesesCortos = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
            const mesTexto = mesesCortos[parseInt(mes, 10) - 1];
            fechaFormateada = `${dia} ${mesTexto} ${anio}`;
        }


        resultados += `<tr>
                <td class="text-center">
                    <input type="checkbox" class="seleccionar-checkbox" 
                        value="${creditos.cuenta}" 
                        data-cuenta="${creditos.cuenta}"
                        data-pagare="${creditos.pagare}" 
                        data-nit="${creditos.cedula}">
                </td>
                <td style="color: #000 !important; font-weight: 525 !important width: 50px; white-space: nowrap;">${creditos.centroCosto}-${creditos.agencia}</td>
                <td class="text-center" style="color: #000 !important; font-weight: 525 !important">${creditos.cuenta}</td>
                <td style="color: #000 !important; font-weight: 525 !important">${creditos.cedula}</td>
                <td style="color: #000 !important; font-weight: 525 !important width: 50px; white-space: nowrap;">${creditos.nombre}</td>
                 <td class="text-center font-weight-bold" 
                            style="${creditos.score === 'F/D' ? 'color:#fd7e14' :
                creditos.score < 650 ? 'color:red' : 'color:#007bff'}">
                            ${creditos.score}
                        </td>
                <td class="text-center" style="color: #000 !important; font-weight: 525 !important">${creditos.edad}</td>
                <td class="text-center" style="color: #000 !important; font-weight: 525 !important">${creditos.pagare}</td>
                <td class="text-center" style="color: #000 !important; font-weight: 525 !important width: 50px; white-space: nowrap;">${fechaFormateada}</td> 
                <td class="text-center" style="color: #000 !important; font-weight: 525 !important">${creditos.linea}</td>
                <td class="text-center" style="color: #000 !important; font-weight: 525 !important">${creditos.recogida}</td>
                <td class="text-center" style="color: #000 !important; font-weight: 525 !important">$${capitalInicial}</td>
                <td class="text-center" style="color: #000 !important; font-weight: 525 !important">${(creditos.tasa || 0)} %</td>
                <td class="text-center" style="color: #000 !important; font-weight: 525 !important ">${creditos.nomina}</td>
               <td class="text-center pagado-columna 
                ${creditos.estado == 1
                ? 'parpadeo-verde'
                : creditos.estado == 0
                    ? 'parpadeo-rojo'
                    : creditos.estado == 2
                        ? 'parpadeo-amarillo'
                        : ''}">
                        ${creditos.estado == 1
                ? 'SI'
                : creditos.estado == 0
                    ? 'NO'
                    : creditos.estado == 2
                        ? 'TESORERÍA'
                        : ''}
                                            </td>
                <td  style="color: #000 !important; font-weight: 525 !important">${creditos.medioPago}</td>
                <td class="text-center" style="white-space: nowrap;">
            <button class="btn btn-success btn-lg me-2 insertar-credito" data-estado="1" data-cuenta="${creditos.cuenta}" data-pagare="${creditos.pagare}" data-nit="${creditos.cedula}">
                <i class="fas fa-check"></i> SI
            </button>
            <button class="btn btn-danger btn-lg me-2 insertar-credito" data-estado="0" data-cuenta="${creditos.cuenta}" data-pagare="${creditos.pagare}" data-nit="${creditos.cedula}">
                <i class="fas fa-times"></i> NO
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

            $(".dt-buttons").prepend(`
                <button id="btnMarcarTodosSI" class="btn btn-success text-dark fw-bold me-2">
                    <i class="fas fa-check"></i> Marcar como "PAGADO"
                </button>
            `);
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


document.getElementById("refreshBtn").addEventListener("click", function () {
    location.reload();
});



let creditos = [];




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
            String(c.cuenta).trim() === cuenta.trim() &&
            String(c.pagare).trim() === pagare.trim() &&
            String(c.cedula).trim() === cedula.trim()
        );


        if (!credito) {
            Swal.fire('Error', 'No se encontró el crédito en la base de datos.', 'error');
            return;
        }

        creditoSeleccionado = {
            centroCosto: credito.centroCosto,
            agencia: credito.agencia,
            cuenta: credito.cuenta,
            cedula: credito.cedula,
            nombre: credito.nombre,
            score: credito.score,
            edad: credito.edad,
            analisis: credito.analisis,
            fecha_analisis: credito.fecha_analisis,
            estado_analisis: credito.estado_analisis,
            pagare: credito.pagare,
            fecha_credito: credito.fecha_credito,
            linea: credito.linea,
            recogida: credito.recogida,
            capital: credito.capital,
            tasa: credito.tasa,
            nomina: credito.nomina,
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


document.addEventListener('click', async function (e) {
    if (e.target.id === 'btnMarcarTodosSI') {
        const checkboxes = document.querySelectorAll('.seleccionar-checkbox:checked');

        if (checkboxes.length === 0) {
            Swal.fire('⚠️ Atención', 'No has seleccionado ningún crédito.', 'warning');
            return;
        }

        for (const checkbox of checkboxes) {
            const cuenta = checkbox.dataset.cuenta;
            const pagare = checkbox.dataset.pagare;
            const cedula = checkbox.dataset.nit;

            const credito = creditos.find(c =>
                String(c.cuenta).trim() === cuenta.trim() &&
                String(c.pagare).trim() === pagare.trim() &&
                String(c.cedula).trim() === cedula.trim()
            );

            if (!credito) {
                console.warn(`❌ Crédito no encontrado: ${cuenta} - ${pagare} - ${cedula}`);
                continue;
            }

            // Aquí llamarías directamente tu lógica de guardar con estado = 1 (pagado)
            insertarCredito({
                ...credito,
                estado: 1,
                medioPago: 'TRANSFERENCIA' // O el medio por defecto
            });
        }

        Swal.fire('✅ Éxito', 'Créditos marcados como pagados.', 'success');
    }
});


document.getElementById('seleccionar-todos').addEventListener('change', function () {
    const isChecked = this.checked;
    const checkboxes = document.querySelectorAll('.seleccionar-checkbox');

    checkboxes.forEach(cb => cb.checked = isChecked);
});

function insertarCredito(credito) {
    // Aquí puedes hacer la petición al backend (AJAX o fetch)
    fetch('http://localhost:5000/api/guardar/creditos', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(credito)
    })
        .then(res => res.json())
        .then(data => {
            console.log(`✅ Crédito insertado correctamente: ${credito.cuenta}`);
        })
        .catch(err => {
            console.error(`❌ Error al insertar crédito ${credito.cuenta}:`, err);
        });
}
