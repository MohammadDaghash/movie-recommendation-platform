const IgnoredSuggestion = require("../models/IgnoredSuggestion");

const ignoreSuggestion = async (req, res) => {
  try {
    const { tmdbId, title } = req.body;

    const ignoredSuggestion = await IgnoredSuggestion.findOneAndUpdate(
      { tmdbId },
      { tmdbId, title },
      { upsert: true, new: true },
    );

    res.status(201).json(ignoredSuggestion);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  ignoreSuggestion,
};
