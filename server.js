const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 3000;

// Enable CORS for all routes
app.use(cors());

// Sample JSON data for movies
let moviesData = require("./data.json");

// Middleware to parse JSON data in the request body
app.use(express.json());

// GET endpoint to retrieve the list of movies
app.get("/films", (req, res) => {
  res.json(moviesData);
});

// GET endpoint to retrieve details of a specific movie
app.get("/films/:id", (req, res) => {
  const movieId = req.params.id;
  const movie = moviesData.films.find((film) => film.id === movieId);
  if (movie) {
    res.json(movie);
  } else {
    res.status(404).json({ error: "Movie not found" });
  }
});

// PATCH endpoint to update the ticket count for a movie
app.patch("/films/:id", (req, res) => {
  const movieId = req.params.id;
  const { tickets_sold } = req.body;
  const movie = moviesData.films.find((film) => film.id === movieId);
  if (movie) {
    movie.tickets_sold = tickets_sold;
    res.json(movie);
  } else {
    res.status(404).json({ error: "Movie not found" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
