document.addEventListener("DOMContentLoaded", function () {

    // ==========================================
    // API OMDb
    // ==========================================

    const API_KEY = "b117a13c";


    // ==========================================
    // BÚSQUEDA DESDE INICIO
    // ==========================================

    const formulario = document.getElementById("formBusqueda");

    if (formulario) {

        formulario.addEventListener("submit", function (event) {

            event.preventDefault();

            const input = document.getElementById("busqueda");
            const busqueda = input.value.trim();

            if (busqueda !== "") {

                window.location.href =
                    "resultados.html?pelicula=" +
                    encodeURIComponent(busqueda);

            }

        });

    }


    // ==========================================
    // MOSTRAR RESULTADOS
    // ==========================================

    const contenedorResultados =
        document.getElementById("resultadosPeliculas");

    if (contenedorResultados) {

        const parametros =
            new URLSearchParams(window.location.search);

        const peliculaBuscada =
            parametros.get("pelicula");

        if (peliculaBuscada) {

            buscarPeliculas(peliculaBuscada);

        } else {

            contenedorResultados.innerHTML = `
                <div class="alert alert-info">
                    Escribe el nombre de una película para comenzar.
                </div>
            `;

        }

    }


    // ==========================================
    // BUSCAR PELÍCULAS EN OMDb
    // ==========================================

    async function buscarPeliculas(nombre) {

        contenedorResultados.innerHTML = `
            <div class="text-center py-5">
                <div class="spinner-border text-primary"></div>
                <p class="mt-3">Buscando películas...</p>
            </div>
        `;

        const url =
            `https://www.omdbapi.com/?apikey=${API_KEY}&s=${encodeURIComponent(nombre)}&type=movie`;

        try {

            const respuesta = await fetch(url);

            const datos = await respuesta.json();

            console.log("Respuesta de OMDb:", datos);

            if (datos.Response === "True") {

                mostrarPeliculas(datos.Search);

            } else {

                contenedorResultados.innerHTML = `
                    <div class="alert alert-warning">
                        No encontramos películas para
                        <strong>${nombre}</strong>.
                    </div>
                `;

            }

        } catch (error) {

            console.error("Error:", error);

            contenedorResultados.innerHTML = `
                <div class="alert alert-danger">
                    Ocurrió un error al conectar con OMDb.
                </div>
            `;

        }

    }


    // ==========================================
    // CREAR TARJETAS DE PELÍCULAS
    // ==========================================

    function mostrarPeliculas(peliculas) {

        contenedorResultados.innerHTML = "";

        peliculas.forEach(function (pelicula) {

            const poster =
                pelicula.Poster !== "N/A"
                    ? pelicula.Poster
                    : "https://via.placeholder.com/300x450?text=Sin+poster";


            contenedorResultados.innerHTML += `

                <div class="col-md-3 mb-4">

                    <div class="card movie-card h-100">

                        <img
                            src="${poster}"
                            class="card-img-top"
                            alt="${pelicula.Title}"
                        >

                        <div class="card-body d-flex flex-column">

                            <h5 class="card-title">
                                ${pelicula.Title}
                            </h5>

                            <p class="card-text">
                                Año: ${pelicula.Year}
                            </p>

                            <a
                                href="detalle.html?imdb=${encodeURIComponent(pelicula.imdbID)}"
                                class="btn btn-primary mt-auto"
                            >
                                Ver película
                            </a>

                        </div>

                    </div>

                </div>

            `;

        });

    }


    // ==========================================
    // DETALLE DE PELÍCULA
    // ==========================================

    const contenedorDetalle =
        document.getElementById("detallePelicula");

    if (contenedorDetalle) {

        const parametros =
            new URLSearchParams(window.location.search);

        const imdbID =
            parametros.get("imdb");

        console.log("ID de película:", imdbID);

        if (imdbID) {

            buscarDetalle(imdbID);

        } else {

            contenedorDetalle.innerHTML = `
                <div class="alert alert-warning">
                    No se encontró el ID de la película.
                </div>
            `;

        }

    }


    // ==========================================
    // BUSCAR DETALLE EN OMDb
    // ==========================================

    async function buscarDetalle(imdbID) {

        const url =
            `https://www.omdbapi.com/?apikey=${API_KEY}&i=${imdbID}&plot=full`;

        try {

            const respuesta = await fetch(url);

            const pelicula = await respuesta.json();

            console.log("Detalle:", pelicula);

            if (pelicula.Response === "True") {

                mostrarDetalle(pelicula);

            } else {

                contenedorDetalle.innerHTML = `
                    <div class="alert alert-warning">
                        No se encontró la película.
                    </div>
                `;

            }

        } catch (error) {

            console.error("Error:", error);

            contenedorDetalle.innerHTML = `
                <div class="alert alert-danger">
                    Ocurrió un error al cargar la película.
                </div>
            `;

        }

    }


    // ==========================================
    // MOSTRAR DETALLE
    // ==========================================

    function mostrarDetalle(pelicula) {

        const poster =
            pelicula.Poster !== "N/A"
                ? pelicula.Poster
                : "https://via.placeholder.com/300x450?text=Sin+poster";


        contenedorDetalle.innerHTML = `

            <div class="row align-items-center">

                <div class="col-md-4 text-center mb-4">

                    <img
                        src="${poster}"
                        class="img-fluid rounded shadow"
                        alt="${pelicula.Title}"
                    >

                </div>


                <div class="col-md-8">

                    <h1 class="fw-bold">
                        ${pelicula.Title}
                    </h1>

                    <p class="text-muted">
                        ${pelicula.Year}
                        ·
                        ${pelicula.Runtime}
                        ·
                        ${pelicula.Genre}
                    </p>


                    <h5>⭐ Calificación</h5>

                    <p>
                        ${pelicula.imdbRating}
                    </p>


                    <h5>🎬 Director</h5>

                    <p>
                        ${pelicula.Director}
                    </p>


                    <h5>🎭 Actores</h5>

                    <p>
                        ${pelicula.Actors}
                    </p>


                    <h5>📝 Sinopsis</h5>

                    <p>
                        ${pelicula.Plot}
                    </p>


                    <button
                        class="btn btn-outline-primary btn-favorito"
                        id="btnFavorito"
                    >
                        ♡ Agregar a favoritos
                    </button>


                    <a
                        href="javascript:history.back()"
                        class="btn btn-outline-secondary ms-2"
                    >
                        ← Regresar
                    </a>

                </div>

            </div>

        `;


        activarBotonFavorito();

    }


    // ==========================================
    // BOTÓN FAVORITOS
    // ==========================================

    function activarBotonFavorito() {

        const boton =
            document.getElementById("btnFavorito");

        if (boton) {

            boton.addEventListener("click", function () {

                boton.innerHTML = "♥ En favoritos";

                boton.classList.remove(
                    "btn-outline-primary"
                );

                boton.classList.add(
                    "btn-primary"
                );

            });

        }

    }


});