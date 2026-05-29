const express = require("express");

const router = express.Router();

const {
  importTVShow,
  searchTMDBTVShows,
} = require("../controllers/tmdb.controller");

const { protect, adminOnly } = require("../middleware/auth.middleware");

router.get("/search", searchTMDBTVShows);

router.post("/import", protect, adminOnly, importTVShow);

module.exports = router;
