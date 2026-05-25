require("dotenv").config();

const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");
const tvShowRoutes = require("./routes/tvShowRoutes.js");
const recommendationRoutes = require("./routes/recommendationRoutes");

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/tv-shows", tvShowRoutes);
app.use("/api/recommendations", recommendationRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "TV Show Recommendation API is running",
  });
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
