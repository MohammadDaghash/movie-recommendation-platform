const TVShow = require("../models/TVShow");

const {
  searchTVShows,
  getTVShowDetailsById,
} = require("../services/tmdb.service");

const searchTMDBTVShows = async (req, res) => {
  try {
    const { title } = req.query;

    if (!title) {
      return res.status(400).json({
        message: "Title query is required",
      });
    }

    const results = await searchTVShows(title);

    res.json(results);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const importTVShow = async (req, res) => {
  try {
    const { tmdbId } = req.body;

    const tmdbShow = await getTVShowDetailsById(tmdbId);

    const existingShow = await TVShow.findOne({
      tmdbId: tmdbShow.tmdbId,
    });

    if (existingShow) {
      return res.status(400).json({
        message: "TV show already exists",
      });
    }

    const newTVShow = await TVShow.create({
      title: tmdbShow.title,
      genres: tmdbShow.genres,
      year: tmdbShow.year,
      imageUrl: tmdbShow.imageUrl,
      overview: tmdbShow.overview,
      popularity: tmdbShow.popularity,
      tmdbRating: tmdbShow.tmdbRating,
      tmdbId: tmdbShow.tmdbId,
      watched: false,
      userRating: null,
      recommendationScore: 0,
    });

    res.status(201).json(newTVShow);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  searchTMDBTVShows,
  importTVShow,
};
