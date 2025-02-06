document.addEventListener("DOMContentLoaded", function () {
    const nombreUsuario = localStorage.getItem('nombreUsuario');

    if (nombreUsuario) {
        // Asignar el nombre del usuario al <h2>
        document.getElementById('nombreUsuario').textContent = nombreUsuario;
    } else {
        // Si no hay nombre en localStorage (por ejemplo, si el usuario no ha iniciado sesión)
        window.location.href = '../login-form-02/login.html'; // Redirige al login
    }
});
// En el Dashboard, cuando la página se carga
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

