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


    } catch (error) {
        console.error("Error al cargar configuración:", error);
    }
});

