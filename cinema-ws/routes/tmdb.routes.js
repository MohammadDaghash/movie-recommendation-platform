const express = require("express");

const router = express.Router();

const {
  importTVShow,
  searchTMDBTVShows,
} = require("../controllers/tmdb.controller");

router.get("/search", searchTMDBTVShows);

router.post("/import", importTVShow);

module.exports = router;
