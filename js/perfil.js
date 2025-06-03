document.addEventListener("DOMContentLoaded", async () => {
    try {       
        // ───────────────────────────────────────────────────────
        // GESTIÓN DE IDIOMA DESDE LA URL
        // ───────────────────────────────────────────────────────
        const params = new URLSearchParams(window.location.search);
        if (!params.has("lang")) { // Verificamos si ya hay un parámetro ?lang en la URL, si no lo hay, lo agregamos
            window.location.search = "?lang=es";
        }
        const lang = params.get("lang") || "es"; // Si no hay parámetro, por defecto es español
        const response = await fetch(`conf/config${lang.toUpperCase()}.json`); // Cargamos el archivo de configuración según el idioma

        if (!response.ok) throw new Error("No se pudo cargar el archjvo de configuración");
        const config = await response.json();
        
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
    }catch (error) {
        console.error("Error al cargar configuración:", error);
    }
});