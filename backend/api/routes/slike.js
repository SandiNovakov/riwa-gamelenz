const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });
const slikeController = require("../controllers/slikeController");

// Image routes
router.get("/images", slikeController.getImage);
router.post("/images", upload.single("image"), slikeController.uploadImage);
router.delete("/images", slikeController.deleteImage);

module.exports = router;
