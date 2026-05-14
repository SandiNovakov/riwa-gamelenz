const express = require("express");
const router = express.Router();
const korisniciController = require("../controllers/korisniciController");

// Korisnici routes
router.post("/korisnici", korisniciController.create);
router.get("/korisnici", korisniciController.getAll);
router.get("/korisnici/:id", korisniciController.getOne);
router.put("/korisnici/:id", korisniciController.update);
router.delete("/korisnici/:id", korisniciController.delete);

// Administratori routes
router.get("/administratori", korisniciController.getAdmins);
router.get("/administratori/check/:id", korisniciController.checkAdmin);
router.post("/administratori/:id", korisniciController.addAdmin);
router.delete("/administratori/:id", korisniciController.removeAdmin);

module.exports = router;
