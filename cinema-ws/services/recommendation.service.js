const TVShow = require("../models/TVShow");

const getRecommendations = async () => {
  const tvShows = await TVShow.find();

  const sortedTVShows = tvShows.sort((a, b) => {
    return b.recommendationScore - a.recommendationScore;
  });

  return sortedTVShows;
};

module.exports = {
  getRecommendations,
};
