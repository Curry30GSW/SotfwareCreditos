document.addEventListener('DOMContentLoaded', function () {
    Swal.fire({
        icon: 'info',
        title: 'Módulo Créditos NO Registrados',
        html: 'Este es el módulo de créditos <b>NO registrados</b>. A continuación se desplegará una lista con los <b>créditos que no están registrados en el sotware.</b>',
        confirmButtonColor: '#3085d6'
    });
});

if (!document.getElementById("blink-style")) {
    const style = document.createElement("style");
    style.id = "blink-style";
    style.innerHTML = `
        @keyframes blink {
            0% { opacity: 1; }
            50% { opacity: 0; }
            100% { opacity: 1; }
        }
        .blink {
            animation: blink 3s infinite;
        }
    `;
    document.head.appendChild(style);
}


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

if (!token) {
    window.location.href = '../../SotfwareCreditos/login-form-02/login.html';
}


setTimeout(() => {
    Swal.close();

    fetch('http://localhost:5000/api/creditos-no-registrados', {
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
            if (!data || !Array.isArray(data.CreditosEspecialesNoRegistrados)) {
                throw new Error("❌ La API no devolvió un array válido");
            }
            mostrar(data.CreditosEspecialesNoRegistrados);
        })
        .catch(error => {
            console.error('Error:', error);
        });

}, 2500);

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
    let resultados = ''; // Asegúrate de inicializar resultados aquí
    creditos.forEach((creditos, index) => {
        // Convertir fecha de registro a un formato legible
        const rawFecha = creditos.FECI13;
        const fechaCalculada = rawFecha + 19000000;
        const año = Math.floor(fechaCalculada / 10000);
        const mesNumero = Math.floor((fechaCalculada % 10000) / 100);
        const dia = String(fechaCalculada % 100).padStart(2, '0');
        const fechaFormateada = `${dia} ${obtenerNombreMes(mesNumero)} ${año}`;
        function obtenerNombreMes(mes) {
            const meses = [
                'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
                'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'
            ];
            return meses[mes - 1]; // Meses están indexados desde 0, así que restamos 1
        }
        let capitalInicial = Number(creditos.CAPI13 || 0).toLocaleString("es-CO");


        resultados +=
            `<tr>
                <td class="text-center" style="color: #000 !important; font-weight: 525 !important">${index + 1}
                <td class="text-center" style="color: #000 !important; font-weight: 525 !important">${creditos.DIRE03}</td>
                <td style="color: #000 !important; font-weight: 525 !important">${creditos.DIST03}-${creditos.DESC03}</td>
                <td style="color: #000 !important; font-weight: 525 !important; width: 50px; white-space: nowrap;">${fechaFormateada}</td>
                <td class="text-center" style="color: #000 !important; font-weight: 525 !important">${creditos.NCTA13}</td>
                <td style="color: #000 !important; font-weight: 525 !important">${creditos.DESC05}</td>
                <td class="text-center font-weight-bold" 
                        style="${creditos.Score === 'F/D' || creditos.Score === 'S/E' ? 'color:#fd7e14' :
                creditos.Score < 650 ? 'color:red' : 'color:#007bff'}">
                                    ${creditos.Score}
                        </td>
                <td class="text-center" style="color: #000 !important; font-weight: 525 !important">${calcularEdad(creditos.FECN05)}</td>
                <td class="text-center" style="color: #000 !important; font-weight: 525 !important">${creditos.NCRE13}</td>
                <td class="text-center" style="color: #000 !important; font-weight: 525 !important">${creditos.TCRE13}-${creditos.DESC06}</td>
                <td class="text-center" style="color: #000 !important; font-weight: 525 !important">$${capitalInicial}</td>
                <td class="text-center" style="color: #000 !important; font-weight: 525 !important">${creditos.TASA13}%</td>
                <td class="text-center" style="color: #000 !important; font-weight: 525 !important">${creditos.DESC04}</td>
                <td class="text-center blink" style="color: red !important; font-weight: 525 !important">${creditos.USEF13}</td>
        
            </tr>`;
    });
    contenedor.innerHTML = resultados;

    // Inicializar DataTables
    if ($.fn.DataTable.isDataTable('#tablaAS400')) {
        $('#tablaAS400').DataTable().destroy();
    }

    $('#tablaAS400').DataTable({
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
                title: 'Creditos No Registrados En Sotfware',
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