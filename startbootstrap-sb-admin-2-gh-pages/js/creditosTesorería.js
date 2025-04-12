const token = sessionStorage.getItem('token');
const contenedor = document.querySelector('tbody');
let resultados = '';
let resultadosterceros = '';

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
            console.error('❌ Error en obtenerDatos:', error);
            Swal.fire('Error', 'No se pudo obtener la información.', 'error');
        }
    }

    async function obtenerDatosTerceros() {
        try {
            const token = sessionStorage.getItem('token');
            const url = 'http://localhost:5000/api/obtener/pagados-terceros';

            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) throw new Error('Error en la solicitud');

            creditosTerceros = await response.json();

            if (!Array.isArray(creditosTerceros) || creditosTerceros.length === 0) {
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

            mostrarTerceros(creditosTerceros);

        } catch (error) {
            console.error('❌ Error en obtenerDatosTerceros:', error);
            Swal.fire('Error', 'No se pudo obtener la información.', 'error');
        }
    }

    async function obtenerDatosApoderados() {
        try {
            const token = sessionStorage.getItem('token');
            const url = 'http://localhost:5000/api/obtener/apoderados';

            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) throw new Error('Error en la solicitud');

            pagoApoderados = await response.json();

            if (!Array.isArray(pagoApoderados) || pagoApoderados.length === 0) {
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

            mostrarApoderados(pagoApoderados);

        } catch (error) {
            console.error('❌ Error en obtenerDatosTerceros:', error);
            Swal.fire('Error', 'No se pudo obtener la información.', 'error');
        }
    }


    await obtenerDatos();
    await obtenerDatosTerceros();
    await obtenerDatosApoderados();
});


const mostrar = (creditos) => {
    let resultados = '';
    let totalRegistros = creditos.length;
    let totalTransferencia = 0;

    creditos.forEach((creditos, index) => {

        let valor = Number(creditos.SCAP16 || 0);
        totalTransferencia += valor;
        let valorDesembolso = valor.toLocaleString("es-CO");

        resultados += `<tr>
                <td class="text-center">
                    <input type="checkbox" class="seleccionar-checkbox" 
                        value="${creditos.cuenta}" 
                        data-cuenta="${creditos.cuenta}"
                        data-pagare="${creditos.pagare}" 
                        data-nit="${creditos.cedula}">
                </td>
                <td style="color: #000 !important; font-weight: 525 !important">${index + 1}</td>
                <td style="color: #000 !important; font-weight: 525 !important white-space: nowrap;">${creditos.DIST05}-${creditos.DESC03}</td>
                <td class="text-center" style="color: #000 !important; font-weight: 525 !important">${creditos.CB_TID}</td>
                <td style="color: #000 !important; font-weight: 525 !important">${creditos.CB_ID}</td>
                <td style="color: #000 !important; font-weight: 525 !important">${creditos.CB_CUENTA}</td>
                <td style="color: #000 !important; font-weight: 525 !important white-space: nowrap;">${creditos.CB_NOMBRE}</td>
                <td style="color: #000 !important; font-weight: 525 !important">${creditos.CB_CTABCO}</td>
                <td class="text-center" style="color: #000 !important; font-weight: 525 !important">
                ${creditos.CB_TIPO === 'C' ? 'Corriente' : 'Ahorro'}
                </td>
                <td style="color: #000 !important; font-weight: 525 !important white-space: nowrap;">${creditos.BN_DESCR}</td>
                <td class="text-center" style="color: #000 !important; font-weight: 525 !important">${creditos.TTRA16}</td>
                <td class="text-center" style="color: #000 !important; font-weight: 525 !important white-space: nowrap;">$ ${valorDesembolso}</td>
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
                <td class="text-center" style="white-space: nowrap;">
            <button class="btn btn-success btn-lg me-2 insertar-credito" data-estado="1" data-cuenta="${creditos.CB_CUENTA}" data-pagare="${creditos.pagare}" data-nit="${creditos.cedula}">
                <i class="fas fa-check"></i> SI
            </button>
            <button class="btn btn-danger btn-lg me-2 insertar-credito" data-estado="0" data-cuenta="${creditos.cuenta}" data-pagare="${creditos.pagare}" data-nit="${creditos.cedula}">
                <i class="fas fa-times"></i> NO
            </button> 
                    </td>
                <td style="color: #000 !important; font-weight: 525 !important width: 50px; white-space: nowrap;">${creditos.fecha_pago}</td>
                <td style="color: #000 !important; font-weight: 525 !important">${creditos.usuario_pagador}</td>

            </tr>`;
    });

    document.getElementById('total-registros').innerText = totalRegistros;
    document.getElementById("total-transferencia").textContent = totalTransferencia.toLocaleString("es-CO");

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
                title: 'Creditos_Virtuales',
                exportOptions: { columns: ':visible' },
                className: 'btn-success text-dark fw-bold'
            },
            {
                text: '<i class="fas fa-file-export text-dark fw-bold"></i> Descargar Archivo PLANO',
                action: function () {
                    exportarcreditosvirtuales();
                },
                className: 'btn-primary text-dark fw-bold'
            }
        ],
        initComplete: function () {
            $('.dt-buttons button').removeClass('dt-button').addClass('btn btn-success btn-m text-white');

            $(".dt-buttons").prepend(`
            `);
        }
    });
};

const mostrarTerceros = (creditosTerceros) => {
    let resultadosterceros = '';
    let totalRegistrosTerceros = creditosTerceros.length;
    let totalTransferenciaTerceros = 0;

    creditosTerceros.forEach((creditosTerceros, index) => {

        let valor = Number(creditosTerceros.VALOR || 0);
        totalTransferenciaTerceros += valor;
        let valorDesembolso = valor.toLocaleString("es-CO");

        resultadosterceros += `<tr>
                <td class="text-center">
                    <input type="checkbox" class="seleccionar-checkbox" 
                        value="${creditosTerceros.cuenta}" 
                        data-cuenta="${creditosTerceros.cuenta}"
                        data-pagare="${creditosTerceros.pagare}" 
                        data-nit="${creditosTerceros.cedula}">
                </td>
                <td style="color: #000 !important; font-weight: 525 !important">${index + 1}</td>
                <td style="color: #000 !important; font-weight: 525 !important">${creditosTerceros.CB_ID}</td>
                <td class="text-center" style="color: #000 !important; font-weight: 525 !important">${creditosTerceros.NCTA16}</td>
                <td style="color: #000 !important; font-weight: 525 !important white-space: nowrap;">${creditosTerceros.CB_NOMBRE}</td>
                <td class="text-center" style="color: #000 !important; font-weight: 525 !important">${creditosTerceros.CB_CTABCO}</td>
                <td class="text-center" style="color: #000 !important; font-weight: 525 !important">
                ${creditosTerceros.CB_TIPO === 'C' ? 'Corriente' : 'Ahorro'}
                </td>
                <td style="color: #000 !important; font-weight: 525 !important white-space: nowrap;">${creditosTerceros.BN_DESCR}</td>
                <td class="text-center" style="color: #000 !important; font-weight: 525 !important">${creditosTerceros.TTRA16}</td>
                <td class="text-center" style="color: #000 !important; font-weight: 525 !important white-space: nowrap;">$ ${valorDesembolso}</td>
               <td class="text-center pagado-columna 
                ${creditosTerceros.estado == 1
                ? 'parpadeo-verde'
                : creditosTerceros.estado == 0
                    ? 'parpadeo-rojo'
                    : creditosTerceros.estado == 2
                        ? 'parpadeo-amarillo'
                        : ''}">
                        ${creditosTerceros.estado == 1
                ? 'SI'
                : creditosTerceros.estado == 0
                    ? 'NO'
                    : creditosTerceros.estado == 2
                        ? 'TESORERÍA'
                        : ''}
                                            </td>
                <td class="text-center" style="white-space: nowrap;">
            <button class="btn btn-success btn-lg me-2 insertar-credito" data-estado="1" data-cuenta="${creditosTerceros.CB_CUENTA}" data-pagare="${creditosTerceros.pagare}" data-nit="${creditosTerceros.cedula}">
                <i class="fas fa-check"></i> SI
            </button>
            <button class="btn btn-danger btn-lg me-2 insertar-credito" data-estado="0" data-cuenta="${creditosTerceros.cuenta}" data-pagare="${creditosTerceros.pagare}" data-nit="${creditosTerceros.cedula}">
                <i class="fas fa-times"></i> NO
            </button> 
                    </td>
                <td style="color: #000 !important; font-weight: 525 !important width: 50px; white-space: nowrap;">${creditosTerceros.fecha_pago}</td>
                <td style="color: #000 !important; font-weight: 525 !important">${creditosTerceros.usuario_pagador}</td>

            </tr>`;
    });

    document.getElementById('total-registros-terceros').innerText = totalRegistrosTerceros;
    document.getElementById("total-transferencia-terceros").textContent = totalTransferenciaTerceros.toLocaleString("es-CO");

    if ($.fn.DataTable.isDataTable('#tablaAS400Terceros')) {
        $('#tablaAS400Terceros').DataTable().clear().destroy();
    }
    $("#tablaAS400Terceros tbody").html(resultadosterceros);

    if (sessionStorage.getItem('hideOnbush') === 'true') {
        document.querySelectorAll('.modulo-restringido').forEach(element => {
            element.style.display = 'none';
        });
    }

    $('#tablaAS400Terceros').DataTable({
        scrollY: "400px",
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
                title: 'Creditos_Terceros',
                exportOptions: { columns: ':visible' },
                className: 'btn-success text-dark fw-bold'
            },
            {
                text: '<i class="fas fa-file-export text-dark fw-bold"></i> Descargar Archivo PLANO',
                action: function () {
                    exportarTerceros();
                },
                className: 'btn-primary text-dark fw-bold'
            }
        ],
        initComplete: function () {
            $('.dt-buttons button').removeClass('dt-button').addClass('btn btn-success btn-m text-white');
        }
    });
};

let pagoApoderados = [];
const mostrarApoderados = (pagoApoderados) => {
    let resultados = '';
    let totalRegistros = pagoApoderados.length;
    let totalTransferencia = 0;

    pagoApoderados.forEach((pagoApoderados, index) => {
        let valor = Number(pagoApoderados.VALOR || 0);
        totalTransferencia += valor;
        let valorDesembolso = valor.toLocaleString("es-CO");

        resultados += `<tr>
                <td class="text-center">
                    <input type="checkbox" class="seleccionar-checkbox" 
                        value="${pagoApoderados.cuenta}" 
                        data-cuenta="${pagoApoderados.cuenta}"
                        data-pagare="${pagoApoderados.pagare}" 
                        data-nit="${pagoApoderados.cedula}">
                </td>
                <td style="color: #000 !important; font-weight: 525 !important">${index + 1}</td>
                <td class="text-center" style="color: #000 !important; font-weight: 525 !important">${pagoApoderados.CB_ID}</td>
                <td style="color: #000 !important; font-weight: 525 !important">${pagoApoderados.CB_CUENTA}</td>
                <td style="color: #000 !important; font-weight: 525 !important white-space: nowrap;">${pagoApoderados.CB_NOMBRE}</td>
                <td style="color: #000 !important; font-weight: 525 !important">${pagoApoderados.CB_CTABCO}</td>
                <td class="text-center" style="color: #000 !important; font-weight: 525 !important">
                ${pagoApoderados.CB_TIPO === 'C' ? 'Corriente' : 'Ahorro'}
                </td>
                <td style="color: #000 !important; font-weight: 525 !important white-space: nowrap;">${pagoApoderados.BN_DESCR}</td>
                <td class="text-center" style="color: #000 !important; font-weight: 525 !important">${pagoApoderados.TTRA16}</td>
                <td class="text-center" style="color: #000 !important; font-weight: 525 !important white-space: nowrap;">$ ${valorDesembolso}</td>
            </tr>`;
    });

    document.getElementById('total-registros-apoderado').innerText = totalRegistros;
    document.getElementById("total-transferencia-apoderado").textContent = totalTransferencia.toLocaleString("es-CO");

    if ($.fn.DataTable.isDataTable('#tApoderados')) {
        $('#tApoderados').DataTable().clear().destroy();
    }
    $("#tApoderados tbody").html(resultados);

    $('#tApoderados').DataTable({
        scrollY: "200px",
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
                title: 'Pago_Apoderados',
                exportOptions: { columns: ':visible' },
                className: 'btn-success text-dark fw-bold'
            },
            {
                text: '<i class="fas fa-file-export text-dark fw-bold"></i> Descargar Archivo PLANO',
                action: function () {
                    exportarApoderados();
                },
                className: 'btn-primary text-dark fw-bold'
            }
        ],
        initComplete: function () {
            $('.dt-buttons button').removeClass('dt-button').addClass('btn btn-success btn-m text-white');
        }
    });
};

const agrupados = {};


const exportarcreditosvirtuales = () => {
    if (!Array.isArray(creditos) || creditos.length === 0) {
        Swal.fire('Sin registros', 'No hay créditos virtuales para exportar.', 'info');
        return;
    }
    // Agrupar por nombre y sumar SCAP16
    creditos.forEach((tercero) => {
        let nombre = (tercero.CB_NOMBRE || '')
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^\x00-\x7F]/g, '~')
            .substring(0, 30)
            .padEnd(30, ' ');

        if (!agrupados[nombre]) {
            agrupados[nombre] = { ...tercero };
        } else {
            // Sumar SCAP16 si el nombre ya existe
            agrupados[nombre].SCAP16 = (Number(agrupados[nombre].SCAP16) || 0) + (Number(tercero.SCAP16) || 0);
        }
    });

    // Convertir el objeto agrupado a un array
    const creditosAgrupados = Object.values(agrupados);

    let data = [];
    let consecutivo = 0;
    let valor_total = 0;
    let registros = creditosAgrupados.length;
    let iden_archivo = 0;
    let comprobante = 0;
    let factura = "";
    let concepto = "Pago desde COOPSERP";

    // Calcular valor total
    creditos.forEach(tercero => {
        valor_total += Number(tercero.SCAP16 || 0);
    });

    const fechaHoy = new Date();
    const yyyy = String(fechaHoy.getFullYear());
    const mm = String(fechaHoy.getMonth() + 1).padStart(2, '0');
    const dd = String(fechaHoy.getDate()).padStart(2, '0');
    const fechaFormateada = `${yyyy}${mm}${dd}`;

    const cuentaPrincipal = '001161512'.toString().padStart(16, '0');
    const cantidadRegistros = registros.toString().padStart(4, '0');
    const valorTotalStr = Math.floor(valor_total).toString().padStart(16, '0') + '00';
    const idenArchivoStr = String(iden_archivo).padStart(6, '0');
    const cerosRellenoEncabezado = '0'.repeat(142);

    // ENCABEZADO
    let encabezado = '1' + '0000' + fechaFormateada + cantidadRegistros + valorTotalStr + cuentaPrincipal + idenArchivoStr + cerosRellenoEncabezado;
    data.push(encabezado);

    // DETALLES
    creditosAgrupados.forEach((tercero, index) => {
        consecutivo++;

        let nombre = (tercero.CB_NOMBRE || '')
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^\x00-\x7F]/g, '~')
            .substring(0, 30)
            .padEnd(30, ' ');

        let cedula = (tercero.CB_ID || '').toString().padStart(11, '0');

        // Banco con validación
        let banco = tercero.CB_BANCO;
        if (banco == 296) banco = 121;
        banco = banco.toString().padStart(4, '0');

        // Forma de pago
        let forma_pago = (tercero.CB_BANCO == 23) ? '2' : '3';

        // Valor
        let valor = Number(tercero.SCAP16 || 0).toString().padStart(13, '0') + '00';

        // Cuenta bancaria
        let cuentaBancaria = (tercero.CB_CTABCO || '').toString().padEnd(16, ' ');

        // Comprobante
        let comprobanteStr = String(comprobante).padStart(12, ' ');

        // Tipo cuenta
        let tipoCuenta = (tercero.CB_TIPO || 'A').toString().toUpperCase().substring(0, 1);

        // Factura (concatenar AGEN16 y NCTA16)
        factura = (String(tercero.DIST05 || '').trim() + String(tercero.NCTA16 || '').trim()).padEnd(24, ' ');

        // Concepto
        concepto = concepto.toString().padEnd(56, ' ');

        let linea =
            '2' +
            consecutivo.toString().padStart(4, '0') +
            cuentaPrincipal +
            nombre +
            cedula +
            banco +
            fechaFormateada +
            forma_pago +
            valor +
            cuentaBancaria +
            comprobanteStr +
            tipoCuenta +
            factura +
            concepto;

        data.push(linea.substring(0, 200).padEnd(200, ' '));
    });

    // PIE
    let registro = 3;
    let secuencia = 9999;
    let nro_registros = registros.toString().padStart(4, '0');
    let valorTotalPie = Math.floor(valor_total).toString().padStart(16, '0') + '00';
    let cerosPie = '0'.repeat(172);

    let foot = registro + "" + secuencia + "" + nro_registros + "" + valorTotalPie + cerosPie;
    data.push(foot);

    // Contenido final con saltos de línea
    const contenido = '\r\n\r\n\r\n' + data.join('\r\n') + '\r\n';

    const blob = new Blob([contenido], {
        type: 'text/plain;charset=ascii',
        endings: 'native'
    });

    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'CreditosVirtuales.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

const exportarTerceros = () => {
    let data = [];
    let consecutivo = 0;
    let valor_total = 0;
    let registros = creditosTerceros.length;
    let iden_archivo = 0;
    let comprobante = 0;
    let factura = "";
    let concepto = "Pago desde COOPSERP";

    // Calcular valor total
    creditosTerceros.forEach(tercero => {
        valor_total += Number(tercero.VALOR || 0);
    });

    const fechaHoy = new Date();
    const yyyy = String(fechaHoy.getFullYear());
    const mm = String(fechaHoy.getMonth() + 1).padStart(2, '0');
    const dd = String(fechaHoy.getDate()).padStart(2, '0');
    const fechaFormateada = `${yyyy}${mm}${dd}`;

    const cuentaPrincipal = '001161512'.toString().padStart(16, '0');
    const cantidadRegistros = registros.toString().padStart(4, '0');
    const valorTotalStr = Math.floor(valor_total).toString().padStart(16, '0') + '00';
    const idenArchivoStr = String(iden_archivo).padStart(6, '0');
    const cerosRellenoEncabezado = '0'.repeat(142);

    // ENCABEZADO
    let encabezado = '1' + '0000' + fechaFormateada + cantidadRegistros + valorTotalStr + cuentaPrincipal + idenArchivoStr + cerosRellenoEncabezado;
    data.push(encabezado);

    // DETALLES
    creditosTerceros.forEach((tercero, index) => {
        consecutivo++;

        let nombre = (tercero.CB_NOMBRE || '')
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^\x00-\x7F]/g, '~')
            .substring(0, 30)
            .padEnd(30, ' ');

        let cedula = (tercero.CB_ID || '').toString().padStart(11, '0');

        // Banco con validación
        let banco = tercero.CB_BANCO;
        if (banco == 296) banco = 121;
        banco = banco.toString().padStart(4, '0');

        // Forma de pago
        let forma_pago = (tercero.CB_BANCO == 23) ? '2' : '3';

        // Valor
        let valor = Number(tercero.VALOR || 0).toString().padStart(13, '0') + '00';

        // Cuenta bancaria
        let cuentaBancaria = (tercero.CB_CTABCO || '').toString().padEnd(16, ' ');

        // Comprobante
        let comprobanteStr = String(comprobante).padStart(12, ' ');

        // Tipo cuenta
        let tipoCuenta = (tercero.CB_TIPO || 'A').toString().toUpperCase().substring(0, 1);

        // Factura y concepto
        factura = (String(tercero.AGEN16 || '').trim() + String(tercero.NCTA16 || '').trim()).padEnd(24, ' ');
        concepto = concepto.toString().padEnd(56, ' ');

        let linea =
            '2' +
            consecutivo.toString().padStart(4, '0') +
            cuentaPrincipal +
            nombre +
            cedula +
            banco +
            fechaFormateada +
            forma_pago +
            valor +
            cuentaBancaria +
            comprobanteStr +
            tipoCuenta +
            factura +
            concepto;

        data.push(linea.substring(0, 200).padEnd(200, ' '));
    });

    // PIE
    let registro = 3;
    let secuencia = 9999;
    let nro_registros = registros.toString().padStart(4, '0');
    let valorTotalPie = Math.floor(valor_total).toString().padStart(16, '0') + '00';
    let cerosPie = '0'.repeat(172);

    let foot = registro + "" + secuencia + "" + nro_registros + "" + valorTotalPie + cerosPie;
    data.push(foot);

    // Contenido final con saltos de línea
    const contenido = '\r\n\r\n\r\n' + data.join('\r\n') + '\r\n';

    const blob = new Blob([contenido], {
        type: 'text/plain;charset=ascii',
        endings: 'native'
    });

    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'Terceros.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

const exportarApoderados = () => {
    let data = [];
    let consecutivo = 0;
    let valor_total = 0;
    let registros = pagoApoderados.length;
    let iden_archivo = 0;
    let comprobante = 0;
    let factura = "";
    let concepto = "Transferencia de credito COOPSERP";

    // Calcular valor total
    pagoApoderados.forEach(apoderado => {
        valor_total += Number(apoderado.VALOR || 0);
    });

    const fechaHoy = new Date();
    const yyyy = String(fechaHoy.getFullYear());
    const mm = String(fechaHoy.getMonth() + 1).padStart(2, '0');
    const dd = String(fechaHoy.getDate()).padStart(2, '0');
    const fechaFormateada = `${yyyy}${mm}${dd}`;

    const cuentaPrincipal = '001161512'.toString().padStart(16, '0');
    const cantidadRegistros = registros.toString().padStart(4, '0');
    const valorTotalStr = Math.floor(valor_total).toString().padStart(16, '0') + '00';
    const idenArchivoStr = String(iden_archivo).padStart(6, '0');
    const cerosRellenoEncabezado = '0'.repeat(142);

    // ENCABEZADO
    let encabezado = '1' + '0000' + fechaFormateada + cantidadRegistros + valorTotalStr + cuentaPrincipal + idenArchivoStr + cerosRellenoEncabezado;
    data.push(encabezado);

    // DETALLES
    pagoApoderados.forEach((apoderado, index) => {
        consecutivo++;

        let nombre = (apoderado.CB_NOMBRE || '')
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^\x00-\x7F]/g, '~')
            .substring(0, 30)
            .padEnd(30, ' ');

        let cedula = (apoderado.CB_ID || '').toString().padStart(11, '0');

        // Banco con validación
        let banco = apoderado.CB_BANCO;
        if (banco == 296) banco = 121;
        banco = banco.toString().padStart(4, '0');

        // Forma de pago
        let forma_pago = (apoderado.CB_BANCO == 23) ? '2' : '3';

        // Valor
        let valor = Number(apoderado.VALOR || 0).toString().padStart(13, '0') + '00';

        // Cuenta bancaria
        let cuentaBancaria = (apoderado.CB_CTABCO || '').toString();
        cuentaBancaria = cuentaBancaria.padEnd(16, ' ');

        // Comprobante
        let comprobanteStr = String(comprobante).padStart(12, ' ');

        // Tipo cuenta
        let tipoCuenta = (apoderado.CB_TIPO || 'A').toString().toUpperCase().substring(0, 1);

        // Factura y concepto
        factura = factura.toString().padEnd(24, ' ');
        concepto = concepto.toString().padEnd(56, ' ');

        let linea =
            '2' +
            consecutivo.toString().padStart(4, '0') +
            cuentaPrincipal + // Cuenta origen
            nombre +
            cedula +
            banco +
            fechaFormateada +
            forma_pago +
            valor +
            cuentaBancaria +
            comprobanteStr +
            tipoCuenta +
            factura +
            concepto;

        data.push(linea.substring(0, 200).padEnd(200, ' '));
    });

    // PIE
    let registro = 3;
    let secuencia = 9999;
    let nro_registros = registros.toString().padStart(4, '0');
    let valorTotalPie = Math.floor(valor_total).toString().padStart(16, '0') + '00';
    let cerosPie = '0'.repeat(172);

    let foot = registro + "" + secuencia + "" + nro_registros + "" + valorTotalPie + cerosPie;
    data.push(foot);

    // Crear contenido final con 3 saltos de línea
    const contenido = '\r\n\r\n\r\n' + data.join('\r\n') + '\r\n';

    const blob = new Blob([contenido], {
        type: 'text/plain;charset=ascii',
        endings: 'native'
    });

    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'Terceros.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
        })
        .catch(err => {
            console.error(`❌ Error al insertar crédito ${credito.cuenta}:`, err);
        });
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



const today = new Date();
const months = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];

const day = today.getDate();
const month = months[today.getMonth()];
const year = today.getFullYear();

const formattedDate = `${day} ${month} ${year}`;

document.getElementById("fecha-as400").textContent = formattedDate;
document.getElementById("fecha-as400Terceros").textContent = formattedDate;
document.getElementById("fecha-as400Apoderados").textContent = formattedDate;