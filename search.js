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
	document.getElementById('main').innerHTML = '';
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
					'&language=en-US&append_to_response=videos,credits,similar,images,reviews';
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

	const movieCard = document.getElementById('main');
	const movieEl = `
    <label for="${title}" class="btn modal-button" style="height: 400px !important; padding-right: 0px !important; padding-left: 0px !important; margin-right: 10px !important; margin-left: 10px !important; margin-bottom: 10px !important; padding-bottom: 0px !important; width: 250px !important;">
        <img src="${
					POSTER_URL + poster_path
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
	
    movieCard.innerHTML += movieEl;

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