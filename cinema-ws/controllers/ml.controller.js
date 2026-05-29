const fs = require("fs");
const path = require("path");

const getMLRecommendations = async (req, res) => {
  try {
    const filePath = path.resolve(
      process.cwd(),
      "ml/experiments/recommendations.json",
    );

    console.log("Looking for recommendations at:", filePath);

    const data = fs.readFileSync(filePath, "utf-8");

    const recommendations = JSON.parse(data);

    res.json(recommendations);
  } catch (error) {
    console.log("ML recommendations error:", error.message);

    res.status(500).json({
      message: "Failed to load ML recommendations",
    });
  }
};

module.exports = {
  getMLRecommendations,
};
