# Sprint 3

Zachary Perry, zperry4, Suggestify

### What you planned to do
- Refactor the API JS code again in order to make it easier to add more API calls.
- Add Pagination to the movies page.
- Add Pagination to the tv show page.
- Add space to hold more information inside of the individual card modals (add a carousel to include 3 different tabs of info).
- Add filtering for both of the movies and tv shows page.
- #51 -- [Movies Page (Pagination & Modal Tabs)(html & js)](https://github.com/utk-cs340-fall22/suggestify.github.io/issues/51)
- #52 -- [TV Page (Pagination & Modal Tabs)(html & js)](https://github.com/utk-cs340-fall22/suggestify.github.io/issues/52)
- #53 -- [Add in filtering for both pages (js)](https://github.com/utk-cs340-fall22/suggestify.github.io/issues/53)
- #73 -- [Refactor API JS Code](https://github.com/utk-cs340-fall22/suggestify.github.io/issues/73)

### What you did not do
- I wanted to go ahead and add all of the additional info to the individual card modals. This will include trailers, cast info, similar movies, reviews, etc. I did not get to this, as I spent most of my time working on the card tabs, filtering, and the pagination for both the movies and tv shows page. 

### What problems you encountered
- One problem I encountered was an issue with how we were making API calls. The specific way we were doing it made it impossible to make additional API calls and have all of the information within the scope that we needed. To fix this, I just refactored the initial API call, looped through the returned info, and made another API call for each returned movie that would get even more details for them. This order fixed the scoping issue and allowed for us to get more information.
- Another issue was figuring out how to us DaisyUI again. Each component it provides comes with different issues, so figuring out how to use it without these issues was difficult.

### Issues you worked on
- #51 -- [Movies Page (Pagination & Modal Tabs)(html & js)](https://github.com/utk-cs340-fall22/suggestify.github.io/issues/51)
- #52 -- [TV Page (Pagination & Modal Tabs)(html & js)](https://github.com/utk-cs340-fall22/suggestify.github.io/issues/52)
- #53 -- [Add in filtering for both pages (js)](https://github.com/utk-cs340-fall22/suggestify.github.io/issues/53)
- #73 -- [Refactor API JS Code](https://github.com/utk-cs340-fall22/suggestify.github.io/issues/73)

### Files you worked on
- Index.js
- Movies.js
- Movies.html
- Tv.js
- Tv.html
- Styles.css

### What you accomplished
During this sprint, I ended up accomplishing mostly everything I had set out to do. I first started by refactoring a very significant part of our JS code that would call the API. The old way that the old code was written made it very difficult to make subsequent API calls without messing up the scope of the data. So, I refactored this code so that it will call the API and then make subsequent API calls for each movie before displaying them. This fixed the issue and made it much more convenient to implement more calls and get more data.

After this, I worked on implementing pagination for both the movies and tv shows pages. This would allow for different pages to be visited and different movies/shows to be dynamically rendered on each page. Alongside this, I also implemented a carousel within each of the individual movie and tv show cards. So, when you click a card, it will now have 3 different tabs that can be visited. Each tab will have different information regarding the show or movie. This ended up being a big pain to do due to using the DaisyUI library. It took a little while and because of this, I was not able to get to adding the information to the cards in this sprint. But, the tab feature does work & the pagination works.

Finally, I worked on adding the filtering for both the movies and tv shows pages. I first got all of the supported genres from the API and created a button for each genre. Then, I added the clicking functionality. When clicked, the button will be highlighted and an API call will be made. This new call will include the genre filter and it will then display all movies or shows with the specified genre. You can select multiple filters at a time and also unselect them whenever you want. If selecting multiple, then the movies or shows will be filtered by the multiple selected genres. The filters will also persist from page to page. This feature took me a while to implement, but I'm pretty happy with how it all turned out.