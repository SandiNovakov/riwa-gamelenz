const express = require("express");
const router = express.Router();
const izdavaciController = require("../controllers/izdavaciController");

// Izdavac routes
router.post("/izdavaci", izdavaciController.create);
router.get("/izdavaci", izdavaciController.getAll);
router.get("/izdavaci/:id", izdavaciController.getOne);
router.put("/izdavaci/:id", izdavaciController.update);
router.delete("/izdavaci/:id", izdavaciController.delete);

module.exports = router;
