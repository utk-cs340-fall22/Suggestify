# Sprint 2
name: Riya Patel
github id: rpatel90
group name: Suggestify

### What you planned to do
* Issue #39: [API -- Get the posters from the API to display on the carousel](https://github.com/utk-cs340-fall22/suggestify.github.io/issues/39)
* Issue #40: [add arrows to trending carousel](https://github.com/utk-cs340-fall22/suggestify.github.io/issues/40)
* Issue #47: [Update modal box with info from the API](https://github.com/utk-cs340-fall22/suggestify.github.io/issues/47)

### What you did not do
* add arrows to the trending carousel so users without trackpads can scroll through it
* add the plus buttons for users to add movies/shows to their list

### What problems you encountered
We encountered issues with DaisyUI so we switched over to Bootstrap. However, we realized that we couldn’t do the carousel with Bootstrap, so we ended up switching back over to DaisyUI and tried to make it work there. This cost us a bit of time, but, ultimately, it was the right choice. Due to the time lost, there were certain things (such as the arrows on the carousel and the plus buttons) that had to be pushed over to the next sprint. However, great progress was made on the carousel.

### Issues you worked on
* Issue #39: [API -- Get the posters from the API to display on the carousel](https://github.com/utk-cs340-fall22/suggestify.github.io/issues/39)
* Issue #40: [add arrows to trending carousel](https://github.com/utk-cs340-fall22/suggestify.github.io/issues/40)
* Issue #47: [Update modal box with info from the API](https://github.com/utk-cs340-fall22/suggestify.github.io/issues/47)

### Files you worked on
(Give a bulleted list of the files in your github repo that you worked on. Give the full pathname.)
* [index.html](https://github.com/utk-cs340-fall22/suggestify.github.io/blob/riya-trending-api/index.html)
* [styles.css](https://github.com/utk-cs340-fall22/suggestify.github.io/blob/riya-trending-api/styles.css)
*[index.js](https://github.com/utk-cs340-fall22/suggestify.github.io/blob/riya-trending-api/index.js)


### What you accomplished
Again, I was responsible for the “Trending Movies” carousel. For this sprint, I focused on integrating the carousel with the API that we decided to use. Before, the carousel was just hard-coded with the images, but once the API was integrated, the carousel actually shows the trending movies for this week, along with their posters. Additionally, I worked on the modal box that pops up when you click on one of the movies. In the box, there is some more information about the movie pulled from the API. There are things such as the overview of the film, the release date, and the rating. Furthermore, I also added tabs to the modal box so the user will be able to view various information about the movie such as similar movies, more info about the movie, and reviews for the movie. Currently, we’re working to get the trailers for the movies from the API so there’s a placeholder in the “More Info” tab for the trailer once we get that working, but that will be an issue for sprint 3. Again, we encountered some minor setbacks due to the midway switch over to Bootstrap and then back again to DaisyUI so some time was wasted trying to fix that, but, ultimately, I think using DaisyUI was the right choice. I will add the arrows for the carousel in the next sprint. 