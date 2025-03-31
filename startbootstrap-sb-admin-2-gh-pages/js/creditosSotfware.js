const token = sessionStorage.getItem('token');
const contenedor = document.querySelector('tbody');

// Abre el modal cuando el usuario hace clic en el botón para abrir el modal de fechas
const abrirModalBtn = document.querySelector('[data-bs-target="#modalFechas"]');
const modalFechas = new bootstrap.Modal(document.getElementById('modalFechas'));

abrirModalBtn.addEventListener('click', () => {
    modalFechas.show();
});

// Función para manejar la acción de búsqueda después de que el usuario seleccione las fechas
const buscarBtn = document.getElementById('buscarBtn');
buscarBtn.addEventListener('click', () => {
    const fechaInicio = document.getElementById('fechaInicio').value;
    const fechaFin = document.getElementById('fechaFin').value;
    const hoy = new Date().toISOString().split('T')[0];

    if (!fechaInicio || !fechaFin) {
        Swal.fire({
            icon: 'warning',
            title: 'Fechas requeridas',
            text: 'Por favor, ingresa ambas fechas antes de buscar.',
            confirmButtonText: 'OK'
        });
        return;
    }

    if (fechaInicio > fechaFin) {
        Swal.fire({
            icon: 'error',
            title: 'Rango de fechas incorrecto',
            html: 'La <b>Fecha Inicial</b> debe ser menor que la fecha final.',
            confirmButtonText: 'OK'
        });
        return;
    }

    if (fechaFin > hoy) {
        Swal.fire({
            icon: 'error',
            title: 'Fecha fuera de rango',
            html: 'La <b>Fecha Final</b> no puede ser mayor al día actual.',
            confirmButtonText: 'OK'
        });
        return;
    }

    if (!token) {
        window.location.href = '../../SotfwareCreditos/login-form-02/login.html';
    }
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

    // Mostrar resultados con las fechas seleccionadas
    fetch(`http://localhost:5000/api/creditos/pagares?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`, {
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
        .then(data => {
            mostrar(data.data);
            modalFechas.hide();
        })
        .catch(error => {
            console.error('Error:', error);
        });
});


const mostrar = (creditosPagares) => {
    let resultados = '';
    creditosPagares.forEach(creditosPagares => {

        // Determinar el estado según el valor de Aprobado
        let estado = '';
        switch (creditosPagares.Aprobado) {
            case 1:
                estado = 'APROBADO';
                break;
            case 0:
                estado = 'RECHAZADO';
                break;
            case 4:
                estado = 'ANULADO';
                break;
            default:
                estado = 'DESCONOCIDO';
        }
        let saldoCapital = Number(creditosPagares.Capital || 0).toLocaleString("es-CO");

        resultados +=
            `<tr>
                <td class="text-center" style="color: #000 !important; font-weight: 525 !important">${creditosPagares.ID}</td>
                <td class="text-center" style="color: #000 !important; font-weight: 525 !important">${creditosPagares.NoAgencia}</td>
                <td class="text-center" style="color: #000 !important; font-weight: 525 !important">${creditosPagares.CuentaCoop}</td>
                <td class="text-center" style="color: #000 !important; font-weight: 525 !important">${creditosPagares.Cedula_Persona}</td>
                <td class="text-center" style="color: #000 !important; font-weight: 525 !important">${creditosPagares.NombreCompleto}</td>
                <td class="text-center" style="color: #000 !important; font-weight: 525 !important">${creditosPagares.FechaCredito}</td>
                <td class="text-center" style="color: #000 !important; font-weight: 525 !important">${creditosPagares.NoLC}</td>
                <td class="text-center" style="color: #000 !important; font-weight: 525 !important">${creditosPagares.ID_Pagare}</td>
                <td class="text-center" style="color: #000 !important; font-weight: 525 !important">$${saldoCapital}</td>
                <td class="text-center" style="color: #000 !important; font-weight: 525 !important">${creditosPagares.Tasa}%</td>
                <td class="text-center" style="color: #000 !important; font-weight: 525 !important">${creditosPagares.Direccion}</td>
                <td class="text-center" style="color: #000 !important; font-weight: 525 !important">${creditosPagares.Linea_Credito}</td>
                <td class="text-center" style="color: #000 !important; font-weight: 525 !important">${creditosPagares.GeneradorPagare}</td>
                <td class="text-center" style="color: #000 !important; font-weight: 525 !important">${creditosPagares.CoorAsignada}</td>
                <td class="text-center" style="color: #000 !important; font-weight: 525 !important">${creditosPagares.Nomina}</td>
                <td class="text-center" style="color: #000 !important; font-weight: 525 !important">${estado}</td>
            </tr>`;
    });
    contenedor.innerHTML = resultados;


    // Inicializar DataTables
    if ($.fn.DataTable.isDataTable('#tablaPagares')) {
        $('#tablaPagares').DataTable().destroy();
    }

    $('#tablaPagares').DataTable({
        scrollY: "500px",
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
        "lengthMenu": [[-1], ["Todos"]]
    });
};

window.onload = () => {
    Swal.fire({
        icon: 'info',
        title: 'Información',
        html: 'Debes ingresar la <b>Fecha de Crédito</b> antes de continuar.',
        confirmButtonText: 'Entendido'
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
