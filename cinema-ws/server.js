require("dotenv").config();

const express = require("express");
const cors = require("cors");
const tmdbRoutes = require("./routes/tmdb.routes");

const connectDB = require("./config/db");
const tvShowRoutes = require("./routes/tvShowRoutes.js");
const recommendationRoutes = require("./routes/recommendationRoutes");
const authRoutes = require("./routes/auth.routes");
const mlRoutes = require("./routes/ml.routes");
const mlRecommendationRoutes = require("./routes/mlRecommendation.routes");
const ignoredSuggestionRoutes = require("./routes/ignoredSuggestion.routes");

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/tv-shows", tvShowRoutes);
app.use("/api/recommendations", recommendationRoutes);

app.use("/api/tmdb", tmdbRoutes);
app.use("/api/auth", authRoutes);

app.use("/api/ml", mlRoutes);
app.use("/api/ml-recommendations", mlRecommendationRoutes);
app.use("/api/ignored-suggestions", ignoredSuggestionRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "TV Show Recommendation API is running",
  });
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
