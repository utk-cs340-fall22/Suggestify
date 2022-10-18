
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


fetch(
	'https://api.themoviedb.org/3/movie/upcoming?api_key=bb1d4e0661af455e02af1ea99fb85fcb&language=en-US&page=1'
)
	.then(response => {
		/* guard clause : Make sure the data is actually returning with a 200 status */
		if (!response.ok) {
			console.log('Problem obtaining a response from API');
			return;
		}
		return response.json();
	})
	.then(data => {
		for (const element of data.results) {
			const id = element.poster_path;
			let poster_url = 'https://image.tmdb.org/t/p/original/';
			poster_url = poster_url.concat(id);

			const markup = `<li><b>${element.title}</b> -- ${element.release_date}</li> <br> <li>${element.overview}</li> <br>`;

			document
				.getElementById('movie-data')
				.insertAdjacentHTML('beforeEnd', markup);
			// document.getElementById('movie-image').src = poster_url;
		}
	})
	.catch(error => {
		console.log(error);
	});

// path for images
// https://image.tmdb.org/t/p/original/[poster_path]
