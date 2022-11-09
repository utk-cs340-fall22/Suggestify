/* This will need to be stored somewhere else at some point for security reasons */
const API_KEY = "api_key=bb1d4e0661af455e02af1ea99fb85fcb";
const BASE_URL = "https://api.themoviedb.org/3/";
/* This can be formatted to include whatever you want -- 'movie/upcoming' is just a placeholder for now */
const API_URL =
  BASE_URL +
  "discover/movie?" +
  API_KEY +
  "&language=en-US&sort_by=popularity.desc&page=1";

/* After this URL, add the posterURL return from the API */
const POSTER_URL = "https://image.tmdb.org/t/p/original/";

/* After the v= comes the key returned by the api call to get all videos for the movie */
const YOUTUBE_TRAILER_URL = "https://youtube.com/watch?v=";
const GENRE_URL = BASE_URL + "genre/movie/list?" + API_KEY + "&language=en-US";

/* Global genre array for filtering -- holds the id value of each genre selected by the user */
var selectedGenreFilter = [];

getGenres(GENRE_URL);
getMovies(API_URL);

/* Function will call the API to get all available movie genres -- will then call displayGenres on the returned data */
function getGenres(url) {
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      console.log("Genres: ", data.genres);
      displayGenres(data.genres);
    })
    .catch((error) => {
      console.log(error);
    });
}

/* Function will create a button for each of the genres and display them */
/* It also adds the button functionality and the filtering */
function displayGenres(genres) {
  document.getElementById("genreTags").innerHTML = "";

  for (const element of genres) {
    const buttonEl = document.createElement("div");
    buttonEl.classList.add("genreName");

    /* *** Functionality for clicking a filter to 'activate it' and clicking it again to 'deactivate it' *** */
    /* On 'click', if the global selectedGenreFilter array is empty, this will store the genre into the array */
    /* Otherwise, if it already includes the genre in the array, you will loop through and remove it */
    buttonEl.addEventListener("click", () => {
      if (selectedGenreFilter.length == 0) {
        selectedGenreFilter.push(element.id);
      } else if (selectedGenreFilter.includes(element.id)) {
        for (var i = 0; i < selectedGenreFilter.length; i++) {
          if (selectedGenreFilter[i] == element.id) {
            selectedGenreFilter.splice(i, 1);
          }
        }
      } else selectedGenreFilter.push(element.id);

      /* Constructs the new URL containing the filters */
      /* Does this by connecting each genre in the array into one string, seperated by commas and appending it to the end of the API call */
      const FILTERED_URL =
        BASE_URL +
        "discover/movie?" +
        API_KEY +
        "&language=en-US&sort_by=popularity.desc&page=1&with_genres=" +
        selectedGenreFilter.join(",");

      main.innerHTML = "";
      getMovies(FILTERED_URL);

      highlightSelectedFilter();
    });

    /* This just constructs the html for each of the filter buttons & inserts them into the genreTags div in movies.html */
    buttonEl.innerHTML = `
	<button class="btn glass" id="${element.id}"style="margin-bottom: 10px !important; margin-right: 10px !important;">
			<p>${element.name}</p>
		</button>`;

    document.getElementById("genreTags").appendChild(buttonEl);
  }
}

/* This function adds the functionality of clicking a filter button and having it highlighted to represent 'active' */
function highlightSelectedFilter() {
  /* Finds all filter buttons (under the class .btn.glass from daisyUI) and stores them into a variable */
  const highlightedButtons = document.querySelectorAll(".btn.glass");

  /* If the selected filter button was already highlighted, but deactivated, then this will 'un-highlight' it */
  highlightedButtons.forEach((button) => {
    button.classList.remove("highlight");
  });

  /* If there are filters active, this will loop through the global array and add the CSS class 'highlighted' to each button */
  if (selectedGenreFilter.length != 0) {
    selectedGenreFilter.forEach((genre) => {
      document.getElementById(genre).classList.add("highlight");
    });
  }
}

/* Makes an API fetch call to get movies with whatever url you want -- this could be for upcoming movies, popular, etc */
function getMovies(url) {
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      console.log("Movies: ", data);
      data.results.forEach((movie) => {
        /* Append to this response to get multiple things to return in one request */
        /* This will get all details, credits, similar movies, and images */
        const DETAIL_URL =
          BASE_URL +
          "movie/" +
          movie.id +
          "?" +
          API_KEY +
          "&language=en-US&append_to_response=videos,credits,similar,images,reviews";
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

function displayMovies(movie) {
  console.log("Singular Movie -------", movie);
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

  const movieEl = document.createElement("div");
  movieEl.classList.add("movie");

  movieEl.innerHTML = `
    <label for="${title}" class="btn modal-button" style="height: 400px !important; padding-right: 0px !important; padding-left: 0px !important; margin-right: 10px !important; margin-left: 10px !important; margin-bottom: 10px !important; padding-bottom: 0px !important; width: 250px !important;">
        <img src="${
          POSTER_URL + poster_path
        }" alt="poster" style="margin-right: 0px !important; height: 400px !important; width: 250px !important;">
        </label>
        <i id="heart-icon" class="fa-regular fa-heart relative bottom-[4rem] right-[4rem] text-4xl text-white hover: cursor-pointer" aria-hidden="true"></i>
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
}

/* Code required for the page buttons */
var pageNumber = 1;

function buttonForward() {
  if (pageNumber < 100) {
    pageNumber++;

    document.getElementById("pageNumberButton").textContent = pageNumber;

    main.innerHTML = "";

    /* Will check to see if there are any filters applied. If so, it will construct the FILTERED_URL for the getMovies call for the next page */
    if (selectedGenreFilter.length != 0) {
      const FILTERED_URL =
        BASE_URL +
        "discover/movie?" +
        API_KEY +
        "&language=en-US&sort_by=popularity.desc&page=" +
        pageNumber +
        "&with_genres=" +
        encodeURI(selectedGenreFilter.join(","));

      console.log(FILTERED_URL);
      getMovies(FILTERED_URL);
    } else {
      const API_URL =
        BASE_URL +
        "discover/movie?" +
        API_KEY +
        "&language=en-US&sort_by=popularity.desc&page=" +
        pageNumber;

      getMovies(API_URL);
    }
  }
}
function buttonBackward() {
  if (pageNumber > 1) {
    pageNumber--;

    document.getElementById("pageNumberButton").textContent = pageNumber;

    main.innerHTML = "";

    /* Will check to see if there are any filters applied. If so, it will construct the FILTERED_URL for the getMovies call for the prev page */
    if (selectedGenreFilter.length != 0) {
      const FILTERED_URL =
        BASE_URL +
        "discover/movie?" +
        API_KEY +
        "&language=en-US&sort_by=popularity.desc&page=" +
        pageNumber +
        "&with_genres=" +
        encodeURI(selectedGenreFilter.join(","));

      console.log(FILTERED_URL);
      getMovies(FILTERED_URL);
    } else {
      const API_URL =
        BASE_URL +
        "discover/movie?" +
        API_KEY +
        "&language=en-US&sort_by=popularity.desc&page=" +
        pageNumber;

      getMovies(API_URL);
    }
  }
}
