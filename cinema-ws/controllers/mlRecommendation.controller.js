const axios = require("axios");
const TVShow = require("../models/TVShow");
const IgnoredSuggestion = require("../models/IgnoredSuggestion");
const {
  createCategoryVector,
  cosineSimilarity,
} = require("../utils/recommendation.utils");

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

const genreMap = {
  Comedy: 35,
  Drama: 18,
  Romance: 10749,
  Crime: 80,
  Thriller: 53,
  Mystery: 9648,
  Horror: 27,
  Fantasy: 10765,
  "Sci-Fi": 10765,
  "Science Fiction": 10765,
  Adventure: 10759,
  Animation: 16,
  Anime: 16,
};

const genreNameMap = {
  18: "Drama",
  35: "Comedy",
  10749: "Romance",
  80: "Crime",
  53: "Thriller",
  9648: "Mystery",
  27: "Horror",
  10765: "Fantasy & Sci-Fi",
  10759: "Adventure",
  16: "Animation",
};

const getTMDBRecommendations = async (req, res) => {
  try {
    const watchedShows = await TVShow.find({ watched: true });
    const allExistingShows = await TVShow.find();
    const ignoredSuggestions = await IgnoredSuggestion.find();
    const ignoredTMDBIds = ignoredSuggestions.map((show) => show.tmdbId);

    const existingTMDBIds = allExistingShows
      .map((show) => show.tmdbId)
      .filter(Boolean);

    const existingTitles = allExistingShows.map((show) =>
      show.title.toLowerCase().trim(),
    );

    const watchedGenres = watchedShows.flatMap((show) => show.genres);

    const watchedVectors = watchedShows.map((show) => ({
      vector: createCategoryVector(show.genres),
      rating: show.userRating || 5,
    }));

    const totalRatingWeight = watchedVectors.reduce(
      (sum, show) => sum + show.rating,
      0,
    );

    const userProfileVector = watchedVectors[0].vector.map((_, index) => {
      const weightedSum = watchedVectors.reduce(
        (total, show) => total + show.vector[index] * show.rating,
        0,
      );

      return weightedSum / totalRatingWeight;
    });

    const genreFrequency = {};

    // Gg​=∑i:g∈genresi​​ ri​
    watchedShows.forEach((show) => {
      const ratingWeight = show.userRating || 5;

      show.genres.forEach((genre) => {
        genreFrequency[genre] = (genreFrequency[genre] || 0) + ratingWeight;
      });
    });

    const favoriteGenreIds = Object.entries(genreFrequency)
      .sort((a, b) => b[1] - a[1])
      .map(([genre]) => genreMap[genre])
      .filter(Boolean)
      .slice(0, 3);

    const tmdbPages = await Promise.all(
      [1, 2, 3, 4, 5].map((page) =>
        axios.get(`${TMDB_BASE_URL}/discover/tv`, {
          params: {
            api_key: TMDB_API_KEY,
            with_genres: favoriteGenreIds[0],
            sort_by: "vote_average.desc",
            "vote_count.gte": 50,
            language: "en-US",
            page,
          },
        }),
      ),
    );

    const tmdbResults = tmdbPages.flatMap((response) => response.data.results);

    const recommendations = tmdbResults
      .filter(
        (show) =>
          !existingTMDBIds.includes(show.id) &&
          !existingTitles.includes(show.name.toLowerCase().trim()) &&
          !ignoredTMDBIds.includes(show.id),
      )
      .map((show) => {
        const showGenres = show.genre_ids
          .map((id) => genreNameMap[id])
          .filter(Boolean);

        const showVector = createCategoryVector(showGenres);

        const genreSimilarity = Math.round(
          cosineSimilarity(userProfileVector, showVector) * 100,
        );

        const categoryPreference = genreSimilarity;
        const tmdbScore = Math.min(
          100,
          Math.round((show.vote_average || 0) * 10),
        );
        const popularityScore = Math.min(
          100,
          Math.round((show.popularity || 0) / 2),
        );
        const yearSimilarity = 80;

        const recommendationScore = Math.round(
          genreSimilarity * 0.4 +
            categoryPreference * 0.2 +
            tmdbScore * 0.2 +
            popularityScore * 0.1 +
            yearSimilarity * 0.1,
        );

        return {
          tmdbId: show.id,
          title: show.name,
          genres: showGenres,
          year: show.first_air_date
            ? Number(show.first_air_date.slice(0, 4))
            : null,
          imageUrl: show.poster_path
            ? `${TMDB_IMAGE_BASE_URL}${show.poster_path}`
            : "",
          overview: show.overview,
          tmdbRating: show.vote_average,
          popularity: show.popularity,
          recommendationScore,
          matchScore: recommendationScore,
          isAISuggestion: true,
          scoreBreakdown: {
            genreSimilarity,
            categoryPreference,
            tmdbRating: tmdbScore,
            popularity: popularityScore,
            yearSimilarity,
          },
          similarWatchedShows: watchedShows
            .map((watchedShow) => {
              const watchedVector = createCategoryVector(watchedShow.genres);

              return {
                title: watchedShow.title,
                similarity: cosineSimilarity(showVector, watchedVector),
              };
            })
            .sort((a, b) => b.similarity - a.similarity)
            .slice(0, 3),
        };
      })
      .sort((a, b) => b.recommendationScore - a.recommendationScore)
      .slice(0, 20);

    res.json(recommendations);
  } catch (error) {
    console.log(error.message);

    res.status(500).json({
      message: "Failed to generate TMDB recommendations",
    });
  }
};

module.exports = {
  getTMDBRecommendations,
};
