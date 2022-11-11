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
            console.log('Document successfully written!', movieTitle);
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

let hearts = [];
getMovies(API_URL);

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
/* This will fetch the URL passed to it and will retrieve a list of movies. It will then loop through each movie, use its ID to construct the DETAIL_URL, and make another API call */
/* This second call will return even more information about each movie and will call displayMovies on each movie to display them with access to all of the information retrieved */
 
var trailerCount = 0;
 
function getMovies(url) {
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
                    '&language=en-US&append_to_response=videos,credits,similar,images';
                fetch(DETAIL_URL)
                    .then(res => res.json())
                    .then(data => {
                        hearts.push({
                            movieId: data.id,
                            movieTitle: data.title,
                            release: data.release_date,
                            description: data.overview,
                        });
                        console.log(data);
       
                        if (trailerCount < 5) {
                            carouselStuff(data);
                            trailerCount++;
                        }
                       
                        showSlide(2);
                        displayMovies(data);
                    });
            });
        })
        .catch(error => {
            console.log(error);
        });
}
 
/* Passed a movie, which will contain all of the needed information about the individual movie (runtime, videos, etc) */
function displayMovies(data) {
    let count = 0;
    const {
        title,
        poster_path,
        vote_average,
        overview,
        backdrop_path,
        release_date,
        runtime
    } = data;
    const backdrop_url = POSTER_URL + backdrop_path;
 
    const movieEl = `
        <div class="carousel-item relative">
            <label for="my-modal-${title}" class="btn modal-button" style="height: 300px !important; padding-right: 0px !important; padding-left: 0px !important; margin-right: 10px !important; margin-left: 10px !important; margin-bottom: 10px !important; padding-bottom: 0px !important; width: 200px !important;">
            <img src="${
                            POSTER_URL + poster_path
                        }" alt="poster" style="margin-right: 0px !important; height: 300px !important; width: 200px !important;">
            </label>
            <i class="heart-icon fa-regular fa-heart absolute right-8 bottom-[230px] text-4xl text-white hover: cursor-pointer" aria-hidden="true"></i>
            <input type="checkbox" class="modal-toggle" id="my-modal-${title}" />
            <div class="modal">
                <div class="modal-box bg-gradient-to-t from-zinc-900 relative w-full max-w-5xl h-full">
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
                    </div>`;
                movieCarousel.innerHTML += movieEl;
             
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
                            deleteMovieFromFirestore(hearts[index].movieTitle);
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
                    vote_average,
                    overview,
                    backdrop_path,
                    release_date,
                    runtime,
                    id,
                    videos,
                } = data;
                const backdrop_url = POSTER_URL + backdrop_path;
             
                const specialChar = id + title;
                const movieEl = `
                <div id="${title,id}" class="carousel-item-big-boi w-full ">
                <label for="my-modal-${title,id}" class="btn modal-button" style="height: 502px !important;padding-right: 0px !important;padding-left: 0px !important;margin-right: 0px !important;margin-left: 0px !important;margin-bottom: 10px !important;padding-bottom: 0px !important;width: 1912px !important;" onClick="moveIt(1)">
                <img src="${
                    backdrop_url
                            }" alt="poster" style="margin-right: auto margin-left: !important;height: 552px !important;width: 1917px !important;padding-top: 0px;padding-bottom: 0px;padding-right: 0px;
                            border-left-width: 0px;padding-left: 0px;border-right-width: 0px;border-top-width: 0px;"></img>
                </label>
            
                <input type="checkbox" class="modal-toggle" id="my-modal-${title,id}" />
                    <div class="modal">
                        <div class="modal-box bg-[#000000] from-zinc-900 relative w-full max-w-5xl h-full" id="${title}">
                            <label
                                for="my-modal-${title,id}"
                                class="btn btn-sm btn-circle absolute right-2 top-2"
                                >✕
                            </label>
                            <div class="card-body" id="${specialChar}"> </div>
                       
                        </div>
                    </div>
                </div>
                `;
                document.getElementById('poggers').innerHTML += movieEl;
                getTrailer(videos.results, specialChar);
             
            }
            let number = 0;

function openTab(evt, tabName) {
    // Declare all variables
    var i, tabcontent, tablinks;

    if(tabName === 'about') Active();
  
    // Get all elements with class="tabcontent" and hide them
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = "none";
    }
  
    // Get all elements with class="tablinks" and remove the class "active"
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
  
    // Show the current tab, and add an "active" class to the link that opened the tab
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";
  }

  function moveIt(redlight){
	var slideInterval = setInterval(move, 6000);
    if (redlight == 1) clearInterval(slideInterval);
  }
  function move(){
	moveSlide(1);
  }

function userName(){
	let userNameChanged;
	userNameChanged = document.getElementById('userName').value;
}

function userBirth(){
	const dateControl = document.querySelector('input[type="date"]');
	userBirthChanged = parseDate(document.getElementById('userBirth').value);
}

function userGender(){
	let option;
	option = document.getElementById('gender').value;
}
function userEmail(){
	let userEmailChanged;
	userEmailChanged = document.getElementById('userEmail').value;
}
function userPassword(){
	let userPasswordChanged;
	userPasswordChanged = document.getElementById('pwd').value;
}

var userObject = {
    name: 'John Doe',
    birthday: '06/04/2000',
    gender: 'Man',
    email: 'example@example.com',
    password: 'password'
};

function Active(){
    var e;
    e = document.getElementById("first");
    e.classList.remove("active");
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
        budget,
        revenue,
        genres, 
        status,
        tagline,
        backdrop_path,
        poster_path,
        release_date,
        vote_average,
        runtime,
        overview,
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
                        </div> 
                            <div id="item3${title}" class="carousel-item w-full">
                                <img src="https://placeimg.com/800/200/arch" class="w-full" />
                            </div> 
           
            <a
            class="absolute left-0 top-1/2 p-4 -translate-y-4 bg-black/30 hover:bg-black/50 text-white hover:text-amber-500 cursor-pointer"
            onclick="moveSlidea(-1)"
            >❮
            </a>
            <a
                class="absolute right-0 top-1/2 p-4 -translate-y-4 bg-black/30 hover:bg-black/50 text-white hover:text-amber-500 cursor-pointer"
                onclick="moveSlidea(1)"
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
    } else  trailerCount--;
}  