const token = sessionStorage.getItem('token');
const contenedor = document.querySelector('tbody');
let resultados = '';

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

    async function obtenerDatos(fechaInicio, fechaFin) {
        try {
            const url = `http://localhost:5000/api/creditos?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`;

            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
            });

            if (!response.ok) throw new Error('Error en la solicitud');

            const creditos = await response.json();
            mostrar(creditos);

        } catch (error) {
            console.error('❌ Error:', error);
            Swal.fire('Error', 'No se pudo obtener la información.', 'error');
        }
    }

    // **1️⃣ Enviar fechas automáticamente cuando la página carga**
    await obtenerDatos(formatoFecha(primerDiaMes), formatoFecha(hoy));

    // **2️⃣ Evento de escucha al hacer clic en "Guardar"**
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
                <td style="color: #000 !important; font-weight: 525 !important width: 50px; white-space: nowrap;"">${creditos.DESC05}</td>
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
            </tr>`;
    });

    // Asegurar que la tabla se limpie antes de agregar nuevos datos
    if ($.fn.DataTable.isDataTable('#tablaAS400')) {
        $('#tablaAS400').DataTable().clear().destroy();
    }

    // Agregar los nuevos resultados
    $("#tablaAS400 tbody").html(resultados);

    // Volver a inicializar DataTables
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

document.getElementById("refreshBtn").addEventListener("click", function () {
    location.reload(); // Recarga la página
});
