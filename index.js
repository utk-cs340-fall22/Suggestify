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

// addItemToFirestore('Black Adam', '2022/11/7', 'a superhero', 'movie/tv');
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

/* This will need to be stored somewhere else at some point for security reasons */
const API_KEY = 'api_key=bb1d4e0661af455e02af1ea99fb85fcb';
const BASE_URL = 'https://api.themoviedb.org/3/';

/* This can be formatted to include whatever you want -- 'movie/upcoming' is just a placeholder for now */
//const API_URL_ = BASE_URL + '/movie/popular?/similar' + API_KEY + '&language=en-US&page=1';

const API_URL =
	BASE_URL + 'movie/popular?' + API_KEY + '&language=en-US&page=1';
getTrendingMovies(API_URL);
let trendingMovieHearts = [];

const API_URL2 =
	BASE_URL + 'movie/top_rated?' + API_KEY + '&language=en-US&page=1';
getTopMovies(API_URL2);
let topMovieHearts = [];

const API_URL3 = BASE_URL + 'tv/popular?' + API_KEY + '&language=en-US&page=1';
getTrendingTV(API_URL3);
let trendingTvHearts = [];

const API_URL4 =
	BASE_URL + 'tv/top_rated?' + API_KEY + '&language=en-US&page=1';
getTopTV(API_URL4);
let topTvHearts = [];

const API_URL6 =
	BASE_URL + 'movie/now_playing?' + API_KEY + '&language=en-US&page=1';
getPlayingMovies(API_URL6);
let playingMovieHearts = [];

const API_URL7 =
	BASE_URL + 'movie/upcoming?' + API_KEY + '&language=en-US&page=1';
getUpcomingMovies(API_URL7);
let upcomingMovieHearts = [];

const POSTER_URL = 'https://image.tmdb.org/t/p/original/';


/* Makes an API fetch call to get movies with whatever url you want -- this could be for upcoming movies, popular, etc */
/* This will fetch the URL passed to it and will retrieve a list of movies. It will then loop through each movie, use its ID to construct the DETAIL_URL, and make another API call */
/* This second call will return even more information about each movie and will call displayMovies on each movie to display them with access to all of the information retrieved */

var trailerCount = 0;
var slideCount = 0;

/* Makes an API fetch call to get movies with whatever url you want -- this could be for upcoming movies, popular, etc */
/* This will fetch the URL passed to it and will retrieve a list of movies. It will then loop through each movie, use its ID to construct the DETAIL_URL, and make another API call */
/* This second call will return even more information about each movie and will call displayMovies on each movie to display them with access to all of the information retrieved */
function getTrendingMovies(url) {
	fetch(url)
		.then(res => res.json())
		.then(data => {
			data.results.forEach(movie => {
				movieCarousel.innerHTML = '';

				/* Append to this response to get multiple things to return in one request (append_to_response=...) */
				/* This will get all details, credits, similar movies, and images | Refer to API documentation for other things to append */
				const DETAIL_URL =
					BASE_URL +
					'movie/' +
					movie.id +
					'?' +
					API_KEY +
					'&language=en-US&append_to_response=videos,reviews,similar,credits,similar,images,watch/providers';

				fetch(DETAIL_URL)
					.then(res => res.json())
					.then(data => {
						trendingMovieHearts.push({
							movieId: data.id,
							movieTitle: data.title,
							release: data.release_date,
							description: data.overview,
						});

						if (data.videos.results.length != 0 && slideCount < 5) {
							data.videos.results.forEach(vid => {
								if (
									vid.name == 'Official Trailer' ||
									vid.name == 'Official Trailer [Subtitled]' ||
									vid.name == 'Dub Trailer' ||
									vid.name == 'United States Trailer'
								) {
									carouselStuff(data);
									slideCount++;
								}
							});
						}

						displayTrendingMovies(data);
					});
			});
		})

		.catch(error => {
			console.log(error);
		});
}

/* Passed a movie, which will contain all of the needed information about the individual movie (runtime, videos, etc) */
function displayTrendingMovies(data) {
	const {
		title,
        poster_path,
        vote_average,
        overview,
        backdrop_path,
        release_date,
        runtime,
		reviews,
        budget,
        revenue,
        genres, 
        status,
        tagline,
		videos,
		credits,
		similar,
        id
    } = data;

    const backdrop_url = POSTER_URL + backdrop_path;
    const specialChar = title + id;
    const specialCharReviews = id + title;
	const specialCharSimilar = id + title + '&';
	const specialCharCast = id + title + '/';
	const specialCharWatchProviders = id + title + '.';
	
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

	genres.forEach(genre => {
		movieGenre += genre.name + ", ";
	})

	const movieEl = `
        <div class="carousel-item relative">
            <label for="my-modal-${title}" class="btn modal-button" style="height: 300px !important; padding-right: 0px !important; padding-left: 0px !important; margin-right: 10px !important; margin-left: 10px !important; margin-bottom: 10px !important; padding-bottom: 0px !important; width: 200px !important;">
            <img src="${
							POSTER_URL + poster_path
						}" alt="poster" style="margin-right: 0px !important; height: 300px !important; width: 200px !important;">
            </label>
            <i id="heart-${title}" class="heart-icon-trending-movies fa-regular fa-heart absolute right-8 bottom-[80px] text-4xl text-white hover: cursor-pointer" aria-hidden="true"></i>
            <input type="checkbox" class="modal-toggle" id="my-modal-${title}" />
            <div class="modal" onClick=getTrailer>
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
                            <div class="carousel-card bg-base-100 shadow-xl" style="height:700px;">
                                <div class="carousel-card-body">
                                    <p><b>About This Movie</b><br><br><strong>${title}</strong><br>${overview}<br><br><b>Genre(s):</b> ${movieGenre} | <b>Type: </b> Movie | <b>Status: </b>${status} | <b>Budget:</b> ${formattedBudget} | <b>Revenue:</b> ${formattedRevenue}<br><br></p>
									
									<div class="flex">
										<p id="${specialCharWatchProviders}" style="
												flex-wrap: wrap !important;
												justify-content: flex-start !important;
												align-items: center !important;">
												<b>Watch Providers: &nbsp; </b>
										</p>
									</div>

									<br><br>
									
									<div class="flex2 " style="flex-wrap:wrap; height:400px;">	
										<div class="mr-40" id="${specialCharCast}">
											<p><b>Cast: </b></p>
										</div>
										
										<div>
											<p><b>Trailer: </b></p>
											<div class="carousel-card-two ml-20 relative bottom-0 bg-base-100 shadow-xl" style="width: 400px; height: 250px;" id="${specialChar}"></div>
										</div>
									</div>
                                </div>
                            </div>
                        </div> 

                        <div id="item2${title}" class="carousel-item w-full">
							<div class="carousel-card-three bg-base-100 shadow-xl">
								<div class="carousel-card-three-body">
									<div class="carousel-card-four relative bottom-0 left-1 bg-base-100 shadow-xl" id="${specialCharReviews}">
										<div class="carousel-card-four-body"></div>
									</div>
								</div>
							</div>
                        </div> 

                        <div id="item3${title}" class="carousel-item w-full">
							<div class="carousel-card-five bg-base-100 shadow-xl">
								<div class="carousel-card-five-body">
									<div class="carousel-card-six bg-base-100 shadow-xl flex justify-center" id="${specialCharSimilar}" style="flex-wrap:wrap">
										<div class="carousel-card-six-body">
										</div>
									</div>
								</div>
							</div>
                        </div> 
						
                    </div> 

                </div>
            </div>
        </div>`;
		
	movieCarousel.innerHTML += movieEl;
	
	getWatchProviders(data["watch/providers"].results["US"], specialCharWatchProviders);
	setTimeout(function () { getTrailer(videos.results, specialChar); }, 10);
	getCast(credits.cast, specialCharCast);
	getReviews(reviews.results, specialCharReviews);
	getSimilar(similar.results, specialCharSimilar);

	/* Fill heart if movie exists in firestore */
	let hIcon = document.querySelectorAll('.heart-icon-trending-movies');
	// find all favorited movies from firestore
	trendingMovieHearts.forEach(heart => {
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

	/* Add/Remove movie if heart clicked */
	hIcon.forEach((icon, index) => {
		icon.addEventListener('click', () => {
			if (icon.classList.contains('fa-regular')) {
				icon.classList.remove('fa-regular');
				icon.classList.add('fa-solid');
				addItemToFirestore(
					trendingMovieHearts[index].movieId,
					trendingMovieHearts[index].movieTitle,
					trendingMovieHearts[index].release,
					trendingMovieHearts[index].description,
					'movie'
				);
				count++;
				document.getElementsByClassName('badge')[0].innerHTML = count;
			} else {
				icon.classList.remove('fa-solid');
				icon.classList.add('fa-regular');
				deleteItemFromFirestore(trendingMovieHearts[index].movieTitle);
				count--;
				document.getElementsByClassName('badge')[0].innerHTML = count;
			}
		});
	});
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
	const slides = document.getElementsByClassName('carousel-item-big-boi');

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

	// show the active slide
	slides[slideIndex - 1].classList.remove('hidden');
}

function carouselStuff(data) {
	const {
		title,
		poster_path,
		backdrop_path,
		release_date,
		vote_average,
		budget,
		revenue,
		genres,
		status,
		tagline,
		runtime,
		overview,
		videos,
		id,
	} = data;
	const backdrop_url = POSTER_URL + backdrop_path;

	const specialChar = id + title + '%';
	const movieEl = `
    <div id="${title,id}" class="carousel-item-big-boi w-full ">
    <label for="my-modal-${title,id}" class="btn modal-button" style="height: 502px !important;padding-right: 0px !important;padding-left: 0px !important;margin-right: 0px !important;margin-left: 0px !important;margin-bottom: 0px !important;padding-bottom: 0px !important;width: 100% !important;" onClick="moveIt(1)">
    <img src="${
        backdrop_url
                }" alt="poster" style="margin-right: auto; margin-left: auto; !important;height: 100% !important;overflow: hidden !important;width: 100% !important;padding-top: 0px;padding-bottom: 0px;padding-right: 0px;
                border-left-width: 0px;padding-left: 0px;border-right-width: 0px;border-top-width: 0px;"></img>
    </label>

    <input type="checkbox" class="modal-toggle" id="my-modal-${title,id}" />
        <div class="modal">
            <div class="modal-box bg-[#000000] from-zinc-900 relative w-full max-w-5xl h-full" id="${title}">
                <label
                    for="my-modal-${title,id}"
                    class="btn btn-sm btn-circle absolute right-2 top-2"
                    onclick="moveIt(0)">✕
                </label>
                <div class="card-body" id="${specialChar}"></div>
				<div style="color:white;">
				<h1 class="card-title" style="text-align: center !important;">
					<font size="+100">${title}</font> 
				</h1>
				<br/>
				
				<p><h3> <b> Overview </b> </h3><br>${overview}<br><br><b>Genre:</b> ${
					genres[0].name
				} | <b>Type: </b> Movie | <b>Status: </b>${status} | <b>Budget:</b> ${budget} | <b>Revenue:</b> ${revenue}<br><br><b>
				</div>
            </div>
        </div>
    </div>
    `;
	document.getElementById('poggers').innerHTML += movieEl;
	getTrailer(videos.results, specialChar);
}

function openTab(evt, tabName) {
	// Declare all variables
	var i, tabcontent, tablinks;

	if (tabName === 'about') Active();

	// Get all elements with class="tabcontent" and hide them
	tabcontent = document.getElementsByClassName('tabcontent');
	for (i = 0; i < tabcontent.length; i++) {
		tabcontent[i].style.display = 'none';
	}

	// Get all elements with class="tablinks" and remove the class "active"
	tablinks = document.getElementsByClassName('tablinks');
	for (i = 0; i < tablinks.length; i++) {
		tablinks[i].className = tablinks[i].className.replace(' active', '');
	}

	// Show the current tab, and add an "active" class to the link that opened the tab
	document.getElementById(tabName).style.display = 'block';
	evt.currentTarget.className += ' active';
}

var slideInterval;

function moveIt(redlight) {
	
	if (redlight == 1) clearInterval(slideInterval);
	else slideInterval = setInterval(move, 8000);
}
function move() {
	moveSlide(1);
}

function userName() {
	let userNameChanged;
	userNameChanged = document.getElementById('userName').value;
}

function userBirth() {
	const dateControl = document.querySelector('input[type="date"]');
	userBirthChanged = parseDate(document.getElementById('userBirth').value);
}

function userGender() {
	let option;
	option = document.getElementById('gender').value;
}
function userEmail() {
	let userEmailChanged;
	userEmailChanged = document.getElementById('userEmail').value;
}
function userPassword() {
	let userPasswordChanged;
	userPasswordChanged = document.getElementById('pwd').value;
}

var userObject = {
	name: 'John Doe',
	birthday: '06/04/2000',
	gender: 'Man',
	email: 'example@example.com',
	password: 'password',
};

function Active() {
	var e;
	e = document.getElementById('first');
	e.classList.remove('active');
}

let slideIndexa = 1;
showSlidea(slideIndexa);

// change slide with the prev/next button
function moveSlidea(moveStep) {
	showSlidea((slideIndexa = moveStep + 5));
}
// change slide with the dots
function currentSlidea(n) {
	showSlidea((slideIndexa = n));
}

function showSlidea(n) {
	let i;
	const slidesa = document.getElementsByClassName('carousel-item');
	const dotsa = document.getElementsByClassName('dot');

	if (n > slidesa.length) {
		slideIndexa = 1;
	}

	if (n < 1) {
		slideIndexa = slidesa.length;
	}

	// hide all slides
	for (i = 0; i < slidesa.length; i++) {
		slidesa[i].classList.add('hidden');
	}

	// remove active status from all dots
	for (i = 0; i < dotsa.length; i++) {
		dotsa[i].classList.remove('bg-yellow-500');
		dotsa[i].classList.add('bg-green-600');
	}

	// show the active slide
	slidesa[slideIndexa - 1].classList.remove('hidden');

	// highlight the active dot
	dotsa[slideIndexa - 1].classList.remove('bg-green-600');
	dotsa[slideIndexa - 1].classList.add('bg-yellow-500');
}

/* Makes an API fetch call to get movies with whatever url you want -- this could be for upcoming movies, popular, etc */
function getTopMovies(url) {
	fetch(url)
		.then(res => res.json())
		.then(data => {
			data.results.forEach(movie => {
				movieCarousel2.innerHTML = '';

				/* Append to this response to get multiple things to return in one request (append_to_response=...) */
				/* This will get all details, credits, similar movies, and images | Refer to API documentation for other things to append */
				const DETAIL_URL =
					BASE_URL +
					'movie/' +
					movie.id +
					'?' +
					API_KEY +
					'&language=en-US&append_to_response=videos,reviews,similar,credits,similar,images,watch/providers';

				fetch(DETAIL_URL)
					.then(res => res.json())
					.then(data => {
						topMovieHearts.push({
							movieId: data.id,
							movieTitle: data.title,
							release: data.release_date,
							description: data.overview,
						});
						displayTopMovies(data);
					});
			});
		})
		.catch(error => {
			console.log(error);
		});
}

/* Will loop through the data returned by the previous API call & display various pieces of info in HTML */
function displayTopMovies(data) {
	const {
		title,
        poster_path,
        vote_average,
        overview,
        backdrop_path,
        release_date,
        runtime,
		reviews,
        budget,
        revenue,
        genres, 
        status,
        tagline,
		videos,
		credits,
		similar,
        id
    } = data;

    const backdrop_url = POSTER_URL + backdrop_path;
    const specialChar = title + id;
    const specialCharReviews = id + title;
	const specialCharSimilar = id + title + '&&';
	const specialCharCast = id + title + '//';
	const specialCharWatchProviders = id + title + '..';
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

	genres.forEach(genre => {
		movieGenre += genre.name + ", ";
	})

	const movieEl = `
        <div class="carousel-item relative">
			<label for="my-modal-${title}" class="btn modal-button" style="height: 300px !important; padding-right: 0px !important; padding-left: 0px !important; margin-right: 10px !important; margin-left: 10px !important; margin-bottom: 10px !important; padding-bottom: 0px !important; width: 200px !important;">
			<img src="${
							POSTER_URL + poster_path
						}" alt="poster" style="margin-right: 0px !important; height: 300px !important; width: 200px !important;">
			</label>
            <i id="heart-${title}" class="heart-icon-top-movies fa-regular fa-heart absolute right-8 bottom-[80px] text-4xl text-white hover: cursor-pointer" aria-hidden="true"></i>
			<input type="checkbox" class="modal-toggle" id="my-modal-${title}" />
            <div class="modal" onClick=getTrailer>
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
							<div class="carousel-card bg-base-100 shadow-xl" style="height:700px;">
                                <div class="carousel-card-body">
                                    <p><b>About This Movie</b><br><br><strong>${title}</strong><br>${overview}<br><br><b>Genre:</b> ${movieGenre} | <b>Type: </b> Movie | <b>Status: </b>${status} | <b>Budget:</b> ${formattedBudget} | <b>Revenue:</b> $${formattedRevenue}<br><br></p>
									
									<div class="flex">
										<p id="${specialCharWatchProviders}" style="
												flex-wrap: wrap !important;
												justify-content: flex-start !important;
												align-items: center !important;">
												<b>Watch Providers: &nbsp; </b>
										</p>
									</div>

									<br><br>
									
									<div class="flex2 " style="flex-wrap:wrap; height:400px;">	
										<div class="mr-40" id="${specialCharCast}">
											<p><b>Cast: </b></p>
											
										</div>
										
										<div>
											<p><b>Trailer: </b></p>
											<div class="carousel-card-two ml-20 relative bottom-0 bg-base-100 shadow-xl" style="width: 400px; height: 250px;" id="${specialChar}"></div>
										</div>
									</div>
                                </div>
                            </div>
                        </div> 

                        <div id="item2${title}" class="carousel-item w-full">
							<div class="carousel-card-three bg-base-100 shadow-xl">
								<div class="carousel-card-three-body">
									<div class="carousel-card-four relative bottom-0 left-1 bg-base-100 shadow-xl" id="${specialCharReviews}">
										<div class="carousel-card-four-body"></div>
									</div>
								</div>
							</div>
                        </div> 

                        <div id="item3${title}" class="carousel-item w-full">
							<div class="carousel-card-five bg-base-100 shadow-xl">
								<div class="carousel-card-five-body">
									<div class="carousel-card-six bg-base-100 shadow-xl flex justify-center" id="${specialCharSimilar}" style="flex-wrap:wrap">
										<div class="carousel-card-six-body">
										</div>
									</div>
								</div>
							</div>
                        </div> 
						
                    </div> 

                </div>
            </div>
        </div>`;
		
	movieCarousel2.innerHTML += movieEl;
	
	getWatchProviders(data["watch/providers"].results["US"], specialCharWatchProviders);
	setTimeout(function () { getTrailer(videos.results, specialChar); }, 10);
	getCast(credits.cast, specialCharCast);
	getReviews(reviews.results, specialCharReviews);
	getSimilar(similar.results, specialCharSimilar);

	/* Fill heart if movie exists in firestore */
	let hIcon = document.querySelectorAll('.heart-icon-top-movies');
	// find all favorited movies from firestore
	topMovieHearts.forEach(heart => {
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

	/* Add/Remove movie if heart clicked */
	hIcon.forEach((icon, index) => {
		icon.addEventListener('click', () => {
			if (icon.classList.contains('fa-regular')) {
				icon.classList.remove('fa-regular');
				icon.classList.add('fa-solid');
				addItemToFirestore(
					topMovieHearts[index].movieId,
					topMovieHearts[index].movieTitle,
					topMovieHearts[index].release,
					topMovieHearts[index].description,
					'movie'
				);

				count++;
				document.getElementsByClassName('badge')[0].innerHTML = count;
			} else {
				icon.classList.remove('fa-solid');
				icon.classList.add('fa-regular');
				deleteItemFromFirestore(topMovieHearts[index].movieTitle);
				count--;
				document.getElementsByClassName('badge')[0].innerHTML = count;
			}
		});
	});
}

/* Makes an API fetch call to get movies with whatever url you want -- this could be for upcoming movies, popular, etc */
function getPlayingMovies(url) {
	fetch(url)
		.then(res => res.json())
		.then(data => {
			data.results.forEach(movie => {
				movieCarousel6.innerHTML = '';

				/* Append to this response to get multiple things to return in one request (append_to_response=...) */
				/* This will get all details, credits, similar movies, and images | Refer to API documentation for other things to append */
				const DETAIL_URL =
					BASE_URL +
					'movie/' +
					movie.id +
					'?' +
					API_KEY +
					'&language=en-US&append_to_response=videos,reviews,similar,credits,similar,images,watch/providers';

				const TRAILER_URL =
					BASE_URL + 'movie/' + movie.id + 'videos?' + API_KEY;
				fetch(DETAIL_URL)
					.then(res => res.json())
					.then(data => {
						playingMovieHearts.push({
							movieId: data.id,
							movieTitle: data.title,
							release: data.release_date,
							description: data.overview,
						});
						displayPlayingMovies(data);
					});
			});
		})
		.catch(error => {
			console.log(error);
		});
}

/* Will loop through the data returned by the previous API call & display various pieces of info in HTML */
function displayPlayingMovies(data) {
	const {
		title,
        poster_path,
        vote_average,
        overview,
        backdrop_path,
        release_date,
        runtime,
		reviews,
        budget,
        revenue,
        genres, 
        status,
        tagline,
		videos,
		credits,
		similar,
        id
    } = data;

    const backdrop_url = POSTER_URL + backdrop_path;
    const specialChar = title + id;
    const specialCharReviews = id + title;
	const specialCharSimilar = id + title + '&&&';
	const specialCharCast = id + title + '///';
	const specialCharWatchProviders = id + title + '...';
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

	genres.forEach(genre => {
		movieGenre += genre.name + ", ";
	})

	const movieEl = `
        <div class="carousel-item relative">
			<label for="my-modal-${title}" class="btn modal-button" style="height: 300px !important; padding-right: 0px !important; padding-left: 0px !important; margin-right: 10px !important; margin-left: 10px !important; margin-bottom: 10px !important; padding-bottom: 0px !important; width: 200px !important;">
			<img src="${
							POSTER_URL + poster_path
						}" alt="poster" style="margin-right: 0px !important; height: 300px !important; width: 200px !important;">
			</label>
            <i id="heart-${title}" class="heart-icon-playing-movies fa-regular fa-heart absolute right-8 bottom-[80px] text-4xl text-white hover: cursor-pointer" aria-hidden="true"></i>
            <input type="checkbox" class="modal-toggle" id="my-modal-${title}" />
            <div class="modal" onClick=getTrailer>
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
							<div class="carousel-card bg-base-100 shadow-xl" style="height:700px;">
                                <div class="carousel-card-body">
                                    <p><b>About This Movie</b><br><br><strong>${title}</strong><br>${overview}<br><br><b>Genre:</b> ${movieGenre} | <b>Type: </b> Movie | <b>Status: </b>${status} | <b>Budget:</b> ${formattedBudget} | <b>Revenue:</b> ${formattedRevenue}<br><br></p>
									
									<div class="flex">
										<p id="${specialCharWatchProviders}" style="
												flex-wrap: wrap;
												justify-content: flex-start !important;
												align-items: center !important;">
												<b>Watch Providers: ; </b>
										</p>
									</div>

									<br><br>
									
									<div class="flex2 " style="flex-wrap:wrap; height:400px;">	
										<div class="mr-40" id="${specialCharCast}">
											<p><b>Cast: </b></p>
											
										</div>
										
										<div>
											<p><b>Trailer: </b></p>
											<div class="carousel-card-two ml-20 relative bottom-0 bg-base-100 shadow-xl" style="width: 400px; height: 250px;" id="${specialChar}"></div>
										</div>
									</div>
                                </div>
                            </div>
                        </div> 

                        <div id="item2${title}" class="carousel-item w-full">
							<div class="carousel-card-three bg-base-100 shadow-xl">
								<div class="carousel-card-three-body">
									<div class="carousel-card-four relative bottom-0 left-1 bg-base-100 shadow-xl" id="${specialCharReviews}">
										<div class="carousel-card-four-body"></div>
									</div>
								</div>
							</div>
                        </div> 

                        <div id="item3${title}" class="carousel-item w-full">
							<div class="carousel-card-five bg-base-100 shadow-xl">
								<div class="carousel-card-five-body">
									<div class="carousel-card-six bg-base-100 shadow-xl flex justify-center" id="${specialCharSimilar}" style="flex-wrap:wrap">
										<div class="carousel-card-six-body">
										</div>
									</div>
								</div>
							</div>
                        </div> 
						
                    </div> 

                </div>
            </div>
        </div>`;
		
	movieCarousel6.innerHTML += movieEl;
	
	getWatchProviders(data["watch/providers"].results["US"], specialCharWatchProviders);
	setTimeout(function () { getTrailer(videos.results, specialChar); }, 10);
	getCast(credits.cast, specialCharCast);
	getReviews(reviews.results, specialCharReviews);
	getSimilar(similar.results, specialCharSimilar);

	/* Fill heart if movie exists in firestore */
	let hIcon = document.querySelectorAll('.heart-icon-playing-movies');
	// find all favorited movies from firestore
	playingMovieHearts.forEach(heart => {
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

	/* Add/Remove movie if heart clicked */
	hIcon.forEach((icon, index) => {
		icon.addEventListener('click', () => {
			if (icon.classList.contains('fa-regular')) {
				icon.classList.remove('fa-regular');
				icon.classList.add('fa-solid');
				addItemToFirestore(
					playingMovieHearts[index].movieId,
					playingMovieHearts[index].movieTitle,
					playingMovieHearts[index].release,
					playingMovieHearts[index].description,
					'movie'
				);

				count++;
				document.getElementsByClassName('badge')[0].innerHTML = count;
			} else {
				icon.classList.remove('fa-solid');
				icon.classList.add('fa-regular');
				deleteItemFromFirestore(playingMovieHearts[index].movieTitle);
				count--;
				document.getElementsByClassName('badge')[0].innerHTML = count;
			}
		});
	});
}

/* Makes an API fetch call to get movies with whatever url you want -- this could be for upcoming movies, popular, etc */
function getUpcomingMovies(url) {
	fetch(url)
		.then(res => res.json())
		.then(data => {
			data.results.forEach(movie => {
				movieCarousel7.innerHTML = '';

				/* Append to this response to get multiple things to return in one request (append_to_response=...) */
				/* This will get all details, credits, similar movies, and images | Refer to API documentation for other things to append */
				const DETAIL_URL =
					BASE_URL +
					'movie/' +
					movie.id +
					'?' +
					API_KEY +
					'&language=en-US&append_to_response=videos,reviews,similar,credits,similar,images,watch/providers';

				fetch(DETAIL_URL)
					.then(res => res.json())
					.then(data => {
						upcomingMovieHearts.push({
							movieId: data.id,
							movieTitle: data.title,
							release: data.release_date,
							description: data.overview,
						});
						displayUpcomingMovies(data);
					});
			});
		})
		.catch(error => {
			console.log(error);
		});
}

/* Will loop through the data returned by the previous API call & display various pieces of info in HTML */
function displayUpcomingMovies(data) {
	const {
		title,
        poster_path,
        vote_average,
        overview,
        backdrop_path,
        release_date,
        runtime,
		reviews,
        budget,
        revenue,
        genres, 
        status,
        tagline,
		videos,
		credits,
		similar,
        id
    } = data;

    const backdrop_url = POSTER_URL + backdrop_path;
    const specialChar = title + id;
    const specialCharReviews = id + title;
	const specialCharSimilar = id + title + '&&&&';
	const specialCharCast = id + title + '////';
	const specialCharWatchProviders = id + title + '....';
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

	genres.forEach(genre => {
		movieGenre += genre.name + ", ";
	})

	const movieEl = `
        <div class="carousel-item relative">
			<label for="my-modal-${title}" class="btn modal-button" style="height: 300px !important; padding-right: 0px !important; padding-left: 0px !important; margin-right: 10px !important; margin-left: 10px !important; margin-bottom: 10px !important; padding-bottom: 0px !important; width: 200px !important;">
			<img src="${
							POSTER_URL + poster_path
						}" alt="poster" style="margin-right: 0px !important; height: 300px !important; width: 200px !important;">
			</label>
            <i id="heart-${title}" class="heart-icon-upcoming-movies fa-regular fa-heart absolute right-8 bottom-[80px] text-4xl text-white hover: cursor-pointer" aria-hidden="true"></i>
            <input type="checkbox" class="modal-toggle" id="my-modal-${title}" />
            <div class="modal" onClick=getTrailer>
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
							<div class="carousel-card bg-base-100 shadow-xl" style="height:700px;">
                            	<div class="carousel-card-body">
                                    <p><b>About This Movie</b><br><br><strong>${title}</strong><br>${overview}<br><br><b>Genre:</b> ${movieGenre} | <b>Type: </b> Movie | <b>Status: </b>${status} | <b>Budget:</b> ${formattedBudget} | <b>Revenue:</b> ${formattedRevenue}<br><br></p>
									
									<div class="flex">
										<p id="${specialCharWatchProviders}" style="
												flex-wrap: wrap;
												justify-content: flex-start !important;
												align-items: center !important;">
												<b>Watch Providers: ; </b>
										</p>
									</div>

									<br><br>
									
									<div class="flex2 " style="flex-wrap:wrap; height:400px;">	
										<div class="mr-40" id="${specialCharCast}">
											<p><b>Cast: </b></p>
											
										</div>
										
										<div>
											<p><b>Trailer: </b></p>
											<div class="carousel-card-two ml-20 relative bottom-0 bg-base-100 shadow-xl" style="width: 400px; height: 250px;" id="${specialChar}"></div>
										</div>
									</div>
                                </div>
                            </div>
                        </div> 

                        <div id="item2${title}" class="carousel-item w-full">
							<div class="carousel-card-three bg-base-100 shadow-xl">
								<div class="carousel-card-three-body">
									<div class="carousel-card-four relative bottom-0 left-1 bg-base-100 shadow-xl" id="${specialCharReviews}">
										<div class="carousel-card-four-body"></div>
									</div>
								</div>
							</div>
                        </div> 

                        <div id="item3${title}" class="carousel-item w-full">
							<div class="carousel-card-five bg-base-100 shadow-xl">
								<div class="carousel-card-five-body">
									<div class="carousel-card-six bg-base-100 shadow-xl flex justify-center" id="${specialCharSimilar}" style="flex-wrap:wrap">
										<div class="carousel-card-six-body">
										</div>
									</div>
								</div>
							</div>
                        </div> 
						
                    </div> 

                </div>
            </div>
        </div>`;
		
	movieCarousel7.innerHTML += movieEl;
	
	getWatchProviders(data["watch/providers"].results["US"], specialCharWatchProviders);
	setTimeout(function () { getTrailer(videos.results, specialChar); }, 10);
	getCast(credits.cast, specialCharCast);
	getReviews(reviews.results, specialCharReviews);
	getSimilar(similar.results, specialCharSimilar);

	/* Fill heart if movie exists in firestore */
	let hIcon = document.querySelectorAll('.heart-icon-upcoming-movies');
	// find all favorited movies from firestore
	upcomingMovieHearts.forEach(heart => {
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

	/* Add/Remove movie if heart clicked */
	hIcon.forEach((icon, index) => {
		icon.addEventListener('click', () => {
			if (icon.classList.contains('fa-regular')) {
				icon.classList.remove('fa-regular');
				icon.classList.add('fa-solid');
				addItemToFirestore(
					upcomingMovieHearts[index].movieId,
					upcomingMovieHearts[index].movieTitle,
					upcomingMovieHearts[index].release,
					upcomingMovieHearts[index].description,
					'movie'
				);

				count++;
				document.getElementsByClassName('badge')[0].innerHTML = count;
			} else {
				icon.classList.remove('fa-solid');
				icon.classList.add('fa-regular');
				deleteItemFromFirestore(upcomingMovieHearts[index].movieTitle);
				count--;
				document.getElementsByClassName('badge')[0].innerHTML = count;
			}
		});
	});
}

/* Makes an API fetch call to get movies with whatever url you want -- this could be for upcoming movies, popular, etc */
function getTrendingTV(url) {
	fetch(url)
		.then(res => res.json())
		.then(data => {
			// console.log('shows: ', data);
			data.results.forEach(tv => {
				movieCarousel3.innerHTML = '';
				/* Append to this response to get multiple things to return in one request */
				/* This will get all details, credits, similar tv shows, and images */
				const DETAIL_URL =
					BASE_URL +
					'tv/' +
					tv.id +
					'?' +
					API_KEY +
					'&language=en-US&append_to_response=videos,reviews,similar,credits,similar,images,watch/providers';
				fetch(DETAIL_URL)
					.then(res => res.json())
					.then(data => {
            			trendingTvHearts.push({
						tvId: data.id,
						tvName: data.name,
						first_air_date: data.first_air_date,
						description: data.overview,
            		});
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
		reviews,
		status,
		videos,
		credits,
		genres,
		similar,
		id,
		number_of_seasons,
		episode_run_time,
		tagline,
	} = data;

    const backdrop_url = POSTER_URL + backdrop_path;
    const specialChar = name + id;
    const specialCharReviews = id + name;
	const specialCharSimilar = id + name + '&&&&&';
	const specialCharCast = id + name + '/////';
	const specialCharWatchProviders = id + name + '.....';
	let tvGenre = '';

	genres.forEach(genre => {
		tvGenre += genre.name + ", ";
	})

	const showEl = `
        <div class="carousel-item relative">
			<label for="my-modal-${name}" class="btn modal-button" style="height: 300px !important; padding-right: 0px !important; padding-left: 0px !important; margin-right: 10px !important; margin-left: 10px !important; margin-bottom: 10px !important; padding-bottom: 0px !important; width: 200px !important;">
			<img src="${
							POSTER_URL + poster_path
						}" alt="poster" style="margin-right: 0px !important; height: 300px !important; width: 200px !important;">
			</label>
            <i id="heart-${name}" class="heart-icon-trending-tv fa-regular fa-heart absolute right-8 bottom-[80px] text-4xl text-white hover: cursor-pointer" aria-hidden="true"></i>
            <input type="checkbox" class="modal-toggle" id="my-modal-${name}" />
            <div class="modal">
                <div class="modal-box bg-gradient-to-t bg-gradient-to-t from-zinc-900 relative w-full max-w-5xl h-full">
                    <label
                        for="my-modal-${name}"
                        class="btn btn-sm btn-circle absolute right-2 top-2"
                        >✕
                    </label>
                    <div class="card bg-base-100 shadow-xl image-full">
                        <figure> <img src="${backdrop_url}" alt="poster" style="margin-right: 0px !important; height: 400px !important; width: 960px !important;"></img> </figure>
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
							<div class="carousel-card bg-base-100 shadow-xl" style="height:700px;">
                                <div class="carousel-card-body">
                                    <p><b>About This Show</b><br><br><strong>${name}</strong><br>${overview}<br><br><b>Genre:</b> ${tvGenre} | <b>Type: </b> Show | <b>Status: </b>${status}<br><br></p>
									
									<div class="flex">
										<p id="${specialCharWatchProviders}" style="
												flex-wrap: wrap;
												justify-content: flex-start !important;
												align-items: center !important;">
												<b>Watch Providers: ; </b>
										</p>
									</div>

									<br><br>
									
									<div class="flex2 " style="flex-wrap:wrap; height:400px;">	
										<div class="mr-40" id="${specialCharCast}">
											<p><b>Cast: </b></p>
											
										</div>
										
										<div>
											<p><b>Trailer: </b></p>
											<div class="carousel-card-two ml-20 relative bottom-0 bg-base-100 shadow-xl" style="width: 400px; height: 250px;" id="${specialChar}"></div>
										</div>
									</div>
                                </div>
                            </div>
                        </div> 
                        
						<div id="item2${name}" class="carousel-item w-full">
							<div class="carousel-card-three bg-base-100 shadow-xl">
								<div class="carousel-card-three-body">
									<div class="carousel-card-four relative bottom-0 left-1 bg-base-100 shadow-xl" id="${specialCharReviews}">
										<div class="carousel-card-four-body"></div>
									</div>
								</div>
							</div>
                        </div> 

                        <div id="item3${name}" class="carousel-item w-full">
							<div class="carousel-card-five bg-base-100 shadow-xl">
								<div class="carousel-card-five-body">
									<div class="carousel-card-six bg-base-100 shadow-xl flex justify-center" id="${specialCharSimilar}" style="flex-wrap:wrap">
										<div class="carousel-card-six-body"></div>
									</div>
								</div>
							</div>
                        </div> 
                    </div> 
                </div>
			</div>
        </div>
    </div>`;

	movieCarousel3.innerHTML += showEl;
	getWatchProviders(data["watch/providers"].results["US"], specialCharWatchProviders);
	setTimeout(function () { getTrailer(videos.results, specialChar); }, 10);
	getCast(credits.cast, specialCharCast);
	getReviews(reviews.results, specialCharReviews);
	getSimilarTV(similar.results, specialCharSimilar);

  /* Fill heart if tv exists in firestore */
	let hIcon = document.querySelectorAll('.heart-icon-trending-tv');
	// find all favorited movies from firestore
	trendingTvHearts.forEach(heart => {
		for (let tv in heart) {
			if (tv == 'tvName') {
				let docName = heart[tv];
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

	/* Add/Remove movie if heart clicked */
	hIcon.forEach((icon, index) => {
		icon.addEventListener('click', () => {
			if (icon.classList.contains('fa-regular')) {
				icon.classList.remove('fa-regular');
				icon.classList.add('fa-solid');
				addItemToFirestore(
					trendingTvHearts[index].tvId,
					trendingTvHearts[index].tvName,
					trendingTvHearts[index].first_air_date,
					trendingTvHearts[index].description,
					'tv'
				);

				count++;
				document.getElementsByClassName('badge')[0].innerHTML = count;
			} else {
				icon.classList.remove('fa-solid');
				icon.classList.add('fa-regular');
				deleteItemFromFirestore(trendingTvHearts[index].tvName);
				count--;
				document.getElementsByClassName('badge')[0].innerHTML = count;
			}
		});
	});
}

/* Makes an API fetch call to get movies with whatever url you want -- this could be for upcoming movies, popular, etc */
function getTopTV(url) {
	fetch(url)
		.then(res => res.json())
		.then(data => {
			// console.log('shows: ', data);
			data.results.forEach(tv => {
				movieCarousel4.innerHTML = '';
				/* Append to this response to get multiple things to return in one request */
				/* This will get all details, credits, similar tv shows, and images */
				const DETAIL_URL =
					BASE_URL +
					'tv/' +
					tv.id +
					'?' +
					API_KEY +
					'&language=en-US&append_to_response=videos,reviews,similar,credits,similar,images,watch/providers';
				fetch(DETAIL_URL)
					.then(res => res.json())
					.then(data => {
            topTvHearts.push({
              tvId: data.id,
              tvName: data.name,
              first_air_date: data.first_air_date,
              description: data.overview,
            });
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
		reviews,
		status,
		videos,
		credits,
		genres,
		similar,
		id,
		number_of_seasons,
		episode_run_time,
		tagline,
	} = data;

    const backdrop_url = POSTER_URL + backdrop_path;
    const specialChar = name + id;
    const specialCharReviews = id + name;
	const specialCharSimilar = id + name + '&&&&&&';
	const specialCharCast = id + name + '//////';
	const specialCharWatchProviders = id + name + '......';
	let tvGenre = '';

	genres.forEach(genre => {
		tvGenre += genre.name + ", ";
	})

	const showEl = `
        <div class="carousel-item relative">
			<label for="my-modal-${name}" class="btn modal-button" style="height: 300px !important; padding-right: 0px !important; padding-left: 0px !important; margin-right: 10px !important; margin-left: 10px !important; margin-bottom: 10px !important; padding-bottom: 0px !important; width: 200px !important;">
				<img src="${
							POSTER_URL + poster_path
						}" alt="poster" style="margin-right: 0px !important; height: 300px !important; width: 200px !important;">
			</label>
            <i id="heart-${name}" class="heart-icon-top-tv fa-regular fa-heart absolute right-8 bottom-[80px] text-4xl text-white hover: cursor-pointer" aria-hidden="true"></i>
            <input type="checkbox" class="modal-toggle" id="my-modal-${name}" />
            <div class="modal">
                <div class="modal-box bg-gradient-to-t bg-gradient-to-t from-zinc-900 relative w-full max-w-5xl h-full">
                    <label
                        for="my-modal-${name}"
                        class="btn btn-sm btn-circle absolute right-2 top-2"
                        >✕
                    </label>
                    <div class="card bg-base-100 shadow-xl image-full">
                        <figure> <img src="${backdrop_url}" alt="poster" style="margin-right: 0px !important; height: 400px !important; width: 960px !important;"></img> </figure>
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
							<div class="carousel-card bg-base-100 shadow-xl" style="height:700px;">
                                <div class="carousel-card-body">
                                    <p><b>About This Show</b><br><br><strong>${name}</strong><br>${overview}<br><br><b>Genre:</b> ${tvGenre} | <b>Type: </b> Show | <b>Status: </b>${status}<br><br></p>
									
									<div class="flex">
										<p id="${specialCharWatchProviders}" style="
												flex-wrap: wrap;
												justify-content: flex-start !important;
												align-items: center !important;">
												<b>Watch Providers: ; </b>
										</p>
									</div>

									<br><br>
									
									<div class="flex2 " style="flex-wrap:wrap; height:400px;">	
										<div class="mr-40" id="${specialCharCast}">
											<p><b>Cast: </b></p>
											
										</div>
										
										<div>
											<p><b>Trailer: </b></p>
											<div class="carousel-card-two ml-20 relative bottom-0 bg-base-100 shadow-xl" style="width: 400px; height: 250px;" id="${specialChar}"></div>
										</div>
									</div>
                                </div>
                            </div>
                        </div> 
                        
						<div id="item2${name}" class="carousel-item w-full">
							<div class="carousel-card-three bg-base-100 shadow-xl">
								<div class="carousel-card-three-body">
									<div class="carousel-card-four relative bottom-0 left-1 bg-base-100 shadow-xl" id="${specialCharReviews}">
										<div class="carousel-card-four-body"></div>
									</div>
								</div>
							</div>
                        </div> 

                        <div id="item3${name}" class="carousel-item w-full">
							<div class="carousel-card-five bg-base-100 shadow-xl">
								<div class="carousel-card-five-body">
									<div class="carousel-card-six bg-base-100 shadow-xl flex justify-center" id="${specialCharSimilar}" style="flex-wrap:wrap">
										<div class="carousel-card-six-body"></div>
									</div>
								</div>
							</div>
                        </div> 
                    </div> 
                </div>
			</div>
        </div>
    </div>`;

	movieCarousel4.innerHTML += showEl;
	getWatchProviders(data["watch/providers"].results["US"], specialCharWatchProviders);
	setTimeout(function () { getTrailer(videos.results, specialChar); }, 10);
	getCast(credits.cast, specialCharCast);
	getReviews(reviews.results, specialCharReviews);
	getSimilarTV(similar.results, specialCharSimilar);

  /* Fill heart if tv exists in firestore */
	let hIcon = document.querySelectorAll('.heart-icon-top-tv');
	// find all favorited movies from firestore
	topTvHearts.forEach(heart => {
		for (let tv in heart) {
			if (tv == 'tvName') {
				let docName = heart[tv];
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

	/* Add/Remove movie if heart clicked */
	hIcon.forEach((icon, index) => {
		icon.addEventListener('click', () => {
			if (icon.classList.contains('fa-regular')) {
				icon.classList.remove('fa-regular');
				icon.classList.add('fa-solid');
				addItemToFirestore(
					topTvHearts[index].tvId,
					topTvHearts[index].tvName,
					topTvHearts[index].first_air_date,
					topTvHearts[index].description,
					'tv'
				);

				count++;
				document.getElementsByClassName('badge')[0].innerHTML = count;
			} else {
				icon.classList.remove('fa-solid');
				icon.classList.add('fa-regular');
				deleteItemFromFirestore(topTvHearts[index].tvName);
				count--;
				document.getElementsByClassName('badge')[0].innerHTML = count;
			}
		});
	});
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

async function getTrailer(videos, specialChar) {
	const YOUTUBE_TRAILER_URL = 'https://youtube.com/embed/';
	if (videos.length != 0) {
		videos.forEach(vid => {
			if (
				vid.name == 'Official Trailer' ||
				vid.name == 'Official Trailer [Subtitled]' ||
				vid.name == 'Dub Trailer' ||
				vid.name == 'United States Trailer'
			) {
				const trailer = YOUTUBE_TRAILER_URL + vid.key;
				const trailerHTML = `
                <iframe width="500" height="300"
                    src="${trailer}"
					allowfullscreen>
                <iframe>`;
				document.getElementById(specialChar).innerHTML = trailerHTML;
			}
		});
	} else trailerCount--;
}

async function getCast(credits, specialChar) {
	let i = 0;
	if (credits.length != 5) {
		credits.forEach(cred => {
			if (i != 5) {
				const castHTML = ` <p>${cred.name}</p> `;
				document.getElementById(specialChar).innerHTML += castHTML;
				i++;
			}
		})
	}
}

async function getReviews(reviews, specialChar) {
	if (reviews.length != 0) {
		reviews.forEach(rev => {
			const reviewHTML = ` <div> <p><b>${rev.author}</b> -- <b>Rating: ${rev.author_details.rating}/10</b><br>${rev.content}<div class="divider"></div></p> </div> `;
			document.getElementById(specialChar).innerHTML += reviewHTML;
		})
	}
}

async function getSimilar(movies, specialChar) {
	if (movies.length != 0) {
		movies.forEach(mov => {
			const similarHTML = `
				<label for="${mov.title}" class="tooltip" style="height: 300px !important; padding-right: 0px !important; padding-left: 0px !important; margin-right: 10px !important; margin-left: 10px !important; margin-bottom: 10px !important; padding-bottom: 0px !important;">
					<img src="${POSTER_URL + mov.poster_path}" alt="poster" style="object-fit: cover; margin-right: 0px !important; height: 300px !important; width: 200px !important;"></img>
					<span class="tooltiptext"><b>${mov.title}</b><br>${mov.vote_average}/10</span>
				</label>
				`;

			document.getElementById(specialChar).innerHTML += similarHTML;
		})
	}
}

async function getSimilarTV(tv, specialChar) {
	if (tv.length != 0) {
		tv.forEach(tvs => {
			const similarHTML = `
				<label for="${tvs.name}" class="tooltip" style="height: 300px !important; padding-right: 0px !important; padding-left: 0px !important; margin-right: 10px !important; margin-left: 10px !important; margin-bottom: 10px !important; padding-bottom: 0px !important;">
					<img src="${POSTER_URL + tvs.poster_path}" alt="poster" style="object-fit: cover; margin-right: 0px !important; height: 300px !important; width: 200px !important;"></img>
					<span class="tooltiptext"><b>${tvs.name}</b><br>${tvs.vote_average}/10</span>
				</label>
				`;

			document.getElementById(specialChar).innerHTML += similarHTML;
		})
	}
}
