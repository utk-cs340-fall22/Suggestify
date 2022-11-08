/* Login box */
var x = document.getElementById("login");
var y = document.getElementById("register");
var z = document.getElementById("btn");

function register() {
  x.style.left = "-400px";
  y.style.left = "50px";
  z.style.left = "110px";
}

function login() {
  x.style.left = "50px";
  y.style.left = "450px";
  z.style.left = "0";
}

/* This will need to be stored somewhere else at some point for security reasons */
const API_KEY = "api_key=bb1d4e0661af455e02af1ea99fb85fcb";
const BASE_URL = "https://api.themoviedb.org/3/";

/* This can be formatted to include whatever you want -- 'movie/upcoming' is just a placeholder for now */
const API_URL =
  BASE_URL + "movie/upcoming?" + API_KEY + "&language=en-US&page=1";

/* After this URL, add the posterURL return from the API */
const POSTER_URL = "https://image.tmdb.org/t/p/original/";

getMovies(API_URL);

/* Makes an API fetch call to get movies with whatever url you want -- this could be for upcoming movies, popular, etc */
/* This will fetch the URL passed to it and will retrieve a list of movies. It will then loop through each movie, use its ID to construct the DETAIL_URL, and make another API call */
/* This second call will return even more information about each movie and will call displayMovies on each movie to display them with access to all of the information retrieved */
function getMovies(url) {
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
            displayMovies(data);
          });
      });
    })
    .catch((error) => {
      console.log(error);
    });
}

/* Passed a movie, which will contain all of the needed information about the individual movie (runtime, videos, etc) */
function displayMovies(data) {
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
                        <figure> <img src="${backdrop_url}" alt="poster" style="margin-right: 0px !important; height: 400px !important; width: 970px !important;"></img> </figure>
                        <div class="card-body">
                            <h1 class="card-title style="text-align: center !important;">
                                <font size="+100">${title}</font>
                            </h1>
                            <br/>
                            <h3><b>Overview</b></h3>
                            <p>${overview}</p>
                            <br /><br />
                            <p class="info"><b>Release Date:</b> ${release_date} | <b>Rating:</b> ${vote_average} / 10 | <b>Runtime:</b> ${runtime} minutes</p>
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
        </div>`;
  movieCarousel.innerHTML += movieEl;
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
  const slides = document.getElementsByClassName("slide");
  const dots = document.getElementsByClassName("dot");

  if (n > slides.length) {
    slideIndex = 1;
  }
  if (n < 1) {
    slideIndex = slides.length;
  }

  // hide all slides
  for (i = 0; i < slides.length; i++) {
    slides[i].classList.add("hidden");
  }

  // remove active status from all dots
  for (i = 0; i < dots.length; i++) {
    dots[i].classList.remove("bg-yellow-500");
    dots[i].classList.add("bg-green-600");
  }

  // show the active slide
  slides[slideIndex - 1].classList.remove("hidden");

  // highlight the active dot
  dots[slideIndex - 1].classList.remove("bg-green-600");
  dots[slideIndex - 1].classList.add("bg-yellow-500");
}
