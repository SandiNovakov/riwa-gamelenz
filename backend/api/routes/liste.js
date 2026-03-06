const express = require("express");
const router = express.Router();
const listeController = require("../controllers/listeController");

// List routes
router.post("/liste", listeController.addToList);
router.get("/liste", listeController.getAll);
router.get("/liste/:userId", listeController.getUserList);
router.get("/liste/:userId/:gameId", listeController.getOne);
router.put("/liste/:userId/:gameId", listeController.update);
router.delete("/liste/:userId/:gameId", listeController.delete);

// User's game list with filters
router.get("/lista_igrica/:id_korisnika", listeController.getFilteredUserList);

module.exports = router;
