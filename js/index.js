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
        
        // ────────────────────────────────────────────────────────────────────
        // INDEX.HTML – Cargar lista de estudiantes y renderizado
        // ────────────────────────────────────────────────────────────────────

        let listaEstudiantes = [];

        try {
            const resEstudiantes = await fetch("datos/index.json");
            listaEstudiantes = await resEstudiantes.json(); // Guardamos para reutilizar
            renderizarEstudiantes(listaEstudiantes);
        } catch (error) {
            console.error("Error cargando estudiantes:", error);
        }

        function renderizarEstudiantes(estudiantesFiltrados) {
            const ul = document.querySelector(".student-list");
            ul.innerHTML = ""; // Limpiamos la lista actual para evitar duplicados

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
                const a = document.createElement("a");
                // Asegúrate de que la variable "lang" esté definida en algún lugar de tu código
                a.href = `perfil.html?ci=${est.ci}&lang=${lang || 'es'}`;

                const img = document.createElement("img");
                img.src = est.imagen;
                img.alt = est.nombre;

                const div = document.createElement("div");
                div.textContent = est.nombre;

                a.appendChild(img);
                a.appendChild(div);
                li.appendChild(a);
                ul.appendChild(li);
            });
        }

        // ───────────────────────────────────────────────────────
        // BUSCADOR – Búsqueda en tiempo real a medida que se escribe
        // ───────────────────────────────────────────────────────

        // Selecciona el input de búsqueda. Asegúrate de que el HTML tenga un input con id "inputBuscar".


        if (inputBuscar) {
            // Usamos el evento "input" para capturar cada cambio en el buscador
            inputBuscar.addEventListener("input", (e) => {
                const query = e.target.value.trim().toLowerCase();
                const filtrados = listaEstudiantes.filter(est =>
                    est.nombre.toLowerCase().includes(query)
                );
                renderizarEstudiantes(filtrados);
            });
        }


    } catch (error) {
        console.error("Error al cargar configuración:", error);
    }
});

