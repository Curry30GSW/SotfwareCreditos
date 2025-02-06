const ind_juridico = [51, 52, 53, 54, 55, 63, 64];
const list_depe = [51, 54];
const list_mes = ["", "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

/* Nombres que aparecen en la declaración de renta */
const jefCartera = "Elvia Yolima CEPEDA ANGULO";
const contador = "Gustavo Adolfo APARICIO BELALCAZAR";
const CargoCartera = "Jefe Dpto. Cartera";
const Cargocontador = "Contador";
const jefRevisor = "Fernando GONZALEZ MARTINEZ";
const CargoRevisor = "Revisor Fiscal";

function compararFechas(primera, segunda) {
    const valoresPrimera = primera.split("-");
    const valoresSegunda = segunda.split("-");
    const diaPrimera = parseInt(valoresPrimera[0], 10);
    const mesPrimera = parseInt(valoresPrimera[1], 10);
    const anyoPrimera = parseInt(valoresPrimera[2], 10);
    const diaSegunda = parseInt(valoresSegunda[0], 10);
    const mesSegunda = parseInt(valoresSegunda[1], 10);
    const anyoSegunda = parseInt(valoresSegunda[2], 10);

    const diasPrimeraJuliano = new Date(anyoPrimera, mesPrimera - 1, diaPrimera).getTime();
    const diasSegundaJuliano = new Date(anyoSegunda, mesSegunda - 1, diaSegunda).getTime();

    if (isNaN(diasPrimeraJuliano) || isNaN(diasSegundaJuliano)) {
        return 0;
    } else {
        return (diasPrimeraJuliano - diasSegundaJuliano) / (1000 * 3600 * 24);
    }
}

function FormatoFecha(fecha) {
    const dias = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
    const meses = ["ENE", "FEB", "MAR", "ABR", "MAY", "JUN", "JUL", "AGO", "SEP", "OCT", "NOV", "DIC"];

    const valoressFecha = fecha.split("-");
    const dia = parseInt(valoressFecha[0], 10);
    const mes = parseInt(valoressFecha[1], 10);
    const anyo = parseInt(valoressFecha[2], 10);

    const fechaNueva = `${dia}-${meses[mes - 1]}-${anyo}`;

    return fechaNueva;
}

function FechaAs400(fecha) {
    fecha = parseInt(fecha) + 19000000;

    const dia = fecha.toString().substring(6, 8);
    const mes = fecha.toString().substring(4, 6);
    const anyo = fecha.toString().substring(0, 4);

    const meses = ["ENE", "FEB", "MAR", "ABR", "MAY", "JUN", "JUL", "AGO", "SEP", "OCT", "NOV", "DIC"];

    const fechaNueva = `${dia}-${meses[parseInt(mes) - 1]}-${anyo}`;

    return fechaNueva;
}

function corte() {
    const fecha = new Date();
    const fec = fecha.getFullYear() - 1900;
    const mes = fecha.getMonth() + 1; // getMonth() devuelve un índice de 0 a 11

    return `${fec}${mes}`;
}
