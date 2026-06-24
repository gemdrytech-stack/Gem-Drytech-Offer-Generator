// controllers/offerController.js

const { getPriceRecommendation } = require("../utils/pricingEngine");

const {
  MATERIALS,
  APPLICATIONS,
  STEAMS,
  FUELTYPE,
  COUNTRY,
  FREQUENCY
} = require("../utils/constants");

const { generatePDF } = require("../utils/pdfGenerator");
const { getAllQuotes } = require("../utils/quoteStore");

exports.getQuotes = (req, res) => {
  try {
    const quotes = getAllQuotes();

    const { search } = req.query;

    if (search) {
      const filtered = quotes.filter((q) =>
        String(q.client || "").toLowerCase().includes(search.toLowerCase())
      );

      return res.json(filtered);
    }

    res.json(quotes);
  } catch (err) {
    console.error("Get quotes error:", err);
    res.status(500).json({ error: "Failed to fetch quotes" });
  }
};

exports.generateOffer = (req, res) => {
  try {
    const data = req.body;

    const requiredFields = [
      "client",
      "material",
      "application",
      "capacity",
      "inputMoisture",
      "outputMoisture",
      "temperature",
      "heatingMedia",
      "moc",
      "bagFilter",
      "steams",
      "fueltype",
      "country",
      "frequency"
    ];

    for (const field of requiredFields) {
      if (
        data[field] === undefined ||
        data[field] === null ||
        String(data[field]).trim() === ""
      ) {
        return res.status(400).json({ error: `${field} is required` });
      }
    }

    if (!MATERIALS.includes(data.material)) {
      return res.status(400).json({ error: "Invalid material" });
    }

    if (!APPLICATIONS.includes(data.application)) {
      return res.status(400).json({ error: "Invalid application" });
    }

    if (!STEAMS.includes(data.steams)) {
      return res.status(400).json({ error: "Invalid steam availability" });
    }

    if (!FUELTYPE.includes(data.fueltype)) {
      return res.status(400).json({ error: "Invalid fuel type" });
    }

    if (!COUNTRY.includes(data.country)) {
      return res.status(400).json({ error: "Invalid country" });
    }

    if (!FREQUENCY.includes(data.frequency)) {
      return res.status(400).json({ error: "Invalid frequency" });
    }

    const capacity = Number(data.capacity);
    const inputMoisture = Number(data.inputMoisture);
    const outputMoisture = Number(data.outputMoisture);
    const temperature = Number(data.temperature);

    if (!Number.isFinite(capacity) || capacity <= 0) {
      return res.status(400).json({ error: "Capacity must be greater than 0" });
    }

    if (
      !Number.isFinite(inputMoisture) ||
      inputMoisture <= 0 ||
      inputMoisture >= 100
    ) {
      return res.status(400).json({
        error: "Input moisture must be greater than 0 and less than 100"
      });
    }

    if (
      !Number.isFinite(outputMoisture) ||
      outputMoisture < 0 ||
      outputMoisture >= 100
    ) {
      return res.status(400).json({
        error: "Output moisture must be greater than or equal to 0 and less than 100"
      });
    }

    if (inputMoisture <= outputMoisture) {
      return res.status(400).json({
        error: "Input moisture must be greater than output moisture"
      });
    }

    if (!Number.isFinite(temperature) || temperature <= 0) {
      return res.status(400).json({
        error: "Temperature must be greater than 0"
      });
    }

    const result = getPriceRecommendation(data);

    res.json({
      success: true,
      ...result
    });
  } catch (err) {
    console.error("Generate offer error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

exports.downloadPDF = (req, res) => {
  try {
    generatePDF(req.body, res);
  } catch (err) {
    console.error("PDF generation error:", err);
    res.status(500).json({ error: "PDF generation failed" });
  }
};

exports.downloadQuotePDF = (req, res) => {
  try {
    const { quoteNo } = req.params;

    const quotes = getAllQuotes();

    const quote = quotes.find((q) => q.quoteNo === quoteNo);

    if (!quote) {
      return res.status(404).json({ error: "Quote not found" });
    }

    generatePDF(quote, res);
  } catch (err) {
    console.error("Quote PDF download error:", err);
    res.status(500).json({ error: "PDF download failed" });
  }
};