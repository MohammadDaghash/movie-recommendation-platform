const express = require("express");
const recommendationController = require("../controllers/recommendation.controller");

const router = express.Router();

router.get("/", recommendationController.getRecommendations);

router.post("/:id/watch", recommendationController.markAsWatched);

router.post("/:id/unwatch", recommendationController.moveToWantToWatch);

router.delete("/:id", recommendationController.deleteTVShow);

module.exports = router;
