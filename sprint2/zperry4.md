# Sprint 2

Zachary Perry, zperry4, Suggestify

### What you planned to do
- Refactor some of the JS code to make it more readable
- Use the API to fetch more information, specifically movie posters and back drop images
- Implement the Movies page, which contains a list of movies. Each movie can be clicked on, which will display a modal and more information about the movie.
- Implement the TV shows page, which does the same thing as the movies page but with tv shows.
- #25 -- [Get Posters from API](https://github.com/utk-cs340-fall22/suggestify.github.io/issues/25)
- #29 -- [Implement the Movies Page (html & js)](https://github.com/utk-cs340-fall22/suggestify.github.io/issues/29)
- #31 -- [Refactor JS code for Index.js](https://github.com/utk-cs340-fall22/suggestify.github.io/issues/31)
- #44 -- [Implement the Tv Shows Page (html & js)](https://github.com/utk-cs340-fall22/suggestify.github.io/issues/44)

### What you did not do
- I accomplished all of my goals for this sprint. I did want to try and add some more information about the movies and shows to the informational modal pop up, but did not have time. This will be a task in sprint 3.

### What problems you encountered
- Using the DaisyUI library for the styling was kind of a pain. Trying to use multiple components with one another required a lot of trial and error before discovering a way to make it work. We tried swapping to Bootstrap, but this ended up causing even more issues so we swapped back to DaisyUI. This cost us a little bit of time during the sprint.

### Issues you worked on
- #25 -- [Get Posters from API](https://github.com/utk-cs340-fall22/suggestify.github.io/issues/25)
- #29 -- [Implement the Movies Page (html & js)](https://github.com/utk-cs340-fall22/suggestify.github.io/issues/29)
- #31 -- [Refactor JS code for Index.js](https://github.com/utk-cs340-fall22/suggestify.github.io/issues/31)
- #44 -- [Implement the Tv Shows Page (html & js)](https://github.com/utk-cs340-fall22/suggestify.github.io/issues/44)

### Files you worked on
- Index.js
- Movies.js
- Movies.html
- Tv.js
- Tv.html
- Styles.css

### What you accomplished
During this sprint, I ended up accomplishing all of the tasks I had planned to do. I first started by refactoring our JS code within index.js. This code was used for fetching information from the API and displaying it. I refactored it into different functions to make it more readable. This would help keep the code consistent across all js files. I then worked on getting the posters and backdrop images from the API for each movie. This ended up being easier than I had thought, as all it required was constructing the URL for each image. I then created and worked on the Tv shows and Movies page. Each page required an HTML and JS file. Within these files, I used the API in order to get the information about various movies and tv shows. I then was able to create cards with the respective posters. These cards serve as buttons and when clicked, will open a modal for the movie or tv show. This modal will contain the name, description, release date, and rating of the movie/show. It will also contain the backdrop image. These modals will serve a huge purpose for later sprints, as I will continue to add more information and features to them. 