document.getElementById('btnLogin').addEventListener('click', async function () {
    const cedula = document.getElementById('cedula').value;
    const password = document.getElementById('password').value;

    if (!cedula || !password) {
        Swal.fire({
            icon: 'warning',
            title: 'Campos vacíos',
            text: 'Por favor ingrese ambos campos.',
        });
        return;
    }

    try {
        const response = await fetch('http://localhost:5000/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ cedula, password })
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

        if (data.success && data.token) {
            localStorage.removeItem('jwt');
            localStorage.setItem('jwt', data.token);

            const nombreUsuario = data.user.descripcion.trim().toUpperCase();
            const fechaUltimaConexion = data.user.ultimaConexionFecha; // Ya viene como "2025-02-05"

            const fechaHoraUltimaConexion = `${fechaUltimaConexion}`; // Unir la fecha con la hora

            const ipUltimaConexion = data.user.ultimaConexionIP;


            // Guarda el nombre de usuario y los datos en localStorage
            localStorage.setItem('nombreUsuario', nombreUsuario);
            localStorage.setItem('fechaUltimaConexion', fechaHoraUltimaConexion);
            localStorage.setItem('ipUltimaConexion', ipUltimaConexion);
            localStorage.setItem('cedula', data.user.nnit);

            Swal.fire({
                icon: 'success',
                title: 'Bienvenido',
                text: `Inicio de sesión exitoso, ${nombreUsuario}.`,
                timer: 1500,
                showConfirmButton: false,
            }).then(() => {
                window.location.href = '../../startbootstrap-sb-admin-2-gh-pages/index.html';
            });
        }
        else {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: data.message || 'Credenciales incorrectas.',
            });
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
