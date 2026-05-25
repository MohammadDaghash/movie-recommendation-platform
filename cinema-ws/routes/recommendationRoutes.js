const express = require("express");

const recommendationController = require("../controllers/recommendation.controller");

const router = express.Router();

router.get("/", recommendationController.getRecommendations);

module.exports = router;
