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

// addMovieToFirestore('Black Adam', '2022/11/7', 'a superhero', 'movie/tv');
async function addMovieToFirestore(
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

// getItemFromFirestore('Black Adam');
async function getItemFromFirestore(docName) {
	var docRef = db.collection('My List').doc(docName);

	docRef
		.get()
		.then(doc => {
			if (doc.exists) {
				console.log('Found: ', doc.data().title);
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

// deleteMovieFromFirestore('name');
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

let count = 0;
let hearts = [];

getCountOfItemsFromFirestore();
async function getCountOfItemsFromFirestore() {
	db.collection('My List')
		.get()
		.then(querySnapshot => {
			querySnapshot.forEach(doc => {
				// doc.data() is never undefined for query doc snapshots
				count++;
				document.getElementsByClassName('badge')[0].innerHTML = count;
			});
		})
		.catch(error => {
			console.log('Error getting documents: ', error);
		});
}


const API_KEY = 'api_key=bb1d4e0661af455e02af1ea99fb85fcb';
const BASE_URL = 'https://api.themoviedb.org/3/';
const POSTER_URL = 'https://image.tmdb.org/t/p/original/';
const SEARCH_QUERY = '&query=searchTerm';
const searchURL = BASE_URL + '/search/multi?' + API_KEY + '&language=en-US&page=1&query=';

const form = document.getElementById('form');
form.addEventListener('submit', (e) => {
    e.preventDefault();
	document.getElementById('movie').innerHTML = '';
  	hearts = [];
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
		credits
	} = movie;

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
	const formatter= new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: 'USD',
	})

	genres.forEach(genre => {
		movieGenre += genre.name + ", ";
	})

	if (revenue == 0) {
		formattedRevenue = "N/A";
	} else {
		formattedRevenue = formatter.format(revenue);
	}

	if (budget == 0) {
		formattedBudget = "N/A";

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

	const movieCard = document.getElementById('movie');
	const movieEl = `
    <label for="${title}" class="btn modal-button" style="height: 400px !important; padding-right: 0px !important; padding-left: 0px !important; margin-right: 10px !important; margin-left: 10px !important; margin-bottom: 10px !important; padding-bottom: 0px !important; width: 250px !important;">
        <img src="${
					posterURL
				}" alt="poster" style="margin-right: 0px !important; height: 400px !important; width: 250px !important;">
        </label>
        <i id="heart-${title}" class="heart-icon fa-regular fa-heart relative bottom-[-320px] right-[4rem] text-4xl text-white hover: cursor-pointer" aria-hidden="true"></i>
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
	getWatchProviders(movie["watch/providers"].results["US"], specialCharWatchProviders);
	getDirector(credits.crew, specialCharCreditsCrew);
	getCast(credits.cast, specialCharCreditsCast);
	getReviews(reviews.results, specialCharReviews);
	getSimilar(similar.results, specialCharSimilar);
  
  /* Fill heart if movie exists in firestore */
	let hIcon = document.querySelectorAll('.heart-icon');

	// find all favorited movies from firestore
	hearts.forEach(heart => {
		for (let movie in heart) {
			if (movie == 'movieTitle') {
				let docName = heart[movie];
				var docRef = db.collection('My List').doc(docName);
				docRef
					.get()
					.then(doc => {
						if (doc.exists) {
							hIcon.forEach(icon => {
								if (icon.id == `heart-${docName}`) {
									icon.classList.remove('fa-regular');
									icon.classList.add('fa-solid');
								}
							});
						}
					})
					.catch(error => {
						console.log('Error getting document:', error);
					});
			}
		}
	});

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
					'movie'
				);
				count++;
				document.getElementsByClassName('badge')[0].innerHTML = count;
			} else {
				icon.classList.remove('fa-solid');
				icon.classList.add('fa-regular');
				deleteMovieFromFirestore(hearts[index].movieTitle);
				count--;
				document.getElementsByClassName('badge')[0].innerHTML = count;
			}
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
		}
		else if (castCount >= 10) {
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
		if (person.job == "Director") {
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