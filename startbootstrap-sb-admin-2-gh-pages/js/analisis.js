const contenedor = document.querySelector('tbody');
let resultados = '';

Promise.all([
    fetch('http://localhost:5000/api/analisis/ultimo-consecutivo', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    }).then(response => {
        if (!response.ok) throw new Error('Error en la solicitud 1');
        return response.json();
    }),

    fetch('http://localhost:5000/api/analisis/ultimo-consecutivo/mes-actual', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    }).then(response => {
        if (!response.ok) throw new Error('Error en la solicitud 2');
        return response.json();
    }),

    fetch('http://localhost:5000/api/analisis-cero', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    }).then(response => {
        if (!response.ok) throw new Error('Error en la solicitud 2');
        return response.json();
    }),

    fetch('http://localhost:5000/api/analisis-uno', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    }).then(response => {
        if (!response.ok) throw new Error('Error en la solicitud 3');
        return response.json();
    }),

    fetch('http://localhost:5000/api/analisis-dos', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    }).then(response => {
        if (!response.ok) throw new Error('Error en la solicitud 4');
        return response.json();
    }),

    fetch('http://localhost:5000/api/analisis-tres', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
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
            agrupados[agencia].ULTIMO_CONSECUTIVO = analisis.ULTIMO_CONSECUTIVO;
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
        agrupados[agencia].CANTIDAD_REALIZADA = agrupados[agencia].ULTIMO_CONSECUTIVONOW - agrupados[agencia].ULTIMO_CONSECUTIVO;
        agrupados[agencia].analisisPendientes = agrupados[agencia].ANALISIS_CERO + agrupados[agencia].ANALISIS_UNO;
    });


    Object.values(agrupados).forEach(analisis => {
        analisis.verificacion =
            analisis.ANALISIS_CERO +
            analisis.ANALISIS_UNO +
            analisis.ANALISIS_DOS +
            analisis.ANALISIS_TRES -
            analisis.CANTIDAD_REALIZADA;


        analisis.efectividad = analisis.CANTIDAD_REALIZADA !== 0
            ? ((analisis.ANALISIS_TRES / analisis.CANTIDAD_REALIZADA) * 100).toFixed(2) + '%'
            : '0%';

    });



    Object.values(agrupados).forEach(analisis => {
        resultados += `
            <tr>
                <td class="text-center text-dark font-weight-bold">${analisis.AGEN23}</td>
                <td class="text-dark font-weight-bold">${analisis.nombreCiudad}</td>
                <td class="text-center text-dark font-weight-bold">${analisis.ULTIMO_CONSECUTIVO}</td>
                <td class="text-center text-dark font-weight-bold">${analisis.ULTIMO_CONSECUTIVONOW}</td>
                <td class="text-center text-dark font-weight-bold">${analisis.CANTIDAD_REALIZADA}</td>
                <td class="text-center text-dark font-weight-bold">
                    ${analisis.ANALISIS_CERO}
                    <button class="btn btn-link text-primary" onclick="verDetalle('ANALISIS_CERO', '${analisis.ANALISIS_CERO}')">
                        <i class="fas fa-eye"></i>
                    </button>
                </td>
                <td class="text-center text-dark font-weight-bold">
                    ${analisis.ANALISIS_UNO}
                    <button class="btn btn-link text-primary" onclick="verDetalle('ANALISIS_UNO', '${analisis.ANALISIS_UNO}')">
                        <i class="fas fa-eye"></i>
                    </button>
                </td>
                <td class="text-center text-dark font-weight-bold">
                    ${analisis.ANALISIS_DOS}
                    <button class="btn btn-link text-primary" onclick="verDetalle('ANALISIS_DOS', '${analisis.ANALISIS_DOS}')">
                        <i class="fas fa-eye"></i>
                    </button>
                </td>
                <td class="text-center text-dark font-weight-bold">
                    ${analisis.ANALISIS_TRES}
                    <button class="btn btn-link text-primary" onclick="verDetalle('ANALISIS_TRES', '${analisis.ANALISIS_TRES}')">
                        <i class="fas fa-eye"></i>
                    </button>
                </td>
                <td class="text-center text-dark font-weight-bold">${analisis.verificacion}</td>
                <td class="text-center text-dark font-weight-bold">${analisis.efectividad}</td>
                <td class="text-center text-dark font-weight-bold">
                    ${analisis.analisisPendientes}
                    <button class="btn btn-link text-primary" onclick="verDetalle('ANÁLISIS PENDIENTES', '${analisis.analisisPendientes}')">
                        <i class="fas fa-eye"></i>
                    </button>
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
                title: 'Reporte_Analisis',
                exportOptions: {
                    columns: ':visible'
                },
                className: 'btn-success' // Aplicamos Bootstrap directamente
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

    // Obtener el 30 del mes anterior
    let mesAnterior = mesActual - 1;
    let añoAnterior = añoActual;

    if (mesAnterior < 0) {
        mesAnterior = 11; // Si estamos en enero, el mes anterior es diciembre
        añoAnterior--; // Y el año anterior también cambia
    }

    const fechaCorte = new Date(añoAnterior, mesAnterior, 30);
    const fechaActual = hoy; // Fecha actual

    // Array con nombres de los meses
    const meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

    // Formatear fechas en "DD-Mes"
    const formatoFecha = (fecha) => {
        const dia = fecha.getDate();
        const mesNombre = meses[fecha.getMonth()];
        return `${dia}-${mesNombre}`;
    };

    thCorte.textContent = `${formatoFecha(fechaCorte)}`;
    thActual.textContent = `${formatoFecha(fechaActual)}`;
});

