// routes/offerRoutes.js

const express = require("express");
const router = express.Router();

const {
  generateOffer,
  downloadPDF,
  getQuotes,
  downloadQuotePDF
} = require("../controllers/offerController");

const {
  MATERIALS,
  APPLICATIONS,
  STEAMS,
  FUELTYPE,
  COUNTRY,
  FREQUENCY
} = require("../utils/constants");

router.get("/meta", (req, res) => {
  res.json({
    materials: MATERIALS,
    applications: APPLICATIONS,
    steams: STEAMS,
    fueltype: FUELTYPE,
    country: COUNTRY,
    frequency: FREQUENCY
  });
});

router.post("/", generateOffer);

router.post("/pdf", downloadPDF);

router.get("/pdf/:quoteNo", downloadQuotePDF);

router.get("/history", getQuotes);

module.exports = router;