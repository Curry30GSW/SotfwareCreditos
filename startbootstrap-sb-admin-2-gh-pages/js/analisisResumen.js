const token = sessionStorage.getItem('token');
const contenedor = document.querySelector('tbody');



// fetch(`http://localhost:5000/api/analisis/ultimo-consecutivo/0`, {
//     method: 'GET',
//     headers: {
//         'Content-Type': 'application/json',
//         'Authorization': `Bearer ${token}`
//     },
// })
//     .then(response => {
//         if (!response.ok) {
//             throw new Error('Error en la solicitud');
//         }
//         return response.json();
//     })
//     .then(data => {
//         console.log(data);
//         mostrar(data.consecutivos);
//     })
//     .catch(error => {
//         console.error('Error:', error);
//     });

Promise.all([
    fetch(`http://localhost:5000/api/analisis/ultimo-consecutivo/0`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
    }).then(response => {
        if (!response.ok) throw new Error('Error en la solicitud 0');
        return response.json().then(data => data.consecutivos || []);
    }),

    fetch(`http://localhost:5000/api/analisis/ultimo-consecutivo/1`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
    }).then(response => {
        if (!response.ok) throw new Error('Error en la solicitud 1');
        return response.json().then(data => data.consecutivos || []);
    }),

    fetch(`http://localhost:5000/api/analisis/ultimo-consecutivo/2`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
    }).then(response => {
        if (!response.ok) throw new Error('Error en la solicitud 2');
        return response.json().then(data => data.consecutivos || []);
    }),

    fetch(`http://localhost:5000/api/analisis/ultimo-consecutivo/3`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
    }).then(response => {
        if (!response.ok) throw new Error('Error en la solicitud 3');
        return response.json().then(data => data.consecutivos || []);
    }),

    fetch(`http://localhost:5000/api/analisis/ultimo-consecutivo/4`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
    }).then(response => {
        if (!response.ok) throw new Error('Error en la solicitud 4');
        return response.json().then(data => data.consecutivos || []);
    }),

    fetch(`http://localhost:5000/api/analisis/ultimo-consecutivo/5`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
    }).then(response => {
        if (!response.ok) throw new Error('Error en la solicitud 5');
        return response.json().then(data => data.consecutivos || []);
    }),
    fetch(`http://localhost:5000/api/analisis/ultimo-consecutivo/6`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
    }).then(response => {
        if (!response.ok) throw new Error('Error en la solicitud 6');
        return response.json().then(data => data.consecutivos || []);
    })
])
    .then(([analisis0, analisis1, analisis2, analisis3, analisis4, analisis5, analisis6]) => {

        // Si no es un array, conviértelo en un array vacío para evitar errores
        analisis0 = Array.isArray(analisis0) ? analisis0 : [];
        analisis1 = Array.isArray(analisis1) ? analisis1 : [];
        analisis2 = Array.isArray(analisis2) ? analisis2 : [];
        analisis3 = Array.isArray(analisis3) ? analisis3 : [];
        analisis4 = Array.isArray(analisis4) ? analisis4 : [];
        analisis5 = Array.isArray(analisis5) ? analisis5 : [];
        analisis6 = Array.isArray(analisis6) ? analisis6 : [];

        console.log("Datos crudos:", { analisis0, analisis1, analisis2, analisis3, analisis4, analisis5, analisis6 });

        const datosCombinados = [
            ...analisis0.map(d => ({ ...d, origen: 0 })),
            ...analisis1.map(d => ({ ...d, origen: 1 })),
            ...analisis2.map(d => ({ ...d, origen: 2 })),
            ...analisis3.map(d => ({ ...d, origen: 3 })),
            ...analisis4.map(d => ({ ...d, origen: 4 })),
            ...analisis5.map(d => ({ ...d, origen: 5 })),
            ...analisis6.map(d => ({ ...d, origen: 6 }))
        ];

        console.log("Datos combinados:", datosCombinados);
        mostrar(datosCombinados);
    })
    .catch(error => console.error('Error:', error));

const getColorPorOrigen = (origen) => {
    const colores = {
        0: 'background-color: #FFA725;', // Febrero - Melocotón
        1: 'background-color: #D4E157;', // Enero - Verde lima
        2: 'background-color: #FFAB91;', // Diciembre - Naranja suave
        3: 'background-color: #81D4FA;', // Noviembre - Azul celeste
        4: 'background-color: #B39DDB;', // Octubre - Morado pastel
        5: 'background-color: #FF8A80;', // Septiembre - Rojo claro
        6: 'background-color: #AED581;'  // Otro - Verde claro
    };
    return colores[origen] || 'background-color: #E0E0E0;'; // Color por defecto (gris)
};


const mostrar = (analisisResumenMes) => {
    let resultados = '';

    // Filtrar los datos por origen para cada mes
    const datosPorMes = {
        0: analisisResumenMes.filter(a => a.origen === 0),
        1: analisisResumenMes.filter(a => a.origen === 1),
        2: analisisResumenMes.filter(a => a.origen === 2),
        3: analisisResumenMes.filter(a => a.origen === 3),
        4: analisisResumenMes.filter(a => a.origen === 4),
        5: analisisResumenMes.filter(a => a.origen === 5),
        6: analisisResumenMes.filter(a => a.origen === 6)
    };

    const maxFilas = Math.max(...Object.values(datosPorMes).map(arr => arr.length));

    for (let i = 0; i < maxFilas; i++) {
        resultados += `<tr>`;

        let primerRegistro = datosPorMes[0][i] || datosPorMes[1][i] || datosPorMes[2][i] ||
            datosPorMes[3][i] || datosPorMes[4][i] || datosPorMes[5][i] || datosPorMes[6][i] || {};

        resultados += `
            <td class="text-center text-dark font-weight-bold">${primerRegistro.AGEN23 || ''}</td>
            <td class="text-dark font-weight-bold">${primerRegistro.DESC03 || ''}</td>
        `;

        for (let origen = 0; origen <= 6; origen++) {
            let analisis = datosPorMes[origen][i] || {};
            let cantidadRealizada = (analisis.ultimo_consecutivoMes || 0) - (analisis.primer_consecutivoMes || 0) + 1;

            resultados += `
                <td class="text-center text-dark font-weight-bold" style="${getColorPorOrigen(origen)}">${analisis.primer_consecutivoMes || ''}</td>
                <td class="text-center text-dark font-weight-bold" style="${getColorPorOrigen(origen)}">${analisis.ultimo_consecutivoMes || ''}</td>
                <td class="text-center text-dark font-weight-bold" style="${getColorPorOrigen(origen)}">${cantidadRealizada || ''}</td>
            `;
        }

        resultados += `</tr>`;
    }

    document.getElementById('resumenAnalisis').innerHTML = resultados;

    if ($.fn.DataTable.isDataTable('#tablaResumenAnalisis')) {
        $('#tablaResumenAnalisis').DataTable().destroy();
    }

    $('#tablaResumenAnalisis').DataTable({
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
        "lengthMenu": [[13, 15, 20, 25], [13, 15, 20, 25]]
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