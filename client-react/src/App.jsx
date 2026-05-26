import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [recommendations, setRecommendations] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("All");
  const [activeTab, setActiveTab] = useState("watched");

  const [selectedShow, setSelectedShow] = useState(null);
  const [ratingInput, setRatingInput] = useState("");

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newShowTitle, setNewShowTitle] = useState("");
  const [isImporting, setIsImporting] = useState(false);

  const [tmdbResults, setTmdbResults] = useState([]);
  const [selectedTMDBShow, setSelectedTMDBShow] = useState(null);

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

  const openRatingModal = (show) => {
    setSelectedShow(show);
    setRatingInput("");
  };

  const submitRating = async () => {
    const rating = Number(ratingInput);

    if (rating < 0 || rating > 10) {
      alert("Rating must be between 0 and 10");
      return;
    }

    await fetch(
      `http://localhost:5001/api/recommendations/${selectedShow._id}/watch`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userRating: rating,
        }),
      },
    );

    await refreshRecommendations();

    setSelectedShow(null);
    setActiveTab("watched");
  };

  const refreshRecommendations = async () => {
    const response = await fetch("http://localhost:5001/api/recommendations");
    const updatedRecommendations = await response.json();

    setRecommendations(updatedRecommendations);
  };

  const moveToWantToWatch = async (showId) => {
    await fetch(`http://localhost:5001/api/recommendations/${showId}/unwatch`, {
      method: "POST",
    });

    await refreshRecommendations();
    setActiveTab("unwatched");
  };

  const deleteTVShow = async (showId) => {
    const shouldDelete = confirm(
      "Are you sure you want to delete this TV show?",
    );

    if (!shouldDelete) {
      return;
    }

    await fetch(`http://localhost:5001/api/recommendations/${showId}`, {
      method: "DELETE",
    });

    await refreshRecommendations();
  };

  const searchTMDBShows = async () => {
    if (!newShowTitle.trim()) {
      return;
    }

    const response = await fetch(
      `http://localhost:5001/api/tmdb/search?title=${encodeURIComponent(
        newShowTitle,
      )}`,
    );

    const results = await response.json();

    setTmdbResults(results);
  };

  const importTVShow = async (tmdbId) => {
    setIsImporting(true);

    await fetch("http://localhost:5001/api/tmdb/import", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        tmdbId,
      }),
    });

    await refreshRecommendations();

    setNewShowTitle("");
    setTmdbResults([]);
    setSelectedTMDBShow(null);
    setIsAddModalOpen(false);
    setIsImporting(false);
    setActiveTab("unwatched");
  };

  const renderCard = (show) => (
    <div className="tv-card" key={show._id}>
      <img src={show.imageUrl} alt={show.title} />

      <h3>{show.title}</h3>

      <p>{show.genres.join(", ")}</p>

      <p>Year: {show.year}</p>

      {show.watched ? (
        <>
          <p className="rating">Your Rating: ⭐ {show.userRating}</p>

          <button
            className="secondary-button"
            onClick={() => moveToWantToWatch(show._id)}
          >
            Move to Want to Watch
          </button>

          <button
            className="danger-button"
            onClick={() => deleteTVShow(show._id)}
          >
            Delete
          </button>
        </>
      ) : (
        <>
          <p className="score">Match Score: {show.recommendationScore}%</p>

          {show.scoreBreakdown && (
            <p className="score-breakdown">
              Taste: {show.scoreBreakdown.genreSimilarity}% · TMDB:{" "}
              {show.scoreBreakdown.tmdbRating}% · Popularity:{" "}
              {show.scoreBreakdown.popularity}%
            </p>
          )}

          {show.similarWatchedShows?.length > 0 && (
            <p className="similar-shows">
              Similar to:{" "}
              {show.similarWatchedShows
                .map((similarShow) => similarShow.title)
                .join(", ")}
            </p>
          )}

          <button
            className="watch-button"
            onClick={() => openRatingModal(show)}
          >
            Mark as Watched
          </button>

          <button
            className="danger-button"
            onClick={() => deleteTVShow(show._id)}
          >
            Delete
          </button>
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

        <button
          className="add-show-button"
          onClick={() => setIsAddModalOpen(true)}
        >
          + Add TV Show
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

      {selectedShow && (
        <div className="modal-overlay">
          <div className="rating-modal">
            <h2>Rate "{selectedShow.title}"</h2>

            <input
              type="number"
              min="0"
              max="10"
              step="0.1"
              value={ratingInput}
              onChange={(e) => setRatingInput(e.target.value)}
              placeholder="Enter rating..."
              className="rating-input"
            />

            <div className="modal-buttons">
              <button
                className="cancel-button"
                onClick={() => setSelectedShow(null)}
              >
                Cancel
              </button>

              <button className="save-button" onClick={submitRating}>
                Save Rating
              </button>
            </div>
          </div>
        </div>
      )}

      {isAddModalOpen && (
        <div className="modal-overlay">
          <div className="add-show-modal">
            <h2>Add TV Show</h2>

            <div className="tmdb-search-row">
              <input
                type="text"
                value={newShowTitle}
                onChange={(e) => setNewShowTitle(e.target.value)}
                placeholder="Search TV show..."
                className="rating-input"
              />

              <button className="save-button" onClick={searchTMDBShows}>
                Search
              </button>
            </div>

            <div className="tmdb-results">
              {tmdbResults.map((show) => (
                <div
                  className={
                    selectedTMDBShow?.tmdbId === show.tmdbId
                      ? "tmdb-result selected-tmdb-result"
                      : "tmdb-result"
                  }
                  key={show.tmdbId}
                  onClick={() => setSelectedTMDBShow(show)}
                >
                  {show.imageUrl && (
                    <img src={show.imageUrl} alt={show.title} />
                  )}

                  <div>
                    <h3>{show.title}</h3>
                    <p>{show.year || "Unknown year"}</p>
                    <p>{show.overview || "No overview available."}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="modal-buttons">
              <button
                className="cancel-button"
                onClick={() => {
                  setIsAddModalOpen(false);
                  setTmdbResults([]);
                  setSelectedTMDBShow(null);
                }}
              >
                Cancel
              </button>

              <button
                className="save-button"
                disabled={!selectedTMDBShow || isImporting}
                onClick={() => importTVShow(selectedTMDBShow.tmdbId)}
              >
                {isImporting ? "Importing..." : "Import Selected"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
