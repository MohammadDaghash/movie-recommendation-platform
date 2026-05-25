import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5001/api/movies")
      .then((res) => res.json())
      .then((data) => setMovies(data))
      .catch((err) => console.log(err));
  }, []);

  return (
    <div className="app">
      <h1>TV Show Recommendation Platform</h1>

      <div className="movie-container">
        {movies.map((movie) => (
          <div className="movie-card" key={movie._id}>
            <h2 className="movie-title">{movie.title}</h2>

            <p className="movie-genres">Genres: {movie.genres.join(", ")}</p>

            <p className="movie-year">Year: {movie.year}</p>

            <p className="recommendation-score">
              Match Score: {movie.recommendationScore}%
            </p>

            <p className="movie-rating">Your Rating: ⭐ {movie.userRating}</p>

            <img src={movie.imageUrl} alt={movie.title} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
