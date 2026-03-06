const express = require("express");
const router = express.Router();
const miscController = require("../controllers/miscController");

// Misc routes
router.get("/index-summary", miscController.getIndexSummary);

module.exports = router;
