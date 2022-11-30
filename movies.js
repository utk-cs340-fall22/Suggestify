const firebaseConfig = {
	apiKey: 'AIzaSyDGTFXLcJqWM4F3yWUXc4QalVBkT2Xg6Rg',
	authDomain: 'suggestify-6b974.firebaseapp.com',
	databaseURL: 'https://suggestify-6b974-default-rtdb.firebaseio.com',
	projectId: 'suggestify-6b974',
	storageBucket: 'suggestify-6b974.appspot.com',
	messagingSenderId: '287553553595',
	appId: '1:287553553595:web:c5e8adde4ca305cfaad59e',
	measurementId: 'G-30270TW59M',
};

/* Initialize app with firebase firestore */
firebase.initializeApp(firebaseConfig);
var db = firebase.firestore();

// addMovieToFirestore('Black Adam', '2022/11/7', 'a superhero', 'true');
async function addMovieToFirestore(
	movieId,
	movieTitle,
	releaseDate,
	overview,
	liked
) {
	db.collection('My List')
		.doc(movieTitle)
		.set({
			id: movieId,
			overview: overview,
			release_date: releaseDate,
			title: movieTitle,
			isLiked: liked,
		})
		.then(() => {
			console.log('Document successfully written - 1!', movieTitle);
		})
		.catch(error => {
			console.error('Error writing document: ', error);
		});
}

// getMoviesFromFirestore('Terrifier 2');
async function getMoviesFromFirestore(docName) {
	var docRef = db.collection('My List').doc(docName);

	docRef
		.get()
		.then(doc => {
			if (doc.exists) {
				console.log('Document data:', doc.data().isLiked);
			} else {
				console.log('No such document!', doc.data());
			}
		})
		.catch(error => {
			console.log('Error getting document:', error);
		});
}

// updateMovieFromFirestore('Black Adam', 'new value');
async function updateMovieFromFirestore(docName, newValue) {
	var docRef = db.collection('My List').doc(docName);

	return docRef
		.update({
			// only one field at a time can be updated
			title: newValue,
			// release_date: 'newValue',
			// overview: 'newValue',
			// isLiked: 'newValue',
		})
		.then(() => {
			console.log('Document successfully updated!', docName);
		})
		.catch(error => {
			// The document probably doesn't exist.
			console.error('Error updating document: ', error);
		});
}

// deleteMovieFromFirestore('movie name');
async function deleteMovieFromFirestore(docName) {
	db.collection('My List')
		.doc(docName)
		.delete()
		.then(() => {
			console.log('Document successfully deleted!', docName);
		})
		.catch(error => {
			console.error('Error removing document: ', error);
		});
}

/* This will need to be stored somewhere else at some point for security reasons */
const API_KEY = 'api_key=bb1d4e0661af455e02af1ea99fb85fcb';
const BASE_URL = 'https://api.themoviedb.org/3/';
/* This can be formatted to include whatever you want -- 'movie/upcoming' is just a placeholder for now */
const API_URL =
	BASE_URL +
	'discover/movie?' +
	API_KEY +
	'&language=en-US&sort_by=popularity.desc&page=1';

/* After this URL, add the posterURL return from the API */
const POSTER_URL = 'https://image.tmdb.org/t/p/original/';

/* After the v= comes the key returned by the api call to get all videos for the movie */
const YOUTUBE_TRAILER_URL = 'https://youtube.com/watch?v=';
const GENRE_URL = BASE_URL + 'genre/movie/list?' + API_KEY + '&language=en-US';

/* Global genre array for filtering -- holds the id value of each genre selected by the user */
var selectedGenreFilter = [];
let hearts = [];
let count = 0;

getGenres(GENRE_URL);
getMovies(API_URL);

/* Function will call the API to get all available movie genres -- will then call displayGenres on the returned data */
function getGenres(url) {
	fetch(url)
		.then(res => res.json())
		.then(data => {
			// console.log('Genres: ', data.genres);
			displayGenres(data.genres);
		})
		.catch(error => {
			console.log(error);
		});
}

/* Function will create a button for each of the genres and display them */
/* It also adds the button functionality and the filtering */
function displayGenres(genres) {
	document.getElementById('genreTags').innerHTML = '';

	for (const element of genres) {
		const buttonEl = document.createElement('div');
		buttonEl.classList.add('genreName');

		/* *** Functionality for clicking a filter to 'activate it' and clicking it again to 'deactivate it' *** */
		/* On 'click', if the global selectedGenreFilter array is empty, this will store the genre into the array */
		/* Otherwise, if it already includes the genre in the array, you will loop through and remove it */
		buttonEl.addEventListener('click', () => {
			if (selectedGenreFilter.length == 0) {
				selectedGenreFilter.push(element.id);
			} else if (selectedGenreFilter.includes(element.id)) {
				for (let i = 0; i < selectedGenreFilter.length; i++) {
					if (selectedGenreFilter[i] == element.id) {
						selectedGenreFilter.splice(i, 1);
					}
				}
			} else selectedGenreFilter.push(element.id);

			/* Constructs the new URL containing the filters */
			/* Does this by connecting each genre in the array into one string, seperated by commas and appending it to the end of the API call */
			const FILTERED_URL =
				BASE_URL +
				'discover/movie?' +
				API_KEY +
				'&language=en-US&sort_by=popularity.desc&page=1&with_genres=' +
				selectedGenreFilter.join(',');

			main.innerHTML = '';
			getMovies(FILTERED_URL);

			highlightSelectedFilter();
		});

		/* This just constructs the html for each of the filter buttons & inserts them into the genreTags div in movies.html */
		buttonEl.innerHTML = `
	<button class="btn glass" id="${element.id}"style="margin-bottom: 10px !important; margin-right: 10px !important;">
			<p>${element.name}</p>
		</button>`;

		document.getElementById('genreTags').appendChild(buttonEl);
	}
}

/* This function adds the functionality of clicking a filter button and having it highlighted to represent 'active' */
function highlightSelectedFilter() {
	/* Finds all filter buttons (under the class .btn.glass from daisyUI) and stores them into a variable */
	const highlightedButtons = document.querySelectorAll('.btn.glass');

	/* If the selected filter button was already highlighted, but deactivated, then this will 'un-highlight' it */
	highlightedButtons.forEach(button => {
		button.classList.remove('highlight');
	});

	/* If there are filters active, this will loop through the global array and add the CSS class 'highlighted' to each button */
	if (selectedGenreFilter.length != 0) {
		selectedGenreFilter.forEach(genre => {
			document.getElementById(genre).classList.add('highlight');
		});
	}
}

/* Makes an API fetch call to get movies with whatever url you want -- this could be for upcoming movies, popular, etc */
function getMovies(url) {
	fetch(url)
		.then(res => res.json())
		.then(data => {
			// console.log('Movies: ', data);
			data.results.forEach(movie => {
				/* Append to this response to get multiple things to return in one request */
				/* This will get all details, credits, similar movies, and images */
				const DETAIL_URL =
					BASE_URL +
					'movie/' +
					movie.id +
					'?' +
					API_KEY +
					'&language=en-US&append_to_response=videos,credits,similar,images,reviews,watch/providers';
				fetch(DETAIL_URL)
					.then(res => res.json())
					.then(data => {
						hearts.push({
							movieId: data.id,
							movieTitle: data.title,
							release: data.release_date,
							description: data.overview,
						});
						displayMovies(data);
					});
			});
		})
		.catch(error => {
			console.log(error);
		});
}

function displayMovies(movie) {
	const {
		id,
		title,
		poster_path,
		vote_average,
		overview,
		backdrop_path,
		release_date,
		runtime,
		budget,
		revenue,
		tagline,
		videos,
		reviews,
		genres,
		status,
		similar
	} = movie;
	

	const backdropURL = POSTER_URL + backdrop_path;
	const specialCharTrailer = id + title;
	const specialCharReviews = title + id;
	const specialCharWatchProviders = runtime + title + id;
	const specialCharSimilar = id + title + runtime;
	let movieGenre = '';
	let movieRevenue = '';
	let movieBudget = '';

	genres.forEach(genre => {
		movieGenre += genre.name + ", ";
	})

	if (revenue == 0) {
		movieRevenue = "N/A";
	} else {
		movieRevenue = "$" + revenue;
	}

	if (budget == 0) {
		movieBudget = "N/A";

	} else {
		movieBudget = "$" + budget;
	}

	const movieEl = document.createElement('div');
	movieEl.classList.add('movie');

	/* Loop through similar / reviews and display */

	movieEl.innerHTML = `
    <label for="${title}" class="btn modal-button" style="height: 400px !important; padding-right: 0px !important; padding-left: 0px !important; margin-right: 10px !important; margin-left: 10px !important; margin-bottom: 10px !important; padding-bottom: 0px !important; width: 250px !important;">
        <img src="${
					POSTER_URL + poster_path
				}" alt="poster" style="margin-right: 0px !important; height: 400px !important; width: 250px !important;">
        </label>
        <i class="heart-icon fa-regular fa-heart relative bottom-[4rem] right-[4rem] text-4xl text-white hover: cursor-pointer" aria-hidden="true"></i>
        <input type="checkbox" id="${title}" class="modal-toggle"/>
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
                <p>${tagline}</p>
                <br/><br/>
                <p><b>Release Date:</b> ${release_date} | <b>Rating:</b> ${vote_average} / 10 | <b>Runtime:</b> ${runtime} minutes</p>
              </div>
            </div>
            <div class="flex justify-center w-full py-2 gap-2">
              <a href="#item1${title}" class="btn btn-xs">Details</a> 
              <a href="#item3${title}" class="btn btn-xs">Reviews</a> 
			  <a href="#item2${title}" class="btn btn-xs">See Also</a> 
            </div>
          <div class="carousel w-full">
            <div id="item1${title}" class="carousel-item w-full">
              <div class="card w-96 bg-base-100 shadow-xl" style="width: 1000px !important; height: 500px !important;">
                <div class="card-body" style="padding-top: 0px !important;">
				  <h1><b>About this movie</b></h1>
				  <hr>
                  <h1><b>Description</b></h1>
				  <p>${overview}</p>
				  </br>
				  <p>
				  	<b>Genre</b>: ${movieGenre} |
					<b>Status</b>: ${status} |
					<b>Budget</b>: ${movieBudget} |
					<b>Revenue</b>: ${movieRevenue}
				  </p>
				  <p id="${specialCharWatchProviders}" style="
				  		display: flex !important;
						flex-direction: row !important;
						flex-wrap: wrap !important;
						justify-content: flex-start !important;
						align-items: center !important;">
						<b>Watch Providers: &nbsp; </b>
				  </p>
				  <div class="card-body" id="${specialCharTrailer}" style="width: 364px !important; right: auto !important; padding: 0px !important; margin-top: 20px !important;"> </div>
				  <br/>
                </div>
              </div>
            </div> 
            <div id="item3${title}" class="carousel-item w-full">
				<div id="${specialCharReviews}"></div>
			</div> 
		  <div id="item2${title}" class="carousel-item w-full">
			<div id="${specialCharSimilar}" style="flex-wrap:wrap;"></div>
        <div class="modal-action">
          <label for="${title}" class="btn btn-sm btn-circle absolute right-2 top-2">✕</label>
        </div>
      </div>
    </div>`;
	main.appendChild(movieEl);

	setTimeout(function () {
		getTrailer(videos.results, specialCharTrailer);
	}, 10);

	getWatchProviders(movie["watch/providers"].results["US"], specialCharWatchProviders);
	getReviews(reviews.results, specialCharReviews);
	getSimilar(similar.results, specialCharSimilar);


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

/* Code required for the page buttons */
let pageNumber = 1;

function buttonForward() {
	if (pageNumber < 100) {
		pageNumber++;

		document.getElementById('pageNumberButton').textContent = pageNumber;

		main.innerHTML = '';

		/* Will check to see if there are any filters applied. If so, it will construct the FILTERED_URL for the getMovies call for the next page */
		if (selectedGenreFilter.length != 0) {
			const FILTERED_URL =
				BASE_URL +
				'discover/movie?' +
				API_KEY +
				'&language=en-US&sort_by=popularity.desc&page=' +
				pageNumber +
				'&with_genres=' +
				encodeURI(selectedGenreFilter.join(','));
			getMovies(FILTERED_URL);
		} else {
			const API_URL =
				BASE_URL +
				'discover/movie?' +
				API_KEY +
				'&language=en-US&sort_by=popularity.desc&page=' +
				pageNumber;

			getMovies(API_URL);
		}
	}
}

function buttonBackward() {
	if (pageNumber > 1) {
		pageNumber--;

		document.getElementById('pageNumberButton').textContent = pageNumber;

		main.innerHTML = '';

		/* Will check to see if there are any filters applied. If so, it will construct the FILTERED_URL for the getMovies call for the prev page */
		if (selectedGenreFilter.length != 0) {
			const FILTERED_URL =
				BASE_URL +
				'discover/movie?' +
				API_KEY +
				'&language=en-US&sort_by=popularity.desc&page=' +
				pageNumber +
				'&with_genres=' +
				encodeURI(selectedGenreFilter.join(','));
			getMovies(FILTERED_URL);
		} else {
			const API_URL =
				BASE_URL +
				'discover/movie?' +
				API_KEY +
				'&language=en-US&sort_by=popularity.desc&page=' +
				pageNumber;

			getMovies(API_URL);
		}
	}
}

/* */
async function getTrailer(videos, specialCharTrailer) {
	const YOUTUBE_TRAILER_URL = 'https://youtube.com/embed/';
	if (videos.length != 0) {
		videos.forEach(vid => {
			if (
				vid.name == 'Official Trailer' ||
				vid.name == 'Official Trailer [Subtitled]' ||
				vid.name == 'Dub Trailer' ||
				vid.name == 'United States Trailer' ||
				vid.name == 'Official Promo' || 
				vid.iso_639_1 == 'en' && vid.iso_3166_1 == 'US'
			) {
				const trailer = YOUTUBE_TRAILER_URL + vid.key;
				const trailerHTML = `
                <iframe width="300" height="200"
                    src="${trailer}">
                </iframe>`;
				document.getElementById(specialCharTrailer).innerHTML = trailerHTML;
			}
		});
	} 
}

async function getWatchProviders(providers, specialCharWatchProviders) {
	const providerURL = 'https://image.tmdb.org/t/p/original/';

	/* If the movie has providers / places to rent / watch, it will display the logo */
	if (providers != null) {
		if (providers.flatrate != null) {
			providers.flatrate.forEach(prov => {	
				const providerHtml = `
				<div>
					<img src="${providerURL + prov.logo_path}" style="
					height: 50px !important;
					width: 50px !important;    
					"/>	
				</div>
				`;
				document.getElementById(specialCharWatchProviders).innerHTML += providerHtml;
			})
		}
		if (providers.rent != null) {
			providers.rent.forEach(prov => {
				const providerHtml = `
				<div>
					<img src="${providerURL + prov.logo_path}" style="
					height: 50px !important;
					width: 50px !important;    
					"/>
				</div>
				`;
				document.getElementById(specialCharWatchProviders).innerHTML += providerHtml;
			})
		}
		else if (providers.buy != null) {
			providers.buy.forEach(prov => {
				const providerHtml = `
				<div>
					<img src="${providerURL + prov.logo_path}" style="
					height: 50px !important;
					width: 50px !important;    
					"/>
				</div>
				`;
				document.getElementById(specialCharWatchProviders).innerHTML += providerHtml;
			})
		}
		else if (providers.ads != null) {
			providers.ads.forEach(prov => {
				const providerHtml = `
				<div>
					<img src="${providerURL + prov.logo_path}" style="
					height: 50px !important;
					width: 50px !important;    
					"/>
				</div>
				`;
				document.getElementById(specialCharWatchProviders).innerHTML += providerHtml;	
			})
		}
	}
	/* Otherwise, theres nowhere to rent or watch -- return no current providers */
	else {
		const providerHtml = `
		<div>
			None at this time
		</div>`;
		document.getElementById(specialCharWatchProviders).innerHTML += providerHtml;
	}
}

/* Get and display 3 reviews left for a movie -- if none, display none */
async function getReviews(reviews, specialCharReviews) {
	let counter = 0;
	if (reviews.length != 0) {
		reviews.forEach(rev => {
			
				const reviewHtml = `
				<div>
					<b>${rev.author}</b> -- <b>Rating: ${rev.author_details.rating}/10</b>
					<div style="height:110px;width:900px;overflow:auto;background-color:#21252b;color:white;scrollbar-base-color:gold;font-family:sans-serif;padding:10px;">
					<p style="margin-left: 30px !important;">
						${rev.content}
					</p>
					</div>
				</div>`;
				document.getElementById(specialCharReviews).innerHTML += reviewHtml;
				counter++;
			
		})
	}
	else {
		const reviewHtml = `<p><b>N/A</b></p>`;
		document.getElementById(specialCharReviews).innerHTML = reviewHtml;
	}
}

async function getSimilar(movies, specialCharSimilar) {
	if (movies.length != 0) {
		movies.forEach(mov => {
			const similarHTML = `
				<label for="${mov.title}" class="tooltip" style="height: 300px !important; padding-right: 0px !important; padding-left: 0px !important; margin-right: 10px !important; margin-left: 10px !important; margin-bottom: 10px !important; padding-bottom: 0px !important;">
					<img src="${POSTER_URL + mov.poster_path}" alt="poster" style="object-fit: cover; margin-right: 0px !important; height: 300px !important; width: 200px !important;"></img>
					<span class="tooltiptext"><b>${mov.title}</b><br>${mov.vote_average}/10</span>
				</label>
				`;

			document.getElementById(specialCharSimilar).innerHTML += similarHTML;
		})
	}
}