const express = require("express");
const { getMLRecommendations } = require("../controllers/ml.controller");

const router = express.Router();

router.get("/recommendations", getMLRecommendations);

module.exports = router;
