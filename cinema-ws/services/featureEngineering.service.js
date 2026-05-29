const MAJOR_CATEGORIES = [
  "Comedy",
  "Drama & Romance",
  "Crime & Thriller",
  "Fantasy & Sci-Fi",
  "Animation",
];

const getCategoryScores = (tvShow) => {
  const genres = tvShow.genres || [];

  const matchedCategories = [];

  if (genres.includes("Animation") || genres.includes("Anime")) {
    matchedCategories.push("Animation");
  }

  if (
    genres.includes("Fantasy") ||
    genres.includes("Sci-Fi") ||
    genres.includes("Science Fiction") ||
    genres.includes("Science-Fiction") ||
    genres.includes("Sci-Fi & Fantasy") ||
    genres.includes("Adventure")
  ) {
    matchedCategories.push("Fantasy & Sci-Fi");
  }

  if (
    genres.includes("Crime") ||
    genres.includes("Thriller") ||
    genres.includes("Mystery") ||
    genres.includes("Horror")
  ) {
    matchedCategories.push("Crime & Thriller");
  }

  if (genres.includes("Drama") && genres.includes("Romance")) {
    matchedCategories.push("Drama & Romance");
  }

  if (genres.includes("Comedy")) {
    matchedCategories.push("Comedy");
  }

  if (matchedCategories.length === 0) {
    matchedCategories.push("Drama & Romance");
  }

  const weights =
    matchedCategories.length === 1
      ? [1]
      : matchedCategories.length === 2
        ? [0.7, 0.3]
        : [0.5, 0.3, 0.2];

  const categoryScores = {
    Comedy: 0,
    "Drama & Romance": 0,
    "Crime & Thriller": 0,
    "Fantasy & Sci-Fi": 0,
    Animation: 0,
  };

  matchedCategories.slice(0, 3).forEach((category, index) => {
    categoryScores[category] = weights[index];
  });

  return categoryScores;
};

const createGenreVector = (tvShow) => {
  const categoryScores = getCategoryScores(tvShow);

  return MAJOR_CATEGORIES.map((category) => {
    return categoryScores[category];
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
  MAJOR_CATEGORIES,
  getCategoryScores,
  createGenreVector,
  cosineSimilarity,
};
