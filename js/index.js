document.addEventListener("DOMContentLoaded", async () => {
    try {
        const response = await fetch("conf/configES.json");
        if (!response.ok) throw new Error("No se pudo cargar el archjvo de configuración");

        const config = await response.json();

        // Titulo del index.html
        document.title = config.sitio.join(" ");

        // Info del Header
        const logoEl = document.querySelector(".logo");
        if (logoEl) {
            logoEl.innerHTML = `${config.sitio[0]}<span>${config.sitio[1]}</span> ${config.sitio[2]}`;
        }

        // saludo en el nombre
        const saludoEl = document.querySelector(".saludo");
        if (saludoEl) {
            saludoEl.textContent = `${config.saludo}, ${config.nombre}`;
        }

        // Parte del search
        const inputBuscar = document.querySelector(".search-form input");
        const botonBuscar = document.querySelector(".search-form button");
        if (inputBuscar) inputBuscar.placeholder = config.buscar;
        if (botonBuscar) botonBuscar.textContent = config.buscar;

        // Footer
        const footerEl = document.querySelector(".copy");
        if (footerEl) {
            footerEl.textContent = config.copyRight;
        }

        // Parte perfil.html donde se muestra la info del perfil
        const colorPerfil = document.querySelector(".color");
        const bookPerfil = document.querySelector(".book");
        const musicPerfil = document.querySelector(".music");
        const videoGamePerfil = document.querySelector(".videogames");
        const programmingPerfil = document.querySelector(".programming");
        const mailPerfil = document.querySelector(".mail");

        if (colorPerfil) {
            colorPerfil.textContent = config.color;
        }
        if (bookPerfil) {
            bookPerfil.textContent = config.libro;
        }
        if (musicPerfil) {
            musicPerfil.textContent = config.musica;
        }
        if (videoGamePerfil) {
            videoGamePerfil.textContent = config.video_juego;
        }
        if (programmingPerfil) {
            programmingPerfil.textContent = config.lenguajes;
        }
        if (mailPerfil) {
            mailPerfil.textContent = config.email;
        }

        // Listado de estudiantes en index.html
        try {
            const resEstudiantes = await fetch("datos/index.json");
            const estudiantes = await resEstudiantes.json();

            const ul = document.querySelector(".student-list");

            estudiantes.forEach(est => {
                const li = document.createElement("li");
                li.innerHTML = `
                <a href="perfil.html?ci=${est.ci}">
                    <img src="${est.imagen}" alt="${est.nombre}" />
                    <div>${est.nombre}</div>
                </a>`;
                ul.appendChild(li);
            });
        } catch (error) {
            console.error("Error cargando estudiantes:", error);
        }

        // Perfil construido de forma dinamica en perfil.html

        const params = new URLSearchParams(window.location.search);
        const ci = params.get("ci");

        fetch(`${ci}/perfil.json`)
            .then(res => res.json())
            .then(data => mostrarPerfil(data))
            .catch(err => console.error("Error cargando perfil:", err));

        function mostrarPerfil(data) {
            // Foto
            const profileImg = document.querySelector(".profile-img");
            profileImg.src = `${ci}/${ci}.jpg`;

            profileImg.onerror = function() {
                profileImg.onerror = function() {
                    profileImg.onerror = function() {
                        profileImg.src = `${ci}/${ci}.JPG`;
                        profileImg.onerror = null; // Detener la cadena de errores en el último intento de extensión
                    };
                    profileImg.src = `${ci}/${ci}.PNG`;
                };
                profileImg.src = `${ci}/${ci}.png`;
            };

            // Nombre
            document.querySelector(".name").textContent = data.nombre;
            document.title = data.nombre; // Cambia el <title>

            // Descripcion
            document.querySelector(".description").textContent = data.descripcion || "";

            // Datos personales
            document.querySelector(".answer-color").textContent = Array.isArray(data.color) ? data.color.join(", ") : data.color;
            document.querySelector(".answer-book").textContent = Array.isArray(data.libro) ? data.libro.join(", ") : data.libro;
            document.querySelector(".answer-music").textContent = Array.isArray(data.musica) ? data.musica.join(", ") : data.musica;
            document.querySelector(".answer-videogames").textContent = Array.isArray(data.video_juego) ? data.video_juego.join(", ") : data.video_juego;
            document.querySelector(".answer-programming").textContent = Array.isArray(data.lenguajes) ? data.lenguajes.join(", ") : data.lenguajes;
            document.querySelector(".answer-mail").textContent = data.email || "";
        }

    } catch (error) {
        console.error("Error al cargar configuración:", error);
    }
});

