const mongoose = require("mongoose");

const ignoredSuggestionSchema = new mongoose.Schema(
  {
    tmdbId: {
      type: Number,
      required: true,
      unique: true,
    },

    title: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("IgnoredSuggestion", ignoredSuggestionSchema);
