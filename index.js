
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

const API_URL6 = BASE_URL + 'movie/now_playing?' + API_KEY + '&language=en-US&page=1';
getPlayingMovies(API_URL6);

const API_URL7 = BASE_URL + 'movie/upcoming?' + API_KEY + '&language=en-US&page=1';
getUpcomingMovies(API_URL7);

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
/* This will fetch the URL passed to it and will retrieve a list of movies. It will then loop through each movie, use its ID to construct the DETAIL_URL, and make another API call */
/* This second call will return even more information about each movie and will call displayMovies on each movie to display them with access to all of the information retrieved */
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

          const TRAILER_URL = 
            BASE_URL +
            "movie/" +
            movie.id +
            "videos?" +
            API_KEY;
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

/* Passed a movie, which will contain all of the needed information about the individual movie (runtime, videos, etc) */
function displayTrendingMovies(data) {
    console.log("Movie -- ", data);
    const {
        title,
        videos,
        poster_path,
        vote_average,
        overview,
        backdrop_path,
        release_date,
        runtime,
        budget,
        revenue,
        genres, 
        status,
        tagline,
        id
    } = data;
    
    const backdrop_url = POSTER_URL + backdrop_path;
    const specialChar = title + id;

    const movieEl = `
        <div class="carousel-item">
            <label for="my-modal-${title}" class="btn modal-button" style="height: 300px !important; padding-right: 0px !important; padding-left: 0px !important; margin-right: 10px !important; margin-left: 10px !important; margin-bottom: 10px !important; padding-bottom: 0px !important; width: 200px !important;">
            <img src="${
            POSTER_URL + poster_path
            }" alt="poster" style="margin-right: 0px !important; height: 300px !important; width: 200px !important;">
            </label>
            <input type="checkbox" class="modal-toggle" id="my-modal-${title}" />
            <div class="modal">
                <div class="modal-box bg-gradient-to-t bg-gradient-to-t from-zinc-900 relative w-full max-w-5xl h-full">
                    <label
                        for="my-modal-${title}"
                        class="btn btn-sm btn-circle absolute right-2 top-2"
                        >✕
                    </label>
                    <div class="card bg-base-100 shadow-xl image-full">
                        <figure> <img src="${backdrop_url}" alt="poster" style="margin-right: 0px !important; height: 400px !important; width: 960px !important;"></img> </figure>
                        <div class="card-body">
                            <h1 class="card-title style="text-align: center !important;">
                                <font size="+100">${title}</font>
                            </h1>
                            <br/>
                            <p>${tagline}<br><br><br><br><br><br><br><br><br></p>
                            <p class="info"><b>Release Date:</b> ${release_date} | <b>Rating:</b> ${vote_average} / 10 | <b>Runtime:</b> ${runtime} minutes</p>
                        </div>
                    </div>

                    <div class="flex justify-center w-full py-2 gap-2">
                        <a href="#item1${title}" class="btn btn-xs">Details</a> 
                        <a href="#item2${title}" class="btn btn-xs">Reviews</a> 
                        <a href="#item3${title}" class="btn btn-xs">See Also</a>
                    </div>
                    <div class="carousel w-full">
                        <div id="item1${title}" class="carousel-item w-full">
                            <div class="carousel-card bg-base-100 shadow-xl">
                                <div class="carousel-card-body">
                                    <p><b>About This Movie</b><br><br><strong>${title}</strong><br>${overview}<br><br><b>Genre:</b> ${genres[0].name} | <b>Type: </b> Movie | <b>Status: </b>${status} | <b>Budget:</b> ${budget} | <b>Revenue:</b> ${revenue}<br><br><b>Where to watch: </b><br><br><br><b>Trailer: </b><br><br></p>
                                
                                    <div class="carousel-card-two absolute bottom-0 left-10 bg-base-100 shadow-xl" id="${specialChar}">
                                        <div class="carousel-card-two-body"></div>
                                    </div>
                                </div>
                            </div>
                        </div> 
                            <div id="item2${title}" class="carousel-item w-full">
                            <img src="https://placeimg.com/800/200/arch" class="w-full" />
                        </div> 
                        <div id="item3${title}" class="carousel-item w-full">
                            <img src="https://placeimg.com/800/200/arch" class="w-full" />
                        </div>
                    </div> 

                </div>
            </div>

            
            <a
            class="absolute left-0 top-1/2 p-4 -translate-y-4 bg-black/30 hover:bg-black/50 text-white hover:text-amber-500 cursor-pointer"
            onclick="moveSlide(-1)"
            >❮
            </a>
            <a
                class="absolute right-0 top-1/2 p-4 -translate-y-4 bg-black/30 hover:bg-black/50 text-white hover:text-amber-500 cursor-pointer"
                onclick="moveSlide(1)"
                >❯
            </a>

            <div class="" id=${specialChar}> </div> 
        </div>`;
    movieCarousel.innerHTML += movieEl;
    getTrailer(videos.results, specialChar);
}

/* Makes an API fetch call to get movies with whatever url you want -- this could be for upcoming movies, popular, etc */
function getTopMovies(url) {
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        data.results.forEach((movie) => {
          movieCarousel2.innerHTML = "";
  
          /* Append to this response to get multiple things to return in one request (append_to_response=...) */
          /* This will get all details, credits, similar movies, and images | Refer to API documentation for other things to append */
          const DETAIL_URL =
            BASE_URL +
            "movie/" +
            movie.id +
            "?" +
            API_KEY +
            "&language=en-US&append_to_response=videos,credits,similar,images";

          const TRAILER_URL = 
            BASE_URL +
            "movie/" +
            movie.id +
            "videos?" +
            API_KEY;
          fetch(DETAIL_URL)
            .then((res) => res.json())
            .then((data) => {
              displayTopMovies(data);
            });
        });
    })
    .catch((error) => {
    console.log(error);
    });
}

/* Will loop through the data returned by the previous API call & display various pieces of info in HTML */
function displayTopMovies(data) {
    console.log("Movie -- ", data);
    const {
        title,
        poster_path,
        vote_average,
        overview,
        backdrop_path,
        release_date,
        runtime,
        budget,
        revenue,
        genres, 
        status,
        tagline,
        id
    } = data;
    
    const backdrop_url = POSTER_URL + backdrop_path;
    const specialChar = title + id;

    const movieEl = `
        <div class="carousel-item">
            <label for="my-modal-${title}" class="btn modal-button" style="height: 300px !important; padding-right: 0px !important; padding-left: 0px !important; margin-right: 10px !important; margin-left: 10px !important; margin-bottom: 10px !important; padding-bottom: 0px !important; width: 200px !important;">
            <img src="${
            POSTER_URL + poster_path
            }" alt="poster" style="margin-right: 0px !important; height: 300px !important; width: 200px !important;">
            </label>
            <input type="checkbox" class="modal-toggle" id="my-modal-${title}" />
            <div class="modal">
                <div class="modal-box bg-gradient-to-t bg-gradient-to-t from-zinc-900 relative w-full max-w-5xl h-full">
                    <label
                        for="my-modal-${title}"
                        class="btn btn-sm btn-circle absolute right-2 top-2"
                        >✕
                    </label>
                    <div class="card bg-base-100 shadow-xl image-full">
                        <figure> <img src="${backdrop_url}" alt="poster" style="margin-right: 0px !important; height: 400px !important; width: 960px !important;"></img> </figure>
                        <div class="card-body">
                            <h1 class="card-title style="text-align: center !important;">
                                <font size="+100">${title}</font>
                            </h1>
                            <br/>
                            <p>${tagline}<br><br><br><br><br><br><br><br><br></p>
                            <p class="info"><b>Release Date:</b> ${release_date} | <b>Rating:</b> ${vote_average} / 10 | <b>Runtime:</b> ${runtime} minutes</p>
                        </div>
                    </div>


                    <div class="flex justify-center w-full py-2 gap-2">
                        <a href="#item1${title}" class="btn btn-xs">Details</a> 
                        <a href="#item2${title}" class="btn btn-xs">Reviews</a> 
                        <a href="#item3${title}" class="btn btn-xs">See Also</a>
                    </div>
                    <div class="carousel w-full">
                        <div id="item1${title}" class="carousel-item w-full">
                            <p><b>About This Movie</b><br><br><strong>${title}</strong><br>${overview}<br><br><b>Genre:</b> ${genres[0].name} | <b>Type: </b> Movie | <b>Status: </b>${status} | <b>Budget:</b> ${budget} | <b>Revenue:</b> ${revenue}<br><br><b>Where to watch: </b><br><br><br><b>Trailer: </b><br><br></p>
                        </div>  
                        
                        <div id="item2${title}" class="carousel-item w-full">
                            <img src="https://placeimg.com/800/200/arch" class="w-full" />
                        </div> 
                        <div id="item3${title}" class="carousel-item w-full">
                            <img src="https://placeimg.com/800/200/arch" class="w-full" />
                        </div> 
                        <div id="item4${title}" class="carousel-item w-full">
                            <img src="https://placeimg.com/800/200/arch" class="w-full" />
                        </div>
                    </div> 

                </div>
            </div>

            
            <a
            class="absolute left-0 top-1/2 p-4 -translate-y-4 bg-black/30 hover:bg-black/50 text-white hover:text-amber-500 cursor-pointer"
            onclick="moveSlide(-1)"
            >❮
            </a>
            <a
                class="absolute right-0 top-1/2 p-4 -translate-y-4 bg-black/30 hover:bg-black/50 text-white hover:text-amber-500 cursor-pointer"
                onclick="moveSlide(1)"
                >❯
            </a>

            <div class="" id=${specialChar}> </div> 
        </div>`;
    movieCarousel2.innerHTML += movieEl;
    getTrailer(videos.results, specialChar);
}

/* Makes an API fetch call to get movies with whatever url you want -- this could be for upcoming movies, popular, etc */
function getPlayingMovies(url) {
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        data.results.forEach((movie) => {
          movieCarousel6.innerHTML = "";
  
          /* Append to this response to get multiple things to return in one request (append_to_response=...) */
          /* This will get all details, credits, similar movies, and images | Refer to API documentation for other things to append */
          const DETAIL_URL =
            BASE_URL +
            "movie/" +
            movie.id +
            "?" +
            API_KEY +
            "&language=en-US&append_to_response=videos,credits,similar,images";

          const TRAILER_URL = 
            BASE_URL +
            "movie/" +
            movie.id +
            "videos?" +
            API_KEY;
          fetch(DETAIL_URL)
            .then((res) => res.json())
            .then((data) => {
              displayPlayingMovies(data);
            });
        });
    })
    .catch((error) => {
    console.log(error);
    });
}

/* Will loop through the data returned by the previous API call & display various pieces of info in HTML */
function displayPlayingMovies(data) {
    console.log("Movie -- ", data);
    const {
        title,
        poster_path,
        vote_average,
        overview,
        backdrop_path,
        release_date,
        runtime,
        budget,
        revenue,
        genres, 
        status,
        tagline
    } = data;
    
    const backdrop_url = POSTER_URL + backdrop_path;

    const movieEl = `
        <div class="carousel-item">
            <label for="my-modal-${title}" class="btn modal-button" style="height: 300px !important; padding-right: 0px !important; padding-left: 0px !important; margin-right: 10px !important; margin-left: 10px !important; margin-bottom: 10px !important; padding-bottom: 0px !important; width: 200px !important;">
            <img src="${
            POSTER_URL + poster_path
            }" alt="poster" style="margin-right: 0px !important; height: 300px !important; width: 200px !important;">
            </label>
            <input type="checkbox" class="modal-toggle" id="my-modal-${title}" />
            <div class="modal">
                <div class="modal-box bg-gradient-to-t bg-gradient-to-t from-zinc-900 relative w-full max-w-5xl h-full">
                    <label
                        for="my-modal-${title}"
                        class="btn btn-sm btn-circle absolute right-2 top-2"
                        >✕
                    </label>
                    <div class="card bg-base-100 shadow-xl image-full">
                        <figure> <img src="${backdrop_url}" alt="poster" style="margin-right: 0px !important; height: 400px !important; width: 960px !important;"></img> </figure>
                        <div class="card-body">
                            <h1 class="card-title style="text-align: center !important;">
                                <font size="+100">${title}</font>
                            </h1>
                            <br/>
                            <p>${tagline}<br><br><br><br><br><br><br><br><br></p>
                            <p class="info"><b>Release Date:</b> ${release_date} | <b>Rating:</b> ${vote_average} / 10 | <b>Runtime:</b> ${runtime} minutes</p>
                        </div>
                    </div>


                    <div class="flex justify-center w-full py-2 gap-2">
                        <a href="#item1${title}" class="btn btn-xs">Details</a> 
                        <a href="#item2${title}" class="btn btn-xs">Reviews</a> 
                        <a href="#item3${title}" class="btn btn-xs">See Also</a>
                    </div>
                    <div class="carousel w-full">
                        <div id="item1${title}" class="carousel-item w-full">
                            <p><b>About This Movie</b><br><br><strong>${title}</strong><br>${overview}<br><br><b>Genre:</b> ${genres[0].name} | <b>Type: </b> Movie | <b>Status: </b>${status} | <b>Budget:</b> ${budget} | <b>Revenue:</b> ${revenue}<br><br><b>Where to watch: </b><br><br><br><b>Trailer: </b></p>
                        </div> 
                            <div id="item2${title}" class="carousel-item w-full">
                            <img src="https://placeimg.com/800/200/arch" class="w-full" />
                        </div> 
                        <div id="item3${title}" class="carousel-item w-full">
                            <img src="https://placeimg.com/800/200/arch" class="w-full" />
                        </div> 
                        <div id="item4${title}" class="carousel-item w-full">
                            <img src="https://placeimg.com/800/200/arch" class="w-full" />
                        </div>
                    </div> 

                </div>
            </div>

            
            <a
            class="absolute left-0 top-1/2 p-4 -translate-y-4 bg-black/30 hover:bg-black/50 text-white hover:text-amber-500 cursor-pointer"
            onclick="moveSlide(-1)"
            >❮
            </a>
            <a
                class="absolute right-0 top-1/2 p-4 -translate-y-4 bg-black/30 hover:bg-black/50 text-white hover:text-amber-500 cursor-pointer"
                onclick="moveSlide(1)"
                >❯
            </a>
        </div>`;
    movieCarousel6.innerHTML += movieEl;
}

/* Makes an API fetch call to get movies with whatever url you want -- this could be for upcoming movies, popular, etc */
function getUpcomingMovies(url) {
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        data.results.forEach((movie) => {
          movieCarousel7.innerHTML = "";
  
          /* Append to this response to get multiple things to return in one request (append_to_response=...) */
          /* This will get all details, credits, similar movies, and images | Refer to API documentation for other things to append */
          const DETAIL_URL =
            BASE_URL +
            "movie/" +
            movie.id +
            "?" +
            API_KEY +
            "&language=en-US&append_to_response=videos,credits,similar,images";

          const TRAILER_URL = 
            BASE_URL +
            "movie/" +
            movie.id +
            "videos?" +
            API_KEY;
          fetch(DETAIL_URL)
            .then((res) => res.json())
            .then((data) => {
              displayUpcomingMovies(data);
            });
        });
    })
    .catch((error) => {
    console.log(error);
    });
}

/* Will loop through the data returned by the previous API call & display various pieces of info in HTML */
function displayUpcomingMovies(data) {
    console.log("Movie -- ", data);
    const {
        title,
        poster_path,
        vote_average,
        overview,
        backdrop_path,
        release_date,
        runtime,
        budget,
        revenue,
        genres, 
        status,
        tagline
    } = data;
    
    const backdrop_url = POSTER_URL + backdrop_path;

    const movieEl = `
        <div class="carousel-item">
            <label for="my-modal-${title}" class="btn modal-button" style="height: 300px !important; padding-right: 0px !important; padding-left: 0px !important; margin-right: 10px !important; margin-left: 10px !important; margin-bottom: 10px !important; padding-bottom: 0px !important; width: 200px !important;">
            <img src="${
            POSTER_URL + poster_path
            }" alt="poster" style="margin-right: 0px !important; height: 300px !important; width: 200px !important;">
            </label>
            <input type="checkbox" class="modal-toggle" id="my-modal-${title}" />
            <div class="modal">
                <div class="modal-box bg-gradient-to-t bg-gradient-to-t from-zinc-900 relative w-full max-w-5xl h-full">
                    <label
                        for="my-modal-${title}"
                        class="btn btn-sm btn-circle absolute right-2 top-2"
                        >✕
                    </label>
                    <div class="card bg-base-100 shadow-xl image-full">
                        <figure> <img src="${backdrop_url}" alt="poster" style="margin-right: 0px !important; height: 400px !important; width: 960px !important;"></img> </figure>
                        <div class="card-body">
                            <h1 class="card-title style="text-align: center !important;">
                                <font size="+100">${title}</font>
                            </h1>
                            <br/>
                            <p>${tagline}<br><br><br><br><br><br><br><br><br></p>
                            <p class="info"><b>Release Date:</b> ${release_date} | <b>Rating:</b> ${vote_average} / 10 | <b>Runtime:</b> ${runtime} minutes</p>
                        </div>
                    </div>


                    <div class="flex justify-center w-full py-2 gap-2">
                        <a href="#item1${title}" class="btn btn-xs">Details</a> 
                        <a href="#item2${title}" class="btn btn-xs">Reviews</a> 
                        <a href="#item3${title}" class="btn btn-xs">See Also</a>
                    </div>
                    <div class="carousel w-full">
                        <div id="item1${title}" class="carousel-item w-full">
                            <p><b>About This Movie</b><br><br><strong>${title}</strong><br>${overview}<br><br><b>Genre:</b> ${genres[0].name} | <b>Type: </b> Movie | <b>Status: </b>${status} | <b>Budget:</b> ${budget} | <b>Revenue:</b> ${revenue}<br><br><b>Where to watch: </b><br><br><br><b>Trailer: </b></p>
                        </div> 
                            <div id="item2${title}" class="carousel-item w-full">
                            <img src="https://placeimg.com/800/200/arch" class="w-full" />
                        </div> 
                        <div id="item3${title}" class="carousel-item w-full">
                            <img src="https://placeimg.com/800/200/arch" class="w-full" />
                        </div> 
                        <div id="item4${title}" class="carousel-item w-full">
                            <img src="https://placeimg.com/800/200/arch" class="w-full" />
                        </div>
                    </div> 

                </div>
            </div>

            
            <a
            class="absolute left-0 top-1/2 p-4 -translate-y-4 bg-black/30 hover:bg-black/50 text-white hover:text-amber-500 cursor-pointer"
            onclick="moveSlide(-1)"
            >❮
            </a>
            <a
                class="absolute right-0 top-1/2 p-4 -translate-y-4 bg-black/30 hover:bg-black/50 text-white hover:text-amber-500 cursor-pointer"
                onclick="moveSlide(1)"
                >❯
            </a>
        </div>`;
    movieCarousel7.innerHTML += movieEl;
}

/* Makes an API fetch call to get movies with whatever url you want -- this could be for upcoming movies, popular, etc */
function getTrendingTV(url) {
	fetch(url)
		.then(res => res.json())
		.then(data => {
			console.log('shows: ', data);
			data.results.forEach(tv => {
                movieCarousel3.innerHTML = "";
				/* Append to this response to get multiple things to return in one request */
				/* This will get all details, credits, similar tv shows, and images */
				const DETAIL_URL =
					BASE_URL +
					'tv/' +
					tv.id +
					'?' +
					API_KEY +
					'&language=en-US&append_to_response=videos,credits,similar,images,reviews';
				fetch(DETAIL_URL)
					.then(res => res.json())
					.then(data => {
						displayTrendingTV(data);
					});
			});
		})
		.catch(error => {
			console.log(error);
		});
}

/* Will loop through the data returned by the previous API call & display various pieces of info in HTML */
function displayTrendingTV(data) {
	const {
		name,
		poster_path,
		vote_average,
		overview,
		backdrop_path,
		first_air_date,
        budget,
		revenue,
		number_of_seasons,
		episode_run_time,
        tagline
	} = data;

	const backdrop_URL = POSTER_URL + backdrop_path;

	const showEl = `
        <div class="carousel-item">
            <label for="my-modal-${name}" class="btn modal-button" style="height: 300px !important; padding-right: 0px !important; padding-left: 0px !important; margin-right: 10px !important; margin-left: 10px !important; margin-bottom: 10px !important; padding-bottom: 0px !important; width: 200px !important;">
            <img src="${
            POSTER_URL + poster_path
            }" alt="poster" style="margin-right: 0px !important; height: 300px !important; width: 200px !important;">
            </label>
            <input type="checkbox" class="modal-toggle" id="my-modal-${name}" />
            <div class="modal">
                <div class="modal-box bg-gradient-to-t bg-gradient-to-t from-zinc-900 relative w-full max-w-5xl h-full">
                    <label
                        for="my-modal-${name}"
                        class="btn btn-sm btn-circle absolute right-2 top-2"
                        >✕
                    </label>
                    <div class="card bg-base-100 shadow-xl image-full">
                        <figure> <img src="${backdrop_URL}" alt="poster" style="margin-right: 0px !important; height: 400px !important; width: 960px !important;"></img> </figure>
                        <div class="card-body">
                            <h1 class="card-title style="text-align: center !important;">
                                <font size="+100">${name}</font>
                            </h1>
                            <br/>
                            <p>${tagline}<br><br><br><br><br><br><br><br><br></p>
                            <p class="info"><b>Release Date:</b> ${first_air_date} | <b>Rating:</b> ${vote_average} / 10 | <b>Episode Runtime:</b> ${episode_run_time} minutes | <b>Seasons: </b>${number_of_seasons}</p>
                        </div>
                    </div>


                    <div class="flex justify-center w-full py-2 gap-2">
                        <a href="#item1${name}" class="btn btn-xs">Details</a> 
                        <a href="#item2${name}" class="btn btn-xs">Reviews</a> 
                        <a href="#item3${name}" class="btn btn-xs">See Also</a>
                    </div>
                    <div class="carousel w-full">
                        <div id="item1${name}" class="carousel-item w-full">
                            <p><b>About This Show</b><br><br><strong>${name}</strong><br>${overview}<br><br><b>Genre:</b> | <b>Type: </b> Show | <b>Status: </b> | <b>Budget:</b> ${budget} | <b>Revenue:</b> ${revenue}<br><br><b>Where to watch: </b><br><br><br><b>Trailer: </b></p>
                        </div> 
                            <div id="item2${name}" class="carousel-item w-full">
                            <img src="https://placeimg.com/800/200/arch" class="w-full" />
                        </div> 
                        <div id="item3${name}" class="carousel-item w-full">
                            <img src="https://placeimg.com/800/200/arch" class="w-full" />
                        </div> 
                        <div id="item4${name}" class="carousel-item w-full">
                            <img src="https://placeimg.com/800/200/arch" class="w-full" />
                        </div>
                    </div> 

                </div>
        </div>

        
        <a
        class="absolute left-0 top-1/2 p-4 -translate-y-4 bg-black/30 hover:bg-black/50 text-white hover:text-amber-500 cursor-pointer"
        onclick="moveSlide(-1)"
        >❮
        </a>
        <a
            class="absolute right-0 top-1/2 p-4 -translate-y-4 bg-black/30 hover:bg-black/50 text-white hover:text-amber-500 cursor-pointer"
            onclick="moveSlide(1)"
            >❯
        </a>
    </div>`;
    movieCarousel3.innerHTML += showEl;
}

/* Makes an API fetch call to get movies with whatever url you want -- this could be for upcoming movies, popular, etc */
function getTopTV(url) {
	fetch(url)
		.then(res => res.json())
		.then(data => {
			console.log('shows: ', data);
			data.results.forEach(tv => {
                movieCarousel4.innerHTML = "";
				/* Append to this response to get multiple things to return in one request */
				/* This will get all details, credits, similar tv shows, and images */
				const DETAIL_URL =
					BASE_URL +
					'tv/' +
					tv.id +
					'?' +
					API_KEY +
					'&language=en-US&append_to_response=videos,credits,similar,images,reviews';
				fetch(DETAIL_URL)
					.then(res => res.json())
					.then(data => {
						displayTopTV(data);
					});
			});
		})
		.catch(error => {
			console.log(error);
		});
}

/* Will loop through the data returned by the previous API call & display various pieces of info in HTML */
function displayTopTV(data) {
	const {
		name,
		poster_path,
		vote_average,
		overview,
		backdrop_path,
		first_air_date,
        budget,
		revenue,
		number_of_seasons,
		episode_run_time,
        tagline
	} = data;

	const backdrop_URL = POSTER_URL + backdrop_path;

	const showEl = `
        <div class="carousel-item">
            <label for="my-modal-${name}" class="btn modal-button" style="height: 300px !important; padding-right: 0px !important; padding-left: 0px !important; margin-right: 10px !important; margin-left: 10px !important; margin-bottom: 10px !important; padding-bottom: 0px !important; width: 200px !important;">
            <img src="${
            POSTER_URL + poster_path
            }" alt="poster" style="margin-right: 0px !important; height: 300px !important; width: 200px !important;">
            </label>
            <input type="checkbox" class="modal-toggle" id="my-modal-${name}" />
            <div class="modal">
                <div class="modal-box bg-gradient-to-t bg-gradient-to-t from-zinc-900 relative w-full max-w-5xl h-full">
                    <label
                        for="my-modal-${name}"
                        class="btn btn-sm btn-circle absolute right-2 top-2"
                        >✕
                    </label>
                    <div class="card bg-base-100 shadow-xl image-full">
                        <figure> <img src="${backdrop_URL}" alt="poster" style="margin-right: 0px !important; height: 400px !important; width: 960px !important;"></img> </figure>
                        <div class="card-body">
                            <h1 class="card-title style="text-align: center !important;">
                                <font size="+100">${name}</font>
                            </h1>
                            <br/>
                            <p>${tagline}<br><br><br><br><br><br><br><br><br></p>
                            <p class="info"><b>Release Date:</b> ${first_air_date} | <b>Rating:</b> ${vote_average} / 10 | <b>Episode Runtime:</b> ${episode_run_time} minutes | <b>Seasons: </b>${number_of_seasons}</p>
                        </div>
                    </div>


                    <div class="flex justify-center w-full py-2 gap-2">
                        <a href="#item1${name}" class="btn btn-xs">Details</a> 
                        <a href="#item2${name}" class="btn btn-xs">Reviews</a> 
                        <a href="#item3${name}" class="btn btn-xs">See Also</a>
                    </div>
                    <div class="carousel w-full">
                        <div id="item1${name}" class="carousel-item w-full">
                            <p><b>About This Show</b><br><br><strong>${name}</strong><br>${overview}<br><br><b>Genre:</b> | <b>Type: </b> Show | <b>Status: </b> | <b>Budget:</b> ${budget} | <b>Revenue:</b> ${revenue}<br><br><b>Where to watch: </b><br><br><br><b>Trailer: </b></p>
                        </div> 
                            <div id="item2${name}" class="carousel-item w-full">
                            <img src="https://placeimg.com/800/200/arch" class="w-full" />
                        </div> 
                        <div id="item3${name}" class="carousel-item w-full">
                            <img src="https://placeimg.com/800/200/arch" class="w-full" />
                        </div> 
                        <div id="item4${name}" class="carousel-item w-full">
                            <img src="https://placeimg.com/800/200/arch" class="w-full" />
                        </div>
                    </div> 

                </div>
        </div>

        
        <a
        class="absolute left-0 top-1/2 p-4 -translate-y-4 bg-black/30 hover:bg-black/50 text-white hover:text-amber-500 cursor-pointer"
        onclick="moveSlide(-1)"
        >❮
        </a>
        <a
            class="absolute right-0 top-1/2 p-4 -translate-y-4 bg-black/30 hover:bg-black/50 text-white hover:text-amber-500 cursor-pointer"
            onclick="moveSlide(1)"
            >❯
        </a>
    </div>`;
    movieCarousel4.innerHTML += showEl;
}

async function getTrailer(videos, specialChar) {
    const YOUTUBE_TRAILER_URL = 'https://youtube.com/embed/';
    if (videos.length != 0) {
        videos.forEach(vid => {
            if (vid.name == "Official Trailer" || vid.name == "Official Trailer [Subtitled]" || vid.name == "Dub Trailer" || vid.name == "United States Trailer") {
                const trailer = YOUTUBE_TRAILER_URL + vid.key;
                const trailerHTML = `
                <iframe width="500" height="300"
                    src="${trailer}">
                <iframe>`;
                document.getElementById(specialChar).innerHTML = trailerHTML;
            }
        })
    }
}