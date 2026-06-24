const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "../data/sequence.json");

function getNextQuoteNumber() {
  const data = JSON.parse(fs.readFileSync(filePath, "utf8"));

  data.current += 1;

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

  const year = new Date().getFullYear();

  const padded = String(data.current).padStart(6, "0");

  return `QTN-${year}-${padded}`;
}

module.exports = { getNextQuoteNumber };