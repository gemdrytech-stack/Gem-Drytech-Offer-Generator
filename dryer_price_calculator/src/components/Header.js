import { useEffect, useState } from "react";
import logo from "../logo.png"

export default function Header({ setPage }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className={`header ${scrolled ? "header-scrolled" : ""}`}>
      <img src={logo} alt="Gem Drytech Systems LLP" className="company-logo" />
      <div className="logo">
        <div className="icon">🏭</div>
        <div>
          <p className="small">INDUSTRIAL</p>
          <h3 className="header-h3">Dryer Auto-Offer</h3>
        </div>
      </div>

      <div className="header-right">
        <button onClick={() => setPage("home")} className="crsr gen-btn">Generator</button>
        <span onClick={() => setPage("history")} className="crsr history">
          Offers history
        </span>
      </div>
    </div>
  );
}