const express = require("express");

const {
  getTMDBRecommendations,
} = require("../controllers/mlRecommendation.controller");

const router = express.Router();

router.get("/tmdb", getTMDBRecommendations);

module.exports = router;
