const express = require("express");
const recommendationController = require("../controllers/recommendation.controller");
const { protect, adminOnly } = require("../middleware/auth.middleware");

const router = express.Router();

router.get("/", recommendationController.getRecommendations);

router.post("/:id/watch", protect, recommendationController.markAsWatched);

router.post(
  "/:id/unwatch",
  protect,
  recommendationController.moveToWantToWatch,
);

router.delete(
  "/:id",
  protect,
  adminOnly,
  recommendationController.deleteTVShow,
);

module.exports = router;
