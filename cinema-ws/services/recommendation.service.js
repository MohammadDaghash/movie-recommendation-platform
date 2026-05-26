const TVShow = require("../models/TVShow");

const {
  getUniqueGenres,
  createGenreVector,
  cosineSimilarity,
} = require("./featureEngineering.service");

const normalizeValue = (value, maxValue) => {
  if (!value || !maxValue) {
    return 0;
  }

  return Math.min(value / maxValue, 1);
};

const calculateAverageWatchedYear = (watchedShows) => {
  const showsWithYear = watchedShows.filter((show) => show.year);

  if (showsWithYear.length === 0) {
    return null;
  }

  const totalYear = showsWithYear.reduce((sum, show) => {
    return sum + show.year;
  }, 0);

  return totalYear / showsWithYear.length;
};

const calculateYearSimilarity = (candidateYear, averageWatchedYear) => {
  if (!candidateYear || !averageWatchedYear) {
    return 0;
  }

  const yearDifference = Math.abs(candidateYear - averageWatchedYear);

  return Math.max(0, 1 - yearDifference / 30);
};

const createPreferenceVector = (watchedShows, allGenres) => {
  const preferenceVector = Array(allGenres.length).fill(0);

  const totalRating = watchedShows.reduce((sum, tvShow) => {
    return sum + (tvShow.userRating || 0);
  }, 0);

  if (totalRating === 0) {
    return preferenceVector;
  }

  watchedShows.forEach((tvShow) => {
    const genreVector = createGenreVector(tvShow, allGenres);
    const ratingWeight = tvShow.userRating || 0;

    genreVector.forEach((value, index) => {
      preferenceVector[index] += value * ratingWeight;
    });
  });

  return preferenceVector.map((value) => value / totalRating);
};

const calculateRecommendationScore = (
  tvShow,
  preferenceVector,
  allGenres,
  averageWatchedYear,
  maxPopularity,
) => {
  const genreVector = createGenreVector(tvShow, allGenres);
  const genreSimilarity = cosineSimilarity(genreVector, preferenceVector);

  const tmdbRatingScore = normalizeValue(tvShow.tmdbRating, 10);
  const popularityScore = normalizeValue(tvShow.popularity, maxPopularity);
  const yearScore = calculateYearSimilarity(tvShow.year, averageWatchedYear);

  const finalScore =
    genreSimilarity * 0.7 +
    tmdbRatingScore * 0.15 +
    popularityScore * 0.1 +
    yearScore * 0.05;

  return {
    recommendationScore: Math.round(finalScore * 100),
    similarity: Number(genreSimilarity.toFixed(3)),
    scoreBreakdown: {
      genreSimilarity: Number((genreSimilarity * 100).toFixed(1)),
      tmdbRating: Number((tmdbRatingScore * 100).toFixed(1)),
      popularity: Number((popularityScore * 100).toFixed(1)),
      yearSimilarity: Number((yearScore * 100).toFixed(1)),
    },
  };
};

const findSimilarWatchedShows = (candidateShow, watchedShows, allGenres) => {
  const candidateVector = createGenreVector(candidateShow, allGenres);

  return watchedShows
    .map((watchedShow) => {
      const watchedVector = createGenreVector(watchedShow, allGenres);
      const similarity = cosineSimilarity(candidateVector, watchedVector);

      return {
        title: watchedShow.title,
        similarity: Number(similarity.toFixed(3)),
      };
    })
    .filter((show) => show.similarity > 0)
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, 3);
};

const getRecommendations = async () => {
  const tvShows = await TVShow.find();

  if (tvShows.length === 0) {
    return [];
  }

  const watchedShows = tvShows.filter((tvShow) => tvShow.watched === true);
  const allGenres = getUniqueGenres(tvShows);
  const preferenceVector = createPreferenceVector(watchedShows, allGenres);
  const averageWatchedYear = calculateAverageWatchedYear(watchedShows);

  const maxPopularity = Math.max(
    ...tvShows.map((tvShow) => tvShow.popularity || 0),
  );

  const scoredTVShows = tvShows.map((tvShow) => {
    const scores = calculateRecommendationScore(
      tvShow,
      preferenceVector,
      allGenres,
      averageWatchedYear,
      maxPopularity,
    );

    const similarWatchedShows =
      tvShow.watched === false
        ? findSimilarWatchedShows(tvShow, watchedShows, allGenres)
        : [];

    return {
      ...tvShow.toObject(),
      recommendationScore: scores.recommendationScore,
      similarity: scores.similarity,
      scoreBreakdown: scores.scoreBreakdown,
      similarWatchedShows,
    };
  });

  return scoredTVShows.sort((a, b) => {
    return b.recommendationScore - a.recommendationScore;
  });
};

module.exports = {
  getRecommendations,
};
