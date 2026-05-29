const mongoose = require("mongoose");
const fs = require("fs");
require("dotenv").config();

const TVShow = require("./models/TVShow");

const exportTVShows = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected");

    const tvShows = await TVShow.find();

    fs.writeFileSync(
      "./ml-experiments/tvshows.json",
      JSON.stringify(tvShows, null, 2),
    );

    console.log("TV shows exported successfully");

    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

exportTVShows();
