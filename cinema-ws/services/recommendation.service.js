const TVShow = require("../models/TVShow");

const {
  getUniqueGenres,
  createGenreVector,
  cosineSimilarity,
} = require("./featureEngineering.service");

const createPreferenceVector = (tvShows, allGenres) => {
  const preferenceVector = Array(allGenres.length).fill(0);

  const totalRating = tvShows.reduce((sum, tvShow) => {
    return sum + (tvShow.userRating || 0);
  }, 0);

  if (totalRating === 0) {
    return preferenceVector;
  }

  tvShows.forEach((tvShow) => {
    const genreVector = createGenreVector(tvShow, allGenres);
    const ratingWeight = tvShow.userRating || 0;

    genreVector.forEach((value, index) => {
      preferenceVector[index] += value * ratingWeight;
    });
  });

  return preferenceVector.map((value) => value / totalRating);
};

const getRecommendations = async () => {
  const tvShows = await TVShow.find();

  if (tvShows.length === 0) {
    return [];
  }

  const allGenres = getUniqueGenres(tvShows);
  const preferenceVector = createPreferenceVector(tvShows, allGenres);

  const scoredTVShows = tvShows.map((tvShow) => {
    const genreVector = createGenreVector(tvShow, allGenres);
    const similarity = cosineSimilarity(genreVector, preferenceVector);

    return {
      ...tvShow.toObject(),
      recommendationScore: Math.round(similarity * 100),
      similarity: Number(similarity.toFixed(3)),
    };
  });

  return scoredTVShows.sort((a, b) => {
    return b.recommendationScore - a.recommendationScore;
  });
};

module.exports = {
  getRecommendations,
};
