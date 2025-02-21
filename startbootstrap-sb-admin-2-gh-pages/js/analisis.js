const contenedor = document.querySelector('tbody');
let resultados = '';

fetch('http://localhost:5000/api/analisis/ultimo-consecutivo', {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
})
    .then(response => {
        if (!response.ok) {
            throw new Error('Error en la solicitud');
        }
        return response.json();
    })
    .then(analisis => {
        mostrar(analisis.ultimoConsecutivo);
    })
    .catch(error => {
        console.error('Error:', error);
    });



const mostrar = (analisis) => {
    let resultados = '';
    analisis.forEach(analisis => {

        const rawFecha = analisis.FECH23;
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



        resultados +=
            `<tr>
                    <td class="text-center text-dark font-weight-bold">${analisis.AGEN23}</td>
                    
                    <td class="text-center text-dark font-weight-bold ">${analisis.ULTIMO_CONSECUTIVO}</td>
   
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
