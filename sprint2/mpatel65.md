# Sprint 2

Name: Manan Patel \
Netid: Mpatel65
GitHub ID: mpatel65 \
Group name: Suggestify

### What I planned to do

* [issue #24](https://github.com/utk-cs340-fall22/suggestify.github.io/issues/24): Look into setting up CI/CD pipeline

* [issue #32](https://github.com/utk-cs340-fall22/suggestify.github.io/issues/32): Fix Github pages

* [issue #36](https://github.com/utk-cs340-fall22/suggestify.github.io/issues/36): Connect Login page to navbar

* [issue #38](https://github.com/utk-cs340-fall22/suggestify.github.io/issues/38): Create database with Firebase to store favorited movies

* [issue #45](https://github.com/utk-cs340-fall22/suggestify.github.io/issues/45): Create database with Firebase to store favorited shows

* [issue #60](https://github.com/utk-cs340-fall22/suggestify.github.io/issues/60): Create My List page

### What I did not do

* [issue #24](https://github.com/utk-cs340-fall22/suggestify.github.io/issues/24): Look into setting up CI/CD pipeline

* [issue #45](https://github.com/utk-cs340-fall22/suggestify.github.io/issues/45): Create database with Firebase to store favorited shows

### What problems I encountered

* DaisyUI's accessiblity is not great and hides a lot of important details so I spend a lot of time debugging.

* At one point we decided to switch to another UI library (Bootstrap), so again I spent a lot of time migrating the project to that but in the end we didn't use that code :/

* If I implemented the CI/CD Pipeline, then it would make me the code owner and git blame wouldn't give correct lines of code to appropriate user. So I decided not to implement Prettier as a GitHub Action.

### Issues I worked on

* [issue #32](https://github.com/utk-cs340-fall22/suggestify.github.io/issues/32): Fix Github pages

* [issue #36](https://github.com/utk-cs340-fall22/suggestify.github.io/issues/36): Connect Login page to navbar

* [issue #38](https://github.com/utk-cs340-fall22/suggestify.github.io/issues/38): Create database with Firebase to store favorited movies

* [issue #60](https://github.com/utk-cs340-fall22/suggestify.github.io/issues/60): Create My List page

### Files I worked on

* [index.html](../index.html)
* [login.html](../login.html)
* [my-list.html](../my-list.html)
* [tv.js](../tv.js)
* [movies.js](../movies.js)
* [styles.css](../styles.css)
* [README.md](../README.md)

### What I accomplished

* Made the navbar sticky so it will always stick on top when you scroll.
* Added database using firebase firestore to store user's choice of movies.
* Implemented Create, Read, Update, and Delete functionality for movies.
* Created My List page and added heart icon to movies and tv shows.
* Updated README.md to include login page image and added "Technologies Used" section.
* Improved `blame.sh` script to only do git blame on last 2 weeks.
* Wrote brand new sticky navbar with bootstrap that we didn't use in the end.
