const express = require("express");
const TVShow = require("../models/TVShow");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const tvShows = await TVShow.find();

    res.json(tvShows);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

router.post("/", async (req, res) => {
  try {
    const tvShow = await TVShow.create(req.body);

    res.status(201).json(tvShow);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

module.exports = router;
