document.addEventListener("DOMContentLoaded", function() {
    var selectedMovieId = localStorage.getItem("selectedMovieId");
  
    // Fetch movie menu data
    fetch("http://localhost:3000/films")
      .then(function(response) {
        return response.json();
      })
      .then(function(movies) {
        var filmsList = document.getElementById("films");
  
        // Remove the placeholder li element
        var placeholderLi = document.getElementById("placeholder");
        filmsList.removeChild(placeholderLi);
  
        // Populate the movie menu
        movies.forEach(function(movie) {
          var li = document.createElement("li");
          li.classList.add("film", "item");
          li.textContent = movie.title;
  
          // Add click event listener to change displayed movie details
          li.addEventListener("click", function() {
            // Store the selected movie ID in local storage
            localStorage.setItem("selectedMovieId", movie.id);
  
            // Fetch movie details for the selected movie
            fetch("http://localhost:3000/films/" + movie.id)
              .then(function(response) {
                return response.json();
              })
              .then(function(movieDetails) {
                // Update the displayed movie details
                var moviePoster = document.getElementById("movie-poster");
                var movieTitle = document.getElementById("movie-title");
                var movieRuntime = document.getElementById("movie-runtime");
                var movieShowtime = document.getElementById("movie-showtime");
                var movieTicketsAvailable = document.getElementById("movie-tickets");
                var buyTicketBtn = document.getElementById("buy-ticket-btn");
  
                moviePoster.src = movieDetails.poster;
                movieTitle.textContent = movieDetails.title;
                movieRuntime.textContent = "Runtime: " + movieDetails.runtime + " minutes";
                movieShowtime.textContent = "Showtime: " + movieDetails.showtime;
                var ticketsAvailable = movieDetails.capacity - movieDetails.tickets_sold;
                movieTicketsAvailable.textContent = "Tickets Available: " + ticketsAvailable;
                buyTicketBtn.disabled = ticketsAvailable === 0;
  
                buyTicketBtn.addEventListener("click", function(event) {
                  event.preventDefault(); // Prevent the page from scrolling back to the top
  
                  if (ticketsAvailable > 0) {
                    // Decrease the available tickets and update the display
                    fetch("http://localhost:3000/films/" + movie.id, {
                      method: "PATCH",
                      headers: {
                        "Content-Type": "application/json"
                      },
                      body: JSON.stringify({
                        tickets_sold: movieDetails.tickets_sold + 1
                      })
                    })
                      .then(function(response) {
                        return response.json();
                      })
                      .then(function(updatedMovieDetails) {
                        movieDetails = updatedMovieDetails;
                        ticketsAvailable = movieDetails.capacity - movieDetails.tickets_sold;
                        movieTicketsAvailable.textContent = "Tickets Available: " + ticketsAvailable;
  
                        if (ticketsAvailable === 0) {
                          buyTicketBtn.disabled = true;
                          buyTicketBtn.textContent = "Sold Out";
                        }
                      })
                      .catch(function(error) {
                        console.log("Error updating ticket count:", error);
                      });
                  }
                });
              })
              .catch(function(error) {
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
      .catch(function(error) {
        console.log("Error fetching movie menu:", error);
      });
  });
  