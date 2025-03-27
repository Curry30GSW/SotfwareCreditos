const token = sessionStorage.getItem('token');
const contenedor = document.querySelector('tbody');

if (!token) {
    window.location.href = '../../SotfwareCreditos/login-form-02/login.html';
}

Promise.all([


    //Actual
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

    //-1
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

    //-2
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

    //-3
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

    //-4
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

    //-5
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
    //-6
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



        const datosCombinados = [
            ...analisis0.map(d => ({ ...d, origen: 0 })),
            ...analisis1.map(d => ({ ...d, origen: 1 })),
            ...analisis2.map(d => ({ ...d, origen: 2 })),
            ...analisis3.map(d => ({ ...d, origen: 3 })),
            ...analisis4.map(d => ({ ...d, origen: 4 })),
            ...analisis5.map(d => ({ ...d, origen: 5 })),
            ...analisis6.map(d => ({ ...d, origen: 6 }))
        ];

        mostrar(datosCombinados);
    })
    .catch(error => console.error('Error:', error));



const mostrar = (analisisResumenMes) => {
    let resultados = '';

    // Obtener todas las agencias únicas
    const agenciasUnicas = [...new Set(analisisResumenMes.map(a => a.AGEN23))];

    // Filtrar los datos por origen para cada mes
    const datosPorMes = {};
    for (let i = 0; i <= 6; i++) {
        datosPorMes[i] = analisisResumenMes.filter(a => a.origen === i);
    }

    // Objeto para almacenar los últimos valores conocidos de cada agencia
    const ultimosValores = {};

    let totalAnalisisNacional = 0;

    agenciasUnicas.forEach(agencia => {
        resultados += `<tr>`;

        const ultimosNombresAgencias = {};

        // Buscar un registro base para obtener la descripción de la agencia
        let primerRegistro = analisisResumenMes.find(a => a.AGEN23 === agencia) || { AGEN23: agencia, DESC03: agencia };

        // Si el nombre no está disponible, intenta recuperar el último conocido
        if (!primerRegistro.DESC03 || primerRegistro.DESC03.trim() === "") {
            primerRegistro.DESC03 = ultimosNombresAgencias[agencia] || agencia; // Usar AGEN23 si DESC03 está vacío
        } else {
            ultimosNombresAgencias[agencia] = primerRegistro.DESC03;
        }



        resultados += `
            <td class="text-center" style="color: #000 !important; font-weight: 525 !important">${primerRegistro.AGEN23 || ''}</td>
            <td style="color: #000 !important; font-weight: 525 !important">${primerRegistro.DESC03 || ''}</td>
        `;

        for (let origen = 6; origen >= 0; origen--) {
            let analisis = datosPorMes[origen].find(a => a.AGEN23 === agencia);

            if (!analisis) {
                // Si no hay datos en este mes, usa los últimos valores guardados
                // PERO aseguramos que cantidadRealizada sea 0
                analisis = ultimosValores[agencia] || { primer_consecutivoMes: '', ultimo_consecutivoMes: '' };
                var cantidadRealizada = 0;
            } else {
                // Actualizar últimos valores conocidos
                ultimosValores[agencia] = analisis;
                var cantidadRealizada = (analisis.ultimo_consecutivoMes || 0) - (analisis.primer_consecutivoMes || 0) + 1;
            }

            resultados += `
                <td class="text-center" style="color: #000 !important; font-weight: 525 !important; ${getColorPorOrigen(origen)}">${analisis.primer_consecutivoMes || ''}</td>
                <td class="text-center" style="color: #000 !important; font-weight: 525 !important; ${getColorPorOrigen(origen)}">${analisis.ultimo_consecutivoMes || ''}</td>
                <td class="text-center" style="color: #000 !important; font-weight: 525 !important; ${getColorPorOrigen(origen)}">${cantidadRealizada}</td>
                <td style="color: #000 !important; font-weight: 525 !important; ${getColorPorOrigen(origen)}">
                    <div class="d-flex w-100 justify-content-between">
                        <button class="btn btn-link text-primary p-0" onclick="verDetalleEstado(${origen}, ${agencia})">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn btn-link text-secondary p-0" onclick="mostraInfo(${origen}, ${agencia})">
                            <i class="fas fa-question-circle"></i>
                        </button>
                    </div>
                </td>


            `;
        }

        let acumuladoParcial = Object.values(datosPorMes).reduce((acc, mes) => {
            let analisis = mes.find(a => a.AGEN23 === agencia);
            return acc + (analisis ? (analisis.ultimo_consecutivoMes || 0) - (analisis.primer_consecutivoMes || 0) + 1 : 0);
        }, 0);

        totalAnalisisNacional += acumuladoParcial;


        // Agregar la fila con el acumulado parcial
        resultados += `
            <td class="text-center" style="color: #000 !important; font-weight: 525 !important;">${acumuladoParcial}</td>
            <td class="text-center" style="color: #000 !important; font-weight: 525 !important;">
                <div class="d-flex w-100 justify-content-between">
                        <button class="btn btn-link text-primary p-0" onclick="verDetalleEstadoParcial(${agencia})">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn btn-link text-secondary p-0" onclick="mostrarInfoParcial(${agencia})">
                            <i class="fas fa-question-circle"></i>
                        </button>
                    </div>
            </td>
        `;


        resultados += `</tr>`;

    });
    document.getElementById("totalAnalisis").textContent = totalAnalisisNacional.toLocaleString("es-CO");
    document.getElementById('resumenAnalisis').innerHTML = resultados;

    if ($.fn.DataTable.isDataTable('#tablaResumenAnalisis')) {
        $('#tablaResumenAnalisis').DataTable().destroy();
    }

    $('#tablaResumenAnalisis').DataTable({
        scrollX: true,
        scrollY: "600px",
        fixedColumns: {
            leftColumns: 2
        },
        fixedHeader: true,
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
                title: 'Reporte_Analisis_Resumen',
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

const getColorPorOrigen = (origen) => {
    const colores = {
        0: 'background-color: #BDB395;',
        1: 'background-color: #D5C7A3;',
        2: 'background-color: #F2E2B1;',
        3: 'background-color: #EEF1DA;',
        4: 'background-color: #D5E5D5;',
        5: 'background-color: #C7D9DD;',
        6: 'background-color: #B5CBD2;'

    };
    return colores[origen] || 'background-color: #E0E0E0;'; // Color por defecto (gris)
};

const verDetalleEstado = (mes, agencia) => {
    const estados = [0, 1, 2, 3];

    const peticiones = estados.map(estado =>
        fetch(`http://localhost:5000/api/analisis/${estado}/${mes}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
            .then(response => response.ok ? response.json() : [])
            .then(data => {

                const dataFiltrada = data.filter(detalle => detalle.AGEN23 === agencia);
                return {
                    estado,
                    data: dataFiltrada.length > 0
                        ? dataFiltrada.map(item => ({
                            AGEN23: item.AGEN23,
                            DESC03: item.DESC03,
                            ANALISIS: item.ANALISIS
                        }))
                        : [{ AGEN23: agencia, DESC03: "", ANALISIS: 0 }]
                };

            })
            .catch(error => {
                console.error(`Error con el estado ${estado}:`, error);
                return { estado, data: [{ AGEN23: agencia, ANALISIS: 0 }] };
            })
    );

    Promise.all(peticiones)
        .then(resultados => {
            let dataEstructurada = {};

            // Organizar la data por agencia
            resultados.forEach(({ estado, data }) => {
                data.forEach(detalle => {
                    const agencia = detalle.AGEN23;
                    if (!dataEstructurada[agencia]) {
                        dataEstructurada[agencia] = {
                            NOMBRE: detalle.DESC03.trim(),
                            PROYECCION: 0,
                            PAGARE: 0,
                            ANULADOS: 0,
                            GRABADOS: 0
                        };
                    }
                    if (estado === 0) dataEstructurada[agencia].PROYECCION = detalle.ANALISIS;
                    if (estado === 1) dataEstructurada[agencia].PAGARE = detalle.ANALISIS;
                    if (estado === 2) dataEstructurada[agencia].ANULADOS = detalle.ANALISIS;
                    if (estado === 3) dataEstructurada[agencia].GRABADOS = detalle.ANALISIS;
                });
            });

            if (Object.keys(dataEstructurada).length === 0) {
                Swal.fire({
                    icon: 'info',
                    title: 'Sin resultados',
                    text: 'No hay análisis para la agencia seleccionada.',
                    confirmButtonColor: '#3085d6',
                    confirmButtonText: 'Entendido'
                });
                return;
            }

            if ($.fn.DataTable.isDataTable('#tablaDetallesAnalisis')) {
                $('#tablaDetallesAnalisis').DataTable().clear().destroy();
            }

            let contenido = '';

            // Recorrer la data organizada y llenar la tabla
            Object.keys(dataEstructurada).forEach(agencia => {
                const detalle = dataEstructurada[agencia];
                contenido += `
                    <tr>
                        <td class="text-center" style="color: #000 !important; font-weight: 525 !important">${detalle.PROYECCION}</td>
                        <td class="text-center" style="color: #000 !important; font-weight: 525 !important">${detalle.PAGARE}</td>
                        <td class="text-center" style="color: #000 !important; font-weight: 525 !important">${detalle.ANULADOS}</td>
                        <td class="text-center" style="color: #000 !important; font-weight: 525 !important">${detalle.GRABADOS}</td>
                    </tr>`;
            });

            document.getElementById('detalleContenidoResumen').innerHTML = contenido;
            // Calcular el total de análisis
            // Calcular el total de análisis
            let totalAnalisis = Object.values(dataEstructurada).reduce((total, detalle) => {
                return total + detalle.PROYECCION + detalle.PAGARE + detalle.ANULADOS + detalle.GRABADOS;
            }, 0);

            document.getElementById('totalAnalisis').textContent = `Total: ${totalAnalisis}`;

            // Obtener el nombre y agencia (asumiendo que solo hay una agencia en dataEstructurada)
            const agenciaKey = Object.keys(dataEstructurada)[0];
            const nombreAgencia = dataEstructurada[agenciaKey]?.NOMBRE?.trim() || agenciaKey;


            // Actualizar el título de la modal con el centro de costo y el nombre
            document.getElementById('detalleModalLabel').innerHTML = `${agenciaKey} - ${nombreAgencia} / Cantidad de Análisis `;


            $('#tablaDetalles').DataTable({
                destroy: true,
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
                "lengthMenu": [[5, 10, 15, 20], [5, 10, 15, 20]],
                dom: '<"top"lfB>rtip',
                buttons: [],
            });

            let modal = new bootstrap.Modal(document.getElementById('detalleModal'));
            modal.show();
        })
        .catch(error => {
            console.error('Error al obtener los detalles:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Ocurrió un problema al obtener los datos.',
                confirmButtonColor: '#d33',
                confirmButtonText: 'Cerrar'
            });
        });
};


const mostraInfo = (mes, agencia) => {
    const estados = [0, 1, 2, 3];

    const peticionesDetalle = estados.map(estado =>
        fetch(`http://localhost:5000/api/analisis/${estado}/${mes}/${agencia}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
            .then(response => response.ok ? response.json() : [])
            .then(data => {
                return {
                    estado,
                    data: data.length > 0 ? data.map(item => ({
                        AGEN23: item.AGEN23,
                        DESC03: item.DESC03.trim(),
                        FECH23: item.FECH23,
                        NANA23: item.NANA23,
                        NCTA23: item.NCTA23,
                        DESC05: item.DESC05.trim(),
                        NNIT05: item.NNIT05.trim(),
                        CAPI23: item.CAPI23,
                        TCRE23: item.TCRE23,
                        USER23: item.USER23.trim(),
                        STAT23: item.STAT23,
                        DESC04: item.DESC04.trim(),
                    })) : []
                };
            })
            .catch(error => {
                console.error(`Error con el estado ${estado}:`, error);
                return { estado, data: [] };
            })
    );

    Promise.all(peticionesDetalle)
        .then(resultados => {
            let dataEstructuradaDetalle = [];

            // Acumular correctamente los datos de cada estado
            resultados.forEach(({ data }) => {
                dataEstructuradaDetalle = dataEstructuradaDetalle.concat(data);
            });

            if (dataEstructuradaDetalle.length === 0) {
                Swal.fire({
                    icon: 'info',
                    title: 'Sin resultados',
                    text: 'No hay análisis para la agencia seleccionada.',
                    confirmButtonColor: '#3085d6',
                    confirmButtonText: 'Entendido'
                });
                return;
            }

            if ($.fn.DataTable.isDataTable('#tablaDetallesAnalisisRes')) {
                $('#tablaDetallesAnalisisRes').DataTable().clear().destroy();
            }

            let contenido = '';

            // Recorrer la data acumulada y llenar la tabla
            dataEstructuradaDetalle.forEach(detalle => {
                let fechaFormateada = formatearFecha(detalle.FECH23);
                let saldoCapital = Number(detalle.CAPI23 || 0).toLocaleString("es-CO");
                contenido += `
                    <tr>
                        <td class="text-center" style="color: #000 !important; font-weight: 525 !important" >${detalle.AGEN23}</td>
                        <td class="text-center" style="color: #000 !important; font-weight: 525 !important">${detalle.DESC03}</td>
                        <td style="color: #000 !important; font-weight: 525 !important">${fechaFormateada}</td>
                        <td class="text-center" style="color: #000 !important; font-weight: 525 !important">${detalle.NANA23}</td>
                        <td class="text-center" style="color: #000 !important; font-weight: 525 !important">${detalle.NCTA23}</td>
                        <td class="text-center" style="color: #000 !important; font-weight: 525 !important">${detalle.DESC05}</td>
                        <td class="text-center" style="color: #000 !important; font-weight: 525 !important">${detalle.NNIT05}</td>
                        <td class="text-center" style="color: #000 !important; font-weight: 525 !important" >${detalle.TCRE23}</td>
                        <td class="text-center" style="color: #000 !important; font-weight: 525 !important" >$${saldoCapital}</td>
                        <td class="text-center" style="color: #000 !important; font-weight: 525 !important">${detalle.USER23}</td>
                        <td class="text-center" style="color: #000 !important; font-weight: 525 !important">${detalle.STAT23}</td>
                        <td class="text-center" style="color: #000 !important; font-weight: 525 !important" >${detalle.DESC04}</td>
                    </tr>`;
            });

            document.getElementById('detallesContenidoResumenCompleto').innerHTML = contenido;

            // Obtener el nombre y agencia (asumiendo que solo hay una agencia en la data)
            const nombreAgencia = dataEstructuradaDetalle[0]?.DESC03?.trim() || agencia;

            document.getElementById('detalleModalLabel1').innerHTML = `${agencia} - ${nombreAgencia}`;

            $('#tablaDetallesAnalisisRes').DataTable({
                destroy: true,
                responsive: true,
                order: [[3, 'asc']],

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
                "info": true,
                dom: '<"top"lfB>rtip',
                buttons: [
                    {
                        extend: 'excelHtml5',
                        text: '<i class="fas fa-file-excel"></i> Exportar a Excel',
                        title: 'Reporte_Analisis_Detallado',
                        exportOptions: {
                            columns: ':visible'
                        },
                        className: 'btn-success text-dark fw-bold' // Aplicamos Bootstrap directamente
                    }
                ],
                initComplete: function () {
                    // Asegurarnos de que el botón tome el estilo correctamente
                    $('.dt-buttons button').removeClass('dt-button').addClass('btn btn-success btn-m text-white');
                }
            });

            let modal = new bootstrap.Modal(document.getElementById('MostrarModal'));
            modal.show();
        })
        .catch(error => {
            console.error('Error al obtener los detalles:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Ocurrió un problema al obtener los datos.',
                confirmButtonColor: '#d33',
                confirmButtonText: 'Cerrar'
            });
        });
};

const mostrarInfoParcial = (agencia) => {
    fetch(`http://localhost:5000/api/datos-fechas-fijas/${agencia}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    })
        .then(response => response.ok ? response.json() : [])
        .then(data => {
            let dataEstructuradaDetalle = data.length > 0 ? data.map(item => ({
                AGEN23: item.AGEN23,
                DESC03: item.DESC03.trim(),
                FECH23: item.FECH23,
                NANA23: item.NANA23,
                NCTA23: item.NCTA23,
                DESC05: item.DESC05.trim(),
                NNIT05: item.NNIT05.trim(),
                CAPI23: item.CAPI23,
                TCRE23: item.TCRE23,
                USER23: item.USER23.trim(),
                STAT23: item.STAT23,
                DESC04: item.DESC04.trim(),
            })) : [];

            if (dataEstructuradaDetalle.length === 0) {
                Swal.fire({
                    icon: 'info',
                    title: 'Sin resultados',
                    text: 'No hay análisis para la agencia seleccionada.',
                    confirmButtonColor: '#3085d6',
                    confirmButtonText: 'Entendido'
                });
                return;
            }

            if ($.fn.DataTable.isDataTable('#tablaDetallesAnalisisRes')) {
                $('#tablaDetallesAnalisisRes').DataTable().clear().destroy();
            }

            let contenido = '';

            dataEstructuradaDetalle.forEach(detalle => {
                let fechaFormateada = formatearFecha(detalle.FECH23);
                let saldoCapital = Number(detalle.CAPI23 || 0).toLocaleString("es-CO");

                contenido += `
                      <tr>
                        <td class="text-center" style="color: #000 !important; font-weight: 525 !important" >${detalle.AGEN23}</td>
                        <td class="text-center" style="color: #000 !important; font-weight: 525 !important">${detalle.DESC03}</td>
                        <td style="color: #000 !important; font-weight: 525 !important">${fechaFormateada}</td>
                        <td class="text-center" style="color: #000 !important; font-weight: 525 !important">${detalle.NANA23}</td>
                        <td class="text-center" style="color: #000 !important; font-weight: 525 !important">${detalle.NCTA23}</td>
                        <td style="color: #000 !important; font-weight: 525 !important">${detalle.DESC05}</td>
                        <td  style="color: #000 !important; font-weight: 525 !important">${detalle.NNIT05}</td>
                        <td class="text-center" style="color: #000 !important; font-weight: 525 !important" >${detalle.TCRE23}</td>
                        <td class="text-center" style="color: #000 !important; font-weight: 525 !important" >$${saldoCapital}</td>
                        <td class="text-center" style="color: #000 !important; font-weight: 525 !important">${detalle.USER23}</td>
                        <td class="text-center" style="color: #000 !important; font-weight: 525 !important">${detalle.STAT23}</td>
                        <td class="text-center" style="color: #000 !important; font-weight: 525 !important" >${detalle.DESC04}</td>
                    </tr>`;
            });

            document.getElementById('detallesContenidoResumenCompleto').innerHTML = contenido;

            const nombreAgencia = dataEstructuradaDetalle[0]?.DESC03?.trim() || agencia;
            document.getElementById('detalleModalLabel1').innerHTML = `${agencia} - ${nombreAgencia}`;

            $('#tablaDetallesAnalisisRes').DataTable({
                destroy: true,
                order: [[3, 'asc']],
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
                "info": true,
                dom: '<"top"lfB>rtip',
                buttons: [
                    {
                        extend: 'excelHtml5',
                        text: '<i class="fas fa-file-excel"></i> Exportar a Excel',
                        title: 'Reporte_Analisis_Parcial',
                        exportOptions: { columns: ':visible' },
                        className: 'btn-success text-dark fw-bold'
                    }
                ],
                initComplete: function () {
                    $('.dt-buttons button').removeClass('dt-button').addClass('btn btn-success btn-m text-white');
                }
            });

            let modal = new bootstrap.Modal(document.getElementById('MostrarModal'));
            modal.show();
        })
        .catch(error => {
            console.error(`Error con la agencia ${agencia}:`, error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Ocurrió un problema al obtener los datos.',
                confirmButtonColor: '#d33',
                confirmButtonText: 'Cerrar'
            });
        });
};


const verDetalleEstadoParcial = (agencia) => {
    const estados = [0, 1, 2, 3];
    const peticiones = estados.map(estado =>
        fetch(`http://localhost:5000/api/conteo-analisis/${estado}/${agencia}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
            .then(response => response.ok ? response.json() : [])
            .then(data => {

                const dataFiltrada = data.filter(detalle => detalle.AGEN23 === agencia);
                return {
                    estado,
                    data: dataFiltrada.length > 0
                        ? dataFiltrada.map(item => ({
                            AGEN23: item.AGEN23,
                            DESC03: item.DESC03,
                            ANALISIS: item.ANALISIS
                        }))
                        : [{ AGEN23: agencia, DESC03: "", ANALISIS: 0 }]
                };

            })
            .catch(error => {
                console.error(`Error con el estado ${estado}:`, error);
                return { estado, data: [{ AGEN23: agencia, ANALISIS: 0 }] };
            })
    );
    Promise.all(peticiones)
        .then(resultados => {
            let dataEstructurada = {};

            // Organizar la data por agencia
            resultados.forEach(({ estado, data }) => {
                data.forEach(detalle => {
                    const agencia = detalle.AGEN23;
                    if (!dataEstructurada[agencia]) {
                        dataEstructurada[agencia] = {
                            NOMBRE: detalle.DESC03.trim(),
                            PROYECCION: 0,
                            PAGARE: 0,
                            ANULADOS: 0,
                            GRABADOS: 0
                        };
                    }
                    if (estado === 0) dataEstructurada[agencia].PROYECCION = detalle.ANALISIS;
                    if (estado === 1) dataEstructurada[agencia].PAGARE = detalle.ANALISIS;
                    if (estado === 2) dataEstructurada[agencia].ANULADOS = detalle.ANALISIS;
                    if (estado === 3) dataEstructurada[agencia].GRABADOS = detalle.ANALISIS;
                });
            });

            if (Object.keys(dataEstructurada).length === 0) {
                Swal.fire({
                    icon: 'info',
                    title: 'Sin resultados',
                    text: 'No hay análisis para la agencia seleccionada.',
                    confirmButtonColor: '#3085d6',
                    confirmButtonText: 'Entendido'
                });
                return;
            }

            if ($.fn.DataTable.isDataTable('#tablaDetallesAnalisis')) {
                $('#tablaDetallesAnalisis').DataTable().clear().destroy();
            }

            let contenido = '';

            // Recorrer la data organizada y llenar la tabla
            Object.keys(dataEstructurada).forEach(agencia => {
                const detalle = dataEstructurada[agencia];
                contenido += `
                    <tr>
                        <td class="text-center" style="color: #000 !important; font-weight: 525 !important">${detalle.PROYECCION}</td>
                        <td class="text-center" style="color: #000 !important; font-weight: 525 !important">${detalle.PAGARE}</td>
                        <td class="text-center" style="color: #000 !important; font-weight: 525 !important">${detalle.ANULADOS}</td>
                        <td class="text-center" style="color: #000 !important; font-weight: 525 !important">${detalle.GRABADOS}</td>
                    </tr>`;
            });

            document.getElementById('detalleContenidoResumen').innerHTML = contenido;
            // Calcular el total de análisis
            // Calcular el total de análisis
            let totalAnalisis = Object.values(dataEstructurada).reduce((total, detalle) => {
                return total + detalle.PROYECCION + detalle.PAGARE + detalle.ANULADOS + detalle.GRABADOS;
            }, 0);

            document.getElementById('totalAnalisis').textContent = `Total: ${totalAnalisis}`;

            // Obtener el nombre y agencia (asumiendo que solo hay una agencia en dataEstructurada)
            const agenciaKey = Object.keys(dataEstructurada)[0];
            const nombreAgencia = dataEstructurada[agenciaKey]?.NOMBRE?.trim() || agenciaKey;


            // Actualizar el título de la modal con el centro de costo y el nombre
            document.getElementById('detalleModalLabel').innerHTML = `${agenciaKey} - ${nombreAgencia} / Cantidad de Análisis `;


            $('#tablaDetalles').DataTable({
                destroy: true,
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
                "lengthMenu": [[5, 10, 15, 20], [5, 10, 15, 20]],
                dom: '<"top"lfB>rtip',
                buttons: [],
            });

            let modal = new bootstrap.Modal(document.getElementById('detalleModal'));
            modal.show();
        })
        .catch(error => {
            console.error('Error al obtener los detalles:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Ocurrió un problema al obtener los datos.',
                confirmButtonColor: '#d33',
                confirmButtonText: 'Cerrar'
            });
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
                window.location.href = '../../SotfwareCreditos/login-form-02/login.html';
            }, 500);
        }
    });
}

const actualizarEncabezadoMeses = () => {
    const colores = ["#B5CBD2", "#C7D9DD", "#D5E5D5", "#EEF1DA", "#F2E2B1", "#D5C7A3", "#BDB395"];
    const mesesElementos = document.querySelectorAll("tr.text-center th.text-center");

    // Obtener los últimos 6 meses más el actual con su año
    let fechaActual = new Date();
    let meses = [];

    for (let i = 6; i >= 0; i--) {
        let fecha = new Date(fechaActual.getFullYear(), fechaActual.getMonth() - i, 1);
        let nombreMes = fecha.toLocaleString('es-ES', { month: 'long' }); // Nombre del mes en español
        let año = fecha.getFullYear(); // Año correspondiente
        meses.push(`${nombreMes.charAt(0).toUpperCase() + nombreMes.slice(1)} ${año}`);
    }

    // Asignar los meses dinámicamente a los <th>
    let index = 1; // Saltamos los primeros dos <th> (Concepto)
    for (let i = 0; i < 7; i++) {
        mesesElementos[index].style.backgroundColor = colores[i];
        mesesElementos[index].textContent = meses[i];

        // Ajustar colspan, el último mes (mes actual) tiene colspan 4
        mesesElementos[index].setAttribute("colspan", i === 4 ? "4" : "4");

        index++;
    }
};

// Llamar a la función al cargar la página
actualizarEncabezadoMeses();


const formatearFecha = (fechaRaw) => {
    if (!fechaRaw) return "Fecha inválida";

    const fechaCalculada = fechaRaw + 19000000;
    const año = Math.floor(fechaCalculada / 10000);
    const mesNumero = Math.floor((fechaCalculada % 10000) / 100);
    const dia = String(fechaCalculada % 100).padStart(2, '0');

    return `${dia} ${obtenerNombreMes(mesNumero)} ${año}`;
};

const obtenerNombreMes = (mes) => {
    const meses = [
        'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
        'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'
    ];
    return meses[mes - 1];
};