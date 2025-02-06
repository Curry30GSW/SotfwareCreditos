// auth.js


const LOGIN_PAGE = "../../login-form-02/login.html";

// Función para verificar el token en el localStorage
function verificarTokenLocalStorage() {
    const token = localStorage.getItem('jwt');

    if (!token) {
        // Si no hay token, redirigir al inicio de sesión
        redirigirALogin();
    } else {

    }
}

// Función para redirigir al usuario a la página de inicio de sesión
function redirigirALogin() {
    Swal.fire({
        icon: 'info',
        title: 'Sesión no iniciada',
        text: 'Por favor, inicia sesión para continuar.',
        timer: 2000,
        showConfirmButton: false,
        allowOutsideClick: false,
    }).then(() => {
        window.location.href = LOGIN_PAGE;
    });
}

verificarTokenLocalStorage();