document.getElementById('btnLogin').addEventListener('click', async function () {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    if (!email || !password) {
        Swal.fire({
            icon: 'warning',
            title: 'Campos vacíos',
            text: 'Por favor ingrese ambos campos.',
        });
        return;
    }

    try {
        const response = await fetch('http://localhost:5000/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
            credentials: 'include'
        });

        const data = await response.json();

        if (!response.ok) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: data.message || 'Credenciales incorrectas.',
            });
            return;
        }

        if (data.token) {
            const nombreUsuario = data.name.trim().toUpperCase();
            const rolUsuario = data.rol;
            const agenciau = data.agenciau;

            sessionStorage.setItem('nombreUsuario', nombreUsuario);
            sessionStorage.setItem('token', data.token);
            sessionStorage.setItem('rol', rolUsuario);
            sessionStorage.setItem('agenciau', agenciau);

            if (rolUsuario === 'Consultante') {
                sessionStorage.setItem('hideOnbush', 'true'); // Ocultar módulos
                Swal.fire({
                    icon: 'success',
                    title: 'Bienvenido',
                    html: `Inicio de sesión exitoso, <b>${nombreUsuario}</b>.`,
                    timer: 2000,
                    showConfirmButton: false,
                }).then(() => {
                    window.location.href = 'http://127.0.0.1:5500/SotfwareCreditos/startbootstrap-sb-admin-2-gh-pages/creditosAS400.html';
                });
            } else if (['Gerencia', 'Coordinacion', 'Admin'].includes(rolUsuario)) {
                sessionStorage.setItem('hideOnbush', 'false'); // No ocultar módulos
                Swal.fire({
                    icon: 'success',
                    title: 'Bienvenido',
                    html: `Inicio de sesión exitoso, <b>${nombreUsuario}</b>.`,
                    timer: 2000,
                    showConfirmButton: false,
                }).then(() => {
                    window.location.href = 'http://127.0.0.1:5500/SotfwareCreditos/startbootstrap-sb-admin-2-gh-pages/index.html';
                });
            } else if (rolUsuario === 'Jefatura') {
                sessionStorage.setItem('hideOnbush', 'true'); // Según necesidad
                Swal.fire({
                    icon: 'success',
                    title: 'Bienvenido',
                    html: `Inicio de sesión exitoso, <b>${nombreUsuario}</b>.`,
                    timer: 2000,
                    showConfirmButton: false,
                }).then(() => {
                    window.location.href = 'http://127.0.0.1:5500/SotfwareCreditos/startbootstrap-sb-admin-2-gh-pages/creditosPagadosTesoreria.html';
                });
            } else {
                Swal.fire({
                    icon: 'warning',
                    title: 'Acceso denegado',
                    text: 'No tienes permiso para ingresar.',
                });
                return;
            }

        }
    } catch (error) {
        console.error('Error en el login:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Ocurrió un error al intentar ingresar. Intente nuevamente.',
        });
    }
});



history.pushState(null, null, location.href);
window.onpopstate = function () {
    history.go(1);
};

document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("loginForm");
    const btnLogin = document.getElementById("btnLogin");

    form.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            event.preventDefault(); // Evita que el formulario se recargue
            btnLogin.click(); // Dispara el evento de clic en el botón de login
        }
    });


});
