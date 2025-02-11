document.getElementById("consultar").addEventListener("click", function () {
    Swal.fire({
        title: 'Consultando...',
        text: 'Por favor espere mientras obtenemos la información.',
        icon: 'info',
        allowOutsideClick: false,
        showConfirmButton: false,
        timer: 3300,
        didOpen: () => {
            Swal.showLoading();
        }
    });
});


document.getElementById('consultar').addEventListener('click', async () => {
    const selectCuenta = document.getElementById('slt-cuenta');
    const cuenta = selectCuenta.value;
    const token = localStorage.getItem('jwt');
    // Obtener la fecha actual
    const now = new Date();
    // Formatear la fecha como "DD-MMM-YYYY"
    const opcionesFecha = { day: "2-digit", month: "short", year: "numeric" };
    const fechaHoy = now.toLocaleDateString("es-ES", opcionesFecha)
        .replace(".", "") // Quitar el punto del mes
        .replace(/\b\w/g, (l) => l.toUpperCase());

    // Obtener la hora actual en formato HH:MM:SS
    const horaHoy = now.toLocaleTimeString("es-CO", { hour12: false });
    const style = document.createElement("style");
    style.innerHTML = `
    .titulo {
        font-weight: bold;
        font-size: 16px;
        color: #333;
        margin-bottom: 2px;
    }

    .valor-label {
    color: #333; 
    font-size: 14px; 
    font-weight: normal; 
    margin-top: 0;
    }

.col {
    flex: 1;
    padding: 2px;
    min-width: 120px;
}
    .detalles-header {
    background-color: #666 !important;
    color: white !important;
    font-weight: bold;
    text-align: center;
}

.row {
    margin-bottom: 5px; /* Reduce el espacio entre filas */
}

.form-group {
    margin-bottom: 2px; /* Reduce el espacio entre cada grupo */
}


    `;
    document.head.appendChild(style);

    if (!cuenta) {
        alert("Seleccione una cuenta");
        return;
    }

    if (!token) {
        alert("No hay sesión activa. Inicie sesión nuevamente.");
        return;
    }

    try {
        const response = await fetch(`http://localhost:5000/api/cuenta/${cuenta}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        const result = await response.json();

        if (result.success && result.data.cuentaData.length > 0) {
            const data = result.data.cuentaData[0];
            // Formatear el número con separador de miles
            const formatNumber = (num) => new Intl.NumberFormat('es-CO').format(num);

            const salo = result.data.salo09;
            const creditoEspecial = Number(result.data.vlrCredEsp ?? 0).toLocaleString("es-CO");
            const couCredEsp = Number(result.data.vlrCredCouEsp ?? 0).toLocaleString("es-CO");
            const vrTotalEsp = Number(result.data.vrTotalEsp ?? 0).toLocaleString("es-CO");
            const creditoOrdinario = Number(result.data.vlrCredOrd[0]?.CREDITO_ORDINARIO ?? 0).toLocaleString("es-CO");
            const couCredOrd = Number(result.data.vlrCredCouOrd[0]?.COU_CRED_ORD ?? 0).toLocaleString("es-CO");
            const vrTotalOrd = Number(result.data.vrTotalOrd ?? 0).toLocaleString("es-CO");
            const comprometido = Number(result.data.comprometido ?? 0).toLocaleString("es-CO");
            const cupo = Number(result.data.cupo ?? 0);
            const cupoFormato = cupo.toLocaleString("es-CO");
            const cupoColor = cupo < 0 ? "text-danger" : ""; // Si es negativo, se pone en rojo

            const deudatotal = Number(result.data.deudaTotal ?? 0).toLocaleString("es-CO");

            // Formateo de fecha distribución de aporte
            const rawFecha = Number(result.data.fecha09) || 0;
            const fechaCalculada = rawFecha + 19000000;
            const año = Math.floor(fechaCalculada / 10000);
            const mesNumero = Math.floor((fechaCalculada % 10000) / 100);
            const dia = String(fechaCalculada % 100).padStart(2, '0');
            const meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
            const mesTexto = meses[mesNumero - 1];
            const fechaFormateada = `${dia} de ${mesTexto} de ${año}`;
            // Extraer el año y el mes
            const lapso = `${meses[now.getMonth()]} ${now.getFullYear()}`;

            // Formateo de fecha para data.FEVI05
            const rawFechaFEVI = Number(data.FEVI05) || 0;
            const fechaCalculadaFEVI = rawFechaFEVI + 19000000;
            const añoFEVI = Math.floor(fechaCalculadaFEVI / 10000);
            const mesNumeroFEVI = Math.floor((fechaCalculadaFEVI % 10000) / 100);
            const diaFEVI = String(fechaCalculadaFEVI % 100).padStart(2, '0');
            const mesTextoFEVI = meses[mesNumeroFEVI - 1];
            const fechaFormateadaFEVI = `${diaFEVI} ${mesTextoFEVI} del ${añoFEVI}`;

            let idCuenta = Number(data.IDCUENTA) || 0; // Convertir a número y manejar valores no numéricos
            let bio = idCuenta > 0 ? "SI" : "NO";
            let asal09 = Number(data.ASAL09 || 0).toLocaleString("es-CO");
            let acuo09 = Number(data.ACUO09 || 0).toLocaleString("es-CO");
            let dsal09 = Number(data.DSAL09 || 0).toLocaleString("es-CO");


            let detallesCreditosHTML = "";

            if (result.data.detallesCreditos && result.data.detallesCreditos.length > 0) {
                if (!document.querySelector("#detallesCreditosContainer .titulo-detalles")) {
                    detallesCreditosHTML += `<h4 class="titulo text-center my-3 color: #333; ">Detalles de Créditos</h4>`;
                }

                detallesCreditosHTML += `
                <div class="container-fluid detalles-creditos">
                    <div class="table-responsive">
                        <table class="table table-striped table-bordered">
                            <thead class="detalles-header text-center">
                                <tr>
                                    <th>Linea</th>
                                    <th>Crédito</th>
                                    <th>Garantia</th>
                                    <th>Sdo Capital</th>
                                    <th>Vencidos</th>
                                    <th>Cuota Capital</th>
                                    <th>Cuota Interés</th>
                                    <th>Cuota Total</th>
                                </tr>
                            </thead>
                            <tbody class="detalles-body">
                                ${result.data.detallesCreditos.map((credito, index) => `
                                    <tr class="${index % 2 === 0 ? "even" : "odd"}">
                                        <td class="valor-label text-center">${credito.TCRE13}</td>
                                        <td class="valor-label text-center">${credito.NCRE13}</td>
                                        <td class="valor-label text-center">${credito.MOGA13.trim()}</td>
                                        <td class="valor-label text-center">$ ${Number(credito.SCAP13).toLocaleString("es-CO")}</td>
                                        <td class="valor-label text-center">$ ${Number(result.data.vencidos[index]).toLocaleString("es-CO")}</td>
                                        <td class="valor-label text-center">$ ${Number(credito.CCAP13).toLocaleString("es-CO")}</td>
                                        <td class="valor-label text-center">$ ${Number(credito.CINT13).toLocaleString("es-CO")}</td>
                                        <td class="valor-label text-center">$ ${Number(result.data.cuotasTotales[index]).toLocaleString("es-CO")}</td>
                                    </tr>
                                `).join("")}
                            </tbody>
                        </table>
                    </div>
                </div>
            `;
            }


            // Validar si `salo` es un número mayor a 0
            let distribucionAportesHTML = "";
            if (!isNaN(salo) && salo > 0) {
                distribucionAportesHTML = `
        <div class="col-md-8">
            <div class="form-group">
                <label><span class="titulo">Distribución Aportes</span></label>
                <label class="valor-label" >El <strong>${fechaFormateada}</strong> se le distribuyó Aportes por <strong>$${formatNumber(salo)}</strong></label>
            </div>
        </div>
    `;
            }
            const estadoCuentaHTML = `
        <div class="row">
                    <div class="col-md-4">
                        <div class="form-group">
                            <label><span class="titulo">Fecha</span></label>
                            <label class="valor-label" >${fechaHoy}</label>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="form-group">
                            <label><span class="titulo">Hora</span></label>
                            <label class="valor-label">${horaHoy}</label>
                        </div>
                    </div>
                </div>

        <div class="row">
                    <div class="col-md-4">
                        <div class="form-group">
                            <label><span class="titulo">Cuenta No.</span></label>
                            <label class="valor-label" >${cuenta} - ${data.DIST05}</label>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="form-group">
                            <label><span class="titulo">Nombre</span></label>
                            <label class="valor-label" >${data.DESC05.trim()}</label>
                        </div>
                    </div>
                </div>
        <div class="row">
                    <div class="col-md-4">
                        <div class="form-group">
                            <label><span class="titulo">Vinculo</span></label>
                            <label class="valor-label" >${fechaFormateadaFEVI}</label>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="form-group">
                            <label><span class="titulo">Nomina</span></label>
                            <label class="valor-label" >${data.NOMI05} ${data.DESC04}</label>
                        </div>
                    </div>
                </div>

        <div class="row">
                    <div class="col-md-4">
                        <div class="form-group">
                            <label><span class="titulo">Cédula</span></label>
                            <label class="valor-label">${data.NNIT05}</label>
                        </div>
                    </div>
                    <div class="col-md-8">
                        <div class="form-group">
                            <label><span class="titulo">Dependencia</span></label>
                            <label class="valor-label" >${data.ENTI05} ${data.DEPE05} ${data.DESC02}</label>
                        </div>
                    </div>
                </div>

        <div class="row">
                    <div class="col-md-4">
                        <div class="form-group">
                            <label><span class="titulo">Agencia</span></label>
                            <label class="valor-label" >${data.AGENCIA}</label>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="form-group">
                            <label><span class="titulo">Estado</span></label>
                            <label class="valor-label" >${data.DCARTERA}</label>
                        </div>
                    </div>
                </div>
        <div class="row">
                    <div class="col-md-4">    
                        <div class="form-group">
                            <label><span class="titulo">Registrado en Biometría</span></label>
                            <label class="valor-label" >${bio}</label>
                        </div>
                    </div>    
                    ${distribucionAportesHTML} 
                </div>   
        <div class="row">
                <div class="col-md-4">    
                        <div class="form-group">
                        <label><span class="titulo">Lapso</span></label>
                        <label class="valor-label" >${lapso}</label>
                        </div>
                    </div>    
                </div>

            <div class="d-none d-md-block">
        <div class="row">
                    <div class="col-md-3">    
                        <div class="form-group">
                        <label>&nbsp;</label>
                        </div>
                    </div>
                    <div class="col-md-3">    
                        <div class="form-group">
                        <label><span class="titulo">Total Capital</span></label>
                        </div>
                    </div>
                    <div class="col-md-3">    
                        <div class="form-group">
                        <label><span class="titulo">Total Vencido</span></label>
                        </div>
                    </div>
                    <div class="col-md-3">    
                        <div class="form-group">
                        <label><span class="titulo">Valor de la Cuota</span></label>
                        </div>
                    </div>  
                </div>      
            </div>

        <div class="row">
                    <div class="col-md-3">    
                    <div class="form-group">
                    <label class="d-none d-md-block"><span class="titulo">Aportes Sociales</span></label>
                    </div>
                </div>
            <div class="col-md-3">    
                <div class="form-group">
                <label class="d-md-none"><span class="titulo">Aportes Sociales</span></label>
                <label class="valor-label">$ ${asal09}</label>
                </div>
            </div>
            <div class="col-md-3">    
                <div class="form-group">
                <label class="d-md-none"><span class="titulo">Vencido</span></label>
                <label class="d-md-none">0</label>
                </div>
            </div>
            <div class="col-md-3">    
                <div class="form-group">
                <label class="d-md-none"><span class="titulo">Cuota Aportes</span></label>
                <label class="valor-label" >$ ${acuo09}</label>
                </div>
            </div> 
        </div>   
        <div class="row">
            <div class="col-md-3">    
                        <div class="form-group">          
                        <label class="d-none d-md-block"><span class="titulo">Aportes Ocasionales</span></label>
                        </div>
                    </div>
                    <div class="col-md-3">    
                        <div class="form-group">
                        <label class="d-md-none"><span class="titulo">Aportes Ocasionales</span></label>
                        <label class="valor-label" >$ ${dsal09}</label>
                        </div>
                    </div>  
                </div>
        </div>

        <div class="row">
                    <div class="col-md-3">    
                        <div class="form-group">
                        <label class="d-none d-md-block"><span class="titulo">Cr&eacute;dito Especial</span></label> 
                        </div>
                    </div>
                    <div class="col-md-3">    
                        <div class="form-group">
                        <label class="d-md-none"><span class="titulo">Cr&eacute;dito Especial</span></label>
                        <label class="valor-label" >$ ${creditoEspecial}</label>
                        </div>
                    </div>
                    <div class="col-md-3">    
                        <div class="form-group">
                        <label class="d-md-none"><span class="titulo">Vencido</span></label>
                        <label class="valor-label">$ ${vrTotalEsp}</label>
                        </div>
                    </div>
                    <div class="col-md-3">    
                        <div class="form-group">
                            <label class="d-md-none"><span class="titulo">Cuota</span></label>
                        <label class="valor-label" >$ ${couCredEsp}</label>
                        </div>
                    </div>    
        </div> 
        <div class="row">
                    <div class="col-md-3">    
                        <div class="form-group">
                        <label class="d-none d-md-block"><span class="titulo">Cr&eacute;dito Ordinario</span></label>
                        </div>
                    </div>
                    <div class="col-md-3">    
                        <div class="form-group">
                        <label class="d-md-none"><span class="titulo">Cr&eacute;dito Ordinario</span></label>
                        <label class="valor-label" >$ ${creditoOrdinario}</label>
                        </div>
                    </div>
                    <div class="col-md-3">    
                        <div class="form-group">
                        <label class="d-md-none"><span class="titulo">Vencido</span></label>
                        <label class="valor-label" >$ ${vrTotalOrd}</label>
                        </div>
                    </div>
                    <div class="col-md-3">    
                        <div class="form-group">
                        <label class="d-md-none"><span class="titulo">Cuota</span></label>
                        <label class="valor-label" >$ ${couCredOrd}</label>
                        </div>
                    </div>    
        </div>
        <div class="row">
                    <div class="col-md-3">    
                    <div class="form-group">
                    <label class="d-none d-md-block"><span class="titulo">Comprometido</span></label>
                    </div>
        </div>
                    <div class="col-md-3">    
                    <div class="form-group">
                    <label class="d-md-none"><span class="titulo">Comprometido</span></label>
                    <label class= "valor-label">$ ${comprometido}</label>
                    </div>
                    </div>
        </div>
        <div class="row">
                    <div class="col-md-3">    
                        <div class="form-group">
                        <label class="d-none d-md-block"><span class="titulo">Cupo</span></label>
                        </div>
                    </div>
                    <div class="col-md-3">    
                        <div class="form-group">
                        <label class="d-md-none"><span class="titulo">Cupo</span></label>
                       <label class="valor-label ${cupoColor}">$ ${cupoFormato}</label>
                        </div>
                    </div>
        </div>

        <div class="row">
                    <div class="col-md-3">    
                        <div class="form-group">
                        <label class="d-none d-md-block"><span class="titulo">Deuda Total</span></label>
                        </div>
                    </div>
                <div class="col-md-3">    
                    <div class="form-group">
                    <label class="d-md-none"><span class="titulo">Deuda Total</span></label>
                    <label class= "valor-label">$ ${deudatotal}</label>
                    </div>
                </div>

        </div>

     <div class="row">
    <div class="col-md-12">
        <div class="table-responsive" style="overflow-x: auto;"> 
            ${detallesCreditosHTML}
        </div>
    </div>    
</div>

        
         `;

            document.getElementById('EstadoCta').innerHTML = estadoCuentaHTML;
        } else {
            document.getElementById('EstadoCta').innerHTML = '<p>No se encontraron datos para esta cuenta, por favor salga e ingrese nuevamente.</p>';
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Hubo un problema en la consulta');
    }
});
