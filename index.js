
/* Login box */
var x = document.getElementById('login');
var y = document.getElementById('register');
var z = document.getElementById('btn');

function register() {
	x.style.left = '-400px';
	y.style.left = '50px';
	z.style.left = '110px';
}

function login() {
	x.style.left = '50px';
	y.style.left = '450px';
	z.style.left = '0';
}


/* This will need to be stored somewhere else at some point for security reasons */
const API_KEY = 'api_key=bb1d4e0661af455e02af1ea99fb85fcb'; 
const BASE_URL = 'https://api.themoviedb.org/3/';

/* This can be formatted to include whatever you want -- 'movie/upcoming' is just a placeholder for now */
const API_URL = BASE_URL + 'movie/upcoming?' + API_KEY + '&language=en-US&page=1';

/* After this URL, add the posterURL return from the API */
const POSTER_URL = 'https://image.tmdb.org/t/p/original/';

getMovies(API_URL);

/* Makes an API fetch call to get movies with whatever url you want -- this could be for upcoming movies, popular, etc */
function getMovies(url) {
    fetch(url).then(res => res.json()).then(data => {
        console.log(data.results);
        displayMovies(data.results);
    }).catch(error => {
        console.log(error);
    })
}

/* Will loop through the data returned by the previous API call & display various pieces of info in HTML */
    // Back drop path can be used in modal
    // <img src="${POSTER_URL + backdrop_path}" alt="title">
    //     <img src="${POSTER_URL + poster_path}" alt="title">
    //     <div class="movieInfo">
    //         <h2><b>${title}</b></h2>
    //         <h3><b>Rating -- ${vote_average}/10 </b></h3>
    //     </div>
    //     <div class="overview">
    //         <h3>Overview</h3>
    //         ${overview}
    //     </div>
    //     <br></br>
function displayMovies(data) {
    let i = 0;
    movieCarousel.innerHTML = '';

    data.forEach(movies => {
        const {title, poster_path, vote_average, overview, backdrop_path} = movies;
        const backdrop_url = POSTER_URL + backdrop_path;
        console.log(movies.title);
  
        const movieEl = `
        <div class="carousel-item">
            <label for="my-modal-${i}" class="btn modal-button" style="height: 300px !important; padding-right: 0px !important; padding-left: 0px !important; margin-right: 10px !important; margin-left: 10px !important; margin-bottom: 10px !important; padding-bottom: 0px !important; width: 200px !important;">
            <img src="${POSTER_URL + poster_path}" alt="poster" style="margin-right: 0px !important; height: 300px !important; width: 200px !important;">
            </label>
            <input type="checkbox" class="modal-toggle" id="my-modal-${i}" />
            <div class="modal">
                <div class="modal-box bg-gradient-to-t bg-gradient-to-t from-zinc-900 relative w-full max-w-5xl h-full">
                    <label
                        for="my-modal-${i}"
                        class="btn btn-sm btn-circle absolute right-2 top-2"
                        >✕
                    </label>

                    <div class="card bg-base-100 shadow-xl image-full">
                        <figure> <img src="${backdrop_url}" alt="poster" style="margin-right: 0px !important; height: 380px !important; width: 960px !important;"></img> </figure>
                        <div class="card-body">
                            <h1 class="card-title style="text-align: center !important;">
                                <font size="+100">${title}</font>
                            </h1>
                            <br/>
                            <h3><b>Overview</b></h3>
                            <p>${overview}</p>
                            <br /><br />
                            <p class="info"><b>Release Date:</b> ${movies.release_date} | <b>Rating:</b> ${vote_average} / 10</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>`
        movieCarousel.innerHTML += movieEl;
        i++;
    })
}