let pagina = 1;
let peliculasHTML = "";
let ultimaPelicula = null;
const API_KEY = "7502d725a078c6fb1eda839fdc3a33a0";
const API_URL = `https://api.themoviedb.org/3/movie/popular`;

let observador = new IntersectionObserver(
  (entradas) => {
    entradas.forEach((entrada) => {
      if (entrada.isIntersecting) {
        console.log("Intersectando");
        pagina++;
        obtenerPeliculas();
      }
    });
  },
  {
    rootMargin: "0px 0px 200px 0px",
    threshold: 0.5,
  }
);

const obtenerPeliculas = async () => {
  try {
    const respuesta = await fetch(
      API_URL +
        `?api_key=${API_KEY}&page=${pagina}&language=es-MX&region=MX&include_image_language=es`
    );
    if (respuesta.status === 200) {
      const datos = await respuesta.json();
      crearPeliculas(datos.results);
    } else if (respuesta.status === 401) {
      console.log("Pusiste la llave mal");
    } else if (respuesta.status === 404) {
      console.log("La pelicula que buscas no existe");
    } else {
      console.log("Hubo un error y no sabemos que paso");
    }
  } catch (error) {
    console.log(error);
  }
};

const crearPeliculas = (peliculas) => {
  peliculas.forEach((pelicula) => {
    peliculasHTML += `
        <div class="pelicula">
            <img src="https://image.tmdb.org/t/p/w500${pelicula.poster_path}" alt="${pelicula.title}">
            <h3>${pelicula.title}</h3>
        </div>
        `;
  });

  document.getElementById("peliculas").innerHTML = peliculasHTML;

  if (ultimaPelicula) {
    observador.unobserve(ultimaPelicula);
  }

  const peliculasEnPantalla = document.querySelectorAll("#peliculas .pelicula");

  ultimaPelicula = peliculasEnPantalla[peliculasEnPantalla.length - 1];
  observador.observe(ultimaPelicula);
};

obtenerPeliculas();
