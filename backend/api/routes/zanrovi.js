const express = require("express");
const router = express.Router();
const zanroviController = require("../controllers/zanroviController");

// Zanr routes
router.post("/zanrovi", zanroviController.create);
router.get("/zanrovi", zanroviController.getAll);
router.get("/zanrovi/:id", zanroviController.getOne);
router.put("/zanrovi/:id", zanroviController.update);
router.delete("/zanrovi/:id", zanroviController.delete);

module.exports = router;
