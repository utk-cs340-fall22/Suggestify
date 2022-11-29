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

// addTvToFirestore('Chucky', '2021-09-12', 'Chucky is back!', 'false');
async function addTvToFirestore(tvId, tvTitle, releaseDate, overview, liked) {
	db.collection('My List')
		.doc(tvTitle)
		.set({
			id: tvId,
			overview: overview,
			release_date: releaseDate,
			title: tvTitle,
			isLiked: liked,
		})
		.then(() => {
			console.log('Document successfully written!', tvTitle);
		})
		.catch(error => {
			console.error('Error writing document: ', error);
		});
}

// getTvFromFirestore('Chucky');
async function getTvFromFirestore(docName) {
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

// updateTvFromFirestore('Chucky', 'new value');
async function updateTvFromFirestore(docName, newValue) {
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

// deleteTvFromFirestore('Chucky');
async function deleteTvFromFirestore(docName) {
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
/* This can be formatted to include whatever you want -- 'tv/upcoming' is just a placeholder for now */
const API_URL =
	BASE_URL +
	'discover/tv?' +
	API_KEY +
	'&language=en-US&sort_by=popularity.desc&page=1';
/* After this URL, add the posterURL return from the API */
const POSTER_URL = 'https://image.tmdb.org/t/p/original/';

/* After the v= comes the key returned by the api call to get all videos for the tv show */
const YOUTUBE_TRAILER_URL = 'https://youtube.com/watch?v=';
const GENRE_URL = BASE_URL + 'genre/tv/list?' + API_KEY + '&language=en-US';

var selectedGenreFilter = [];
let hearts = [];
let count = 0;

getGenres(GENRE_URL);
getTvShows(API_URL);

/* Function will call the API to get all available tv genres -- will then call displayGenres on the returned data */
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
				'discover/tv?' +
				API_KEY +
				'&language=en-US&sort_by=popularity.desc&page=1&with_genres=' +
				selectedGenreFilter.join(',');

			main.innerHTML = '';
			pageNumber = 1;
			document.getElementById('pageNumberButton').textContent = pageNumber;

			getTvShows(FILTERED_URL);
			highlightSelectedFilter();
		});

		/* This just constructs the html for each of the filter buttons & inserts them into the genreTags div in tv.html */
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

/* Makes an API fetch call to get tv shows with whatever url you want -- this could be for upcoming shows, popular, etc */
function getTvShows(url) {
	fetch(url)
		.then(res => res.json())
		.then(data => {
			// console.log('shows: ', data);
			data.results.forEach(tv => {
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
						hearts.push({
							tvId: data.id,
							tvTitle: data.name,
							release: data.first_air_date,
							description: data.overview,
						});

						displayTvShow(data);
					});
			});
		})
		.catch(error => {
			console.log(error);
		});
}

function displayTvShow(show) {
	const {
		name,
		poster_path,
		vote_average,
		overview,
		backdrop_path,
		first_air_date,
		revenue,
		number_of_seasons,
		episode_run_time,
	} = show;

	var posterURL = null;
	var backdropURL = null;

	/* If the backdrop exists, then create the URL for it and check if the poster path is null -- if so, set it equal to the backdrop path */
	if (backdrop_path != null) {
		backdropURL = POSTER_URL + backdrop_path;
		if (poster_path == null) {
			posterURL = backdropURL;
		}
		else if (poster_path != null) {
			posterURL = POSTER_URL + poster_path;
		}
	}
	/* If the backdrop_path is null, check if the poster path exists. If so, create it and set them equal */
	/* Otherwise, just sets them equal to blank square */
	else if (backdrop_path == null) {
		if (poster_path != null) {
			posterURL = POSTER_URL + poster_path;
			backdropURL = posterURL;
		}
		else if (poster_path == null) {
			posterURL = 'https://upload.wikimedia.org/wikipedia/commons/1/1f/Blank_square.svg';
			backdropURL = 'https://upload.wikimedia.org/wikipedia/commons/1/1f/Blank_square.svg';
		}
	}

	const showEl = document.createElement('div');
	showEl.classList.add('show');

	showEl.innerHTML = `
	<label for="${name}" class="btn modal-button" style="height: 400px !important; padding-right: 0px !important; padding-left: 0px !important; margin-right: 10px !important; margin-left: 10px !important; margin-bottom: 10px !important; padding-bottom: 0px !important; width: 250px !important;">
		<img src="${
			posterURL
		}" alt="poster" style="margin-right: 0px !important; height: 400px !important; width: 250px !important;">
		</label>
    <i class="heart-icon fa-regular fa-heart relative bottom-[4rem] right-[4rem] text-4xl text-white hover: cursor-pointer" aria-hidden="true"></i>
    <input type="checkbox" id="${name}" class="modal-toggle" />
    <div class="modal">
      <div class="modal-box w-full max-w-5xl h-full">
        <div class="card w-96 bg-base-100 shadow-xl image-full" style="width: 970px !important; height: 400px !important;">
          <figure>            
          <img src="${backdropURL}" alt="backDrop" style="width: 970px !important; height: 500px !important; margin-right: 0px !important; border-radius: 0px !important; border-width: 0px !important; padding: 1px 0px 1px 1px !important;"></img>
          </figure>
        <div class="card-body">
          <h1 class="card-title" style="text-align: center !important;">
          <font size="+100">${name}</font> 
          </h1>
          <br/>
          <h3> <b> Overview </b> </h3>
          <p>${overview}</p>
          <br/><br/>
          <p><b>First Air Date:</b> ${first_air_date} | <b>Rating:</b> ${vote_average} / 10 | <b>Seasons:</b> ${number_of_seasons}</p>
        </div>
      </div>
      <div class="flex justify-center w-full py-2 gap-2">
        <a href="#item1${name}" class="btn btn-xs">More Info</a> 
        <a href="#item2${name}" class="btn btn-xs">See Also</a> 
        <a href="#item3${name}" class="btn btn-xs">Reviews</a> 
      </div>
      <div class="carousel w-full">
        <div id="item1${name}" class="carousel-item w-full">
          <div class="card w-96 bg-base-100 shadow-xl">
            <div class="card-body">
              <h1><b>More Info</b></h1>
              <p>Episode Runtime -- ${episode_run_time[0]} minutes</p>
            </div>
          </div>
        </div> 
        <div id="item2${name}" class="carousel-item w-full">
          <div class="card w-96 bg-base-100 shadow-xl">
            <div class="card-body">
            <h1><b>See Also</b></h1>
            </div>
          </div>
        </div> 
        <div id="item3${name}" class="carousel-item w-full">
          <div class="card w-96 bg-base-100 shadow-xl">
            <div class="card-body">
            <h1><b>Reviews</b></h1>
            </div>
          </div>
        </div> 
      </div> 
  
      <div class="modal-action">
          <label for="${name}" class="btn btn-sm btn-circle absolute right-2 top-2">✕</label>
      </div>
      </div>
	</div>`;
	main.appendChild(showEl);

	/* Heart functionality */
	let hIcon = document.querySelectorAll('.heart-icon');
	hIcon.forEach((icon, index) => {
		icon.addEventListener('click', () => {
			if (icon.classList.contains('fa-regular')) {
				icon.classList.remove('fa-regular');
				icon.classList.add('fa-solid');
				addTvToFirestore(
					hearts[index].tvId,
					hearts[index].tvTitle,
					hearts[index].release,
					hearts[index].description,
					'true'
				);
				count++;
				document.getElementsByClassName('badge')[0].innerHTML = count;
			} else {
				icon.classList.remove('fa-solid');
				icon.classList.add('fa-regular');
				// deleteTvFromFirestore(hearts[index].tvTitle);
				count--;
				document.getElementsByClassName('badge')[0].innerHTML = count;
			}
		});
	});
}

/* Code required for the page buttons */
var pageNumber = 1;

function buttonForward() {
	if (pageNumber < 100) {
		pageNumber++;

		document.getElementById('pageNumberButton').textContent = pageNumber;

		main.innerHTML = '';

		/* Will check to see if there are any filters applied. If so, it will construct the FILTERED_URL for the getTvShows call for the next page */
		if (selectedGenreFilter.length != 0) {
			const FILTERED_URL =
				BASE_URL +
				'discover/tv?' +
				API_KEY +
				'&language=en-US&sort_by=popularity.desc&page=' +
				pageNumber +
				'&with_genres=' +
				encodeURI(selectedGenreFilter.join(','));

			// console.log(FILTERED_URL);
			getTvShows(FILTERED_URL);
		} else {
			const API_URL =
				BASE_URL +
				'discover/tv?' +
				API_KEY +
				'&language=en-US&sort_by=popularity.desc&page=' +
				pageNumber;

			getTvShows(API_URL);
		}
	}
}
function buttonBackward() {
	if (pageNumber > 1) {
		pageNumber--;

		document.getElementById('pageNumberButton').textContent = pageNumber;

		main.innerHTML = '';

		/* Will check to see if there are any filters applied. If so, it will construct the FILTERED_URL for the getTvShows call for the prev page */
		if (selectedGenreFilter.length != 0) {
			const FILTERED_URL =
				BASE_URL +
				'discover/tv?' +
				API_KEY +
				'&language=en-US&sort_by=popularity.desc&page=' +
				pageNumber +
				'&with_genres=' +
				encodeURI(selectedGenreFilter.join(','));

			// console.log(FILTERED_URL);
			getTvShows(FILTERED_URL);
		} else {
			const API_URL =
				BASE_URL +
				'discover/tv?' +
				API_KEY +
				'&language=en-US&sort_by=popularity.desc&page=' +
				pageNumber;

			getTvShows(API_URL);
		}
	}
}
