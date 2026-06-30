import React, { useEffect, useMemo, useState } from "react";

export default function Recommendation({ data }) {
    const [currency, setCurrency] = useState("USD");
    const [selectedDryer, setSelectedDryer] = useState("");

    const USD_TO_INR = 94.15;

    useEffect(() => {
        if (data?.dryer) {
            setSelectedDryer(data.dryer);
        }
    }, [data]);

    const dryerInfo = {
        "Band Dryer / Roaster / Cooler": {
            desc: "Suitable for desiccated coconut, granules, chips, cereals, grains, animal feed, snacks, pigments, fruits and vegetables.",
            tags: ["Band Dryer", "Continuous", "Food/Agro"]
        },

        "Mesh Belt Dryer": {
            desc: "Suitable for desiccated coconut, nuts and seeds, carrageenan, pet foods, snacks, pharmaceuticals, chemicals and minerals.",
            tags: ["Mesh Belt", "Modular", "Hot Air"]
        },

        "Tunnel Oven": {
            desc: "Suitable for bakery applications such as biscuits, snacks and bread.",
            tags: ["Bakery", "Oven", "Continuous"]
        },

        "Flash Dryer": {
            desc: "Suitable for fine powder, sawdust, filter cakes, starch, fibres, bagasse, pigments, dyes and phosphates.",
            tags: ["Powder", "Flash Drying", "Short Retention"]
        },

        "Freeze Dryer": {
            desc: "Suitable for vegetables, fruits, poultry, marine products, spices, herbs, pre-cooked meals, pet foods, dairy products, tea, coffee and pharmaceutical products.",
            tags: ["Freeze Drying", "Heat Sensitive", "High Value"]
        },

        "Paddle Dryer": {
            desc: "Suitable for waste sludge, wet cakes, wet powders, agro waste, municipal solid waste, pastes, crystalline solids and magnesium carbonate.",
            tags: ["Sludge", "Paste", "Indirect Heating"]
        },

        "Double Drum Dryer": {
            desc: "Suitable for molten liquid or pasty feeds, slurry, solution, organic and inorganic materials, milk products, fruit concentrates and industrial wastewater slurry.",
            tags: ["Slurry", "Pasty Feed", "Drum Drying"]
        },

        "Single Drum Flaker / Dryer": {
            desc: "Suitable for molten chemicals such as caustic soda, chlorinated wax, fatty acids, phenolic resin, organic resins and sodium sulphide.",
            tags: ["Flaker", "Molten Feed", "Chemical"]
        },

        "Rotary Dryer": {
            desc: "Suitable for chemical fertilizers, clay, sands, limestone, waste sludge, food products, plastics, silica sands, ores, coal and filter cake.",
            tags: ["Rotary", "Bulk Solids", "Minerals"]
        },

        "Vibrating Fluid Bed Dryer": {
            desc: "Suitable for citric acid, ammonium sulphate, beans, pharmaceuticals, monosodium glutamate, sugar, foodstuff, borax, seed, chemical and grain.",
            tags: ["Fluid Bed", "Granules", "Uniform Drying"]
        },

        "Tray Dryer": {
            desc: "Suitable for chilies, spices, papads, potato chips, onion, fish, garlic, grapes, cashew nuts, confectionery, pharmaceuticals, chemicals, powders and granules.",
            tags: ["Tray Dryer", "Batch", "Compact"]
        },

        "DDGS Dryer": {
            desc: "Suitable for distillery and ethanol plants, wet distillers grains, brewer spent grains, agro by-products and feed ingredient drying.",
            tags: ["DDGS", "Distillery", "Animal Feed"]
        },

        "Grain Dryer": {
            desc: "Suitable for maize, chickpeas, paddy, coffee beans, soybean, wheat, rye, barley, rice and pulses.",
            tags: ["Grain", "Paddy", "Bulk Drying"]
        },

        "Combination Dryer": {
            desc: "Suitable for non-liquid input materials requiring combined drying action for better moisture removal and uniform drying.",
            tags: ["Non-Liquid", "Custom", "GEM Design"]
        }
    };

    const dryerOptions = useMemo(() => {
        const options = [];

        if (data?.dryer) {
            options.push(data.dryer);
        }

        if (Array.isArray(data?.alternativeDryers)) {
            data.alternativeDryers.forEach((item) => {
                if (item?.dryer && !options.includes(item.dryer)) {
                    options.push(item.dryer);
                }
            });
        }

        return options;
    }, [data]);

    if (!data) {
        return (
            <div className="recommend-card">
                <p className="section-title">RECOMMENDATION</p>
                <p>No offer generated yet.</p>
            </div>
        );
    }

    const minPrice = Number(data.minPrice || 0);
    const maxPrice = Number(data.maxPrice || 0);

    const formatUSD = (value) => {
        return `$${Number(value || 0).toLocaleString("en-US")}`;
    };

    const formatINR = (value) => {
        return `₹${Math.round(Number(value || 0) * USD_TO_INR).toLocaleString("en-IN")}`;
    };

    const priceDisplay =
        currency === "USD"
            ? `${formatUSD(minPrice)} - ${formatUSD(maxPrice)}`
            : `${formatINR(minPrice)} - ${formatINR(maxPrice)}`;

    const selectedInfo = dryerInfo[selectedDryer] || {
        desc: "Recommended based on application, material type, evaporation load, temperature, and heating media.",
        tags: ["Custom", "Calculated", "Suggested"]
    };

    const handleDownload = async () => {
        try {
            const pdfData = {
                ...data,
                dryer: selectedDryer
            };

            const res = await fetch("https://gem-drytech-offer-generator.onrender.com/api/offer/pdf", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(pdfData)
            });

            if (!res.ok) {
                alert("PDF generation failed");
                return;
            }

            const blob = await res.blob();
            const url = window.URL.createObjectURL(blob);

            const a = document.createElement("a");
            a.href = url;
            a.download = `${data.client || "quotation"}-offer.pdf`;
            a.click();

            window.URL.revokeObjectURL(url);
        } catch (err) {
            console.error("PDF download error:", err);
            alert("Unable to download PDF. Please check backend.");
        }
    };

    const handleSave = () => {
        const savedQuote = {
            ...data,
            dryer: selectedDryer,
            savedAt: new Date().toISOString()
        };

        const existing = JSON.parse(localStorage.getItem("quoteHistory") || "[]");
        existing.push(savedQuote);

        localStorage.setItem("quoteHistory", JSON.stringify(existing));

        alert("Offer saved to local history.");
    };

    return (
        <div className="recommend-card">
            <p className="section-title">RECOMMENDATION</p>

            <h2 className="title">{selectedDryer}</h2>

            <div className="price-pill">
                {priceDisplay}
            </div>

            <div className="currency">
                <span
                    className={`currency-item ${currency === "USD" ? "active" : ""}`}
                    onClick={() => setCurrency("USD")}
                >
                    USD
                </span>

                <span
                    className={`currency-item ${currency === "INR" ? "active" : ""}`}
                    onClick={() => setCurrency("INR")}
                >
                    INR
                </span>
            </div>

            <p className="desc">
                {selectedInfo.desc}
            </p>

            <div className="info-box">
                <strong>Mass Balance</strong>

                <div className="info-row">
                    <span>Dry Solids</span>
                    <b>{Number(data.drySolids || 0).toLocaleString("en-IN")} kg/hr</b>
                </div>

                <div className="info-row">
                    <span>Final Output</span>
                    <b>{Number(data.finalOutput || 0).toLocaleString("en-IN")} kg/hr</b>
                </div>

                <div className="info-row">
                    <span>Water Evaporation</span>
                    <b>{Number(data.waterEvaporation || data.evaporation || 0).toLocaleString("en-IN")} kg/hr</b>
                </div>
            </div>

            <hr />

            <label>Override — pick a different dryer</label>
            <select
                value={selectedDryer}
                onChange={(e) => setSelectedDryer(e.target.value)}
            >
                {dryerOptions.map((dryer) => (
                    <option key={dryer} value={dryer}>
                        {dryer}
                    </option>
                ))}
            </select>

            {Array.isArray(data.alternativeDryers) && data.alternativeDryers.length > 0 && (
                <div className="info-box">
                    <strong>Alternative Dryers</strong>

                    {data.alternativeDryers.map((item, index) => (
                        <div className="info-row" key={index}>
                            <span>{item.dryer}</span>
                            <b>Score: {item.score}</b>
                        </div>
                    ))}
                </div>
            )}

            {Array.isArray(data.selectionReasons) && data.selectionReasons.length > 0 && (
                <div className="info-box">
                    <strong>Basis of Selection</strong>

                    <ul className="reason-list">
                        {data.selectionReasons.map((reason, index) => (
                            <li key={index}>{reason}</li>
                        ))}
                    </ul>
                </div>
            )}

            <div className="info-box">
                <strong>Dryer Suitability</strong>

                <div className="tags">
                    {selectedInfo.tags.map((tag, index) => (
                        <span key={index}>{tag}</span>
                    ))}
                </div>
            </div>

            <button className="primary-btn" onClick={handleDownload}>
                Download PDF Offer
            </button>

            <button className="secondary-btn" onClick={handleSave}>
                Save to History
            </button>
        </div>
    );
}
