// Fetch the movie data from the server
function fetchMovies() {
    // Fetch the data of the first movie
    fetch('http://localhost:3000/films/1')
      .then(response => response.json())
      .then(data => {
        // Display the details of the first movie
        displayMovieDetails(data);
      })
      .catch(error => {
        console.log('Error:', error);
      });
  
    // Fetch the data of all movies
    fetch('http://localhost:3000/films')
      .then(response => response.json())
      .then(data => {
        // Display the movie menu
        displayMovieMenu(data);
      })
      .catch(error => {
        console.log('Error:', error);
      });
  }
  
  // Display the movie menu
  function displayMovieMenu(movies) {
    const movieMenu = document.getElementById('films');
    movieMenu.innerHTML = '';
  
    movies.forEach(movie => {
      const listItem = document.createElement('li');
      listItem.classList.add('film', 'item');
      listItem.textContent = movie.title;
  
      // Add click event listener to switch movie details
      listItem.addEventListener('click', () => {
        displayMovieDetails(movie);
      });
  
      movieMenu.appendChild(listItem);
    });
  }
  
  // Display the movie details
  function displayMovieDetails(movie) {
    const poster = document.getElementById('poster');
    const title = document.getElementById('title');
    const runtime = document.getElementById('runtime');
    const showtime = document.getElementById('showtime');
    const availableTickets = document.getElementById('available-tickets');
    const buyButton = document.getElementById('buy-tickets');
  
    poster.setAttribute('src', movie.poster);
    title.textContent = movie.title;
    runtime.textContent = `Runtime: ${movie.runtime} minutes`;
    showtime.textContent = `Showtime: ${movie.showtime}`;
    availableTickets.textContent = `Available Tickets: ${movie.capacity - movie.tickets_sold}`;
  
    buyButton.addEventListener('click', () => {
      if (movie.tickets_sold < movie.capacity) {
        movie.tickets_sold++;
        availableTickets.textContent = `Available Tickets: ${movie.capacity - movie.tickets_sold}`;
        // Send a PATCH request to update the tickets_sold on the server (extra bonus)
        updateTicketsSold(movie.id, movie.tickets_sold);
      } else {
        alert('Sold out! No more tickets available.');
      }
    });
  }
  
  // Update the tickets_sold on the server (extra bonus)
  function updateTicketsSold(movieId, ticketsSold) {
    fetch(`http://localhost:3000/films/${movieId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        tickets_sold: ticketsSold
      })
    })
      .then(response => response.json())
      .then(data => {
        console.log('Tickets sold updated:', data);
      })
      .catch(error => {
        console.log('Error:', error);
      });
  }
  
  // Delete a film from the server (extra bonus)
  function deleteFilm(movieId) {
    fetch(`http://localhost:3000/films/${movieId}`, {
      method: 'DELETE'
    })
      .then(response => response.json())
      .then(data => {
        console.log('Film deleted:', data);
        // Remove the film from the menu
        const filmItem = document.querySelector(`li[data-id="${movieId}"]`);
        if (filmItem) {
          filmItem.remove();
        }
      })
      .catch(error => {
        console.log('Error:', error);
      });
  }
  window.addEventListener('DOMContentLoaded', () => {
    // Call the fetchMovies function to start fetching and displaying movie data
    fetchMovies();
  });
  