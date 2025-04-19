import React, { useState, useEffect } from "react";
import axios from "axios";
import "../stilovi/App.css";

const getBaseUrl = () => {
  if (window.location.hostname === "localhost") {
    return "http://localhost:5000";
  }
  return "https://informacioni-sistem-za-aviokompanije.onrender.com";
};

const daniSedmice = {
  1: "Pon",
  2: "Uto",
  3: "Sri",
  4: "Čet",
  5: "Pet",
  6: "Sub",
  7: "Ned",
  x: "Ad-hoc",
};

const formatirajRaspored = (schedule) => {
  if (!schedule) return "Nema podataka";
  if (schedule === "1234567") return "Svaki dan";
  if (schedule.startsWith("x")) {
    const excluded = schedule
      .slice(1)
      .split("")
      .map((d) => daniSedmice[d] || d)
      .join(", ");
    return `Svi dani osim: ${excluded}`;
  }
  return schedule
    .split("")
    .map((char) => daniSedmice[char] || char)
    .join(", ");
};

const Letovi = () => {
  const [letovi, setLetovi] = useState([]);
  const [destinacije, setDestinacije] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    odrediste: "",
    dan: "",
    mjesec: "",
    godina: "",
  });

  const fetchDestinacije = async () => {
    try {
      const response = await axios.get(
        `${getBaseUrl()}/api/letovi/destinacije`
      );
      const destinacijeArray = Array.isArray(response.data)
        ? response.data
        : [];
      setDestinacije(destinacijeArray);
    } catch (err) {
      setError("Greška pri dohvatanju destinacija.");
      setDestinacije([]);
    }
  };

  const fetchLetovi = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = {};
      if (filters.odrediste) params.odrediste = filters.odrediste;

      if (filters.dan && filters.mjesec && filters.godina) {
        const dan = filters.dan.padStart(2, "0");
        const mjesec = filters.mjesec.padStart(2, "0");
        params.datumPolaska = `${dan}/${mjesec}/${filters.godina}`;
      }

      const response = await axios.get(`${getBaseUrl()}/api/letovi`, {
        params,
      });

      const formattedLetovi = response.data.map((let_) => ({
        _id: let_._id || "",
        flightNumber: let_.flightNumber || "",
        origin: let_.origin || "",
        destination: let_.destination || "",
        departureTime: let_.departureTime || "",
        arrivalTime: let_.arrivalTime || "",
        dolazakSljedeciDan: let_.dolazakSljedeciDan || false,
        avionId: let_.avionId
          ? {
              naziv: let_.avionId.naziv || "",
              model: let_.avionId.model || "",
            }
          : null,
      }));

      setLetovi(formattedLetovi);
    } catch (err) {
      console.error("Greška pri dohvatanju letova:", err);
      setError("Došlo je do greške pri učitavanju letova.");
      setLetovi([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDestinacije();
    fetchLetovi();
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    if (["dan", "mjesec", "godina"].includes(name) && value !== "") {
      if (!/^\d+$/.test(value)) return;
    }

    if (name === "dan" && (value < 1 || value > 31 || value.length > 2)) return;
    if (name === "mjesec" && (value < 1 || value > 12 || value.length > 2))
      return;
    if (name === "godina" && value.length > 4) return;

    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchLetovi();
  };

  return (
    <div className="letovi-container">
      <h2>Pretraga Letova</h2>

      <form onSubmit={handleSearch} className="pretraga-forma">
        <div className="form-group">
          <select
            name="odrediste"
            value={filters.odrediste}
            onChange={handleFilterChange}
            className="input-field select-field">
            <option value="">Sve destinacije</option>
            {destinacije.map((destinacija) => (
              <option key={destinacija} value={destinacija}>
                {destinacija}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group date-group">
          <div className="date-inputs">
            <input
              type="text"
              name="dan"
              placeholder="DD"
              value={filters.dan}
              onChange={handleFilterChange}
              className="input-field date-input"
              maxLength="2"
            />
            <span className="date-separator">/</span>
            <input
              type="text"
              name="mjesec"
              placeholder="MM"
              value={filters.mjesec}
              onChange={handleFilterChange}
              className="input-field date-input"
              maxLength="2"
            />
            <span className="date-separator">/</span>
            <input
              type="text"
              name="godina"
              placeholder="YYYY"
              value={filters.godina}
              onChange={handleFilterChange}
              className="input-field date-input year-input"
              maxLength="4"
            />
          </div>
        </div>
        <button type="submit" className="pretrazi-dugme" disabled={loading}>
          Pretraži
        </button>
      </form>

      {loading && <div className="loading">Učitavanje...</div>}
      {error && <div className="error">{error}</div>}

      <div className="letovi-grid">
        {letovi.length > 0
          ? letovi.map((let_) => (
              <div key={let_._id} className="let-kartica">
                <div className="let-info">
                  <h3>Let {let_.flightNumber}</h3>
                  <p>
                    Ruta: {let_.origin} → {let_.destination}
                  </p>
                  <p>
                    Vrijeme: {let_.departureTime} – {let_.arrivalTime}{" "}
                    {let_.dolazakSljedeciDan ? "(dolazak sljedeći dan)" : ""}
                  </p>
                  {let_.avionId && (
                    <p className="avion-info">
                      Avion: {let_.avionId.naziv} ({let_.avionId.model})
                    </p>
                  )}
                </div>
                <button
                  className="rezervisi-dugme"
                  onClick={() =>
                    (window.location.href = "/rezervacija/" + let_._id)
                  }
                  disabled={!let_.brojSlobodnihMjesta}>
                  {!let_.brojSlobodnihMjesta ? "Popunjeno" : "Rezerviši"}
                </button>
              </div>
            ))
          : !loading &&
            !error && (
              <div className="no-results">
                Nema dostupnih letova za odabrane kriterije.
              </div>
            )}
      </div>
    </div>
  );
};

export default Letovi;
