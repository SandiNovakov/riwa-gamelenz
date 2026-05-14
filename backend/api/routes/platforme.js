const express = require("express");
const router = express.Router();
const platformeController = require("../controllers/platformeController");

// Platforma CRUD
router.post("/platforme", platformeController.create);
router.get("/platforme", platformeController.getAll);
router.get("/platforme/:id", platformeController.getOne);
router.put("/platforme/:id", platformeController.update);
router.delete("/platforme/:id", platformeController.delete);

// Igrica-Platforma veze
router.post("/igrice-platforme", platformeController.addGamePlatform);
router.get("/igrice-platforme", platformeController.getAllGamePlatforms);
router.get(
  "/igrice-platforme/:igricaId/:platformaId",
  platformeController.getOneGamePlatform,
);
router.delete(
  "/igrice-platforme/:igricaId/:platformaId",
  platformeController.deleteGamePlatform,
);

module.exports = router;
