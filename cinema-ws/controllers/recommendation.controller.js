const TVShow = require("../models/TVShow");
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

const markAsWatched = async (req, res) => {
  try {
    const { id } = req.params;
    const { userRating } = req.body;

    const updatedShow = await TVShow.findByIdAndUpdate(
      id,
      {
        watched: true,
        userRating,
      },
      {
        new: true,
      },
    );

    res.json(updatedShow);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const moveToWantToWatch = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedShow = await TVShow.findByIdAndUpdate(
      id,
      {
        watched: false,
        userRating: null,
      },
      { new: true },
    );

    res.json(updatedShow);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteTVShow = async (req, res) => {
  try {
    const { id } = req.params;

    await TVShow.findByIdAndDelete(id);

    res.json({ message: "TV show deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getRecommendations,
  markAsWatched,
  moveToWantToWatch,
  deleteTVShow,
};
