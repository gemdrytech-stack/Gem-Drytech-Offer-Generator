const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "../data/quotes.json");

function getAllQuotes() {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function saveQuote(quote) {
  const quotes = getAllQuotes();
  quotes.unshift(quote); // latest first
  fs.writeFileSync(filePath, JSON.stringify(quotes, null, 2));
}

module.exports = { getAllQuotes, saveQuote };