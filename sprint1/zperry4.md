# Sprint 1

Zachary Perry, zperry4, Suggestify

### What you planned to do
- Issue [#3](https://github.com/utk-cs340-fall22/suggestify.github.io/issues/3) Get the website hosted on GitHub Pages.
- Issue [#8](https://github.com/utk-cs340-fall22/suggestify.github.io/issues/8) Research and find a free API to use that has everything we want (Movies, TV Shows, etc). 
- Issue [#15](https://github.com/utk-cs340-fall22/suggestify.github.io/issues/15) Fetch a list of movies from the API and display them on the website. 

### What you did not do
I wanted to get more of the movie information displayed in a better format on the website. This is something I will do next sprint, but was unable to get to in this one. 

### What problems you encountered
 Learning how to use the API and use their get calls to get certain information was a little difficult. But, after learning how to use it, it wasn't too bad.

### Issues you worked on
[#1](https://github.com/utk-cs340-fall22/suggestify.github.io/issues/3) Host Website
[#2](https://github.com/utk-cs340-fall22/suggestify.github.io/issues/8) Find API
[#3](https://github.com/utk-cs340-fall22/suggestify.github.io/issues/15) Fetch from API and Display

### Files you worked on
- [index.js]
- [index.html]
- [styles.css]

### What you accomplished
To start out the sprint, I worked on finding ways to host our website. I did some research and found that just using GitHub Pages would be easiest way. To accomplish this, all I had to do was make the repo public and adjust some things in the Pages setting. 
I then did a ton of research to find a free API that contained information related to movies and TV shows. I found TMDB, or The Movie DataBase. This free API not only has no request limit, but also has a ton of free information. This includes lists of trending movies and shows, posters, trailers, descriptions, cast information, and related movies. 
My final task was to implement an API call to display information. To do this, I used a simple javascript fetch request and returned the data as JSON. Then, I was able to parse this data and display it within our HTML. For right now, I fetched one page of trending movies from the API and displayed it at the bottom of the webpage. This was done to show that the request does work and does return a variety of information about each movie.
I also updated some of the CSS for the website to fix the gradient. 
