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

getMovies(API_URL);

/* Makes an API fetch call to get movies with whatever url you want -- this could be for upcoming movies, popular, etc */
function getMovies(url) {
	fetch(url)
		.then(res => res.json())
		.then(data => {
			console.log(data.results);
			displayMovies(data.results);
		})
		.catch(error => {
			console.log(error);
		});
}

/* Will loop through the data returned by the previous API call & display various pieces of info in HTML */
function displayMovies(data) {
	data.forEach(movies => {
		const markup = `<li><b>${movies.title}</b> -- ${movies.release_date}</li> <br> <li>${movies.overview}</li> <br>`;
		document
			.getElementById('movie-data')
			.insertAdjacentHTML('beforeEnd', markup);
	});
}
