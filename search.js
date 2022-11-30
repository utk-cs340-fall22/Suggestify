
const API_KEY = 'api_key=bb1d4e0661af455e02af1ea99fb85fcb';
const BASE_URL = 'https://api.themoviedb.org/3/';
const POSTER_URL = 'https://image.tmdb.org/t/p/original/';
const SEARCH_QUERY = '&query=searchTerm';
const searchURL = BASE_URL + '/search/multi?' + API_KEY + '&language=en-US&page=1&query=';

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
	document.getElementById("main").appendChild(movieEl);

}