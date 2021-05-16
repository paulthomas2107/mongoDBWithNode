const express = require("express");
const router = express.Router();
const { ensureAuth } = require("../middleware/auth");
const story = require("../models/Story");

//@desc  Show add page
//@route GET /stories/add
router.get("/add", ensureAuth, (req, res) => {
  res.render("stories/add");
});

module.exports = router;
