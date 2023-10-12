const jsonServer = require("json-server"); // importing json-server library
const server = jsonServer.create();
const router = jsonServer.router("db.json");
const middlewares = jsonServer.defaults();
const port = process.env.PORT || 8080; //  chose port from here like 8080, 3001

server.use(middlewares);
server.use(router);

server.listen(port);


document.addEventListener("DOMContentLoaded", () => {
  let selectedMovieId = localStorage.getItem("selectedMovieId");

  // Fetch movie menu data
  fetch("http://localhost:3000/films")
    .then(response => response.json())
    .then(movies => {
      const filmsList = document.getElementById("films");

      // Remove the placeholder li element
      const placeholderLi = document.getElementById("placeholder");
      filmsList.removeChild(placeholderLi);

      // Populate the movie menu
      movies.forEach(movie => {
        const li = document.createElement("li");
        li.classList.add("film", "item");
        li.textContent = movie.title;

        // Add click event listener to change displayed movie details
        li.addEventListener("click", () => {
          // Store the selected movie ID in local storage
          localStorage.setItem("selectedMovieId", movie.id);

          // Fetch movie details for the selected movie
          fetch(`http://localhost:3000/films/${movie.id}`)
            .then(response => response.json())
            .then(movieDetails => {
              // Update the displayed movie details
              const moviePoster = document.getElementById("movie-poster");
              const movieTitle = document.getElementById("movie-title");
              const movieRuntime = document.getElementById("movie-runtime");
              const movieShowtime = document.getElementById("movie-showtime");
              const movieTicketsAvailable = document.getElementById("movie-tickets");
              const buyTicketBtn = document.getElementById("buy-ticket-btn");

              moviePoster.src = movieDetails.poster;
              movieTitle.textContent = movieDetails.title;
              movieRuntime.textContent = `Runtime: ${movieDetails.runtime} minutes`;
              movieShowtime.textContent = `Showtime: ${movieDetails.showtime}`;
              let ticketsAvailable = movieDetails.capacity - movieDetails.tickets_sold;
              movieTicketsAvailable.textContent = `Tickets Available: ${ticketsAvailable}`;
              buyTicketBtn.disabled = ticketsAvailable === 0;

              if (ticketsAvailable === 0) {
                buyTicketBtn.textContent = "Sold Out";
              } else {
                buyTicketBtn.textContent = "Buy Ticket";
              }

              buyTicketBtn.addEventListener("click", () => {
                if (ticketsAvailable > 0) {
                  // Decrease the available tickets and update the display
                  fetch(`http://localhost:3000/films/${movie.id}`, {
                    method: "PATCH",
                    headers: {
                      "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                      tickets_sold: movieDetails.tickets_sold + 1
                    })
                  })
                    .then(response => response.json())
                    .then(updatedMovieDetails => {
                      movieDetails = updatedMovieDetails;
                      ticketsAvailable = movieDetails.capacity - movieDetails.tickets_sold;
                      movieTicketsAvailable.textContent = `Tickets Available: ${ticketsAvailable}`;

                      if (ticketsAvailable === 0) {
                        buyTicketBtn.disabled = true;
                        buyTicketBtn.textContent = "Sold Out";
                      }
                    })
                    .catch(error => {
                      console.log("Error updating ticket count:", error);
                    });
                }
              });
            })
            .catch(error => {
              console.log("Error fetching movie details:", error);
            });
        });

        // Check if this movie is the selected movie
        if (selectedMovieId && movie.id === selectedMovieId) {
          // Trigger a click event on the selected movie to display its details
          li.click();
        }

        filmsList.appendChild(li);
      });
    })
    .catch(error => {
      console.log("Error fetching movie menu:", error);
    });
});
