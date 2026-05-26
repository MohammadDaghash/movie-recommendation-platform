import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [recommendations, setRecommendations] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("All");
  const [activeTab, setActiveTab] = useState("watched");

  useEffect(() => {
    fetch("http://localhost:5001/api/recommendations")
      .then((response) => response.json())
      .then((data) => setRecommendations(data))
      .catch((error) => console.error(error));
  }, []);

  const watchedShows = recommendations
    .filter((show) => show.watched === true)
    .sort((a, b) => b.userRating - a.userRating);

  const unwatchedShows = recommendations
    .filter((show) => show.watched === false)
    .sort((a, b) => b.recommendationScore - a.recommendationScore);

  const currentShows = activeTab === "watched" ? watchedShows : unwatchedShows;

  const allGenres = [
    "All",
    ...new Set(
      currentShows
        .flatMap((show) => show.genres)
        .filter(Boolean)
        .sort(),
    ),
  ];

  const filteredShows = currentShows.filter((show) => {
    const matchesSearch = show.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesGenre =
      selectedGenre === "All" || show.genres.includes(selectedGenre);

    return matchesSearch && matchesGenre;
  });

  const isFiltering = searchTerm !== "" || selectedGenre !== "All";

  const getPrimaryCategory = (show) => {
    const genres = show.genres;

    if (genres.includes("Comedy")) return "Comedy";
    if (genres.includes("Romance")) return "Drama & Romance";
    if (genres.includes("Crime") || genres.includes("Thriller"))
      return "Crime & Thriller";
    if (genres.includes("Fantasy") || genres.includes("Sci-Fi"))
      return "Fantasy & Sci-Fi";
    if (genres.includes("Animation")) return "Animation";

    return "Drama";
  };

  const categoryOrder = [
    "Comedy",
    "Drama & Romance",
    "Crime & Thriller",
    "Fantasy & Sci-Fi",
    "Animation",
    "Drama",
  ];

  const showsByCategory = categoryOrder
    .map((category) => ({
      category,
      shows: currentShows.filter(
        (show) => getPrimaryCategory(show) === category,
      ),
    }))
    .filter((group) => group.shows.length > 0);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSearchTerm("");
    setSelectedGenre("All");
  };

  const renderCard = (show) => (
    <div className="tv-card" key={show._id}>
      <img src={show.imageUrl} alt={show.title} />

      <h3>{show.title}</h3>

      <p>{show.genres.join(", ")}</p>

      <p>Year: {show.year}</p>

      {show.watched ? (
        <p className="rating">Your Rating: ⭐ {show.userRating}</p>
      ) : (
        <>
          <p className="score">Match Score: {show.recommendationScore}%</p>

          {show.similarWatchedShows?.length > 0 && (
            <p className="similar-shows">
              Similar to:{" "}
              {show.similarWatchedShows
                .map((similarShow) => similarShow.title)
                .join(", ")}
            </p>
          )}
        </>
      )}
    </div>
  );

  return (
    <div className="app">
      <h1>TV Show Recommendation Platform</h1>

      <div className="tabs">
        <button
          className={activeTab === "watched" ? "tab active-tab" : "tab"}
          onClick={() => handleTabChange("watched")}
        >
          Watched
        </button>

        <button
          className={activeTab === "unwatched" ? "tab active-tab" : "tab"}
          onClick={() => handleTabChange("unwatched")}
        >
          Want to Watch
        </button>
      </div>

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

      {isFiltering ? (
        <section>
          <h2 className="section-title">Filtered Results</h2>
          <div className="carousel-row">{filteredShows.map(renderCard)}</div>
        </section>
      ) : (
        <>
          {activeTab === "unwatched" && (
            <section>
              <h2 className="section-title">Recommended For You</h2>
              <div className="carousel-row">
                {unwatchedShows.slice(0, 10).map(renderCard)}
              </div>
            </section>
          )}

          {showsByCategory.map((group) => (
            <section key={group.category}>
              <h2 className="section-title">{group.category}</h2>
              <div className="carousel-row">{group.shows.map(renderCard)}</div>
            </section>
          ))}
        </>
      )}
    </div>
  );
}

export default App;
