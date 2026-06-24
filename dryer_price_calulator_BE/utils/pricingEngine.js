// utils/pricingEngine.js

const { DRYER_RULES, BASE_PRICE } = require("./constants");

function toNumber(value, fallback = 0) {
  const num = Number(String(value ?? "").replace(/,/g, ""));
  return Number.isFinite(num) ? num : fallback;
}

function normalize(value) {
  return String(value || "").trim().toLowerCase();
}

function addScores(scores, ruleScores = {}) {
  for (const [dryer, points] of Object.entries(ruleScores)) {
    scores[dryer] = (scores[dryer] || 0) + Number(points);
  }
}

function calculateMassBalance(data) {
  const feedRate = toNumber(data.feedRate || data.capacity);
  const inputMoisture = toNumber(data.inputMoisture);
  const outputMoisture = toNumber(data.outputMoisture);

  const Mi = inputMoisture / 100;
  const Mf = outputMoisture / 100;

  if (
    feedRate <= 0 ||
    inputMoisture < 0 ||
    outputMoisture < 0 ||
    inputMoisture >= 100 ||
    outputMoisture >= 100 ||
    inputMoisture <= outputMoisture
  ) {
    return {
      feedRate,
      inputMoisture,
      outputMoisture,
      drySolids: 0,
      finalOutput: 0,
      waterEvaporation: 0,
      moistureDiff: inputMoisture - outputMoisture
    };
  }

  const drySolids = feedRate * (1 - Mi);
  const finalOutput = drySolids / (1 - Mf);
  const waterEvaporation = feedRate - finalOutput;

  return {
    feedRate,
    inputMoisture,
    outputMoisture,
    drySolids,
    finalOutput,
    waterEvaporation,
    moistureDiff: inputMoisture - outputMoisture
  };
}

function getMatchingMaterialRule(material) {
  const materialText = normalize(material);

  const matchedKey = Object.keys(DRYER_RULES.materials || {}).find((key) =>
    materialText.includes(key.toLowerCase())
  );

  return matchedKey ? DRYER_RULES.materials[matchedKey] : null;
}

function applyCapacityRule(scores, waterEvaporation, reasons) {
  const rules = DRYER_RULES.capacityRules || [];

  for (const rule of rules) {
    const minOk = rule.minEvap === undefined || waterEvaporation >= rule.minEvap;
    const maxOk = rule.maxEvap === undefined || waterEvaporation < rule.maxEvap;

    if (minOk && maxOk) {
      addScores(scores, rule.scores);
      if (rule.reason) reasons.push(rule.reason);
      break;
    }
  }
}

function applyTemperatureRule(scores, temperature, reasons) {
  const rules = DRYER_RULES.temperatureRules || [];

  for (const rule of rules) {
    const minOk = rule.minTemp === undefined || temperature >= rule.minTemp;
    const maxOk = rule.maxTemp === undefined || temperature < rule.maxTemp;

    if (minOk && maxOk) {
      addScores(scores, rule.scores);
      if (rule.reason) reasons.push(rule.reason);
      break;
    }
  }
}

function applyHeatingMediaRule(scores, data, reasons) {
  const heatingText = `${normalize(data.heatingMedia)} ${normalize(data.fueltype)}`;
  const mediaRules = DRYER_RULES.heatingMediaRules || {};

  for (const [media, ruleScores] of Object.entries(mediaRules)) {
    if (heatingText.includes(media)) {
      addScores(scores, ruleScores);
      reasons.push(`Heating media matched with ${media}.`);
    }
  }
}

function removeInvalidDryers(scores, data, reasons) {
  const materialText = normalize(data.material);
  const applicationText = normalize(data.application);

  const isLiquidInput =
    materialText.includes("liquid") ||
    materialText.includes("slurry") ||
    applicationText.includes("dairy") ||
    applicationText.includes("ceramics") ||
    applicationText.includes("coating");

  if (isLiquidInput) {
    delete scores["Combination Dryer"];
    reasons.push("Combination Dryer removed because input material is liquid/slurry.");
  }
}

function rankDryers(scores) {
  const priority = DRYER_RULES.priority || [];

  return Object.entries(scores)
    .sort((a, b) => {
      const scoreDiff = b[1] - a[1];

      if (scoreDiff !== 0) return scoreDiff;

      const aPriority = priority.indexOf(a[0]);
      const bPriority = priority.indexOf(b[0]);

      return (
        (aPriority === -1 ? 999 : aPriority) -
        (bPriority === -1 ? 999 : bPriority)
      );
    })
    .map(([dryer, score]) => ({ dryer, score }));
}

function selectDryer(data) {
  const scores = {};
  const reasons = [];

  const { application, material, temperature } = data;

  const massBalance = calculateMassBalance(data);

  // 1. Application-based scoring
  const applicationRule = DRYER_RULES.applications?.[application];

  if (applicationRule) {
    addScores(scores, applicationRule.scores);
    if (applicationRule.reason) reasons.push(applicationRule.reason);
  } else {
    scores[DRYER_RULES.defaultDryer] = 1;
    reasons.push("No exact application match found, so default dryer logic was applied.");
  }

  // 2. Material-based scoring
  const materialRule = getMatchingMaterialRule(material);

  if (materialRule) {
    addScores(scores, materialRule);
    reasons.push(`Material nature matched with ${material}.`);
  }

  // 3. Capacity / evaporation scoring
  applyCapacityRule(scores, massBalance.waterEvaporation, reasons);

  // 4. Temperature scoring
  applyTemperatureRule(scores, toNumber(temperature), reasons);

  // 5. Heating media scoring
  applyHeatingMediaRule(scores, data, reasons);

  // 6. Remove technically invalid dryer choices
  removeInvalidDryers(scores, data, reasons);

  const rankedDryers = rankDryers(scores);

  const recommendedDryer = rankedDryers[0]?.dryer || DRYER_RULES.defaultDryer;

  return {
    dryer: recommendedDryer,
    rankedDryers,
    selectionReasons: reasons,
    massBalance
  };
}

function getPriceRecommendation(data) {
  const {
    material,
    temperature,
    heatingMedia,
    moc,
    bagFilter,
    country
  } = data;

  const selection = selectDryer(data);

  const dryer = selection.dryer;
  const massBalance = selection.massBalance;

  let price = BASE_PRICE[dryer] || 150000;

  // 1. Capacity impact
  price += massBalance.feedRate * 100;

  // 2. Moisture removal impact
  price += Math.max(massBalance.moistureDiff, 0) * 500;

  // 3. Water evaporation impact
  price += massBalance.waterEvaporation * 250;

  // 4. Temperature impact
  if (toNumber(temperature) > 150) {
    price *= 1.1;
  }

  // 5. Material handling complexity
  const materialText = normalize(material);

  if (
    materialText.includes("sludge") ||
    materialText.includes("paste") ||
    materialText.includes("filter cake") ||
    materialText.includes("wet cake") ||
    materialText.includes("fibrous")
  ) {
    price *= 1.2;
  }

  // 6. Heating media impact
  const heatingText = normalize(heatingMedia);

  if (heatingText.includes("steam")) {
    price *= 1.05;
  } else if (heatingText.includes("electric")) {
    price *= 1.15;
  } else if (
    heatingText.includes("gas") ||
    heatingText.includes("diesel") ||
    heatingText.includes("wood") ||
    heatingText.includes("biomass") ||
    heatingText.includes("coal")
  ) {
    price *= 1.1;
  }

  // 7. MOC impact
  const mocText = normalize(moc);

  if (mocText.includes("ss316")) {
    price *= 1.2;
  } else if (mocText.includes("ss304")) {
    price *= 1.1;
  }

  // 8. Bag filter cost
  if (normalize(bagFilter) === "yes") {
    price += 10000;
  }

  // 9. Export / international margin
  if (country && !normalize(country).includes("india")) {
    price *= 1.08;
  }

  const minPrice = Math.round(price);
  const maxPrice = Math.round(price * 1.25);

  return {
    dryer,
    minPrice,
    maxPrice,

    drySolids: Math.round(massBalance.drySolids),
    finalOutput: Math.round(massBalance.finalOutput),
    waterEvaporation: Math.round(massBalance.waterEvaporation),

    selectionScore: selection.rankedDryers[0]?.score || 0,
    alternativeDryers: selection.rankedDryers.slice(1, 4),
    selectionReasons: selection.selectionReasons
  };
}

function calculateDryingTime({
  dryingArea,
  materialDepth,
  bulkDensity,
  feedRate
}) {
  const area = Number(dryingArea);
  const depthMm = Number(materialDepth);
  const density = Number(bulkDensity);
  const feed = Number(feedRate);

  if (!area || !depthMm || !density || !feed) {
    return 0;
  }

  const depthM = depthMm / 1000;

  const materialHoldUp = area * depthM * density;

  const dryingTimeMinutes = (materialHoldUp / feed) * 60;

  return Math.round(dryingTimeMinutes);
}

module.exports = {
  getPriceRecommendation,
  selectDryer,
  calculateMassBalance,
  calculateDryingTime
};