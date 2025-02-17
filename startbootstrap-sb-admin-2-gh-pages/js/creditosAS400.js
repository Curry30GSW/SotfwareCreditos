const contenedor = document.querySelector('tbody');
let resultados = '';


//Mostrar Resultados
fetch('http://localhost:5000/api/creditos', {
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
    .then(creditos => {
        mostrar(creditos);
    })
    .catch(error => {
        console.error('Error:', error);
    });



const mostrar = (creditos) => {
    let resultados = ''; // Asegúrate de inicializar resultados aquí
    creditos.forEach(creditos => {
        // Convertir fecha de registro a un formato legible
        const rawFecha = creditos.FECI13;
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
            return meses[mes - 1]; // Meses están indexados desde 0, así que restamos 1
        }
        let capitalInicial = Number(creditos.CAPI13 || 0).toLocaleString("es-CO");


        const tasaFormateada = creditos.TASA13 > 0 ? "Tasa>0" : "Tasa=0";

        resultados +=
            `<tr>
                <td class="text-center ">${creditos.AGOP13}</td>
                <td class="text-center ">${creditos.NCTA13}</td>
                <td class="text-center ">${creditos.NNIT05}</td>
                <td class="text">${creditos.DESC05}</td>
                <td class="text">${fechaFormateada}</td> 
                <td class="text-center ">${creditos.TCRE13}</td>
                <td class="text-center ">${creditos.CPTO13}</td>
                <td class="text-center ">${creditos.NCRE13}</td>
                <td class="text-center ">${creditos.ORSU13}</td>
                <td class="text-center ">$${capitalInicial}</td>
                <td class="text-center ">${creditos.TASA13}</td>
                <td class="text-center ">${tasaFormateada}</td>
                <td class="text-center ">${creditos.LAPI13}</td>
                <td class="text-center ">${creditos.CIUD05}</td>
                <td class="text-center ">${creditos.DESC06}</td>
                <td class="text-center ">${creditos.CLAS06}</td>
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
        "lengthMenu": [[5, 10, 15, 20, 25], [5, 10, 15, 20, 25]]
    });
};

