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
        "Band Dryer / Roaster / Cooler": 10,
        "Mesh Belt Dryer": 8,
        "Tray Dryer": 6,
        "Freeze Dryer": 5,
        "Vibrating Fluid Bed Dryer": 4
      },
      reason: "Food products generally require hygienic, controlled and uniform drying."
    },

    "Vegetables / Fruits": {
      scores: {
        "Band Dryer / Roaster / Cooler": 9,
        "Mesh Belt Dryer": 8,
        "Freeze Dryer": 8,
        "Tray Dryer": 5
      },
      reason: "Vegetables and fruits require controlled drying with product quality, colour and aroma retention."
    },

    "Tea / Herbs": {
      scores: {
        "Tray Dryer": 9,
        "Band Dryer / Roaster / Cooler": 8,
        "Mesh Belt Dryer": 6,
        "Freeze Dryer": 5,
        "Rotary Dryer": -5
      },
      reason: "Tea and herbs require gentle drying to preserve aroma, colour and active compounds."
    },

    "Bakery": {
      scores: {
        "Tunnel Oven": 10,
        "Band Dryer / Roaster / Cooler": 7,
        "Tray Dryer": 5
      },
      reason: "Bakery products such as biscuits, snacks and bread are suitable for tunnel oven or continuous band systems."
    },

    "Pharma": {
      scores: {
        "Freeze Dryer": 10,
        "Tray Dryer": 7,
        "Vibrating Fluid Bed Dryer": 6,
        "Flash Dryer": 4,
        "Rotary Dryer": -5
      },
      reason: "Pharma materials require hygienic, controlled and low-contamination drying."
    },

    "Biotech": {
      scores: {
        "Freeze Dryer": 10,
        "Tray Dryer": 5,
        "Double Drum Dryer": 3,
        "Rotary Dryer": -8
      },
      reason: "Biotech products generally require low-temperature and high-preservation drying."
    },

    "Heat-Sensitive Specialty": {
      scores: {
        "Freeze Dryer": 10,
        "Tray Dryer": 6,
        "Band Dryer / Roaster / Cooler": 5,
        "Double Drum Dryer": 4,
        "Rotary Dryer": -8
      },
      reason: "Heat-sensitive products require gentle and controlled drying."
    },

    "Chemical": {
      scores: {
        "Paddle Dryer": 9,
        "Rotary Dryer": 8,
        "Flash Dryer": 8,
        "Vibrating Fluid Bed Dryer": 7,
        "Double Drum Dryer": 6,
        "Single Drum Flaker / Dryer": 6,
        "Tray Dryer": 4,
        "Band Dryer / Roaster / Cooler": 4
      },
      reason: "Chemical drying depends on whether the material is powder, granule, paste, wet cake, slurry, molten or crystalline solid."
    },

    "Minerals": {
      scores: {
        "Rotary Dryer": 10,
        "Vibrating Fluid Bed Dryer": 6,
        "Flash Dryer": 5,
        "Paddle Dryer": 3,
        "Tray Dryer": -4
      },
      reason: "Minerals usually require rugged, high-throughput drying."
    },

    "Fertilizer": {
      scores: {
        "Rotary Dryer": 10,
        "Vibrating Fluid Bed Dryer": 7,
        "DDGS Dryer": 5,
        "Band Dryer / Roaster / Cooler": 4,
        "Tray Dryer": -4
      },
      reason: "Fertilizer drying generally requires continuous bulk drying with strong material handling."
    },

    "Grain (Paddy/Wheat/Maize)": {
      scores: {
        "Grain Dryer": 10,
        "Vibrating Fluid Bed Dryer": 7,
        "Band Dryer / Roaster / Cooler": 4,
        "Tray Dryer": 3
      },
      reason: "Grain drying requires uniform air movement and controlled residence time."
    },

    "Biomass / Wood": {
      scores: {
        "Rotary Dryer": 9,
        "Flash Dryer": 8,
        "Band Dryer / Roaster / Cooler": 8,
        "Combination Dryer": 7,
        "Mesh Belt Dryer": 5
      },
      reason: "Biomass and wood require high-moisture removal and robust continuous drying."
    },

    "Sludge / Wastewater": {
      scores: {
        "Paddle Dryer": 10,
        "Combination Dryer": 8,
        "Rotary Dryer": 6,
        "Band Dryer / Roaster / Cooler": 5,
        "Double Drum Dryer": 4,
        "Vibrating Fluid Bed Dryer": -8,
        "Freeze Dryer": -10
      },
      reason: "Sludge and wastewater solids require sticky, high-moisture and non-free-flowing material handling."
    },

    "Dairy": {
      scores: {
        "Double Drum Dryer": 9,
        "Freeze Dryer": 7,
        "Tray Dryer": 3,
        "Single Drum Flaker / Dryer": 3,
        "Combination Dryer": -10
      },
      reason: "Dairy applications may require drum drying or freeze drying depending on product form."
    },

    "Pet Food / Snacks": {
      scores: {
        "Mesh Belt Dryer": 9,
        "Band Dryer / Roaster / Cooler": 8,
        "Vibrating Fluid Bed Dryer": 6,
        "Tunnel Oven": 5,
        "Tray Dryer": 4
      },
      reason: "Pet food and snacks require uniform hot-air drying and controlled product movement."
    },

    "Ceramics / Coating": {
      scores: {
        "Double Drum Dryer": 7,
        "Tray Dryer": 5,
        "Vibrating Fluid Bed Dryer": 4,
        "Combination Dryer": -10
      },
      reason: "Ceramic or coating materials are commonly slurry or paste-based and need suitable surface or controlled drying."
    },

    "Distillery / DDGS": {
      scores: {
        "DDGS Dryer": 10,
        "Rotary Dryer": 8,
        "Paddle Dryer": 6,
        "Combination Dryer": 5
      },
      reason: "Distillery by-products such as WDG/BSG are suitable for DDGS or rotary drying systems."
    }
  },

  materials: {
    "Sludge": {
      "Paddle Dryer": 10,
      "Combination Dryer": 8,
      "Rotary Dryer": 6,
      "Band Dryer / Roaster / Cooler": 5,
      "Double Drum Dryer": 4,
      "Vibrating Fluid Bed Dryer": -8,
      "Freeze Dryer": -10
    },

    "Paste": {
      "Paddle Dryer": 10,
      "Double Drum Dryer": 8,
      "Combination Dryer": 7,
      "Band Dryer / Roaster / Cooler": 4,
      "Rotary Dryer": 3,
      "Vibrating Fluid Bed Dryer": -7
    },

    "Filter Cake": {
      "Paddle Dryer": 9,
      "Flash Dryer": 8,
      "Combination Dryer": 7,
      "Rotary Dryer": 6,
      "Band Dryer / Roaster / Cooler": 5,
      "Vibrating Fluid Bed Dryer": -5
    },

    "Wet Cake": {
      "Paddle Dryer": 9,
      "Flash Dryer": 8,
      "Combination Dryer": 7,
      "Rotary Dryer": 6,
      "Band Dryer / Roaster / Cooler": 5,
      "Vibrating Fluid Bed Dryer": -5
    },

    "Wet Powder": {
      "Paddle Dryer": 8,
      "Flash Dryer": 8,
      "Vibrating Fluid Bed Dryer": 7,
      "Rotary Dryer": 5,
      "Tray Dryer": 4
    },

    "Powder": {
      "Flash Dryer": 9,
      "Vibrating Fluid Bed Dryer": 8,
      "Tray Dryer": 5,
      "Rotary Dryer": 4,
      "Paddle Dryer": 3
    },

    "Fine Powder": {
      "Flash Dryer": 10,
      "Vibrating Fluid Bed Dryer": 7,
      "Tray Dryer": 4,
      "Rotary Dryer": 3
    },

    "Granules": {
      "Vibrating Fluid Bed Dryer": 9,
      "Band Dryer / Roaster / Cooler": 8,
      "Mesh Belt Dryer": 8,
      "Rotary Dryer": 6,
      "Freeze Dryer": 4
    },

    "Seeds / Grains": {
      "Grain Dryer": 10,
      "Vibrating Fluid Bed Dryer": 8,
      "Band Dryer / Roaster / Cooler": 5,
      "Mesh Belt Dryer": 5
    },

    "Pieces": {
      "Band Dryer / Roaster / Cooler": 9,
      "Mesh Belt Dryer": 8,
      "Tray Dryer": 5,
      "Freeze Dryer": 5,
      "Vibrating Fluid Bed Dryer": 3
    },

    "Flakes": {
      "Band Dryer / Roaster / Cooler": 8,
      "Single Drum Flaker / Dryer": 8,
      "Tray Dryer": 5,
      "Mesh Belt Dryer": 4
    },

    "Fibrous": {
      "Flash Dryer": 9,
      "Rotary Dryer": 8,
      "Combination Dryer": 8,
      "Band Dryer / Roaster / Cooler": 7,
      "Mesh Belt Dryer": 5
    },

    "Sawdust": {
      "Flash Dryer": 10,
      "Rotary Dryer": 8,
      "Combination Dryer": 7,
      "Band Dryer / Roaster / Cooler": 5
    },

    "Biomass": {
      "Rotary Dryer": 9,
      "Flash Dryer": 8,
      "Combination Dryer": 8,
      "Band Dryer / Roaster / Cooler": 7
    },

    "Slurry": {
      "Double Drum Dryer": 10,
      "Paddle Dryer": 5,
      "Freeze Dryer": 4,
      "Combination Dryer": -15,
      "Rotary Dryer": -6,
      "Vibrating Fluid Bed Dryer": -8
    },

    "Liquid": {
      "Double Drum Dryer": 9,
      "Freeze Dryer": 7,
      "Single Drum Flaker / Dryer": 5,
      "Combination Dryer": -15,
      "Rotary Dryer": -8,
      "Vibrating Fluid Bed Dryer": -8,
      "Band Dryer / Roaster / Cooler": -6
    },

    "Molten": {
      "Single Drum Flaker / Dryer": 10,
      "Double Drum Dryer": 8,
      "Paddle Dryer": 4,
      "Rotary Dryer": -8,
      "Vibrating Fluid Bed Dryer": -8,
      "Combination Dryer": -6
    },

    "Crystalline Solids": {
      "Paddle Dryer": 8,
      "Rotary Dryer": 7,
      "Vibrating Fluid Bed Dryer": 7,
      "Tray Dryer": 4
    },

    "Ores / Minerals": {
      "Rotary Dryer": 10,
      "Vibrating Fluid Bed Dryer": 6,
      "Flash Dryer": 5,
      "Tray Dryer": -5
    },

    "Chips": {
      "Band Dryer / Roaster / Cooler": 10,
      "Mesh Belt Dryer": 8,
      "Tray Dryer": 5,
      "Tunnel Oven": 4
    },

    "Snacks": {
      "Tunnel Oven": 8,
      "Band Dryer / Roaster / Cooler": 8,
      "Mesh Belt Dryer": 7,
      "Tray Dryer": 4
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