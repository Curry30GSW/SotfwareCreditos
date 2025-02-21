const contenedor = document.querySelector('tbody');

// Abre el modal cuando el usuario hace clic en el botón para abrir el modal de fechas
const abrirModalBtn = document.querySelector('[data-bs-target="#modalFechas"]'); // Selecciona el botón que abre el modal
const modalFechas = new bootstrap.Modal(document.getElementById('modalFechas')); // Referencia del modal

abrirModalBtn.addEventListener('click', () => {
    modalFechas.show(); // Mostrar modal
});

// Función para manejar la acción de búsqueda después de que el usuario seleccione las fechas
const buscarBtn = document.getElementById('buscarBtn');
buscarBtn.addEventListener('click', () => {
    const fechaInicio = document.getElementById('fechaInicio').value;
    const fechaFin = document.getElementById('fechaFin').value;

    if (!fechaInicio || !fechaFin) {
        alert('Por favor, ingresa ambas fechas');
        return;
    }


    console.log(fechaInicio);
    console.log(fechaFin);

    // Mostrar resultados con las fechas seleccionadas
    fetch(`http://localhost:5000/api/creditos/pagares?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`, {
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
        .then(data => {
            mostrar(data.data);  // Pasa 'data.data' al método mostrar
            modalFechas.hide(); // Cerrar modal después de la búsqueda
        })
        .catch(error => {
            console.error('Error:', error);
        });
});


const mostrar = (creditosPagares) => {
    let resultados = '';
    creditosPagares.forEach(creditosPagares => {
        // Usar la fecha ya formateada


        resultados +=
            `<tr>
                <td class="text-center text-dark font-weight-bold">${creditosPagares.ID}</td>
                <td class="text-center text-dark font-weight-bold">${creditosPagares.NoAgencia}</td>
                <td class="text-center text-dark font-weight-bold">${creditosPagares.CuentaCoop}</td>
                <td class="text text-dark font-weight-bold">${creditosPagares.Cedula_Persona}</td>
                <td class="text text-dark font-weight-bold">${creditosPagares.NombreCompleto}</td>
                <td class="text-center text-uppercase text-dark font-weight-bold">${creditosPagares.FechaCredito}</td>
                <td class="text-center text-dark font-weight-bold">${creditosPagares.NoLC}</td>
                <td class="text-center text-dark font-weight-bold">${creditosPagares.ID_Pagare}</td>
                <td class="text-center text-dark font-weight-bold">${creditosPagares.Capital}</td>
                <td class="text-center text-dark font-weight-bold">${creditosPagares.Tasa}</td>
                <td class="text-center text-uppercase text-dark font-weight-bold">${creditosPagares.FechaAccion}</td>
                <td class="text-center text-dark font-weight-bold">${creditosPagares.Direccion}</td>
                <td class="text-center text-dark font-weight-bold">${creditosPagares.Linea_Credito}</td>
                <td class="text-center text-dark font-weight-bold">${creditosPagares.GeneradorPagare}</td>
                <td class="text-center text-dark font-weight-bold">${creditosPagares.CoorAsignada}</td>
                <td class="text-center text-dark font-weight-bold">${creditosPagares.Nomina}</td>
                <td class="text-center text-dark font-weight-bold">${creditosPagares.Aprobado}</td>
                <td class="text-center text-dark font-weight-bold">${creditosPagares.Ordinario}</td>
            </tr>`;
    });
    contenedor.innerHTML = resultados;

    // Inicializar DataTables
    if ($.fn.DataTable.isDataTable('#tablaPagares')) {
        $('#tablaPagares').DataTable().destroy();
    }

    $('#tablaPagares').DataTable({
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
