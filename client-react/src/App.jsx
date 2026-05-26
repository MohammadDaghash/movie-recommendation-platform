import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [tvShows, setTvShows] = useState([]);
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    fetch("https://tvshow-recommendation-platform.onrender.com/api/tv-shows")
      .then((response) => response.json())
      .then((data) => setTvShows(data))
      .catch((error) => console.error(error));

    fetch(
      "https://tvshow-recommendation-platform.onrender.com/api/recommendations",
    )
      .then((response) => response.json())
      .then((data) => setRecommendations(data))
      .catch((error) => console.error(error));
  }, []);

  const renderCard = (show) => (
    <div className="tv-card" key={show._id}>
      <h2>{show.title}</h2>

      <p>Genres: {show.genres.join(", ")}</p>

      <p>Year: {show.year}</p>

      <p className="score">Match Score: {show.recommendationScore}%</p>

      <p className="rating">Your Rating: ⭐ {show.userRating}</p>

      <img src={show.imageUrl} alt={show.title} />
    </div>
  );

  return (
    <div className="app">
      <h1>TV Show Recommendation Platform</h1>

      <section>
        <h2 className="section-title">Recommended For You</h2>

        <div className="tv-grid">{recommendations.map(renderCard)}</div>
      </section>

      <section>
        <h2 className="section-title">All TV Shows</h2>

        <div className="tv-grid">{tvShows.map(renderCard)}</div>
      </section>
    </div>
  );
}

export default App;
