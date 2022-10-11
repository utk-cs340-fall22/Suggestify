fetch('https://api.themoviedb.org/3/movie/upcoming?api_key=bb1d4e0661af455e02af1ea99fb85fcb&language=en-US&page=1')
.then(response => {

    /* guard clause : Make sure the data is actually returning with a 200 status */
    if (!response.ok) {
        console.log('Problem obtaining a response from API');
        return;
    }
    return response.json()
})
.then(data => {
    console.log(data);
    for (const element of data.results) {
        const id = element.poster_path;
        let poster_url = 'https://image.tmdb.org/t/p/original/';
        poster_url = poster_url.concat(id);

        const markup = `<li><b>${element.title}</b> -- ${element.release_date}</li> <br> <li>${element.overview}</li> <br>`;
        
        document.getElementById('movie-data').insertAdjacentHTML('beforeEnd', markup);
        // document.getElementById('movie-image').src = poster_url;
    }
})
.catch(error => {
    console.log(error);
})

// path for images
// https://image.tmdb.org/t/p/original/[poster_path]