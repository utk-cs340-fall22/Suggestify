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

	const movieUrl = `${BASE_URL}movie/${id}?${API_KEY}&language=en-US`;

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
		title,
		release_date,
		overview,
		poster_path,
		backdrop_path,
		vote_average,
		runtime,
		revenue,
	} = data;

	const backdropURL = POSTER_URL + backdrop_path;

	const movieCard = document.getElementById('card');
	const movieEl = document.createElement('div');
	movieEl.classList.add('movie');
	movieEl.innerHTML = `
    <label for="${title}" class="btn modal-button" style="height: 400px !important; padding-right: 0px !important; padding-left: 0px !important; margin-right: 10px !important; margin-left: 10px !important; margin-bottom: 10px !important; padding-bottom: 0px !important; width: 250px !important;">
        <img src="${
					POSTER_URL + poster_path
				}" alt="poster" style="margin-right: 0px !important; height: 400px !important; width: 250px !important;">
        </label>
        <i class="heart-icon-movies fa-solid fa-heart relative bottom-[4rem] right-[4rem] text-4xl text-white hover: cursor-pointer" aria-hidden="true"></i>
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
	movieCard.appendChild(movieEl);

	/* Heart functionality */
	let hIcon = document.querySelectorAll('.heart-icon-movies');
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

	const tvUrl = `${BASE_URL}tv/${id}?${API_KEY}&language=en-US`;

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
		revenue,
		number_of_seasons,
		episode_run_time,
	} = data;

	const backdropURL = POSTER_URL + backdrop_path;

	const showCard = document.getElementById('card');
	const showEl = document.createElement('div');
	showEl.classList.add('show');

	showEl.innerHTML = `
	<label for="${name}" class="btn modal-button" style="height: 400px !important; padding-right: 0px !important; padding-left: 0px !important; margin-right: 10px !important; margin-left: 10px !important; margin-bottom: 10px !important; padding-bottom: 0px !important; width: 250px !important;">
		<img src="${
			POSTER_URL + poster_path
		}" alt="poster" style="margin-right: 0px !important; height: 400px !important; width: 250px !important;">
		</label>
    <i class="heart-icon-tv fa-solid fa-heart relative bottom-[4rem] right-[4rem] text-4xl text-white hover: cursor-pointer" aria-hidden="true"></i>
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
	showCard.appendChild(showEl);

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