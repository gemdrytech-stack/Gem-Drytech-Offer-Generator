// utils/pdfGenerator.js

const PDFDocument = require("pdfkit");
const path = require("path");
const fs = require("fs");

const { getNextQuoteNumber } = require("./quoteNumber");
const { saveQuote, getAllQuotes } = require("./quoteStore");

/*
  Recommended asset structure:

  backend/
    assets/
      hderlgo.png
      dryer-offer.jpg

  Change these filenames as per your actual files.
*/
const logoPath = path.join(__dirname, "../assets/hderlgo.png");
const defaultDryerImagePath = path.join(__dirname, "../assets/dryer-offer.jpg");

function generatePDF(data, res) {
  let sourceData = data;
  const quotes = getAllQuotes();

  if (data.quoteNo) {
    const found = quotes.find((q) => q.quoteNo === data.quoteNo);
    if (found) sourceData = found;
  }

  const doc = new PDFDocument({
    size: "A4",
    margin: 0
  });

  const quoteNo = sourceData.quoteNo || getNextQuoteNumber();
  const date = sourceData.date || new Date().toLocaleDateString("en-IN");

  res.setHeader(
    "Content-Disposition",
    `attachment; filename=${quoteNo}-technical-offer.pdf`
  );
  res.setHeader("Content-Type", "application/pdf");

  doc.pipe(res);

  const pageWidth = doc.page.width;
  const pageHeight = doc.page.height;

  const left = 45;
  const right = pageWidth - 45;
  const tableWidth = right - left;

  const descW = 340;
  const qtyW = 45;
  const unitW = 60;
  const amountW = tableWidth - descW - qtyW - unitW;

  const qtyX = left + descW;
  const unitX = qtyX + qtyW;
  const amountX = unitX + unitW;

  const currency =
    sourceData.currency ||
    (String(sourceData.country || "").toLowerCase().includes("india")
      ? "INR"
      : "USD");

  /* =========================
     BASIC HELPERS
  ========================= */

  function safe(value, fallback = "-") {
    if (value === undefined || value === null || value === "") return fallback;
    return value;
  }

  function toNumber(value, fallback = 0) {
    const num = Number(String(value ?? "").replace(/,/g, ""));
    return Number.isFinite(num) ? num : fallback;
  }

  function formatNumber(value) {
    const num = toNumber(value);
    return num.toLocaleString("en-IN");
  }

  function formatCurrency(value) {
    const num = toNumber(value);
    const formatted = num.toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });

    return formatted;
  }

  function line(x1, y1, x2, y2) {
    doc.moveTo(x1, y1).lineTo(x2, y2).stroke();
  }

  function rect(x, y, w, h) {
    doc.rect(x, y, w, h).stroke();
  }

  function bold(size = 8) {
    return doc.font("Helvetica-Bold").fontSize(size);
  }

  function normal(size = 8) {
    return doc.font("Helvetica").fontSize(size);
  }

  function imageExists(imagePath) {
    return imagePath && fs.existsSync(imagePath);
  }

  function drawOuterBorder() {
    doc.lineWidth(0.7);
    rect(left, 38, tableWidth, pageHeight - 78);
  }

  function getOfferTitle() {
    console.log("=========",sourceData)
    const dryer = safe(sourceData.dryer, "DRYER");
    return `TECHNICAL OFFER FOR ${String(dryer).toUpperCase()}`;
  }

  function getAmountValue() {
    return (
      sourceData.totalPrice ||
      sourceData.amount ||
      sourceData.maxPrice ||
      sourceData.minPrice ||
      0
    );
  }

  function calculateMassBalance() {
    const feedRate = toNumber(
      sourceData.feedRate || sourceData.capacity || sourceData.inputCapacity
    );
    const inputMoisture = toNumber(sourceData.inputMoisture);
    const outputMoisture = toNumber(sourceData.outputMoisture);

    if (
      feedRate <= 0 ||
      inputMoisture <= 0 ||
      inputMoisture >= 100 ||
      outputMoisture < 0 ||
      outputMoisture >= 100 ||
      inputMoisture <= outputMoisture
    ) {
      return {
        drySolids: sourceData.drySolids || "-",
        finalOutput:
          sourceData.finalOutput || sourceData.outputCapacity || "-",
        waterEvaporation:
          sourceData.waterEvaporation ||
          sourceData.evaporation ||
          sourceData.evaporationCapacity ||
          "-"
      };
    }

    const drySolids = feedRate * (1 - inputMoisture / 100);
    const finalOutput = drySolids / (1 - outputMoisture / 100);
    const waterEvaporation = feedRate - finalOutput;

    return {
      drySolids: Math.round(drySolids),
      finalOutput: Math.round(finalOutput),
      waterEvaporation: Math.round(waterEvaporation)
    };
  }

  function estimateDimensions() {
    const evaporation = toNumber(
      sourceData.waterEvaporation ||
        sourceData.evaporation ||
        sourceData.evaporationCapacity
    );

    if (!evaporation) {
      return {
        overallLength: sourceData.overallLength || "-",
        overallWidth: sourceData.overallWidth || "-"
      };
    }

    let evaporationLoad = 20;

    const app = String(sourceData.application || "").toLowerCase();
    const material = String(sourceData.material || "").toLowerCase();

    if (app.includes("sludge") || material.includes("sludge")) {
      evaporationLoad = 12;
    } else if (app.includes("food") || app.includes("vegetable")) {
      evaporationLoad = 18;
    } else if (app.includes("biomass") || material.includes("fibrous")) {
      evaporationLoad = 25;
    } else if (app.includes("chemical")) {
      evaporationLoad = 18;
    }

    const dryingArea = evaporation / evaporationLoad;

    const beltWidthM = toNumber(sourceData.beltWidthM || sourceData.beltWidth, 2);
    const numberOfPasses = toNumber(sourceData.numberOfPasses, 1);

    const effectiveLengthM = dryingArea / beltWidthM / numberOfPasses;

    const overallLengthM = effectiveLengthM * 1.15 + 3;
    const overallWidthM = beltWidthM + 3;

    return {
      overallLength:
        sourceData.overallLength ||
        `${Math.round(overallLengthM * 1000)}`,
      overallWidth:
        sourceData.overallWidth ||
        `${Math.round(overallWidthM * 1000)}`
    };
  }

  const massBalance = calculateMassBalance();
  const dimensions = estimateDimensions();

  /* =========================
     HEADER
  ========================= */

  function drawPageHeader() {
    drawOuterBorder();

    const y = 38;
    const h = 55;

    rect(left, y, tableWidth, h);

    // Logo
    if (imageExists(logoPath)) {
      doc.image(logoPath, left + 8, y + 10, {
        width: 38,
        height: 17,
        fit: [38, 17]
      });
    } else {
      bold(7).text("GEM", left + 10, y + 12, { width: 35 });
    }

    // Title
    bold(9).text(getOfferTitle(), left + 58, y + 12, {
      width: 235,
      align: "center"
    });

    // Quote / date / company block
    bold(7).text(`No. ${quoteNo}`, left + 300, y + 8, {
      width: 110
    });

    bold(7).text(`Dated: ${date}`, left + 405, y + 8, {
      width: 95,
      align: "right"
    });

    // bold(7).text("GEM DRYTECH SYSTEMS LLP", left + 300, y + 22, {
    //   width: 200
    // });

    // normal(6.7).text(
    //   "10/C, MIDDLETON ROW, 3RD FLOOR, CALCUTTA-700071, INDIA\nPHONE: (91-33) 2217-7328\nFAX: (91-33) 2217-7333\nE-MAIL: sales@gemdryers.com / sg@gemdryers.com",
    //   left + 300,
    //   y + 32,
    //   {
    //     width: 200,
    //     lineGap: 1
    //   }
    // );

    doc.y = y + h;
  }

function drawClientAndTermsBlock() {
  const y = 93;
  const clientH = 65;
  const termsH = 125; // increased height
  const rightColX = left + 300;
  const leftColW = 300;
  const rightColW = tableWidth - leftColW;

  // Client and company box
  rect(left, y, tableWidth, clientH);
  line(rightColX, y, rightColX, y + clientH);

  normal(7).text(
    `To,\n${safe(sourceData.client, "Client Name")}\n${safe(
      sourceData.companyAddress,
      "Company Address"
    )}\nEmail: ${safe(sourceData.email)}\nTel: ${safe(sourceData.phone)}`,
    left + 5,
    y + 5,
    {
      width: leftColW - 10,
      lineGap: 1.5
    }
  );

  bold(7).text("GEM DRYTECH SYSTEMS LLP", rightColX + 5, y + 5, {
    width: rightColW - 10
  });

  normal(6.8).text(
    "10/C, MIDDLETON ROW, 3RD FLOOR, CALCUTTA-700071, INDIA\nPHONE: (91-33) 2217-7328\nFAX: (91-33) 2217-7333\nE-MAIL: sales@gemdryers.com / sg@gemdryers.com",
    rightColX + 5,
    y + 18,
    {
      width: rightColW - 10,
      lineGap: 1.2
    }
  );

  const y2 = y + clientH;

  rect(left, y2, tableWidth, termsH);
  line(rightColX, y2, rightColX, y2 + termsH);

  // Left side
  const paymentH = 38;
  line(left, y2 + paymentH, rightColX, y2 + paymentH);

  bold(7).text("TERMS OF PAYMENT:", left + 5, y2 + 5, {
    width: leftColW - 10
  });

  normal(6.5).text(
    safe(
      sourceData.paymentTerms,
      "40% advance along with techno-commercial clear purchase order\n60% plus G.S.T. prevailing at the time of supply against pro-forma invoice before dispatch."
    ),
    left + 5,
    y2 + 16,
    {
      width: leftColW - 10,
      lineGap: 1
    }
  );

  bold(7).text("OUR BANKER:", left + 5, y2 + paymentH + 5, {
    width: leftColW - 10
  });

  normal(6.4).text(
    "STANDARD CHARTERED BANK\n21A, SHAKESPEARE SARANI\nKOLKATA - 700017\nACCOUNT NAME : GEM DRYTECH SYSTEMS LLP\nINR ACCOUNT NUMBER: 33705900241\nBRANCH CODE: 337\nIFSC CODE: SCBL0036014\nSWIFT CODE: SCBLINBBXXX\nAD CODE: 64700661000009",
    left + 5,
    y2 + paymentH + 16,
    {
      width: leftColW - 10,
      lineGap: 0.5
    }
  );

  // Right side row heights
  const enquiryH = 30;
  const validityH = 35;
  const despatchH = 35;
  const packingH = termsH - enquiryH - validityH - despatchH;

  const enquiryY = y2;
  const validityY = enquiryY + enquiryH;
  const despatchY = validityY + validityH;
  const packingY = despatchY + despatchH;

  line(rightColX, validityY, right, validityY);
  line(rightColX, despatchY, right, despatchY);
  line(rightColX, packingY, right, packingY);

  bold(7).text("YOUR ENQUIRY NO.", rightColX + 5, enquiryY + 5, {
    width: rightColW - 10
  });

  normal(6.5).text(
    `DATED: ${safe(sourceData.enquiryDate, sourceData.date || "-")}`,
    rightColX + 5,
    enquiryY + 16,
    {
      width: rightColW - 10
    }
  );

  bold(7).text("VALIDITY:", rightColX + 5, validityY + 5, {
    width: rightColW - 10
  });

  normal(6.4).text(
    safe(
      sourceData.validity,
      "Our offer is valid for 30 Days from date and subject to reconfirmation thereafter."
    ),
    rightColX + 5,
    validityY + 16,
    {
      width: rightColW - 10,
      lineGap: 0.7
    }
  );

  bold(7).text("DESPATCH:", rightColX + 5, despatchY + 5, {
    width: rightColW - 10
  });

  normal(6.3).text(
    safe(
      sourceData.despatch,
      "Within 14-18 weeks of receipt of your order confirmation and advance payment."
    ),
    rightColX + 5,
    despatchY + 16,
    {
      width: rightColW - 10,
      lineGap: 0.5
    }
  );

  bold(7).text("PACKING & MARKS:", rightColX + 5, packingY + 4, {
    width: rightColW - 10
  });

  normal(6.2).text(
    "Goods will be securely packed and suitably marked.",
    rightColX + 5,
    packingY + 15,
    {
      width: rightColW - 10
    }
  );

  // Extra spacing before description table
  doc.y = y2 + termsH + 5;
}

  /* =========================
     OFFER TABLE
  ========================= */

  function drawOfferTable(y, bottomY, showColumnHeader = true) {
    const headerH = showColumnHeader ? 21 : 0;

    rect(left, y, tableWidth, bottomY - y);

    line(qtyX, y, qtyX, bottomY);
    line(unitX, y, unitX, bottomY);
    line(amountX, y, amountX, bottomY);

    if (showColumnHeader) {
      line(left, y + headerH, right, y + headerH);

      bold(7).text("Description", left + 5, y + 7, {
        width: descW - 10,
        align: "center"
      });

      bold(7).text("Quantity", qtyX + 3, y + 7, {
        width: qtyW - 6,
        align: "center"
      });

      bold(6.8).text(`Unit Price\n(In ${currency})`, unitX + 3, y + 4, {
        width: unitW - 6,
        align: "center",
        lineGap: 0
      });

      bold(6.8).text(`Amount\n(In ${currency})`, amountX + 3, y + 4, {
        width: amountW - 6,
        align: "center",
        lineGap: 0
      });
    }

    return y + headerH;
  }

  function writePriceColumns(y) {
    const amount = getAmountValue();

    normal(7).text("1 No.", qtyX + 3, y + 12, {
      width: qtyW - 6,
      align: "center"
    });

    normal(7).text(formatCurrency(amount), unitX + 3, y + 12, {
      width: unitW - 6,
      align: "right"
    });

    normal(7).text(formatCurrency(amount), amountX + 3, y + 12, {
      width: amountW - 6,
      align: "right"
    });
  }

  function writeLine(text, x, y, width, options = {}) {
    const {
      size = 6.8,
      isBold = false,
      lineGap = 1.2,
      indent = 0,
      continued = false
    } = options;

    if (isBold) bold(size);
    else normal(size);

    doc.text(text, x + indent, y, {
      width: width - indent,
      lineGap,
      continued
    });

    return doc.y;
  }

  function writeSpecLines(startY) {
    let y = startY;
    const x = left + 8;
    const w = descW - 16;

    const specs = [
      ["Product", sourceData.product || sourceData.material],
      [
        "Input Capacity",
        sourceData.capacity
          ? `${formatNumber(sourceData.capacity)} kg/hr`
          : "-"
      ],
      [
        "Output Capacity",
        massBalance.finalOutput !== "-"
          ? `${formatNumber(massBalance.finalOutput)} kg/hr`
          : "-"
      ],
      [
        "Evaporation Capacity",
        massBalance.waterEvaporation !== "-"
          ? `${formatNumber(massBalance.waterEvaporation)} kg/hr`
          : "-"
      ],
      [
        "Initial Moisture",
        sourceData.inputMoisture ? `${sourceData.inputMoisture} %` : "-"
      ],
      [
        "Final Moisture",
        sourceData.outputMoisture ? `${sourceData.outputMoisture} %` : "-"
      ],
      [
        "Drying Time",
        sourceData.dryingTime ? `${sourceData.dryingTime} mins approx.` : "-"
      ],
      [
        "Temperature",
        sourceData.temperature ? `${sourceData.temperature} Deg C` : "-"
      ],
      [
        "Bulk Density",
        sourceData.bulkDensity ? `${sourceData.bulkDensity} kg/m3` : "-"
      ]
    ];

    specs.forEach(([label, value]) => {
      bold(6.7).text(`${label}:`, x, y, {
        width: 95,
        continued: true
      });

      normal(6.7).text(` ${safe(value)}`, {
        width: w - 95
      });

      y = doc.y + 1.2;
    });

    y += 4;

    bold(6.9).text(
      `Overall Length: Approximately ${safe(dimensions.overallLength)} mm`,
      x,
      y,
      {
        width: w
      }
    );

    y = doc.y + 1.5;

    bold(6.9).text(
      `Overall Width: Approximately ${safe(dimensions.overallWidth)} mm`,
      x,
      y,
      {
        width: w
      }
    );

    return doc.y + 8;
  }

  function writeSection(title, lines, startY) {
    let y = startY;
    const x = left + 8;
    const w = descW - 16;

    bold(6.9).text(`${title}:`, x, y, { width: w });
    y = doc.y + 1;

    normal(6.5).text(lines.join("\n"), x, y, {
      width: w,
      lineGap: 0.7
    });

    return doc.y + 5;
  }

  function isEnabled(value) {
  return value === true || value === "true" || value === "Yes" || value === "yes";
}

function getPageOneScopeSections() {
  const sections = [];

  if (isEnabled(sourceData.feedingEnabled)) {
    sections.push({
      title: "Feeding",
      lines: [
        `Feed conveyor ${safe(sourceData.feedConveyorWidth, "600")} mm wide, ${safe(sourceData.feedLength, "4500")} mm long`,
        `Material of construction ${safe(sourceData.feedMoc, sourceData.moc || "MS / SS304")}`,
        `Gear motor ${safe(sourceData.feedMotor, "7.5 HP")}`
      ]
    });
  }

  sections.push({
    title: "Dryer",
    lines: [
      `${safe(sourceData.dryer, "Dryer")} suitable for continuous drying application`,
      `Material of construction ${safe(sourceData.dryerMoc, sourceData.moc || "As per offer")}`,
      `Drive arrangement with suitable geared motor`,
      `Motor make ${safe(sourceData.motorMake, "ABB / Siemens or equivalent")}`
    ]
  });

  if (isEnabled(sourceData.exhaustSystemEnabled)) {
    sections.push({
      title: "Exhaust Systems",
      lines: [
        `${safe(sourceData.exhaustFanQty, "1 No.")} centrifugal blower for exhaust gases and moisture air`,
        `Blower ${safe(sourceData.exhaustFanHp, "100 HP")}`,
        `Motor make ${safe(sourceData.exhaustMotorMake, "ABB / Siemens")}`,
        `Blower construction ${safe(sourceData.blowerMoc, "MS")}`
      ]
    });
  }

  if (isEnabled(sourceData.dustSeparationEnabled)) {
    sections.push({
      title: "Dust Separation Systems",
      lines: [
        `${safe(sourceData.dustSeparatorQty, "2 Nos.")} cyclone separator will be provided`,
        `Material of construction ${safe(sourceData.cycloneMoc, "MS")}`,
        `Thickness ${safe(sourceData.cycloneThickness, "3 mm")}`,
        `Rotary valve ${safe(sourceData.rotaryValveHp, "2 HP")}`
      ]
    });
  }

  return sections;
}

 function isEnabled(value) {
  return value === true || value === "true" || value === "Yes" || value === "yes";
}

function getPageTwoSections() {
  const dryer = String(sourceData.dryer || "").toLowerCase();

  const sections = [];

  // Always show discharge section
  if (dryer.includes("rotary")) {
    sections.push({
      title: "Discharge",
      lines: [
        `Screw conveyor ${safe(sourceData.dischargeConveyorWidth, "600")} mm wide, ${safe(sourceData.dischargeLength, "4500")} mm long`,
        `Material of construction ${safe(sourceData.dischargeMoc, "MS")}`,
        `Gear motor ${safe(sourceData.dischargeMotor, "7.5 HP")}`
      ]
    });

    sections.push({
      title: "Rotary Cooler",
      lines: [
        `Rotary cooler diameter ${safe(sourceData.coolerDiameter, "1500")} mm x ${safe(sourceData.coolerLength, "10500")} mm long`,
        `Material of construction ${safe(sourceData.coolerMoc, "MS")}`,
        `Drive arrangement ${safe(sourceData.coolerDrive, "40 HP geared motor")}`,
        `Gear and motor make ${safe(sourceData.motorMake, "ABB / Siemens or equivalent")}`
      ]
    });

    sections.push({
      title: "Final Discharge",
      lines: [
        `Screw conveyor ${safe(sourceData.finalDischargeWidth, "600")} mm wide, ${safe(sourceData.finalDischargeLength, "4500")} mm long`,
        `Material of construction ${safe(sourceData.finalDischargeMoc, "MS")}`,
        `Gear motor ${safe(sourceData.finalDischargeMotor, "7.5 HP")}`
      ]
    });
  } else {
    sections.push({
      title: "Discharge",
      lines: [
        "Suitable discharge arrangement will be provided as per material flow.",
        `Material of construction ${safe(sourceData.dischargeMoc, sourceData.moc || "As applicable")}`
      ]
    });

    sections.push({
      title: "Air Circulation System",
      lines: [
        "Suitable hot air blower / circulation blower will be provided.",
        `Motor make ${safe(sourceData.motorMake, "ABB / Siemens or equivalent")}`
      ]
    });
  }

  // Optional Exhaust System
  if (isEnabled(sourceData.exhaustSystemEnabled)) {
    if (dryer.includes("rotary")) {
      sections.push({
        title: "Exhaust Systems",
        lines: [
          `${safe(sourceData.coolingFanQty || sourceData.exhaustFanQty, "1 No.")} ID fan / exhaust fan will be provided`,
          `Blower ${safe(sourceData.coolingFanHp || sourceData.exhaustFanHp, "40 HP")}`,
          `Motor make ${safe(sourceData.exhaustMotorMake || sourceData.motorMake, "ABB / Siemens")}`,
          `Blower construction ${safe(sourceData.blowerMoc, "MS")}`
        ]
      });
    } else {
      sections.push({
        title: "Exhaust Systems",
        lines: [
          `${safe(sourceData.exhaustFanQty, "1 No.")} centrifugal blower for exhaust gases and moisture air`,
          `Blower ${safe(sourceData.exhaustFanHp, "Suitable HP")}`,
          `Motor make ${safe(sourceData.exhaustMotorMake || sourceData.motorMake, "ABB / Siemens")}`,
          `Blower construction ${safe(sourceData.blowerMoc, "MS")}`
        ]
      });
    }
  }

  // Optional Dust Separation System
  if (isEnabled(sourceData.dustSeparationEnabled)) {
    if (dryer.includes("rotary")) {
      sections.push({
        title: "Dust Separation Systems",
        lines: [
          `${safe(sourceData.coolingCycloneQty || sourceData.dustSeparatorQty, "2 Nos.")} cyclone separator will be provided`,
          `Material of construction ${safe(sourceData.cycloneMoc, "MS")}`,
          `Thickness ${safe(sourceData.cycloneThickness, "3 mm")}`,
          `Rotary valve ${safe(sourceData.rotaryValveHp, "2 HP")}`
        ]
      });
    } else {
      sections.push({
        title: "Dust Separation Systems",
        lines: [
          `${safe(sourceData.dustSeparatorQty, "1 No.")} dust collector / cyclone separator will be provided`,
          `Material of construction ${safe(sourceData.cycloneMoc, "MS / SS as applicable")}`,
          `Thickness ${safe(sourceData.cycloneThickness, "As per design")}`,
          `Rotary valve ${safe(sourceData.rotaryValveHp, "As applicable")}`
        ]
      });
    }
  }

  return sections;
}

  function writeUtilities(startY) {
    let y = startY;
    const x = left + 8;
    const w = descW - 16;

    const lines = [
      `Heating Medium - ${safe(sourceData.heatingMedia, "Hot Air")}`,
      `Cooling Medium - ${safe(sourceData.coolingMedium, "Ambient Air")}`,
      `Fuel Consumption - ${safe(sourceData.fuelConsumption || sourceData.dieselConsumption || sourceData.steamConsumption, "-")}`,
      `Direct Fired Burner - ${safe(sourceData.burnerMake, "-")}`,
      `Direct Fired Heat Exchanger - ${safe(sourceData.heatExchanger, "-")}`,
      `Connected Power - ${safe(sourceData.connectedLoad, "-")} HP`,
      `Consumed Power - ${safe(sourceData.consumedLoad, "-")} HP`,
      `Power Supply - ${safe(sourceData.powerSupply, sourceData.frequency ? `415V, 3 phase, ${sourceData.frequency}` : "415V, 3 phase, 50 Hz")}`,
      "All motors shall be standard TEFC type and suitable for supply of 415 volts, 50 Hz, 3 phase.",
      "Motors shall be ABB or Siemens make."
    ];

    bold(6.9).text("Utilities:", x, y, { width: w });
    y = doc.y + 1;

    normal(6.4).text(lines.join("\n"), x, y, {
      width: w,
      lineGap: 0.6
    });

    return doc.y + 6;
  }

  function writeElectricalConsole(startY) {
    let y = startY;
    const x = left + 8;
    const w = descW - 16;

    bold(6.9).text("Electrical Central Console", x, y, { width: w });
    y = doc.y + 1;

    normal(6.3).text(
      "It comprises of a sturdy carbon steel console for single point control of all equipment. Star Delta or DOL starters for motors, on-off push buttons, miniature circuit breaker and main switch are provided. Temperature indicators for each stage are mounted on this console. Variable Frequency Drives for the conveyors are provided. All MCBs and VFDs are of Siemens / ABB / Schneider or equivalent make.",
      x,
      y,
      {
        width: w,
        lineGap: 0.8
      }
    );

    return doc.y + 8;
  }

  function writeNotes(startY) {
    const x = left + 8;
    const w = descW - 16;

    bold(6.7).text("Note:", x, startY, { width: w });

    normal(6.3).text(
      safe(
        sourceData.note,
        "1. Cable is client scope\n2. Height base platform is client scope"
      ),
      x,
      doc.y + 1,
      {
        width: w,
        lineGap: 0.7
      }
    );

    return doc.y + 6;
  }

  function drawBottomTotals(startY) {
    const rowH = 15;
    const rows = [
      [
        `TOTAL FOB ${safe(sourceData.fobLocation, "KOLKATA, INDIA")} IN ${currency}`,
        sourceData.fobTotal || getAmountValue()
      ],
      [`FREIGHT IN ${currency}`, sourceData.freight || 0],
      [`INSURANCE IN ${currency}`, sourceData.insurance || 0],
      [
        `SUPERVISION OF INSTALLATION AND COMMISSIONING CHARGES IN ${currency}`,
        sourceData.installationCharges || 0
      ],
      [
        `CIF ${safe(sourceData.cifLocation, sourceData.country || "DESTINATION")} IN ${currency}`,
        sourceData.cifTotal ||
          toNumber(getAmountValue()) +
            toNumber(sourceData.freight) +
            toNumber(sourceData.insurance) +
            toNumber(sourceData.installationCharges)
      ]
    ];

    let y = startY;

    rows.forEach(([label, amount]) => {
      rect(left, y, tableWidth, rowH);
      line(amountX, y, amountX, y + rowH);

      bold(6.5).text(label, left + 5, y + 4, {
        width: amountX - left - 10,
        align: "right"
      });

      normal(6.5).text(formatCurrency(amount), amountX + 3, y + 4, {
        width: amountW - 6,
        align: "right"
      });

      y += rowH;
    });
  }

  /* =========================
     PAGE 1
  ========================= */

  drawPageHeader();
  drawClientAndTermsBlock();

  const page1TableY = doc.y + 3;
  const page1BottomY = pageHeight - 45;
  const contentY = drawOfferTable(page1TableY, page1BottomY, true);

  let y = contentY + 8;

  bold(7).text(`1     ${safe(sourceData.dryer, "DRYER").toUpperCase()}`, left + 8, y, {
    width: descW - 16
  });

  y = doc.y + 5;

  const machineImagePath = sourceData.machineImagePath || defaultDryerImagePath;

  if (imageExists(machineImagePath)) {
    doc.image(machineImagePath, left + 18, y, {
      width: 240,
      height: 115,
      fit: [240, 115]
    });

    y += 122;
  }

  y = writeSpecLines(y);

  bold(6.9).text("Scope of supply:", left + 8, y, {
    width: descW - 16
  });

  y = doc.y + 3;

  const pageOneSections = getPageOneScopeSections();

  pageOneSections.forEach((section) => {
    if (y < page1BottomY - 48) {
      y = writeSection(section.title, section.lines, y);
    }
  });

  writePriceColumns(contentY);

  /* =========================
     PAGE 2
  ========================= */

  doc.addPage();

  drawPageHeader();

  const page2TableY = 93;
  const page2BottomY = pageHeight - 120;
  const page2ContentY = drawOfferTable(page2TableY, page2BottomY, true);

  let y2 = page2ContentY + 8;

  const pageTwoSections = getPageTwoSections();

  pageTwoSections.forEach((section) => {
    if (y2 < page2BottomY - 55) {
      y2 = writeSection(section.title, section.lines, y2);
    }
  });

  if (y2 < page2BottomY - 95) {
    y2 = writeUtilities(y2);
  }

  if (y2 < page2BottomY - 95) {
    y2 = writeElectricalConsole(y2);
  }

  if (y2 < page2BottomY - 40) {
    y2 = writeNotes(y2);
  }

  drawBottomTotals(page2BottomY);

  /* =========================
     SAVE QUOTE
  ========================= */

  if (!data.quoteNo) {
    saveQuote({
      ...sourceData,
      quoteNo,
      date,
      drySolids: massBalance.drySolids,
      finalOutput: massBalance.finalOutput,
      waterEvaporation: massBalance.waterEvaporation,
      overallLength: dimensions.overallLength,
      overallWidth: dimensions.overallWidth,
      currency
    });
  }

  doc.end();
}

module.exports = { generatePDF };