
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
const SEARCH_QUERY = '&query=searchTerm';
/* This can be formatted to include whatever you want -- 'movie/upcoming' is just a placeholder for now */
const API_URL = BASE_URL + 'movie/upcoming?' + API_KEY + '&language=en-US&page=1';

const searchURL = BASE_URL + '/search/multi?' + API_KEY + '&language=en-US&page=1&query=';
/* After this URL, add the posterURL return from the API */
const POSTER_URL = 'https://image.tmdb.org/t/p/original/';

const form = document.getElementById('form');

form.addEventListener('submit', (e) => {
    e.preventDefault();

    const searchTerm = search.value;
    const url = searchURL + searchTerm + '&include_adult=false';
    if(searchTerm){
        fetch(url)
		.then(res => res.json())
		.then(data => {
			// console.log('Movies: ', data);
			data.results.forEach(movie => {
                search.innerHTML = "";
				/* Append to this response to get multiple things to return in one request */
				/* This will get all details, credits, similar movies, and images */
				const DETAIL_URL =
					BASE_URL +
					'movie/' +
					movie.id +
					'?' +
					API_KEY +
					'&language=en-US&append_to_response=videos,credits,similar,images,reviews';
				fetch(DETAIL_URL)
					.then(res => res.json())
					.then(data => {
						displaySearchMovies(data);
					});
			});
		})
		.catch(error => {
			console.log(error);
		});
    }

})

function displaySearchMovies(movie) {
	const {
		title,
		poster_path,
		vote_average,
		overview,
		backdrop_path,
		release_date,
		runtime,
		revenue,
	} = movie;

	const backdropURL = POSTER_URL + backdrop_path;

	const movieEl = document.createElement('div');
	movieEl.classList.add('movie');

	movieEl.innerHTML = `
    <label for="${title}" class="btn modal-button" style="height: 400px !important; padding-right: 0px !important; padding-left: 0px !important; margin-right: 10px !important; margin-left: 10px !important; margin-bottom: 10px !important; padding-bottom: 0px !important; width: 250px !important;">
        <img src="${
					POSTER_URL + poster_path
				}" alt="poster" style="margin-right: 0px !important; height: 400px !important; width: 250px !important;">
        </label>
        <i class="heart-icon fa-regular fa-heart relative bottom-[4rem] right-[4rem] text-4xl text-white hover: cursor-pointer" aria-hidden="true"></i>
        <input type="checkbox" id="${title}" class="modal-toggle" />
        <div class="modal">
          <div class="modal-box w-full max-w-5xl h-full">
            <div class="card w-96 bg-base-100 shadow-xl image-full" style="width: 970px !important; height: 400px !important;">
              <figure>            
                <img src="${backdropURL}" alt="backDrop" style="width: 970px !important; height: 500px !important; margin-right: 0px !important; border-radius: 0px !important; border-width: 0px !important; padding: 1px 0px 1px 1px !important;"></img>
              </figure>
              <div class="card-body">
                <h1 class="card-title" style="text-align: center !important;">
                <font size="+100">${title}</font> 
                </h1>
                <br/>
                <h3> <b> Overview </b> </h3>
                <p>${overview}</p>
                <br/><br/>
                <p><b>Release Date:</b> ${release_date} | <b>Rating:</b> ${vote_average} / 10 | <b>Runtime:</b> ${runtime} minutes</p>
              </div>
            </div>
            <div class="flex justify-center w-full py-2 gap-2">
              <a href="#item1${title}" class="btn btn-xs">More Info</a> 
              <a href="#item2${title}" class="btn btn-xs">See Also</a> 
              <a href="#item3${title}" class="btn btn-xs">Reviews</a> 
            </div>
          <div class="carousel w-full">
            <div id="item1${title}" class="carousel-item w-full">
              <div class="card w-96 bg-base-100 shadow-xl">
                <div class="card-body">
                  <h1><b>More Info</b></h1>
                  <p>Revenue: $${revenue}</p>
                </div>
              </div>
            </div> 
            <div id="item2${title}" class="carousel-item w-full">
              <div class="card w-96 bg-base-100 shadow-xl">
                <div class="card-body">
                <h1><b>See Also</b></h1>
                </div>
              </div>
            </div> 
            <div id="item3${title}" class="carousel-item w-full">
            <div class="card w-96 bg-base-100 shadow-xl">
              <div class="card-body">
              <h1><b>Reviews</b></h1>
              </div>
            </div>
          </div> 
        </div> 
        <div class="modal-action">
          <label for="${title}" class="btn btn-sm btn-circle absolute right-2 top-2">✕</label>
        </div>
      </div>
    </div>`;
	main.appendChild(movieEl);

	/* Heart functionality */
	let hIcon = document.querySelectorAll('.heart-icon');
	hIcon.forEach((icon, index) => {
		icon.addEventListener('click', () => {
			if (icon.classList.contains('fa-regular')) {
				icon.classList.remove('fa-regular');
				icon.classList.add('fa-solid');
				addMovieToFirestore(
					hearts[index].movieId,
					hearts[index].movieTitle,
					hearts[index].release,
					hearts[index].description,
					'true'
				);
				count++;
				document.getElementsByClassName('badge')[0].innerHTML = count;
			} else {
				icon.classList.remove('fa-solid');
				icon.classList.add('fa-regular');
				// deleteMovieFromFirestore(hearts[index].movieTitle);
				count--;
				document.getElementsByClassName('badge')[0].innerHTML = count;
			}
		});
	});
}

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
        </div>`
        movieCarousel.innerHTML += movieEl;
        i++;
    })
}

let slideIndex = 1;
showSlide(slideIndex);

// change slide with the prev/next button
function moveSlide(moveStep) {
	showSlide((slideIndex += moveStep));
}

// change slide with the dots
function currentSlide(n) {
	showSlide((slideIndex = n));
}

function showSlide(n) {
	let i;
	const slides = document.getElementsByClassName('slide');
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