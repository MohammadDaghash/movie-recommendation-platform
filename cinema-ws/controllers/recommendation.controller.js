const recommendationService = require("../services/recommendation.service");

const getRecommendations = async (req, res) => {
  try {
    const recommendations = await recommendationService.getRecommendations();

    res.json(recommendations);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  getRecommendations,
};
