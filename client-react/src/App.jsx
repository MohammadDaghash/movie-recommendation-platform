import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [tvShows, setTvShows] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("All");

  useEffect(() => {
    fetch("http://localhost:5001/api/tv-shows")
      .then((response) => response.json())
      .then((data) => setTvShows(data))
      .catch((error) => console.error(error));

    fetch("http://localhost:5001/api/recommendations")
      .then((response) => response.json())
      .then((data) => setRecommendations(data))
      .catch((error) => console.error(error));
  }, []);

  const allGenres = [
    "All",
    ...new Set(
      recommendations
        .flatMap((show) => show.genres)
        .filter(Boolean)
        .sort(),
    ),
  ];

  const filteredShows = recommendations.filter((show) => {
    const matchesSearch = show.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesGenre =
      selectedGenre === "All" || show.genres.includes(selectedGenre);

    return matchesSearch && matchesGenre;
  });

  const isFiltering = searchTerm !== "" || selectedGenre !== "All";

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

      <div className="filters">
        <input
          type="text"
          placeholder="Search TV shows..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />

        <select
          value={selectedGenre}
          onChange={(e) => setSelectedGenre(e.target.value)}
          className="genre-select"
        >
          {allGenres.map((genre) => (
            <option value={genre} key={genre}>
              {genre}
            </option>
          ))}
        </select>
      </div>

      {!isFiltering && (
        <section>
          <h2 className="section-title">Recommended For You</h2>

          <div className="tv-grid">{recommendations.map(renderCard)}</div>
        </section>
      )}

      <section>
        <h2 className="section-title">All TV Shows</h2>

        <div className="tv-grid">{filteredShows.map(renderCard)}</div>
      </section>
    </div>
  );
}

export default App;
