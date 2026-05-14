const express = require("express");
const router = express.Router();
const developeriController = require("../controllers/developeriController");

// Developer routes
router.post("/developeri", developeriController.create);
router.get("/developeri", developeriController.getAll);
router.get("/developeri/:id", developeriController.getOne);
router.put("/developeri/:id", developeriController.update);
router.delete("/developeri/:id", developeriController.delete);

module.exports = router;
