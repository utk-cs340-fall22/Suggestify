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
 
/* This can be formatted to include whatever you want -- 'movie/upcoming' is just a placeholder for now */
const API_URL =
    BASE_URL + 'movie/upcoming?' + API_KEY + '&language=en-US&page=1';
 
/* After this URL, add the posterURL return from the API */
const POSTER_URL = 'https://image.tmdb.org/t/p/original/';
 
let hearts = [];
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
        runtime,
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
async function getTrailer(videos, specialChar) {
 
    const YOUTUBE_TRAILER_URL = 'https://youtube.com/embed/';
    if (videos.length != 0) {
        videos.forEach(vid => {
            if (vid.name == "Official Trailer" || vid.name == "Official Trailer [Subtitled]" || vid.name == "Dub Trailer") {
                const trailer = YOUTUBE_TRAILER_URL + vid.key;
                const trailerHTML = `
                <iframe width="full" height="500"
                    src="${trailer}">
                <iframe>`;
                document.getElementById(specialChar).innerHTML = trailerHTML;
            }
        })
    }
    else  trailerCount--;

}

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