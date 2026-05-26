const getUniqueGenres = (tvShows) => {
  const genres = tvShows.flatMap((tvShow) => tvShow.genres);

  return [...new Set(genres)].sort();
};

const createGenreVector = (tvShow, allGenres) => {
  return allGenres.map((genre) => {
    return tvShow.genres.includes(genre) ? 1 : 0;
  });
};

const dotProduct = (vectorA, vectorB) => {
  return vectorA.reduce((sum, value, index) => {
    return sum + value * vectorB[index];
  }, 0);
};

const magnitude = (vector) => {
  const squaredSum = vector.reduce((sum, value) => {
    return sum + value * value;
  }, 0);

  return Math.sqrt(squaredSum);
};

const cosineSimilarity = (vectorA, vectorB) => {
  const denominator = magnitude(vectorA) * magnitude(vectorB);

  if (denominator === 0) {
    return 0;
  }

  return dotProduct(vectorA, vectorB) / denominator;
};

module.exports = {
  getUniqueGenres,
  createGenreVector,
  cosineSimilarity,
};
