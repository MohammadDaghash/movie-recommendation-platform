const express = require("express");
const {
  ignoreSuggestion,
} = require("../controllers/ignoredSuggestion.controller");

const router = express.Router();

router.post("/", ignoreSuggestion);

module.exports = router;
