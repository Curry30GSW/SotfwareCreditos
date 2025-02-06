// Función que obtiene las cuentas para una cédula
async function obtenerCuentasPorCedula() {
    try {
        // Obtener el token JWT y la cédula del localStorage
        const token = localStorage.getItem('jwt');
        const cedula = localStorage.getItem('cedula'); // Recuperamos la cédula

        // Si el token o la cédula no están presentes, no hacemos la solicitud
        if (!token || !cedula) {
            console.error("No se encontró el token de autenticación o la cédula");
            return;
        }

        // Configurar los encabezados, incluyendo el JWT
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`  // Añadir el token al encabezado
        };

        // Realiza una solicitud GET al endpoint que devuelve las cuentas
        const response = await fetch(`http://localhost:5000/api/cuentas/${cedula}`, { headers });

        // Si la respuesta es exitosa, procesamos los datos
        if (response.ok) {
            const data = await response.json();  // Obtiene los datos en formato JSON

            const cuentasSelect = document.getElementById("slt-cuenta");

            // Limpiar el select antes de agregar las nuevas opciones
            cuentasSelect.innerHTML = '';

            // Recorremos los datos y agregamos los elementos <option>
            data.forEach(val => {
                const option = document.createElement("option");
                option.value = val.cuenta;  // Establecemos el valor del <option>
                option.textContent = `${val.cuenta} ${val.nomina}`;  // Establecemos el texto visible del <option>
                cuentasSelect.appendChild(option);  // Agregamos el <option> al <select>
            });
        } else {
            console.error('Error al obtener las cuentas:', response.statusText);
        }
    } catch (error) {
        console.error('Error en la solicitud:', error);
    }
}

// Llamar la función
obtenerCuentasPorCedula();
