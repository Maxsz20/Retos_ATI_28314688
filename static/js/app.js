document.addEventListener("DOMContentLoaded", async () => {

    const lang = sessionStorage.getItem("lang") || "es";
    const inputBuscar = document.querySelector(".search-form input");
    const botonBuscar = document.querySelector(".search-form button");
    const ul = document.querySelector(".student-list");
    const sectionListado = document.querySelector(".student-list-section");
    const sectionPerfil = document.getElementById("profile-view");

    let config = {};
    let estudiantes = [];

    // ───────────────────────────────────────────────────────
    // CARGAR CONFIGURACIÓN Y LISTA DE ESTUDIANTES
    // ───────────────────────────────────────────────────────
    try {
        const configRes = await fetch(`/api/config?lang=${lang}`);
        config = await configRes.json();

        document.title = config.sitio.join(" ");
        document.querySelector(".logo").innerHTML = `${config.sitio[0]}<span>${config.sitio[1]}</span> ${config.sitio[2]}`;
        document.querySelector(".saludo").textContent = `${config.saludo}, ${config.nombre}`;
        inputBuscar.placeholder = config.buscar;
        botonBuscar.textContent = config.buscar;
        document.querySelector(".copy").textContent = config.copyRight;
    } catch (err) {
        console.error("Error cargando configuración:", err);
    }

    try {
        const resEstudiantes = await fetch("/api/estudiantes");
        estudiantes = await resEstudiantes.json();
        renderizarEstudiantes(estudiantes);
    } catch (err) {
        console.error("Error cargando estudiantes:", err);
    }

    // ───────────────────────────────────────────────────────
    // FUNCIONES DE RENDERIZADO
    // ───────────────────────────────────────────────────────
     

    function renderizarEstudiantes(lista) {
        ul.innerHTML = "";
        sectionPerfil.style.display = "none";
        sectionListado.style.display = "block";

        if (lista.length === 0) { /* … */ }

        lista.forEach(est => {
            const li  = document.createElement("li");
            const a   = document.createElement("a");
            a.href    = "#";
            a.addEventListener("click", () => cargarPerfil(est.ci));

            const img = document.createElement("img");
            const extList = ["jpg", "JPG", "jpeg", "JPEG", "png", "PNG"];
            let attempt = 0;                            
            img.src = `/static/datos/${est.ci}/${est.ci}.${extList[attempt]}`;

            img.onerror = function () {
                attempt++;

                if (attempt < extList.length) {
                this.src = `/static/datos/${est.ci}/${est.ci}.${extList[attempt]}`;
                return;   
                }

                this.onerror = null;
                this.src = "/static/no-photo.png";
            };


            const div = document.createElement("div");
            div.textContent = est.nombre;

            a.append(img, div);
            li.appendChild(a);
            ul.appendChild(li);
        });
    }

    async function cargarPerfil(ci) {
        try {
            const res = await fetch(`/api/perfil/${ci}`);
            const data = await res.json();
            if (data.error) throw new Error(data.error);

            sectionListado.style.display = "none";
            sectionPerfil.style.display = "";

            const img = document.querySelector(".profile-img");
            img.src = `static/datos/${ci}/${ci}.jpg`;
            img.onerror = function () {
                img.src = `static/datos/${ci}/${ci}.png`;
                img.onerror = null;
            };

            document.querySelector(".name").textContent = data.nombre;
            document.querySelector(".description").textContent = data.descripcion || "";
            document.querySelector(".label.color").textContent = config.color;
            document.querySelector(".label.book").textContent = config.libro;
            document.querySelector(".label.music").textContent = config.musica;
            document.querySelector(".label.videogames").textContent = config.video_juego;
            document.querySelector(".label.programming").textContent = config.lenguajes;
            document.querySelector(".mail").textContent = config.email;

            document.querySelector(".answer-color").textContent = Array.isArray(data.color) ? data.color.join(", ") : data.color;
            document.querySelector(".answer-book").textContent = Array.isArray(data.libro) ? data.libro.join(", ") : data.libro;
            document.querySelector(".answer-music").textContent = Array.isArray(data.musica) ? data.musica.join(", ") : data.musica;
            document.querySelector(".answer-videogames").textContent = Array.isArray(data.video_juego) ? data.video_juego.join(", ") : data.video_juego;
            document.querySelector(".answer-programming").textContent = Array.isArray(data.lenguajes) ? data.lenguajes.join(", ") : data.lenguajes;
            document.querySelector(".answer-mail").textContent = data.email || "";
        } catch (err) {
            console.error("Error cargando perfil:", err);
        }
    }

    // ───────────────────────────────────────────────────────
    // BÚSQUEDA EN TIEMPO REAL
    // ───────────────────────────────────────────────────────
    inputBuscar.addEventListener("input", (e) => {
        const query = e.target.value.trim().toLowerCase();
        const filtrados = estudiantes.filter(est => est.nombre.toLowerCase().includes(query));
        renderizarEstudiantes(filtrados);
    });
});
