import React, { useState } from "react";
import Header from "./components/Header";
import Form from "./components/Form";
import Recommendation from "./components/Recommendation";
import History from "./components/History";

function App() {
  const [offerData, setOfferData] = useState(null);
  const [page, setPage] = useState("home");

  return (
    <div>
      <Header setPage = {setPage} />

      {/* HERO */}
      <div className="hero">
        <div className="hero-content">
          <span className="badge">OFFER ENGINE · V1</span>
          <h1>
            Spec-in your feedstock.<br />
            <span>Spec-out a dryer offer.</span>
          </h1>
          <p>
            Enter material, capacity, moisture and application — we recommend
            the right dryer, quote a realistic price range.
          </p>
        </div>
      </div>

      {/* MAIN */}
      {page === "home" ? (
        <div className="container">
          <div className="left">
            <Form setOfferData={setOfferData} />
          </div>
          <div className="right">
            {offerData && <Recommendation data={offerData} />}
        </div>
        </div>
      ) : <History /> }
    </div>
  );
}

export default App;