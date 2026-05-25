import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [tvShows, setTvShows] = useState([]);

  useEffect(() => {
    fetch("https://tvshow-recommendation-platform.onrender.com/api/tv-shows")
      .then((res) => res.json())
      .then((data) => setTvShows(data))
      .catch((err) => console.log(err));
  }, []);

  return (
    <div className="app">
      <h1>TV Show Recommendation Platform</h1>

      <div className="tvshow-container">
        {tvShows.map((tvShow) => (
          <div className="tvshow-card" key={tvShow._id}>
            <h2 className="tvshow-title">{tvShow.title}</h2>

            <p className="tvshow-genres">Genres: {tvShow.genres.join(", ")}</p>

            <p className="tvshow-year">Year: {tvShow.year}</p>

            <p className="recommendation-score">
              Match Score: {tvShow.recommendationScore}%
            </p>

            <p className="tvshow-rating">Your Rating: ⭐ {tvShow.userRating}</p>

            <img src={tvShow.imageUrl} alt={tvShow.title} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
