const TVShow = require("../models/TVShow");

const {
  getUniqueGenres,
  createGenreVector,
  cosineSimilarity,
} = require("./featureEngineering.service");

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

const calculateRecommendationScore = (tvShow, preferenceVector, allGenres) => {
  const genreVector = createGenreVector(tvShow, allGenres);
  const similarity = cosineSimilarity(genreVector, preferenceVector);

  return {
    recommendationScore: Math.round(similarity * 100),
    similarity: Number(similarity.toFixed(3)),
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

  const scoredTVShows = tvShows.map((tvShow) => {
    const scores = calculateRecommendationScore(
      tvShow,
      preferenceVector,
      allGenres,
    );

    const similarWatchedShows =
      tvShow.watched === false
        ? findSimilarWatchedShows(tvShow, watchedShows, allGenres)
        : [];

    return {
      ...tvShow.toObject(),
      recommendationScore: scores.recommendationScore,
      similarity: scores.similarity,
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
