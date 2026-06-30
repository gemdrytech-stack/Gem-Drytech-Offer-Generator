// utils/constants.js

const MATERIALS = [
  "Sludge",
  "Paste",
  "Filter Cake",
  "Wet Cake",
  "Fibrous",
  "Powder",
  "Granules",
  "Pieces",
  "Flakes",
  "Slurry",
  "Liquid"
];

const APPLICATIONS = [
  "Heat-Sensitive Specialty",
  "Biotech",
  "Pharma",
  "Dairy",
  "Food",
  "Bakery",
  "Chemical",
  "Minerals",
  "Fertilizer",
  "Grain (Paddy/Wheat/Maize)",
  "Biomass / Wood",
  "Sludge / Wastewater",
  "Vegetables / Fruits",
  "Tea / Herbs",
  "Pet Food / Snacks",
  "Ceramics / Coating"
];

const STEAMS = [
  "Available",
  "Not Available"
];

const FUELTYPE = [
  "Steam",
  "Electric",
  "Gas",
  "Diesel",
  "Thermic Fluid",
  "Flue Gas",
  "Wood Fired",
  "Biomass",
  "Coal",
  "Other"
];

const COUNTRY = [
  "India",
  "Indonesia",
  "Philippines",
  "Vietnam",
  "Thailand",
  "Malaysia",
  "USA",
  "Saudi Arabia",
  "UAE",
  "Europe",
  "Other"
];

const FREQUENCY = [
  "50 Hz",
  "60 Hz"
];

const DRYER_TYPES = [
  "Band Dryer / Roaster / Cooler",
  "Mesh Belt Dryer",
  "Tunnel Oven",
  "Flash Dryer",
  "Freeze Dryer",
  "Paddle Dryer",
  "Double Drum Dryer",
  "Single Drum Flaker / Dryer",
  "Rotary Dryer",
  "Vibrating Fluid Bed Dryer",
  "Tray Dryer",
  "DDGS Dryer",
  "Grain Dryer",
  "Combination Dryer"
];

const BASE_PRICE = {
  "Band Dryer / Roaster / Cooler": 450000,
  "Mesh Belt Dryer": 420000,
  "Tunnel Oven": 300000,
  "Flash Dryer": 650000,
  "Freeze Dryer": 1200000,
  "Paddle Dryer": 550000,
  "Double Drum Dryer": 500000,
  "Single Drum Flaker / Dryer": 480000,
  "Rotary Dryer": 400000,
  "Vibrating Fluid Bed Dryer": 420000,
  "Tray Dryer": 180000,
  "DDGS Dryer": 900000,
  "Grain Dryer": 350000,
  "Combination Dryer": 500000
};

const DRYER_RULES = {
  defaultDryer: "Band Dryer / Roaster / Cooler",

  priority: [
    "Band Dryer / Roaster / Cooler",
    "Mesh Belt Dryer",
    "Combination Dryer",
    "Paddle Dryer",
    "Rotary Dryer",
    "Vibrating Fluid Bed Dryer",
    "Flash Dryer",
    "Tray Dryer",
    "Freeze Dryer",
    "Double Drum Dryer",
    "Single Drum Flaker / Dryer",
    "Tunnel Oven",
    "DDGS Dryer",
    "Grain Dryer"
  ],

  applications: {
    "Food": {
      scores: {
        "Band Dryer / Roaster / Cooler": 9,
        "Mesh Belt Dryer": 8,
        "Tray Dryer": 6,
        "Freeze Dryer": 4
      },
      reason: "Food products require hygienic and uniform drying."
    },

    "Vegetables / Fruits": {
      scores: {
        "Band Dryer / Roaster / Cooler": 9,
        "Mesh Belt Dryer": 8,
        "Freeze Dryer": 7,
        "Tray Dryer": 5
      },
      reason: "Vegetables and fruits require controlled drying with product quality retention."
    },

    "Chemical": {
      scores: {
        "Paddle Dryer": 8,
        "Rotary Dryer": 7,
        "Flash Dryer": 7,
        "Vibrating Fluid Bed Dryer": 6,
        "Double Drum Dryer": 5,
        "Single Drum Flaker / Dryer": 5,
        "Band Dryer / Roaster / Cooler": 4
      },
      reason: "Chemical drying depends on whether the material is cake, powder, paste, slurry, molten or crystalline."
    },

    "Sludge / Wastewater": {
      scores: {
        "Paddle Dryer": 10,
        "Rotary Dryer": 6,
        "Band Dryer / Roaster / Cooler": 6,
        "Combination Dryer": 7,
        "Double Drum Dryer": 4,
        "Vibrating Fluid Bed Dryer": -6
      },
      reason: "Sludge and wastewater solids require sticky, high-moisture material handling."
    },

    "Biomass / Wood": {
      scores: {
        "Rotary Dryer": 9,
        "Band Dryer / Roaster / Cooler": 8,
        "Flash Dryer": 7,
        "Combination Dryer": 7
      },
      reason: "Biomass and wood need high-throughput moisture removal."
    },

    "Minerals": {
      scores: {
        "Rotary Dryer": 10,
        "Vibrating Fluid Bed Dryer": 6,
        "Paddle Dryer": 4
      },
      reason: "Minerals are rugged high-capacity drying applications."
    },

    "Fertilizer": {
      scores: {
        "Rotary Dryer": 9,
        "Vibrating Fluid Bed Dryer": 7,
        "DDGS Dryer": 5,
        "Band Dryer / Roaster / Cooler": 4
      },
      reason: "Fertilizer drying generally requires continuous bulk drying."
    },

    "Grain (Paddy/Wheat/Maize)": {
      scores: {
        "Grain Dryer": 10,
        "Vibrating Fluid Bed Dryer": 7,
        "Band Dryer / Roaster / Cooler": 4
      },
      reason: "Grains require uniform air flow and controlled residence time."
    },

    "Bakery": {
      scores: {
        "Tunnel Oven": 10,
        "Band Dryer / Roaster / Cooler": 7,
        "Tray Dryer": 5
      },
      reason: "Bakery products such as biscuits, snacks and bread are suitable for tunnel oven systems."
    },

    "Dairy": {
      scores: {
        "Double Drum Dryer": 8,
        "Freeze Dryer": 6,
        "Tray Dryer": 3
      },
      reason: "Dairy applications may require drum drying or freeze drying depending on product form."
    },

    "Pharma": {
      scores: {
        "Freeze Dryer": 9,
        "Tray Dryer": 6,
        "Vibrating Fluid Bed Dryer": 5,
        "Flash Dryer": 4
      },
      reason: "Pharma materials require controlled hygienic drying."
    },

    "Heat-Sensitive Specialty": {
      scores: {
        "Freeze Dryer": 10,
        "Tray Dryer": 5,
        "Band Dryer / Roaster / Cooler": 4,
        "Rotary Dryer": -5
      },
      reason: "Heat-sensitive materials require low-temperature controlled drying."
    }
  }
};

module.exports = {
  MATERIALS,
  APPLICATIONS,
  STEAMS,
  FUELTYPE,
  COUNTRY,
  FREQUENCY,
  BASE_PRICE,
  DRYER_RULES,
  DRYER_TYPES,
};