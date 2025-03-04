document.addEventListener('DOMContentLoaded', function () {
    function actualizarFechaHora() {
        const opcionesFecha = {
            timeZone: 'America/Bogota',
            year: 'numeric',
            month: 'long',  // 'long' para mostrar el nombre completo en español
            day: '2-digit'
        };

        const opcionesHora = {
            timeZone: 'America/Bogota',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true
        };

        const ahora = new Date();
        const fecha = new Intl.DateTimeFormat('es-CO', opcionesFecha).format(ahora);
        const hora = new Intl.DateTimeFormat('es-CO', opcionesHora).format(ahora);

        const fechaActualElement = document.getElementById('fechaActual');
        if (fechaActualElement) {
            fechaActualElement.textContent = `${fecha} - ${hora}`;
        } else {
            console.error("❌ No se encontró el elemento con ID 'fechaActual'");
        }
    }

    // Llama a la función al cargar la página
    actualizarFechaHora();

    // Actualiza cada segundo
    setInterval(actualizarFechaHora, 1000);
});
