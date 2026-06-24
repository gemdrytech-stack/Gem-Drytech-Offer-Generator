import React, { useState, useRef, useEffect } from "react";

export default function Dropdown({ label, options, value, onChange, error }) {
  const [open, setOpen] = useState(false);
  const ref = useRef();

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="dropdown" ref={ref}>
      <label>{label}</label>

      <div
        className={`dropdown-header ${error ? "error-border" : ""}`}
        onClick={() => setOpen(!open)}
      >
        {value || "Select"}
        <span className={`arrow ${open ? "rotate" : ""}`}>▼</span>
      </div>

      {open && (
        <div className="dropdown-list">
          {options.map((opt, i) => (
            <div
              key={i}
              className={`dropdown-item ${value === opt ? "active" : ""}`}
              onClick={() => {
                onChange(opt);
                setOpen(false);
              }}
            >
              {opt}
            </div>
          ))}
        </div>
      )}

      {error && <span className="error">{error}</span>}
    </div>
  );
}