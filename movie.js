document.addEventListener('DOMContentLoaded', fetchMovies);

function fetchMovies() {
    fetch('http://localhost:3000/films')
        .then(response => response.json())
        .then(data => {
            displayMovieMenu(data);
            displayMovieDetails(data[0]);
        })
        .catch(error => {
            console.log('Error:', error);
        });
}

function displayMovieMenu(movies) {
    const movieMenu = document.getElementById('films');
    movieMenu.innerHTML = '';

    movies.forEach(movie => {
        const listItem = document.createElement('li');
        listItem.classList.add('film', 'item');
        listItem.textContent = movie.title;

        listItem.addEventListener('click', () => {
            displayMovieDetails(movie);
        });

        movieMenu.appendChild(listItem);
    });
}

function displayMovieDetails(movie) {
    const poster = document.getElementById('posters');
    const title = document.getElementById('movie-title');
    const runtime = document.getElementById('runtime');
    const showtime = document.getElementById('showtime');
    const availableTickets = document.getElementById('available-tickets');
    const buyButton = document.getElementById('buy-tickets');

    poster.innerHTML = '<img src="' + movie.poster + '" alt="' + movie.title + '">';
    title.textContent = movie.title;
    runtime.textContent = movie.runtime;
    showtime.textContent = movie.showtime;
    availableTickets.textContent = movie.available_tickets;

    buyButton.addEventListener('click', () => {
        if (movie.available_tickets > 0) {
            movie.available_tickets--;
            availableTickets.textContent = movie.available_tickets;
        }
    });
}