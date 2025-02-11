document.addEventListener("DOMContentLoaded", function () {
    const nombreUsuario = localStorage.getItem('nombreUsuario');

    if (nombreUsuario) {

        document.getElementById('nombreUsuario').textContent = nombreUsuario;
    } else {

        window.location.href = '../login-form-02/login.html'; // Redirige al login
    }
});

document.addEventListener('DOMContentLoaded', function () {
    const nombreUsuario = localStorage.getItem('nombreUsuario');

    // Mostrar los valores en el frontend
    document.getElementById('nombreUsuario').innerText = nombreUsuario;


});

// Manejador del evento de cerrar sesión
document.getElementById('logout').addEventListener('click', function () {
    // Elimina todo lo almacenado en el localStorage
    localStorage.clear();

    // Redirige a la página de login
    window.location.href = '../login-form-02/login.html';  // Ajusta la URL si es necesario
});