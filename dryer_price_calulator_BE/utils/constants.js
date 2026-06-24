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

const BASE_PRICE = {
  "Continuous Band Dryer": 450000,
  "Combination Dryer": 500000,
  "Paddle Dryer": 550000,
  "Rotary Dryer": 400000,
  "Fluid Bed Dryer": 420000,
  "Tray Dryer": 180000,
  "Vacuum Dryer": 600000,
  "Spray Dryer": 750000,
  "Freeze Dryer (Lyophilizer)": 1200000,
  "Spin Flash Dryer": 650000,
  "Drum Dryer": 500000
};

const DRYER_RULES = {
  defaultDryer: "Continuous Band Dryer",

  priority: [
    "Continuous Band Dryer",
    "Combination Dryer",
    "Paddle Dryer",
    "Rotary Dryer",
    "Fluid Bed Dryer",
    "Tray Dryer",
    "Vacuum Dryer",
    "Spray Dryer",
    "Freeze Dryer (Lyophilizer)",
    "Spin Flash Dryer",
    "Drum Dryer"
  ],

  applications: {
    "Heat-Sensitive Specialty": {
      scores: {
        "Freeze Dryer (Lyophilizer)": 10,
        "Vacuum Dryer": 8,
        "Continuous Band Dryer": 5,
        "Tray Dryer": 4,
        "Rotary Dryer": -5
      },
      reason: "Heat-sensitive material needs low-temperature or vacuum-based drying."
    },

    Biotech: {
      scores: {
        "Freeze Dryer (Lyophilizer)": 10,
        "Vacuum Dryer": 8,
        "Tray Dryer": 3
      },
      reason: "Biotech materials generally require controlled low-temperature drying."
    },

    Pharma: {
      scores: {
        "Vacuum Dryer": 10,
        "Tray Dryer": 6,
        "Fluid Bed Dryer": 5,
        "Paddle Dryer": 4
      },
      reason: "Pharma materials usually need controlled hygienic drying."
    },

    Dairy: {
      scores: {
        "Spray Dryer": 10,
        "Drum Dryer": 6,
        "Fluid Bed Dryer": 4,
        "Combination Dryer": -15
      },
      reason: "Dairy liquid/slurry products are commonly dried through spray or drum drying."
    },

    Food: {
      scores: {
        "Continuous Band Dryer": 9,
        "Tray Dryer": 6,
        "Fluid Bed Dryer": 5,
        "Freeze Dryer (Lyophilizer)": 4
      },
      reason: "Food products generally require hygienic and uniform drying."
    },

    Bakery: {
      scores: {
        "Continuous Band Dryer": 8,
        "Tray Dryer": 7,
        "Fluid Bed Dryer": 4
      },
      reason: "Bakery products usually need gentle hot-air drying."
    },

    Chemical: {
      scores: {
        "Paddle Dryer": 8,
        "Rotary Dryer": 7,
        "Spin Flash Dryer": 6,
        "Fluid Bed Dryer": 5,
        "Continuous Band Dryer": 4,
        "Combination Dryer": 4
      },
      reason: "Chemical drying depends on cake, powder, paste, or slurry nature."
    },

    Minerals: {
      scores: {
        "Rotary Dryer": 10,
        "Fluid Bed Dryer": 6,
        "Paddle Dryer": 4
      },
      reason: "Minerals are usually rugged, high-capacity drying applications."
    },

    Fertilizer: {
      scores: {
        "Rotary Dryer": 9,
        "Fluid Bed Dryer": 6,
        "Continuous Band Dryer": 5
      },
      reason: "Fertilizer drying generally needs continuous bulk drying."
    },

    "Grain (Paddy/Wheat/Maize)": {
      scores: {
        "Fluid Bed Dryer": 9,
        "Continuous Band Dryer": 5,
        "Tray Dryer": 3
      },
      reason: "Grains require uniform air distribution and continuous drying."
    },

    "Biomass / Wood": {
      scores: {
        "Rotary Dryer": 9,
        "Continuous Band Dryer": 8,
        "Combination Dryer": 7,
        "Fluid Bed Dryer": 4
      },
      reason: "Biomass and wood generally need high-throughput moisture removal."
    },

    "Sludge / Wastewater": {
      scores: {
        "Paddle Dryer": 10,
        "Continuous Band Dryer": 8,
        "Combination Dryer": 8,
        "Rotary Dryer": 3,
        "Fluid Bed Dryer": -6,
        "Spray Dryer": -10
      },
      reason: "Sludge requires handling of sticky, high-moisture, non-free-flowing material."
    },

    "Vegetables / Fruits": {
      scores: {
        "Continuous Band Dryer": 9,
        "Tray Dryer": 6,
        "Freeze Dryer (Lyophilizer)": 6,
        "Fluid Bed Dryer": 3
      },
      reason: "Vegetables and fruits need controlled drying with product quality retention."
    },

    "Tea / Herbs": {
      scores: {
        "Tray Dryer": 8,
        "Continuous Band Dryer": 8,
        "Fluid Bed Dryer": 4,
        "Rotary Dryer": -4
      },
      reason: "Tea and herbs need gentle drying to preserve aroma and quality."
    },

    "Pet Food / Snacks": {
      scores: {
        "Fluid Bed Dryer": 8,
        "Continuous Band Dryer": 7,
        "Tray Dryer": 4
      },
      reason: "Pet food and snacks usually require uniform drying and cooling."
    },

    "Ceramics / Coating": {
      scores: {
        "Spray Dryer": 9,
        "Fluid Bed Dryer": 5,
        "Tray Dryer": 3,
        "Combination Dryer": -15
      },
      reason: "Ceramic slurry and coating applications often require spray drying."
    }
  },

  materials: {
    Sludge: {
      "Paddle Dryer": 10,
      "Continuous Band Dryer": 8,
      "Combination Dryer": 8,
      "Rotary Dryer": 3,
      "Fluid Bed Dryer": -6,
      "Spray Dryer": -10
    },

    Paste: {
      "Paddle Dryer": 9,
      "Combination Dryer": 8,
      "Continuous Band Dryer": 5,
      "Spin Flash Dryer": 4,
      "Fluid Bed Dryer": -5,
      "Spray Dryer": -8
    },

    "Filter Cake": {
      "Paddle Dryer": 9,
      "Combination Dryer": 8,
      "Continuous Band Dryer": 7,
      "Rotary Dryer": 4,
      "Fluid Bed Dryer": -4
    },

    "Wet Cake": {
      "Paddle Dryer": 9,
      "Combination Dryer": 8,
      "Continuous Band Dryer": 7,
      "Rotary Dryer": 4
    },

    Fibrous: {
      "Combination Dryer": 9,
      "Continuous Band Dryer": 8,
      "Rotary Dryer": 7,
      "Fluid Bed Dryer": 3
    },

    Powder: {
      "Fluid Bed Dryer": 8,
      "Spin Flash Dryer": 7,
      "Spray Dryer": 5,
      "Rotary Dryer": 4,
      "Combination Dryer": -3
    },

    Granules: {
      "Fluid Bed Dryer": 9,
      "Rotary Dryer": 6,
      "Continuous Band Dryer": 5,
      "Combination Dryer": 3
    },

    Pieces: {
      "Continuous Band Dryer": 9,
      "Tray Dryer": 5,
      "Fluid Bed Dryer": 4,
      "Combination Dryer": 4
    },

    Flakes: {
      "Continuous Band Dryer": 8,
      "Tray Dryer": 5,
      "Fluid Bed Dryer": 4,
      "Combination Dryer": 4
    },

    Slurry: {
      "Spray Dryer": 9,
      "Drum Dryer": 8,
      "Paddle Dryer": 4,
      "Combination Dryer": -15,
      "Tray Dryer": -4
    },

    Liquid: {
      "Spray Dryer": 10,
      "Drum Dryer": 8,
      "Freeze Dryer (Lyophilizer)": 5,
      "Combination Dryer": -15,
      "Rotary Dryer": -8,
      "Fluid Bed Dryer": -8
    }
  },

  capacityRules: [
    {
      maxEvap: 50,
      scores: {
        "Tray Dryer": 8,
        "Vacuum Dryer": 5,
        "Continuous Band Dryer": 2
      },
      reason: "Low evaporation load can be handled by small or batch drying systems."
    },
    {
      minEvap: 50,
      maxEvap: 300,
      scores: {
        "Continuous Band Dryer": 6,
        "Paddle Dryer": 6,
        "Combination Dryer": 5,
        "Tray Dryer": 5,
        "Fluid Bed Dryer": 4
      },
      reason: "Medium-low evaporation load allows compact continuous or batch drying."
    },
    {
      minEvap: 300,
      maxEvap: 1000,
      scores: {
        "Continuous Band Dryer": 8,
        "Paddle Dryer": 7,
        "Combination Dryer": 7,
        "Rotary Dryer": 7,
        "Fluid Bed Dryer": 6
      },
      reason: "Medium evaporation load is suitable for continuous drying systems."
    },
    {
      minEvap: 1000,
      maxEvap: 3000,
      scores: {
        "Continuous Band Dryer": 9,
        "Rotary Dryer": 9,
        "Combination Dryer": 8,
        "Paddle Dryer": 6
      },
      reason: "High evaporation load needs continuous high-capacity drying equipment."
    },
    {
      minEvap: 3000,
      scores: {
        "Rotary Dryer": 10,
        "Continuous Band Dryer": 9,
        "Combination Dryer": 8,
        "Paddle Dryer": 6
      },
      reason: "Very high evaporation load may need large or multiple drying systems."
    }
  ],

  temperatureRules: [
    {
      maxTemp: 70,
      scores: {
        "Freeze Dryer (Lyophilizer)": 5,
        "Vacuum Dryer": 5,
        "Continuous Band Dryer": 4,
        "Tray Dryer": 3,
        "Rotary Dryer": -4
      },
      reason: "Low-temperature drying indicates heat-sensitive product."
    },
    {
      minTemp: 70,
      maxTemp: 150,
      scores: {
        "Continuous Band Dryer": 5,
        "Combination Dryer": 4,
        "Fluid Bed Dryer": 4,
        "Tray Dryer": 3,
        "Paddle Dryer": 3
      },
      reason: "Medium-temperature drying is suitable for hot-air drying systems."
    },
    {
      minTemp: 150,
      scores: {
        "Rotary Dryer": 5,
        "Paddle Dryer": 4,
        "Combination Dryer": 4,
        "Fluid Bed Dryer": 3,
        "Tray Dryer": -2
      },
      reason: "High-temperature duty is better suited for rugged thermal dryers."
    }
  ],

  heatingMediaRules: {
    steam: {
      "Continuous Band Dryer": 4,
      "Paddle Dryer": 4,
      "Combination Dryer": 4,
      "Tray Dryer": 3,
      "Fluid Bed Dryer": 3
    },

    electric: {
      "Tray Dryer": 5,
      "Vacuum Dryer": 4,
      "Freeze Dryer (Lyophilizer)": 3,
      "Continuous Band Dryer": 2
    },

    gas: {
      "Rotary Dryer": 5,
      "Continuous Band Dryer": 4,
      "Combination Dryer": 4,
      "Fluid Bed Dryer": 3
    },

    diesel: {
      "Rotary Dryer": 4,
      "Continuous Band Dryer": 4,
      "Combination Dryer": 4
    },

    thermic: {
      "Paddle Dryer": 5,
      "Rotary Dryer": 4,
      "Combination Dryer": 4,
      "Continuous Band Dryer": 3
    },

    "flue gas": {
      "Rotary Dryer": 6,
      "Continuous Band Dryer": 4,
      "Combination Dryer": 4
    },

    wood: {
      "Rotary Dryer": 5,
      "Continuous Band Dryer": 4,
      "Combination Dryer": 4
    },

    biomass: {
      "Rotary Dryer": 5,
      "Continuous Band Dryer": 4,
      "Combination Dryer": 4
    },

    coal: {
      "Rotary Dryer": 5,
      "Continuous Band Dryer": 3,
      "Combination Dryer": 3
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
  DRYER_RULES
};