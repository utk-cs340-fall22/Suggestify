
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

let tabs = [
    "Tab 1",
    "Tab 2",
    "Tab 3",
]
let activeTab = 1;

function activateTabs() {

}



/* This will need to be stored somewhere else at some point for security reasons */
const API_KEY = 'api_key=bb1d4e0661af455e02af1ea99fb85fcb';
const BASE_URL = 'https://api.themoviedb.org/3/';

/* This can be formatted to include whatever you want -- 'movie/upcoming' is just a placeholder for now */
//const API_URL_ = BASE_URL + '/movie/popular?/similar' + API_KEY + '&language=en-US&page=1';

const API_URL = BASE_URL + 'movie/popular?' + API_KEY + '&language=en-US&page=1';
getTrendingMovies(API_URL);

const API_URL2 = BASE_URL + 'movie/top_rated?' + API_KEY + '&language=en-US&page=1';
getTopMovies(API_URL2);

const API_URL3 = BASE_URL + 'tv/popular?' + API_KEY + '&language=en-US&page=1';
getTrendingTV(API_URL3);

const API_URL4 = BASE_URL + 'tv/top_rated?' + API_KEY + '&language=en-US&page=1';
getTopTV(API_URL4);

const API_URL5 = BASE_URL + 'movie/latest?' + API_KEY + '&language=en-US&page=1';
getLatestMovies(API_URL5);

const API_URL6 = BASE_URL + 'movie/now_playing?' + API_KEY + '&language=en-US&page=1';
getPlayingMovies(API_URL6);

const API_URL7 = BASE_URL + 'movie/upcoming?' + API_KEY + '&language=en-US&page=1';
getUpcomingMovies(API_URL7);

const API_URL8 = BASE_URL + 'tv/on_the_air?' + API_KEY + '&language=en-US&page=1';
getAiringTV(API_URL8);

/* After this URL, add the posterURL return from the API */
const POSTER_URL = 'https://image.tmdb.org/t/p/original/';

let slideIndex = 1;
showSlide(slideIndex);

// change slide with the prev/next button
function moveSlide(moveStep) {
    showSlide((slideIndex = moveStep + 5));
}
// change slide with the dots
function currentSlide(n) {
    showSlide((slideIndex = n));
}

function showSlide(n) {
    let i;
    const slides = document.getElementsByClassName('carousel-item');
    const dots = document.getElementsByClassName('dot');

    if (n > slides.length) {
        slideIndex = 1;
    }

    if (n < 1) {
        slideIndex = slides.length;
    }

    // hide all slides
    for (i = 0; i < slides.length; i++) {
        slides[i].classList.add('hidden');
    }

    // remove active status from all dots
    for (i = 0; i < dots.length; i++) {
        dots[i].classList.remove('bg-yellow-500');
        dots[i].classList.add('bg-green-600');
    }

    // show the active slide
    slides[slideIndex - 1].classList.remove('hidden');

    // highlight the active dot
    dots[slideIndex - 1].classList.remove('bg-green-600');
    dots[slideIndex - 1].classList.add('bg-yellow-500');
}

/* Makes an API fetch call to get movies with whatever url you want -- this could be for upcoming movies, popular, etc */
/* function getTrendingMovies(url) {
    fetch(url).then(res => res.json()).then(data => {
        //console.log(data.results);
        displayTrendingMovies(data.results);
    }).catch(error => {
        console.log(error);
    })
} */

async function getKey(trailer_url) {
    var rtrn = "";
    fetch(trailer_url).then(res => res.json()).then(data3 => {
        rtrn = data3.results[0].key;
        return rtrn;
    }).catch(error => {
        console.log(error);
    })
}

function getTrendingMovies(url) {
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        data.results.forEach((movie) => {
          movieCarousel.innerHTML = "";
  
          /* Append to this response to get multiple things to return in one request (append_to_response=...) */
          /* This will get all details, credits, similar movies, and images | Refer to API documentation for other things to append */
          const DETAIL_URL =
            BASE_URL +
            "movie/" +
            movie.id +
            "?" +
            API_KEY +
            "&language=en-US&append_to_response=videos,credits,similar,images";
          fetch(DETAIL_URL)
            .then((res) => res.json())
            .then((data) => {
              displayTrendingMovies(data);
            });
        });
      })
      .catch((error) => {
        console.log(error);
      });
}

//const trailer_url = BASE_URL + `movie/${id}/videos?` + API_KEY;
// fetch(trailer_url).then(res => res.json()).then(data3 => {
//     //console.log(data3.results);
//     //console.log(data3.results[0].key);
//     let strkey = getKey(trailer_url, data3);
//     //strkey = data3.results[0].key;
// }).catch(error => {
//     console.log(error);
// })

/*         const API_URL_SINGLE = BASE_URL + `movie/${id}?` + API_KEY + '&language=en-US&page=1';
    fetch(API_URL_SINGLE).then(res => res.json()).then(data2 => {
        rt.push(data2.runtime);
    }).catch(error => {
        console.log(error);
    }) */

    //var strkey = getKey(trailer_url);
//console.log(strkey);
//console.log(getKey(trailer_url));

/* Will loop through the data returned by the previous API call & display various pieces of info in HTML */
function displayTrendingMovies(data) {
    console.log("Movie -- ", data);
    const {
      title,
      poster_path,
      vote_average,
      overview,
      backdrop_path,
      release_date,
      runtime,
    } = data;
    const backdrop_url = POSTER_URL + backdrop_path;
  
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
                    <figure> <img src="${backdrop_url}" alt="poster" style="margin-right: 0px !important; height: 400px !important; width: 970px !important;"></img> </figure>
                    <div class="card-body">
                        <h1 class="card-title style="text-align: center !important;">
                            <font size="+100">${title}</font>
                        </h1>
                        <br/>
                        <h3><b>Overview</b></h3>
                        <p>${overview}</p>
                        <br /><br />
                        <p class="info"><b>Release Date:</b> ${release_date} | <b>Rating:</b> ${vote_average} / 10</p>
                    </div>
                </div>

                <br></br>
                <div>
                    <p><b>Runtime: </b>${rt[0]}m<p>
                    <p><b>Language: </b> ${original_language}<p>
                    <p><b>Revenue: </b><p>
                </div>

                <div class="absolute right-10">
                    <p><b>Trailer</b></p>
                        <iframe
                            class="w-[300px] h-[170px] object-cover"
                            
                            src= "https://www.youtube.com/watch?v=";
                            title="Black Adam - Official Trailer 2"
                            frameborder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowfullscreen
                        ></iframe>
                    <div class="card-trailer bg-base-100 shadow-xl image-full">
                        <figure><img src="${backdrop_url}" alt="trailer" style="!important; height: 170 !important; width: 300px"/></figure>
                        <div class="card-trailer-body">
                            <button class="trailer-btn btn-circle">▶</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <a
        class="absolute left-0 top-1/2 p-4 -translate-y-4 bg-black/30 hover:bg-black/50 text-white hover:text-amber-500 cursor-pointer"
        onclick="moveSlide(-1)"
        >❮</a
        >
        <a
            class="absolute right-0 top-1/2 p-4 -translate-y-4 bg-black/30 hover:bg-black/50 text-white hover:text-amber-500 cursor-pointer"
            onclick="moveSlide(1)"
            >❯</a
        >
    </div>`
    
    movieCarousel.innerHTML += movieEl;
    i++;
}

/* Makes an API fetch call to get movies with whatever url you want -- this could be for upcoming movies, popular, etc */
function getTopMovies(url) {
    fetch(url).then(res => res.json()).then(data => {
        //console.log(data.results);
        displayTopMovies(data.results);
    }).catch(error => {
        console.log(error);
    })
}

/* Will loop through the data returned by the previous API call & display various pieces of info in HTML */
function displayTopMovies(data) {
    let i2 = 0;
    movieCarousel2.innerHTML = '';

    data.forEach(movies => {
        const { title, poster_path, vote_average, overview, backdrop_path } = movies;
        const backdrop_url = POSTER_URL + backdrop_path;

        const movieEl2 = `
        <div class="carousel-item">
            <label for="my-modal2-${i2}" class="btn modal-button" style="height: 300px !important; padding-right: 0px !important; padding-left: 0px !important; margin-right: 10px !important; margin-left: 10px !important; margin-bottom: 10px !important; padding-bottom: 0px !important; width: 200px !important;">
            <img src="${POSTER_URL + poster_path}" alt="poster" style="margin-right: 0px !important; height: 300px !important; width: 200px !important;">
            </label>
            <input type="checkbox" class="modal-toggle" id="my-modal2-${i2}" />
            <div class="modal">
                <div class="modal-box bg-gradient-to-t bg-gradient-to-t from-zinc-900 relative w-full max-w-5xl h-full">
                    <label
                        for="my-modal2-${i2}"
                        class="btn btn-sm btn-circle absolute right-2 top-2"
                        >✕
                    </label>
                    <div class="card bg-base-100 shadow-xl image-full">
                        <figure> <img src="${backdrop_url}" alt="poster" style="margin-right: 0px !important; height: 400px !important; width: 970px !important;"></img> </figure>
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

                    <div class="tabs tabs-center">
                        <a class="tab tab-lg tab-bordered">See Also</a>
                        <a class="tab tab-lg tab-bordered tab-active">More Info</a> 
                        <a class="tab tab-lg tab-bordered">Reviews</a>
                    </div>

                    <br/><br/>
                    <div class="absolute right-10">
                        <p><b>Trailer</b></p>
                        <div class="card-trailer bg-base-100 shadow-xl image-full">
                            <figure><img src="${backdrop_url}" alt="trailer" style="!important; height: 170 !important; width: 300px"/></figure>
                            
                            <div class="card-trailer-body">
                                <button class="trailer-btn btn-circle">▶</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <a
            class="absolute left-0 top-1/2 p-4 -translate-y-4 bg-black/30 hover:bg-black/50 text-white hover:text-amber-500 cursor-pointer"
            onclick="moveSlide(-1)"
            >❮</a
            >
            <a
                class="absolute right-0 top-1/2 p-4 -translate-y-4 bg-black/30 hover:bg-black/50 text-white hover:text-amber-500 cursor-pointer"
                onclick="moveSlide(1)"
                >❯</a
            >
        </div>`
        movieCarousel2.innerHTML += movieEl2;
        i2++;
    })
}

/* Makes an API fetch call to get movies with whatever url you want -- this could be for upcoming movies, popular, etc */
function getPlayingMovies(url) {
    fetch(url).then(res => res.json()).then(data => {
        //console.log(data.results);
        displayPlayingMovies(data.results);
    }).catch(error => {
        console.log(error);
    })
}

/* Will loop through the data returned by the previous API call & display various pieces of info in HTML */
function displayPlayingMovies(data) {
    let i2 = 0;
    movieCarousel6.innerHTML = '';

    data.forEach(movies => {
        const { title, poster_path, vote_average, overview, backdrop_path } = movies;
        const backdrop_url = POSTER_URL + backdrop_path;

        const movieEl2 = `
        <div class="carousel-item">
            <label for="my-modal6-${i2}" class="btn modal-button" style="height: 300px !important; padding-right: 0px !important; padding-left: 0px !important; margin-right: 10px !important; margin-left: 10px !important; margin-bottom: 10px !important; padding-bottom: 0px !important; width: 200px !important;">
            <img src="${POSTER_URL + poster_path}" alt="poster" style="margin-right: 0px !important; height: 300px !important; width: 200px !important;">
            </label>
            <input type="checkbox" class="modal-toggle" id="my-modal6-${i2}" />
            <div class="modal">
                <div class="modal-box bg-gradient-to-t bg-gradient-to-t from-zinc-900 relative w-full max-w-5xl h-full">
                    <label
                        for="my-modal6-${i2}"
                        class="btn btn-sm btn-circle absolute right-2 top-2"
                        >✕
                    </label>
                    <div class="card bg-base-100 shadow-xl image-full">
                        <figure> <img src="${backdrop_url}" alt="poster" style="margin-right: 0px !important; height: 400px !important; width: 970px !important;"></img> </figure>
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

                    <div class="tabs tabs-center">
                        <a class="tab tab-lg tab-bordered">See Also</a>
                        <a class="tab tab-lg tab-bordered tab-active">More Info</a> 
                        <a class="tab tab-lg tab-bordered">Reviews</a>
                    </div>

                    <br/><br/>
                    <div class="absolute right-10">
                        <p><b>Trailer</b></p>
                        <div class="card-trailer bg-base-100 shadow-xl image-full">
                            <figure><img src="${backdrop_url}" alt="trailer" style="!important; height: 170 !important; width: 300px"/></figure>
                            
                            <div class="card-trailer-body">
                                <button class="trailer-btn btn-circle">▶</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <a
            class="absolute left-0 top-1/2 p-4 -translate-y-4 bg-black/30 hover:bg-black/50 text-white hover:text-amber-500 cursor-pointer"
            onclick="moveSlide(-1)"
            >❮</a
            >
            <a
                class="absolute right-0 top-1/2 p-4 -translate-y-4 bg-black/30 hover:bg-black/50 text-white hover:text-amber-500 cursor-pointer"
                onclick="moveSlide(1)"
                >❯</a
            >
        </div>`
        movieCarousel6.innerHTML += movieEl2;
        i2++;
    })
}

/* Makes an API fetch call to get movies with whatever url you want -- this could be for upcoming movies, popular, etc */
function getLatestMovies(url) {
    fetch(url).then(res => res.json()).then(data => {
        //console.log(data.results);
        displayLatestMovies(data.results);
    }).catch(error => {
        console.log(error);
    })
}

/* Will loop through the data returned by the previous API call & display various pieces of info in HTML */
function displayLatestMovies(data) {
    let i5 = 0;
    movieCarousel5.innerHTML = '';

    data.forEach(movies => {
        const { title, poster_path, vote_average, overview, backdrop_path } = movies;
        const backdrop_url = POSTER_URL + backdrop_path;

        const movieEl2 = `
        <div class="carousel-item">
            <label for="my-modal5-${i5}" class="btn modal-button" style="height: 300px !important; padding-right: 0px !important; padding-left: 0px !important; margin-right: 10px !important; margin-left: 10px !important; margin-bottom: 10px !important; padding-bottom: 0px !important; width: 200px !important;">
            <img src="${POSTER_URL + poster_path}" alt="poster" style="margin-right: 0px !important; height: 300px !important; width: 200px !important;">
            </label>
            <input type="checkbox" class="modal-toggle" id="my-modal5-${i5}" />
            <div class="modal">
                <div class="modal-box bg-gradient-to-t bg-gradient-to-t from-zinc-900 relative w-full max-w-5xl h-full">
                    <label
                        for="my-modal5-${i5}"
                        class="btn btn-sm btn-circle absolute right-2 top-2"
                        >✕
                    </label>
                    <div class="card bg-base-100 shadow-xl image-full">
                        <figure> <img src="${backdrop_url}" alt="poster" style="margin-right: 0px !important; height: 400px !important; width: 970px !important;"></img> </figure>
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

                    <div class="tabs tabs-center">
                        <a class="tab tab-lg tab-bordered">See Also</a>
                        <a class="tab tab-lg tab-bordered tab-active">More Info</a> 
                        <a class="tab tab-lg tab-bordered">Reviews</a>
                    </div>

                    <br/><br/>
                    <div class="absolute right-10">
                        <p><b>Trailer</b></p>
                        <div class="card-trailer bg-base-100 shadow-xl image-full">
                            <figure><img src="${backdrop_url}" alt="trailer" style="!important; height: 170 !important; width: 300px"/></figure>
                            
                            <div class="card-trailer-body">
                                <button class="trailer-btn btn-circle">▶</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <a
            class="absolute left-0 top-1/2 p-4 -translate-y-4 bg-black/30 hover:bg-black/50 text-white hover:text-amber-500 cursor-pointer"
            onclick="moveSlide(-1)"
            >❮</a
            >
            <a
                class="absolute right-0 top-1/2 p-4 -translate-y-4 bg-black/30 hover:bg-black/50 text-white hover:text-amber-500 cursor-pointer"
                onclick="moveSlide(1)"
                >❯</a
            >
        </div>`
        movieCarousel5.innerHTML += movieEl2;
        i5++;
    })
}

/* Makes an API fetch call to get movies with whatever url you want -- this could be for upcoming movies, popular, etc */
function getUpcomingMovies(url) {
    fetch(url).then(res => res.json()).then(data => {
        console.log(data.results);
        displayUpcomingMovies(data.results);
    }).catch(error => {
        console.log(error);
    })
}

/* Will loop through the data returned by the previous API call & display various pieces of info in HTML */
function displayUpcomingMovies(data) {
    let i7 = 0;
    movieCarousel7.innerHTML = '';

    data.forEach(movies => {
        const { title, poster_path, vote_average, overview, backdrop_path } = movies;
        const backdrop_url = POSTER_URL + backdrop_path;

        const movieEl2 = `
        <div class="carousel-item">
            <label for="my-modal7-${i7}" class="btn modal-button" style="height: 300px !important; padding-right: 0px !important; padding-left: 0px !important; margin-right: 10px !important; margin-left: 10px !important; margin-bottom: 10px !important; padding-bottom: 0px !important; width: 200px !important;">
            <img src="${POSTER_URL + poster_path}" alt="poster" style="margin-right: 0px !important; height: 300px !important; width: 200px !important;">
            </label>
            <input type="checkbox" class="modal-toggle" id="my-modal7-${i7}" />
            <div class="modal">
                <div class="modal-box bg-gradient-to-t bg-gradient-to-t from-zinc-900 relative w-full max-w-5xl h-full">
                    <label
                        for="my-modal7-${i7}"
                        class="btn btn-sm btn-circle absolute right-2 top-2"
                        >✕
                    </label>
                    <div class="card bg-base-100 shadow-xl image-full">
                        <figure> <img src="${backdrop_url}" alt="poster" style="margin-right: 0px !important; height: 400px !important; width: 970px !important;"></img> </figure>
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

                    <div class="tabs tabs-center">
                        <a class="tab tab-lg tab-bordered">See Also</a>
                        <a class="tab tab-lg tab-bordered tab-active">More Info</a> 
                        <a class="tab tab-lg tab-bordered">Reviews</a>
                    </div>

                    <br/><br/>
                    <div class="absolute right-10">
                        <p><b>Trailer</b></p>
                        <div class="card-trailer bg-base-100 shadow-xl image-full">
                            <figure><img src="${backdrop_url}" alt="trailer" style="!important; height: 170 !important; width: 300px"/></figure>
                            
                            <div class="card-trailer-body">
                                <button class="trailer-btn btn-circle">▶</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <a
            class="absolute left-0 top-1/2 p-4 -translate-y-4 bg-black/30 hover:bg-black/50 text-white hover:text-amber-500 cursor-pointer"
            onclick="moveSlide(-1)"
            >❮</a
            >
            <a
                class="absolute right-0 top-1/2 p-4 -translate-y-4 bg-black/30 hover:bg-black/50 text-white hover:text-amber-500 cursor-pointer"
                onclick="moveSlide(1)"
                >❯</a
            >
        </div>`
        movieCarousel7.innerHTML += movieEl2;
        i7++;
    })
}

/* Makes an API fetch call to get movies with whatever url you want -- this could be for upcoming movies, popular, etc */
function getTrendingTV(url) {
    fetch(url).then(res => res.json()).then(data => {
        console.log(data.results);
        displayTrendingTV(data.results);
    }).catch(error => {
        console.log(error);
    })
}

/* Will loop through the data returned by the previous API call & display various pieces of info in HTML */
function displayTrendingTV(data) {
    let i3 = 0;
    movieCarousel3.innerHTML = '';

    data.forEach(movies => {
        const { name, poster_path, vote_average, overview, backdrop_path, first_air_date } = movies;
        const backdrop_url = POSTER_URL + backdrop_path;

        const movieEl2 = `
        <div class="carousel-item">
            <label for="my-modal3-${i3}" class="btn modal-button" style="height: 300px !important; padding-right: 0px !important; padding-left: 0px !important; margin-right: 10px !important; margin-left: 10px !important; margin-bottom: 10px !important; padding-bottom: 0px !important; width: 200px !important;">
            <img src="${POSTER_URL + poster_path}" alt="poster" style="margin-right: 0px !important; height: 300px !important; width: 200px !important;">
            </label>
            <input type="checkbox" class="modal-toggle" id="my-modal3-${i3}" />
            <div class="modal">
                <div class="modal-box bg-gradient-to-t bg-gradient-to-t from-zinc-900 relative w-full max-w-5xl h-full">
                    <label
                        for="my-modal3-${i3}"
                        class="btn btn-sm btn-circle absolute right-2 top-2"
                        >✕
                    </label>
                    <div class="card bg-base-100 shadow-xl image-full">
                        <figure> <img src="${backdrop_url}" alt="poster" style="margin-right: 0px !important; height: 400px !important; width: 970px !important;"></img> </figure>
                        <div class="card-body">
                            <h1 class="card-title style="text-align: center !important;">
                                <font size="+100">${name}</font>
                            </h1>
                            <br/>
                            <h3><b>Overview</b></h3>
                            <p>${overview}</p>
                            <br /><br />
                            <p class="info"><b>Release Date:</b> ${first_air_date} | <b>Rating:</b> ${vote_average} / 10</p>
                        </div>
                    </div>

                    <div class="tabs tabs-center">
                        <a class="tab tab-lg tab-bordered">See Also</a>
                        <a class="tab tab-lg tab-bordered tab-active">More Info</a> 
                        <a class="tab tab-lg tab-bordered">Reviews</a>
                    </div>

                    <br/><br/>
                    <div class="absolute right-10">
                        <p><b>Trailer</b></p>
                        <div class="card-trailer bg-base-100 shadow-xl image-full">
                            <figure><img src="${backdrop_url}" alt="trailer" style="!important; height: 170 !important; width: 300px"/></figure>
                            
                            <div class="card-trailer-body">
                                <button class="trailer-btn btn-circle">▶</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <a
            class="absolute left-0 top-1/2 p-4 -translate-y-4 bg-black/30 hover:bg-black/50 text-white hover:text-amber-500 cursor-pointer"
            onclick="moveSlide(-1)"
            >❮</a
            >
            <a
                class="absolute right-0 top-1/2 p-4 -translate-y-4 bg-black/30 hover:bg-black/50 text-white hover:text-amber-500 cursor-pointer"
                onclick="moveSlide(1)"
                >❯</a
            >
        </div>`
        movieCarousel3.innerHTML += movieEl2;
        i3++;
    })
}

/* Makes an API fetch call to get movies with whatever url you want -- this could be for upcoming movies, popular, etc */
function getTopTV(url) {
    fetch(url).then(res => res.json()).then(data => {
        console.log(data.results);
        displayTopTV(data.results);
    }).catch(error => {
        console.log(error);
    })
}

/* Will loop through the data returned by the previous API call & display various pieces of info in HTML */
function displayTopTV(data) {
    let i4 = 0;
    movieCarousel4.innerHTML = '';

    data.forEach(movies => {
        const { name, poster_path, vote_average, overview, backdrop_path, first_air_date } = movies;
        const backdrop_url = POSTER_URL + backdrop_path;

        const movieEl2 = `
        <div class="carousel-item">
            <label for="my-modal4-${i4}" class="btn modal-button" style="height: 300px !important; padding-right: 0px !important; padding-left: 0px !important; margin-right: 10px !important; margin-left: 10px !important; margin-bottom: 10px !important; padding-bottom: 0px !important; width: 200px !important;">
            <img src="${POSTER_URL + poster_path}" alt="poster" style="margin-right: 0px !important; height: 300px !important; width: 200px !important;">
            </label>
            <input type="checkbox" class="modal-toggle" id="my-modal4-${i4}" />
            <div class="modal">
                <div class="modal-box bg-gradient-to-t bg-gradient-to-t from-zinc-900 relative w-full max-w-5xl h-full">
                    <label
                        for="my-modal4-${i4}"
                        class="btn btn-sm btn-circle absolute right-2 top-2"
                        >✕
                    </label>
                    <div class="card bg-base-100 shadow-xl image-full">
                        <figure> <img src="${backdrop_url}" alt="poster" style="margin-right: 0px !important; height: 400px !important; width: 970px !important;"></img> </figure>
                        <div class="card-body">
                            <h1 class="card-title style="text-align: center !important;">
                                <font size="+100">${name}</font>
                            </h1>
                            <br/>
                            <h3><b>Overview</b></h3>
                            <p>${overview}</p>
                            <br /><br />
                            <p class="info"><b>Release Date:</b> ${first_air_date} | <b>Rating:</b> ${vote_average} / 10</p>
                        </div>
                    </div>

                    <div class="tabs tabs-center">
                        <a class="tab tab-lg tab-bordered">See Also</a>
                        <a class="tab tab-lg tab-bordered tab-active">More Info</a> 
                        <a class="tab tab-lg tab-bordered">Reviews</a>
                    </div>

                    <br/><br/>
                    <div class="absolute right-10">
                        <p><b>Trailer</b></p>
                        <div class="card-trailer bg-base-100 shadow-xl image-full">
                            <figure><img src="${backdrop_url}" alt="trailer" style="!important; height: 170 !important; width: 300px"/></figure>
                            
                            <div class="card-trailer-body">
                                <button class="trailer-btn btn-circle">▶</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <a
            class="absolute left-0 top-1/2 p-4 -translate-y-4 bg-black/30 hover:bg-black/50 text-white hover:text-amber-500 cursor-pointer"
            onclick="moveSlide(-1)"
            >❮</a
            >
            <a
                class="absolute right-0 top-1/2 p-4 -translate-y-4 bg-black/30 hover:bg-black/50 text-white hover:text-amber-500 cursor-pointer"
                onclick="moveSlide(1)"
                >❯</a
            >
        </div>`
        movieCarousel4.innerHTML += movieEl2;
        i4++;
    })
}

/* Makes an API fetch call to get movies with whatever url you want -- this could be for upcoming movies, popular, etc */
function getAiringTV(url) {
    fetch(url).then(res => res.json()).then(data => {
        console.log(data.results);
        displayAiringTV(data.results);
    }).catch(error => {
        console.log(error);
    })
}

/* Will loop through the data returned by the previous API call & display various pieces of info in HTML */
function displayAiringTV(data) {
    let i8 = 0;
    movieCarousel8.innerHTML = '';

    data.forEach(movies => {
        const { name, poster_path, vote_average, overview, backdrop_path, first_air_date } = movies;
        const backdrop_url = POSTER_URL + backdrop_path;

        const movieEl2 = `
        <div class="carousel-item">
            <label for="my-modal8-${i8}" class="btn modal-button" style="height: 300px !important; padding-right: 0px !important; padding-left: 0px !important; margin-right: 10px !important; margin-left: 10px !important; margin-bottom: 10px !important; padding-bottom: 0px !important; width: 200px !important;">
            <img src="${POSTER_URL + poster_path}" alt="poster" style="margin-right: 0px !important; height: 300px !important; width: 200px !important;">
            </label>
            <input type="checkbox" class="modal-toggle" id="my-modal8-${i8}" />
            <div class="modal">
                <div class="modal-box bg-gradient-to-t bg-gradient-to-t from-zinc-900 relative w-full max-w-5xl h-full">
                    <label
                        for="my-modal8-${i8}"
                        class="btn btn-sm btn-circle absolute right-2 top-2"
                        >✕
                    </label>
                    <div class="card bg-base-100 shadow-xl image-full">
                        <figure> <img src="${backdrop_url}" alt="poster" style="margin-right: 0px !important; height: 400px !important; width: 970px !important;"></img> </figure>
                        <div class="card-body">
                            <h1 class="card-title style="text-align: center !important;">
                                <font size="+100">${name}</font>
                            </h1>
                            <br/>
                            <h3><b>Overview</b></h3>
                            <p>${overview}</p>
                            <br /><br />
                            <p class="info"><b>Release Date:</b> ${first_air_date} | <b>Rating:</b> ${vote_average} / 10</p>
                        </div>
                    </div>

                    <div class="tabs tabs-center">
                        <a class="tab tab-lg tab-bordered">See Also</a>
                        <a class="tab tab-lg tab-bordered tab-active">More Info</a> 
                        <a class="tab tab-lg tab-bordered">Reviews</a>
                    </div>

                    <br/><br/>
                    <div class="absolute right-10">
                        <p><b>Trailer</b></p>
                        <div class="card-trailer bg-base-100 shadow-xl image-full">
                            <figure><img src="${backdrop_url}" alt="trailer" style="!important; height: 170 !important; width: 300px"/></figure>
                            
                            <div class="card-trailer-body">
                                <button class="trailer-btn btn-circle">▶</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <a
            class="absolute left-0 top-1/2 p-4 -translate-y-4 bg-black/30 hover:bg-black/50 text-white hover:text-amber-500 cursor-pointer"
            onclick="moveSlide(-1)"
            >❮</a
            >
            <a
                class="absolute right-0 top-1/2 p-4 -translate-y-4 bg-black/30 hover:bg-black/50 text-white hover:text-amber-500 cursor-pointer"
                onclick="moveSlide(1)"
                >❯</a
            >
        </div>`
        movieCarousel8.innerHTML += movieEl2;
        i8++;
    })
}