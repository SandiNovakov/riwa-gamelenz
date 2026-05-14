const express = require("express");
const router = express.Router();
const igriceController = require("../controllers/igriceController");

// Igrice CRUD
router.post("/igrice", igriceController.create);
router.get("/igrice", igriceController.getAll);
router.get("/igrice/:id", igriceController.getOne);
router.put("/igrice/:id", igriceController.update);
router.delete("/igrice/:id", igriceController.delete);

// Browse with filters
router.get("/browse", igriceController.browse);

//detalji o igrici
router.get("/igrice/detalji/:id", igriceController.getDetails);

module.exports = router;
