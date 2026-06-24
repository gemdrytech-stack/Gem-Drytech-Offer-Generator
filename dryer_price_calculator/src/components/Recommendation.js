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
        "Continuous Band Dryer": {
            desc: "Suitable for continuous hot-air drying of food, sludge, biomass, fibrous material, flakes, and pieces with controlled residence time.",
            tags: ["Continuous", "Hot Air", "High Capacity"]
        },
        "Combination Dryer": {
            desc: "Suitable for non-liquid input materials where combined drying action is required for better moisture removal and uniform drying.",
            tags: ["Non-Liquid Feed", "Custom", "Efficient Drying"]
        },
        "Paddle Dryer": {
            desc: "Suitable for sludge, paste, filter cake, wet cake, and sticky materials requiring indirect heating and enclosed drying.",
            tags: ["Sticky Material", "Indirect Heating", "Sludge/Cake"]
        },
        "Rotary Dryer": {
            desc: "Suitable for minerals, biomass, fertilizer, and bulk solids requiring rugged high-throughput drying.",
            tags: ["Bulk Solids", "Rugged", "High Throughput"]
        },
        "Fluid Bed Dryer": {
            desc: "Suitable for powders, granules, grains, and free-flowing material requiring uniform air distribution.",
            tags: ["Powder", "Granules", "Uniform Drying"]
        },
        "Tray Dryer": {
            desc: "Suitable for small batch drying, herbs, food products, and low-capacity applications.",
            tags: ["Batch", "Simple", "Low Capacity"]
        },
        "Vacuum Dryer": {
            desc: "Suitable for heat-sensitive and pharma materials requiring low-temperature drying under vacuum.",
            tags: ["Vacuum", "Pharma", "Heat Sensitive"]
        },
        "Spray Dryer": {
            desc: "Suitable for liquid or slurry feed such as dairy, ceramic slurry, and solution-based products.",
            tags: ["Liquid Feed", "Slurry", "Powder Output"]
        },
        "Freeze Dryer (Lyophilizer)": {
            desc: "Suitable for high-value heat-sensitive products requiring maximum product preservation.",
            tags: ["Heat Sensitive", "High Value", "Low Temperature"]
        },
        "Spin Flash Dryer": {
            desc: "Suitable for certain chemical cakes, pastes, and powders requiring fast drying with disintegration.",
            tags: ["Chemical", "Fast Drying", "Powder"]
        },
        "Drum Dryer": {
            desc: "Suitable for slurry, paste, and liquid feed that can be dried on heated drum surfaces.",
            tags: ["Slurry", "Paste", "Surface Drying"]
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

            const res = await fetch("http://localhost:5000/api/offer/pdf", {
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