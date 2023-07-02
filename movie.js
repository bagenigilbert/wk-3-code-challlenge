// fetch the  movie data from the server 
function fetchMovies() {
    // fetching the data of the first movie
    fetch('http://localhost:3000/films/1')
    .then(res => res.json())
    .then(data=> {
    //display the details of the first movie
    displayMovieDetails(data);
    })

    
}