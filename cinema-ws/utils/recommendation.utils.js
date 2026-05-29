const MAJOR_CATEGORIES = [
  "Comedy",
  "Drama & Romance",
  "Crime & Thriller",
  "Fantasy & Sci-Fi",
  "Animation",
];

const createCategoryVector = (genres) => {
  const vector = {
    Comedy: 0,
    "Drama & Romance": 0,
    "Crime & Thriller": 0,
    "Fantasy & Sci-Fi": 0,
    Animation: 0,
  };

  if (genres.includes("Comedy")) {
    vector["Comedy"] += 1;
  }

  if (genres.includes("Drama") || genres.includes("Romance")) {
    vector["Drama & Romance"] += 1;
  }

  if (
    genres.includes("Crime") ||
    genres.includes("Thriller") ||
    genres.includes("Mystery") ||
    genres.includes("Horror")
  ) {
    vector["Crime & Thriller"] += 1;
  }

  if (
    genres.includes("Fantasy") ||
    genres.includes("Sci-Fi") ||
    genres.includes("Science Fiction") ||
    genres.includes("Adventure")
  ) {
    vector["Fantasy & Sci-Fi"] += 1;
  }

  if (genres.includes("Animation") || genres.includes("Anime")) {
    vector["Animation"] += 1;
  }

  return MAJOR_CATEGORIES.map((category) => vector[category]);
};

const dotProduct = (vectorA, vectorB) => {
  return vectorA.reduce((sum, value, index) => sum + value * vectorB[index], 0);
};

const magnitude = (vector) => {
  return Math.sqrt(vector.reduce((sum, value) => sum + value * value, 0));
};

const cosineSimilarity = (vectorA, vectorB) => {
  const denominator = magnitude(vectorA) * magnitude(vectorB);

  if (denominator === 0) {
    return 0;
  }

  return dotProduct(vectorA, vectorB) / denominator;
};

module.exports = {
  createCategoryVector,
  cosineSimilarity,
};
