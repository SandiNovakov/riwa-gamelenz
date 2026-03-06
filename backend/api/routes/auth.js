const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

// Auth routes
router.post("/login", authController.login);
router.post("/check_rights", authController.checkRights);

// Note: Register is handled by POST /korisnici in korisnici routes

module.exports = router;
