import React, { useEffect, useState } from "react";
//import Form from "./Form";

export default function History() {
  const [quotes, setQuotes] = useState([]);
  const [search, setSearch] = useState("");

  const fetchQuotes = async () => {
    const res = await fetch(
      `https://gem-drytech-offer-generator.onrender.com/api/offer/history?search=${search}`
    );
    const data = await res.json();
    setQuotes(data);
  };

  useEffect(() => {
    fetchQuotes();
  }, [search]);

  const downloadPDF = async (quoteNo) => {
    const res = await fetch(
      `https://gem-drytech-offer-generator.onrender.com/api/offer/pdf/${quoteNo}`
    );

    const blob = await res.blob();

    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${quoteNo}.pdf`;
    a.click();
  };

  return (
    <div className="history-page">
      <h2>Quotation History</h2>

      <input
        placeholder="Search by client..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <table>
        <thead>
          <tr>
            <th>Quote No</th>
            <th>Date</th>
            <th>Client</th>
            <th>Dryer</th>
            <th>Price Range</th>
          </tr>
        </thead>

        <tbody>
          {quotes.map((q, i) => (
            <tr key={i}>
              <td>{q.quoteNo}</td>
              <td>{q.date}</td>
              <td>{q.client}</td>
              <td>{q.dryer}</td>
              <td>${q.minPrice} - ${q.maxPrice}</td>
              <td>
                <button onClick={() => downloadPDF(q.quoteNo)}>
                  Download PDF
                </button>
              </td>
              {/* <td>
                <button onClick={() => <Form />}>
                  Edit
                </button>
              </td> */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
