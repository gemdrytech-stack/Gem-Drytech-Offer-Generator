import React, { useState, useEffect } from "react";
import Dropdown from "./Dropdown";

export default function Form({ setOfferData }) {
    const [form, setForm] = useState({
        client: "",
        product: "",
        material: "",
        application: "",
        capacity: "",
        feedRate: "",
        inputMoisture: "",
        outputMoisture: "",
        temperature: "",
        heatingMedia: "",
        moc: "",
        bagFilter: "",
        notes: "",
        steams: "",
        fueltype: "",
        country: "",
        frequency: "",
        materialDepth: "",
        bulkDensity: "",
        evaporationLoad: "",

        // Optional scope sections
        feedingEnabled: false,
        feedConveyorWidth: "",
        feedLength: "",
        feedMoc: "",
        feedMotor: "",

        exhaustSystemEnabled: false,
        exhaustFanQty: "",
        exhaustFanHp: "",
        exhaustMotorMake: "",
        blowerMoc: "",

        dustSeparationEnabled: false,
        dustSeparatorQty: "",
        cycloneMoc: "",
        cycloneThickness: "",
        rotaryValveHp: ""
    });
    const [errors, setErrors] = useState({});
    const [materials, setMaterials] = useState([]);
    const [applications, setApplications] = useState([]);
    const [steams, setSteams] = useState([]);
    const [fueltype, setFueltype] = useState([]);
    const [country, setCountry] = useState([]);
    const [frequency, setFrequency] = useState([]);
    const [loading, setLoading] = useState(false);

    const bagFilterOptions = ["Yes", "No"];

    const mocOptions = [
        "MS",
        "SS304",
        "SS316",
        "SS304 Contact Parts",
        "SS316 Contact Parts"
    ];

    useEffect(() => {
        fetch("http://localhost:5000/api/offer/meta")
            .then((res) => res.json())
            .then((data) => {
                setMaterials(data.materials || []);
                setApplications(data.applications || []);
                setSteams(data.steams || []);
                setFueltype(data.fueltype || []);
                setCountry(data.country || []);
                setFrequency(data.frequency || []);
            })
            .catch((err) => {
                console.error("Meta fetch error:", err);
            });
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }));
    };

    const toNumber = (value) => {
        const num = Number(value);
        return Number.isFinite(num) ? num : 0;
    };

    const calculateMassBalance = () => {
        const feedRate = toNumber(form.feedRate || form.capacity);
        const inputMoisture = toNumber(form.inputMoisture);
        const outputMoisture = toNumber(form.outputMoisture);

        const Mi = inputMoisture / 100;
        const Mf = outputMoisture / 100;

        const drySolids = feedRate * (1 - Mi);
        const finalOutput = drySolids / (1 - Mf);
        const evaporation = feedRate - finalOutput;

        return {
            feedRate,
            drySolids: Math.round(drySolids),
            finalOutput: Math.round(finalOutput),
            evaporation: Math.round(evaporation)
        };
    };

    const validate = () => {
        let err = {};

        const requiredFields = [
            "client",
            "product",
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
            "frequency",
            "bulkDensity"
        ];

        requiredFields.forEach((field) => {
            if (!form[field] || String(form[field]).trim() === "") {
                err[field] = "Required";
            }
        });

        const capacity = toNumber(form.capacity);
        const inputMoisture = toNumber(form.inputMoisture);
        const outputMoisture = toNumber(form.outputMoisture);
        const temperature = toNumber(form.temperature);

        if (form.capacity && capacity <= 0) {
            err.capacity = "Capacity must be greater than 0";
        }

        if (
            form.inputMoisture &&
            (inputMoisture <= 0 || inputMoisture >= 100)
        ) {
            err.inputMoisture = "Input moisture must be between 1 and 99";
        }

        if (
            form.outputMoisture &&
            (outputMoisture < 0 || outputMoisture >= 100)
        ) {
            err.outputMoisture = "Output moisture must be between 0 and 99";
        }

        if (
            form.inputMoisture &&
            form.outputMoisture &&
            inputMoisture <= outputMoisture
        ) {
            err.outputMoisture = "Output moisture must be lower than input moisture";
        }

        if (form.temperature && temperature <= 0) {
            err.temperature = "Temperature must be greater than 0";
        }

        return err;
    };

    const handleSubmit = async () => {
        const validation = validate();

        if (Object.keys(validation).length > 0) {
            setErrors(validation);
            return;
        }

        setErrors({});
        setLoading(true);

        const massBalance = calculateMassBalance();

        const payload = {
            ...form,

            capacity: toNumber(form.capacity),
            feedRate: massBalance.feedRate,
            inputMoisture: toNumber(form.inputMoisture),
            outputMoisture: toNumber(form.outputMoisture),
            temperature: toNumber(form.temperature),

            materialDepth: toNumber(form.materialDepth),
            bulkDensity: toNumber(form.bulkDensity),
            evaporationLoad: form.evaporationLoad ? toNumber(form.evaporationLoad) : "",

            feedConveyorWidth: form.feedConveyorWidth ? toNumber(form.feedConveyorWidth) : "",
            feedLength: form.feedLength ? toNumber(form.feedLength) : "",

            drySolids: massBalance.drySolids,
            finalOutput: massBalance.finalOutput,
            evaporation: massBalance.evaporation
        };

        try {
            const res = await fetch("http://localhost:5000/api/offer", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            });

            const data = await res.json();

            if (!res.ok) {
                alert(data.error || "Something went wrong");
                setLoading(false);
                return;
            }

            setOfferData({
                ...payload,

                dryer: data.dryer,
                minPrice: data.minPrice,
                maxPrice: data.maxPrice,

                drySolids: data.drySolids,
                finalOutput: data.finalOutput,
                waterEvaporation: data.waterEvaporation,

                selectionScore: data.selectionScore,
                alternativeDryers: data.alternativeDryers,
                selectionReasons: data.selectionReasons
            });

        } catch (err) {
            console.error("Offer generation error:", err);
            alert("Server error. Please check backend connection.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="card">
            <h4 className="section-title">INPUTS</h4>

            <label>Client Name</label>
            <input
                name="client"
                value={form.client}
                onChange={handleChange}
            />
            <span className="error">{errors.client}</span>

            <label>Product</label>
            <input
                name="product"
                value={form.product}
                onChange={handleChange}
            />
            <span className="error">{errors.product}</span>

            <div className="row">
                <div className="under-row">
                    <Dropdown
                        label="Material Type"
                        options={materials}
                        value={form.material}
                        onChange={(val) =>
                            setForm((prev) => ({ ...prev, material: val }))
                        }
                        error={errors.material}
                    />
                </div>

                <div className="under-row">
                    <Dropdown
                        label="Application"
                        options={applications}
                        value={form.application}
                        onChange={(val) =>
                            setForm((prev) => ({ ...prev, application: val }))
                        }
                        error={errors.application}
                    />
                </div>
            </div>

            <div className="row">
                <div className="under-row-input">
                    <label>Capacity / Wet Feed Rate (kg/hr)</label>
                    <input
                        type="number"
                        name="capacity"
                        value={form.capacity}
                        onChange={handleChange}
                    />
                    <span className="error">{errors.capacity}</span>
                </div>

                <div className="under-row-input">
                    <label>Input Moisture (%)</label>
                    <input
                        type="number"
                        name="inputMoisture"
                        value={form.inputMoisture}
                        onChange={handleChange}
                    />
                    <span className="error">{errors.inputMoisture}</span>
                </div>
            </div>

            <div className="row">
                <div className="under-row-input">
                    <label>Output Moisture (%)</label>
                    <input
                        type="number"
                        name="outputMoisture"
                        value={form.outputMoisture}
                        onChange={handleChange}
                    />
                    <span className="error">{errors.outputMoisture}</span>
                </div>

                <div className="under-row-input">
                    <label>Temperature (°C)</label>
                    <input
                        type="number"
                        name="temperature"
                        value={form.temperature}
                        onChange={handleChange}
                    />
                    <span className="error">{errors.temperature}</span>
                </div>
            </div>

            <label>Bulk Density</label>
            <input
                type="number"
                name="bulkDensity"
                value={form.bulkDensity}
                onChange={handleChange}
            />
            <span className="error">{errors.bulkDensity}</span>


            <label>Feed Rate Override (kg/hr) - Optional</label>
            <input
                type="number"
                name="feedRate"
                value={form.feedRate}
                onChange={handleChange}
                placeholder="Leave blank to use capacity"
            />
            <span className="error">{errors.feedRate}</span>

            <div className="row">
                <div className="under-row">
                    <Dropdown
                        label="Steam Availability"
                        options={steams}
                        value={form.steams}
                        onChange={(val) =>
                            setForm((prev) => ({ ...prev, steams: val }))
                        }
                        error={errors.steams}
                    />
                </div>

                <div className="under-row">
                    <Dropdown
                        label="Fuel Type"
                        options={fueltype}
                        value={form.fueltype}
                        onChange={(val) =>
                            setForm((prev) => ({ ...prev, fueltype: val }))
                        }
                        error={errors.fueltype}
                    />
                </div>
            </div>

            <div className="row">
                <div className="under-row">
                    <Dropdown
                        label="Country"
                        options={country}
                        value={form.country}
                        onChange={(val) =>
                            setForm((prev) => ({ ...prev, country: val }))
                        }
                        error={errors.country}
                    />
                </div>

                <div className="under-row">
                    <Dropdown
                        label="Frequency"
                        options={frequency}
                        value={form.frequency}
                        onChange={(val) =>
                            setForm((prev) => ({ ...prev, frequency: val }))
                        }
                        error={errors.frequency}
                    />
                </div>
            </div>

            <label>Heating Media</label>
            <input
                type="text"
                name="heatingMedia"
                value={form.heatingMedia}
                onChange={handleChange}
                placeholder="Example: Steam / Thermic Fluid / Hot Air / Gas"
            />
            <span className="error">{errors.heatingMedia}</span>

            <Dropdown
                label="Material of Construction (MOC)"
                options={mocOptions}
                value={form.moc}
                onChange={(val) =>
                    setForm((prev) => ({ ...prev, moc: val }))
                }
                error={errors.moc}
            />

            <Dropdown
                label="Bag Filter Required"
                options={bagFilterOptions}
                value={form.bagFilter}
                onChange={(val) =>
                    setForm((prev) => ({ ...prev, bagFilter: val }))
                }
                error={errors.bagFilter}
            />

            <h4 className="section-title">OPTIONAL SCOPE OF SUPPLY</h4>

            <div className="checkbox-row">
                <input
                    type="checkbox"
                    name="feedingEnabled"
                    checked={form.feedingEnabled}
                    onChange={handleChange}
                />
                <label>Feeding System</label>
            </div>

            {form.feedingEnabled && (
                <div className="scope-box">
                    <div className="row">
                        <div className="under-row-input">
                            <label>Feed Conveyor Width (mm)</label>
                            <input
                                type="number"
                                name="feedConveyorWidth"
                                value={form.feedConveyorWidth}
                                onChange={handleChange}
                                placeholder="Example: 600"
                            />
                        </div>

                        <div className="under-row-input">
                            <label>Feed Conveyor Length (mm)</label>
                            <input
                                type="number"
                                name="feedLength"
                                value={form.feedLength}
                                onChange={handleChange}
                                placeholder="Example: 4500"
                            />
                        </div>
                    </div>

                    <div className="row">
                        <div className="under-row-input">
                            <label>Feed MOC</label>
                            <input
                                name="feedMoc"
                                value={form.feedMoc}
                                onChange={handleChange}
                                placeholder="Example: MS / SS304"
                            />
                        </div>

                        <div className="under-row-input">
                            <label>Feed Gear Motor</label>
                            <input
                                name="feedMotor"
                                value={form.feedMotor}
                                onChange={handleChange}
                                placeholder="Example: 7.5 HP"
                            />
                        </div>
                    </div>
                </div>
            )}

            <div className="checkbox-row">
                <input
                    type="checkbox"
                    name="exhaustSystemEnabled"
                    checked={form.exhaustSystemEnabled}
                    onChange={handleChange}
                />
                <label>Exhaust System</label>
            </div>

            {form.exhaustSystemEnabled && (
                <div className="scope-box">
                    <div className="row">
                        <div className="under-row-input">
                            <label>Exhaust Fan Quantity</label>
                            <input
                                name="exhaustFanQty"
                                value={form.exhaustFanQty}
                                onChange={handleChange}
                                placeholder="Example: 1 No."
                            />
                        </div>

                        <div className="under-row-input">
                            <label>Exhaust Fan HP</label>
                            <input
                                name="exhaustFanHp"
                                value={form.exhaustFanHp}
                                onChange={handleChange}
                                placeholder="Example: 100 HP"
                            />
                        </div>
                    </div>

                    <div className="row">
                        <div className="under-row-input">
                            <label>Motor Make</label>
                            <input
                                name="exhaustMotorMake"
                                value={form.exhaustMotorMake}
                                onChange={handleChange}
                                placeholder="Example: ABB / Siemens"
                            />
                        </div>

                        <div className="under-row-input">
                            <label>Blower MOC</label>
                            <input
                                name="blowerMoc"
                                value={form.blowerMoc}
                                onChange={handleChange}
                                placeholder="Example: MS / SS304"
                            />
                        </div>
                    </div>
                </div>
            )}

            <div className="checkbox-row">
                <input
                    type="checkbox"
                    name="dustSeparationEnabled"
                    checked={form.dustSeparationEnabled}
                    onChange={handleChange}
                />
                <label>Dust Separation System</label>
            </div>

            {form.dustSeparationEnabled && (
                <div className="scope-box">
                    <div className="row">
                        <div className="under-row-input">
                            <label>Dust Separator Quantity</label>
                            <input
                                name="dustSeparatorQty"
                                value={form.dustSeparatorQty}
                                onChange={handleChange}
                                placeholder="Example: 2 Nos."
                            />
                        </div>

                        <div className="under-row-input">
                            <label>Cyclone MOC</label>
                            <input
                                name="cycloneMoc"
                                value={form.cycloneMoc}
                                onChange={handleChange}
                                placeholder="Example: MS / SS304"
                            />
                        </div>
                    </div>

                    <div className="row">
                        <div className="under-row-input">
                            <label>Cyclone Thickness</label>
                            <input
                                name="cycloneThickness"
                                value={form.cycloneThickness}
                                onChange={handleChange}
                                placeholder="Example: 3 mm"
                            />
                        </div>

                        <div className="under-row-input">
                            <label>Rotary Valve</label>
                            <input
                                name="rotaryValveHp"
                                value={form.rotaryValveHp}
                                onChange={handleChange}
                                placeholder="Example: 2 HP"
                            />
                        </div>
                    </div>
                </div>
            )}

            <label>Notes (optional)</label>
            <textarea
                name="notes"
                value={form.notes}
                onChange={handleChange}
            />

            <button
                className="primary-btn"
                onClick={handleSubmit}
                disabled={loading}
            >
                {loading ? "Generating..." : "Generate offer →"}
            </button>
        </div>
    );
}