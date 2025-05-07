document.addEventListener("DOMContentLoaded", async () => {
    try {

        // ───────────────────────────────────────────────────────
        // GESTIÓN DE IDIOMA DESDE LA URL
        // ───────────────────────────────────────────────────────
        const paramslang = new URLSearchParams(window.location.search);
        if (!paramslang.has("lang")) { // Verificamos si ya hay un parámetro ?lang en la URL, si no lo hay, lo agregamos
            window.location.search = "?lang=es";
        }
        const lang = paramslang.get("lang") || "es"; // Si no hay parámetro, por defecto es español
        const response = await fetch(`conf/config${lang.toUpperCase()}.json`); // Cargamos el archivo de configuración según el idioma

        if (!response.ok) throw new Error("No se pudo cargar el archjvo de configuración");
        const config = await response.json();

        // ───────────────────────────────────────────────────────
        //  CONFIGURACIÓN GENERAL DEL SITIO INDEX.HTML (TÍTULO, HEADER, FOOTER)
        // ───────────────────────────────────────────────────────

        // Titulo
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


        // ───────────────────────────────────────────────────────
        // CONFIGURACIÓN GENERAL DEL SITIO PERFIL.HTML
        // ───────────────────────────────────────────────────────
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


        // ───────────────────────────────────────────────────────
        // PERFIL.HTML – Carga de la pagina de forma dinamica según CI
        // ───────────────────────────────────────────────────────

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
                        profileImg.onerror = null; // Detener la cadena de errores en el último intento de extensión de la imagen
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

        // ────────────────────────────────────────────────────────────────────
        // INDEX.HTML – Cargar lista de estudiantes y renderizado
        // ────────────────────────────────────────────────────────────────────

        // Hacemos este cambio: Movemos la creacion del listado de estudiantes en el index.html que teniamos mas arriba a esta parte
        // Esto se hace para que la lista de estudiantes se filtre en tiempo real

        let listaEstudiantes = [];

        try {
            const resEstudiantes = await fetch("datos/index.json");
            listaEstudiantes =  await resEstudiantes.json(); // Guardamos para reutilizar
            renderizarEstudiantes(listaEstudiantes);
        } catch (error) {
            console.error("Error cargando estudiantes:", error);
        }

        function renderizarEstudiantes(estudiantesFiltrados) {
            const ul = document.querySelector(".student-list");
            ul.innerHTML = ""; // Limpiamos lista actual para evitar duplicados

            if (estudiantesFiltrados.length === 0) {
                const mensaje = document.createElement("p");

                mensaje.textContent = `No hay alumnos que tengan en su nombre: ${inputBuscar.value}`;
                mensaje.style.textAlign = "center";
                mensaje.style.color = "#0056b3";
                mensaje.style.gridColumn = "1 / -1";

                ul.appendChild(mensaje);
                return;
            }

            estudiantesFiltrados.forEach(est => {
                const li = document.createElement("li");
                li.innerHTML = `
                    <a href="perfil.html?ci=${est.ci}&lang=${lang}">
                        <img src="${est.imagen}" alt="${est.nombre}" />
                        <div>${est.nombre}</div>
                    </a>`;
                ul.appendChild(li);
            });
        }


        // ───────────────────────────────────────────────────────
        // BUSCADOR – Busqueda en la lista de estudiantes del index.html
        // ───────────────────────────────────────────────────────

        // Esto es por si la busqueda se hace desde el boton de buscar al presionarlo
        const formBuscar = document.querySelector(".search-form");
        formBuscar.addEventListener("submit", (e) => {
            e.preventDefault(); // Evita recarga
            const query = inputBuscar.value.trim().toLowerCase();
            const filtrados = listaEstudiantes.filter(est =>
                est.nombre.toLowerCase().includes(query)
            );
            renderizarEstudiantes(filtrados);
        });

        // Evitamos que dar enter en el buscador recargue la pagina
        
        formBuscar.addEventListener("submit", (e) => {
            e.preventDefault(); // Esto evita que se reinicie la página
        });

    } catch (error) {
        console.error("Error al cargar configuración:", error);
    }
});

