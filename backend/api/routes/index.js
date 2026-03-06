const express = require("express");
const router = express.Router();

router.use(require("./auth"));
router.use(require("./korisnici"));
router.use(require("./igrice"));
router.use(require("./liste"));
router.use(require("./slike"));
router.use(require("./developeri"));
router.use(require("./platforme"));
router.use(require("./izdavaci"));
router.use(require("./zanrovi"));
router.use(require("./misc"));

module.exports = router;
