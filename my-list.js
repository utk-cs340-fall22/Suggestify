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

// addItemToFirestore(1, "something", "10-2-2022", "hi", "movie");
async function addItemToFirestore(
	itemId,
	itemTitle,
	releaseDate,
	itemOverview,
	type
) {
	db.collection('My List')
		.doc(itemTitle)
		.set({
			id: itemId,
			overview: itemOverview,
			release_date: releaseDate,
			title: itemTitle,
			category: type,
		})
		.then(() => {
			console.log('Document successfully written!', itemTitle);
		})
		.catch(error => {
			console.error('Error writing document: ', error);
		});
}

// getItemFromFirestore('superman');
async function getItemFromFirestore(docName) {
	var docRef = db.collection('My List').doc(docName);

	docRef
		.get()
		.then(doc => {
			if (doc.exists) {
				console.log('Document data:', doc.data().title);
			} else {
				console.log('No such document!', doc.data());
			}
		})
		.catch(error => {
			console.log('Error getting document:', error);
		});
}

// updateItemFromFirestore('Black Adam', 'new value');
async function updateItemFromFirestore(docName, newValue) {
	var docRef = db.collection('My List').doc(docName);

	return docRef
		.update({
			// only one field at a time can be updated
			// title: newValue,
			// release_date: 'newValue',
			// overview: 'newValue',
			// category: 'newValue',
		})
		.then(() => {
			console.log('Document successfully updated!', docName);
		})
		.catch(error => {
			// The document probably doesn't exist.
			console.error('Error updating document: ', error);
		});
}

// deleteItemFromFirestore('name');
async function deleteItemFromFirestore(docName) {
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

let count = 0;
let movieHearts = [];
let tvHearts = [];

const API_KEY = 'api_key=bb1d4e0661af455e02af1ea99fb85fcb';
const BASE_URL = 'https://api.themoviedb.org/3/';
const POSTER_URL = 'https://image.tmdb.org/t/p/original/';

/* Movie fetching */

getLikedMoviesFromFirestore();
async function getLikedMoviesFromFirestore() {
	db.collection('My List')
		.where('category', '==', 'movie')
		.get()
		.then(querySnapshot => {
			querySnapshot.forEach(doc => {
				// doc.data() is never undefined for query doc snapshots
				count++;
				getLikedMoviesFromApi(doc.data());
			});
		})
		.catch(error => {
			console.log('Error getting documents: ', error);
		});
}

function getLikedMoviesFromApi(tvInfo) {
	const { id } = tvInfo;

	const movieUrl = `${BASE_URL}movie/${id}?${API_KEY}&language=en-US&append_to_response=videos,credits,similar,images,reviews,watch/providers`;

	fetch(movieUrl)
		.then(res => res.json())
		.then(data => {
			movieHearts.push({
				movieId: data.id,
				movieTitle: data.title,
				release: data.release_date,
				description: data.overview,
			});
			displayMovieFromFirestore(data);
		});
}

// display movies like movies page
function displayMovieFromFirestore(data) {
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
		similar,
		credits,
	} = data;

	const specialCharTrailer = id + title;
	const specialCharReviews = title + id;
	const specialCharWatchProviders = runtime + title + id;
	const specialCharSimilar = id + title + runtime;
	const specialCharCreditsCast = title + runtime + id;
	const specialCharCreditsCrew = id + runtime + title + release_date;
	let movieGenre = '';
	let formattedRevenue = '';
	let formattedBudget = '';

	/* Formats the revenue and budget into USD */
	const formatter = new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: 'USD',
	});

	genres.forEach(genre => {
		movieGenre += genre.name + ', ';
	});

	if (revenue == 0) {
		formattedRevenue = 'N/A';
	} else {
		formattedRevenue = formatter.format(revenue);
	}

	if (budget == 0) {
		formattedBudget = 'N/A';
	} else {
		formattedBudget = formatter.format(budget);
	}

	let posterURL = null;
	let backdropURL = null;

	/* If the backdrop exists, then create the URL for it and check if the poster path is null -- if so, set it equal to the backdrop path */
	if (backdrop_path != null) {
		backdropURL = POSTER_URL + backdrop_path;
		if (poster_path == null) {
			posterURL = backdropURL;
		} else if (poster_path != null) {
			posterURL = POSTER_URL + poster_path;
		}
	} else if (backdrop_path == null) {
		/* If the backdrop_path is null, check if the poster path exists. If so, create it and set them equal */
		/* Otherwise, just sets them equal to blank square */
		if (poster_path != null) {
			posterURL = POSTER_URL + poster_path;
			backdropURL = posterURL;
		} else if (poster_path == null) {
			posterURL =
				'https://upload.wikimedia.org/wikipedia/commons/1/1f/Blank_square.svg';
			backdropURL =
				'https://upload.wikimedia.org/wikipedia/commons/1/1f/Blank_square.svg';
		}
	}

	const movieCard = document.getElementById('movie');
	const movieEl = `
    <label for="${title}" class="btn modal-button" style="height: 400px !important; padding-right: 0px !important; padding-left: 0px !important; margin-right: 10px !important; margin-left: 10px !important; margin-bottom: 10px !important; padding-bottom: 0px !important; width: 250px !important;">
        <img src="${posterURL}" alt="poster" style="margin-right: 0px !important; height: 400px !important; width: 250px !important;">
        </label>
        <i id="heart-${title}" class="heart-icon fa-solid fa-heart relative bottom-[-320px] right-[4rem] text-4xl text-white hover: cursor-pointer" aria-hidden="true"></i>
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
					<div class="carousel-card bg-base-100 shadow-xl" style="height: 1600px !important;">
						<div class="carousel-card-body">
						<h1><b>About this movie</b></h1>
						<hr>
						<br>
						<h1><b>Description</b></h1>
						<p>${overview}</p>
						<br>
						<p>
							<b>Genre</b>: ${movieGenre} |
						  	<b>Status</b>: ${status} |
						  	<b>Budget</b>: ${formattedBudget} |
						  	<b>Revenue</b>: ${formattedRevenue}
						</p>
						<br>
						<div id="${specialCharWatchProviders}" style="
								display: flex !important;
							  	flex-direction: row !important;
							  	flex-wrap: wrap !important;
							  	justify-content: flex-start !important;
							  	align-items: center !important;">
							  	<b>Watch Providers</b>: &nbsp;
						</div>
						<br>
						<div class="flex column-gap:100px" style="flex-wrap:wrap">	
							<p id="${specialCharCreditsCrew}"><b>Director</b>: </p>
						</div>
						<br>
						<div class="flex column-gap:100px" style="flex-wrap:wrap">	
							<p id="${specialCharCreditsCast}"><b>Cast</b>: </p>
						</div>
						<br>
						<h2 style="text-align: center;"><b>Trailer</b></h2>
						<div class="card-body" style="width: 900px; height: 500px; text-align: center;" id="${specialCharTrailer}"> </div>
					</div>
				</div>
			</div> 
			<div id="item3${title}" class="carousel-item w-full">
				<div id="${specialCharReviews}"></div>
			</div> 
		  	<div id="item2${title}" class="carousel-item w-full">
				<div id="${specialCharSimilar}" style="flex-wrap:wrap;"></div>
			</div>
			<div class="modal-action">
          		<label for="${title}" class="btn btn-sm btn-circle absolute right-2 top-2">✕</label>
        	</div>
      	</div>
    </div>`;

	movieCard.innerHTML += movieEl;

	/* Used to help improve load time of trailers */
	setTimeout(function () {
		getTrailer(videos.results, specialCharTrailer);
	}, 5);

	/* Call all functions with their respective specialChar id used within the html */
	getWatchProviders(
		data['watch/providers'].results['US'],
		specialCharWatchProviders
	);
	getDirector(credits.crew, specialCharCreditsCrew);
	getCast(credits.cast, specialCharCreditsCast);
	getReviews(reviews.results, specialCharReviews);
	getSimilar(similar.results, specialCharSimilar);

	/* Heart functionality */
	let hIcon = document.querySelectorAll('.heart-icon');
	hIcon.forEach((icon, index) => {
		document.getElementsByClassName('badge')[0].innerHTML = count;
		icon.addEventListener('click', () => {
			deleteItemFromFirestore(movieHearts[index].movieTitle);
			count--;
			icon.classList.remove('fa-solid');
			icon.classList.add('fa-regular');
			setTimeout(() => {
				location.reload();
			}, '500');
		});
	});
}

/* Gets a trailer for the movie */
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
				(vid.iso_639_1 == 'en' && vid.iso_3166_1 == 'US')
			) {
				const trailer = YOUTUBE_TRAILER_URL + vid.key;
				const trailerHTML = `
                <iframe 
					style="text-align:center; width: 900px; height: 400px"
                    src="${trailer}"
					allowfullscreen >
                </iframe>`;
				document.getElementById(specialCharTrailer).innerHTML = trailerHTML;
			}
		});
	}
}

/* Gets the first 10 people listed in the cast */
async function getCast(cast, specialCharCreditsCast) {
	let castCount = 0;
	let shouldBreak = false;

	cast.forEach(person => {
		if (shouldBreak) {
			return;
		}
		if (castCount < 10) {
			const castMember = `${person.name} | `;
			document.getElementById(specialCharCreditsCast).innerHTML += castMember;
			castCount++;
		} else if (castCount >= 10) {
			shouldBreak = true;
		}
	});
}

/* Gets the director of the film to display */
async function getDirector(crew, specialCharCreditsCrew) {
	let shouldBreak = false;

	crew.forEach(person => {
		if (shouldBreak) {
			return;
		}
		if (person.job == 'Director') {
			const director = `${person.name}`;
			document.getElementById(specialCharCreditsCrew).innerHTML += director;
			shouldBreak = true;
		}
	});
}

/* Gets all watch providers and display's their logo */
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
				document.getElementById(specialCharWatchProviders).innerHTML +=
					providerHtml;
			});
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
				document.getElementById(specialCharWatchProviders).innerHTML +=
					providerHtml;
			});
		} else if (providers.buy != null) {
			providers.buy.forEach(prov => {
				const providerHtml = `
				<div>
					<img src="${providerURL + prov.logo_path}" style="
					height: 50px !important;
					width: 50px !important;    
					"/>
				</div>
				`;
				document.getElementById(specialCharWatchProviders).innerHTML +=
					providerHtml;
			});
		} else if (providers.ads != null) {
			providers.ads.forEach(prov => {
				const providerHtml = `
				<div>
					<img src="${providerURL + prov.logo_path}" style="
					height: 50px !important;
					width: 50px !important;    
					"/>
				</div>
				`;
				document.getElementById(specialCharWatchProviders).innerHTML +=
					providerHtml;
			});
		}
	} else {
		/* Otherwise, theres nowhere to rent or watch -- return no current providers */
		const providerHtml = `
		<div>
			None at this time
		</div>`;
		document.getElementById(specialCharWatchProviders).innerHTML +=
			providerHtml;
	}
}

/* Get and display 3 reviews left for a movie -- if none, display none */
async function getReviews(reviews, specialCharReviews) {
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
		});
	} else {
		const reviewHtml = `<p><b>N/A</b></p>`;
		document.getElementById(specialCharReviews).innerHTML = reviewHtml;
	}
}

async function getSimilar(movies, specialCharSimilar) {
	if (movies.length != 0) {
		movies.forEach(mov => {
			const similarHTML = `
				<label for="${
					mov.title
				}" class="tooltip" style="height: 300px !important; padding-right: 0px !important; padding-left: 0px !important; margin-right: 10px !important; margin-left: 10px !important; margin-bottom: 10px !important; padding-bottom: 0px !important;">
					<img src="${
						POSTER_URL + mov.poster_path
					}" alt="poster" style="object-fit: cover; margin-right: 0px !important; height: 300px !important; width: 200px !important;"></img>
					<span class="tooltiptext"><b>${mov.title}</b><br>${mov.vote_average}/10</span>
				</label>
				`;

			document.getElementById(specialCharSimilar).innerHTML += similarHTML;
		});
	}
}

/* TV Fetching */

getLikedTvFromFirestore();
async function getLikedTvFromFirestore() {
	db.collection('My List')
		.where('category', '==', 'tv')
		.get()
		.then(querySnapshot => {
			querySnapshot.forEach(doc => {
				// doc.data() is never undefined for query doc snapshots
				count++;
				getLikedTvFromApi(doc.data());
			});
		})
		.catch(error => {
			console.log('Error getting documents: ', error);
		});
}

// fetch tv by id from firestore
function getLikedTvFromApi(tvInfo) {
	const { id } = tvInfo;

	const tvUrl = `${BASE_URL}tv/${id}?${API_KEY}&language=en-US&append_to_response=videos,credits,similar,images,reviews,watch/providers`;

	fetch(tvUrl)
		.then(res => res.json())
		.then(data => {
			tvHearts.push({
				tvId: data.id,
				tvName: data.name,
				first_air_date: data.first_air_date,
				description: data.overview,
			});
			displayTvFromFirestore(data);
		});
}

// display tv like tv page
function displayTvFromFirestore(data) {
	const {
		name,
		poster_path,
		vote_average,
		overview,
		backdrop_path,
		first_air_date,
		number_of_seasons,
		number_of_episodes,
		episode_run_time,
		status,
		genres,
		tagline,
		videos,
		reviews,
		similar,
		id,
		credits,
	} = data;

	const specialCharTrailer = id + name + status + "oisbdo abdo";
	const specialCharReviews = name + id + name + id;
	const specialCharWatchProviders = episode_run_time + name + id + id;
	const specialCharSimilar = id + name + episode_run_time + id;
	const specialCharCreditsCast = id + name + episode_run_time + status;
	const specialCharCreditsCrew = id + episode_run_time + name + tagline;
	let showGenre = '';

	genres.forEach(genre => {
		showGenre += genre.name + ", ";
	})

	let posterURL = null;
	let backdropURL = null;

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


	const showCard = document.getElementById('tv');

	const showEl = `
	<label for="${name + id}" class="btn modal-button" style="height: 400px !important; padding-right: 0px !important; padding-left: 0px !important; margin-right: 10px !important; margin-left: 10px !important; margin-bottom: 10px !important; padding-bottom: 0px !important; width: 250px !important;">
		<img src="${
			posterURL
		}" alt="poster" style="margin-right: 0px !important; height: 400px !important; width: 250px !important;">
		</label>
    <i id="heart-${name}" class="heart-icon-tv fa-solid fa-heart relative bottom-[-320px] right-[4rem] text-4xl text-white hover: cursor-pointer" aria-hidden="true"></i>
    <input type="checkbox" id="${name + id}" class="modal-toggle" />

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
          <p>${tagline}</p>
          <br/><br/>
          <p><b>First Air Date:</b> ${first_air_date} | <b>Rating:</b> ${vote_average} / 10 | <b>Seasons:</b> ${number_of_seasons}</p>
        </div>
      </div>
      <div class="flex justify-center w-full py-2 gap-2">
        <a href="#item1${name + id}" class="btn btn-xs">More Info</a>
		<a href="#item3${name + id}" class="btn btn-xs">Reviews</a> 
        <a href="#item2${name + id}" class="btn btn-xs">See Also</a> 
      </div>
	  <div class="carousel w-full">
	  <div id="item1${name + id}" class="carousel-item w-full">
		  	<div class="carousel-card bg-base-100 shadow-xl" style="height: 1600px !important;">
				<div class="carousel-card-body">
					<h1><b>About this show</b></h1>
					<hr>
					<br>
					<h1><b>Description</b></h1>
					<p>${overview}</p>
					<br>
					<p>
					<b>Genre</b>: ${showGenre} |
					<b>Status</b>: ${status} |
					<b>Number of Episodes</b>: ${number_of_episodes}
					</p>
					<br>
					<div id="${specialCharWatchProviders}" style="
							display: flex !important;
							flex-direction: row !important;
							flex-wrap: wrap !important;">
							<b>Watch Providers</b>: &nbsp;
					</div>
					<br>
					<div class="flex column-gap:100px" style="flex-wrap:wrap">	
						<p id="${specialCharCreditsCrew}"><b>Director</b>: </p>
					</div>
					<br>
					<div class="flex column-gap:100px" style="flex-wrap:wrap">	
						<p id="${specialCharCreditsCast}"><b>Cast</b>: </p>
					</div>
			  		<br>
			  		<h2 style="text-align: center;"><b>Trailer</b></h2>
			  		<div class="card-body" style="width: 900px; height: 500px; text-align: center;" id="${specialCharTrailer}"> </div>
		  		</div>
	  		</div>
  		</div> 
  		<div id="item3${name + id}" class="carousel-item w-full">
			<div id="${specialCharReviews}"></div>
		</div> 
		<div id="item2${name + id}" class="carousel-item w-full">
			<div id="${specialCharSimilar}" style="flex-wrap:wrap;"></div>
		</div>
		<div class="modal-action">
			<label for="${name + id}" class="btn btn-sm btn-circle absolute right-2 top-2">✕</label>
		</div>
	</div>`;
  showCard.innerHTML += showEl;

	setTimeout(function () {
		getTrailer(videos.results, specialCharTrailer);
	}, 5);

	/* Call all functions with their respective specialChar id used within the html */
	getWatchProviders(data["watch/providers"].results["US"], specialCharWatchProviders);
	getDirector(credits.crew, specialCharCreditsCrew);
	getCast(credits.cast, specialCharCreditsCast);
	getReviews(reviews.results, specialCharReviews);
	getSimilar(similar.results, specialCharSimilar);

	/* Heart functionality */
	let hIcon = document.querySelectorAll('.heart-icon-tv');
	hIcon.forEach((icon, index) => {
		document.getElementsByClassName('badge')[0].innerHTML = count;
		icon.addEventListener('click', () => {
			deleteItemFromFirestore(tvHearts[index].tvName);
			count--;
			icon.classList.remove('fa-solid');
			icon.classList.add('fa-regular');
			setTimeout(() => {
				location.reload();
			}, '500');
		});
	});
}

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
                <iframe 
					style="text-align:center; width: 900px; height: 600px"
                    src="${trailer}"
					allowfullscreen >
                </iframe>`;
				document.getElementById(specialCharTrailer).innerHTML = trailerHTML;
			}
		});
	} 
	else {
		const trailerHTML = `<p style="text-align:center;>No Trailer Available</p>`;
		document.getElementById(specialCharTrailer).innerHTML = trailerHTML;
	}
}

/* Gets the first 10 people listed in the cast */
async function getCast(cast, specialCharCreditsCast) {
	let castCount = 0;
	let shouldBreak = false;

	cast.forEach(person => {
		if (shouldBreak) {
			return;
		}
		if (castCount < 10) {
			const castMember = `${person.name} | `;
			document.getElementById(specialCharCreditsCast).innerHTML += castMember;
			castCount++;
		}
		else if (castCount >= 10) {
			shouldBreak = true;
		}
	});
}

/* Gets the director of the film to display */
async function getDirector(crew, specialCharCreditsCrew) {
	let shouldBreak = false;

	if (crew.length != 0) {
		crew.forEach(person => {
			if (shouldBreak) {
				return;
			}
			if (person.job == "Director" || person.known_for_department == "Directing") {
				const director = `${person.name}`;
				document.getElementById(specialCharCreditsCrew).innerHTML += director;
				shouldBreak = true;
			}
		});
	}
	else {
		const director = `N/A`;
		document.getElementById(specialCharCreditsCrew).innerHTML += director;
	}
}

/* Gets all watch providers and display's their logo */
async function getWatchProviders(providers, specialCharWatchProviders) {
	const providerURL = 'https://image.tmdb.org/t/p/original/';

	/* If the show has providers / places to rent / watch, it will display the logo */
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

/* Get and display 3 reviews left for a show -- if none, display none */
async function getReviews(reviews, specialCharReviews) {
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
		})
	}
	else {
		const reviewHtml = `<p><b>N/A</b></p>`;
		document.getElementById(specialCharReviews).innerHTML = reviewHtml;
	}
}

async function getSimilar(show, specialCharSimilar) {
	if (show.length != 0) {
		show.forEach(s => {
			const similarHTML = `
				<label for="${s.name}" class="tooltip" style="height: 300px !important; padding-right: 0px !important; padding-left: 0px !important; margin-right: 10px !important; margin-left: 10px !important; margin-bottom: 10px !important; padding-bottom: 0px !important;">
					<img src="${POSTER_URL + s.poster_path}" alt="poster" style="object-fit: cover; margin-right: 0px !important; height: 300px !important; width: 200px !important;"></img>
					<span class="tooltiptext"><b>${s.name}</b><br>${s.vote_average}/10</span>
				</label>
				`;

			document.getElementById(specialCharSimilar).innerHTML += similarHTML;
		})
	}
}
