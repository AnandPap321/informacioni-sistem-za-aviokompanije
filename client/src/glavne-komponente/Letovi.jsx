import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../stilovi/App.css";
import { dohvatiDestinacije } from "../pomocne-funkcije/fetch-funkcije";

const getBaseUrl = () => {
  return window.location.hostname === "localhost"
    ? "http://localhost:5000"
    : "https://informacioni-sistem-za-aviokompanije.onrender.com";
};

const Letovi = () => {
  const [letovi, setLetovi] = useState([]);
  const [destinacije, setDestinacije] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [aviokompanije, setAviokompanije] = useState([]);

  // Filtri – ažurirani ključevi
  const [filters, setFilters] = useState({
    polaziste: "",
    odrediste: "",
    datumPolaska: "",
    datumDolaska: "",
    aviokompanija: "",
    vrijemePolaska: "",
    vrijemeDolaska: "",
  });

  const navigate = useNavigate();

  const fetchDestinacije = async () => {
    try {
      const response = await axios.get(`${getBaseUrl()}/api/letovi/destinacije`);
      const data = response.data;
      if (!Array.isArray(data)) throw new Error("Nepodržan format");
      setDestinacije(data);
    } catch (err) {
      console.error("Greška pri dohvatanju destinacija:", err);
      setError("Greška pri dohvatanju destinacija.");
      setDestinacije([]);
    }
  };

  const fetchAviokompanije = async () => {
    try {
      const response = await axios.get(`${getBaseUrl()}/api/aviokompanije`);
      setAviokompanije(response.data || []);
    } catch (err) {
      console.error("Greška pri dohvaćanju aviokompanija:", err);
      setAviokompanije([]);
    }
  };

  const generisiCijenu = () => {
    return Math.floor(Math.random() * (1000 - 100 + 1)) + 100;
  };

  const formatTime = (timeStr) => {
    if (!timeStr) return timeStr;
    let [hours, minutes] = timeStr.split(':');
    hours = hours.padStart(2, '0');
    return `${hours}:${minutes}`;
  };  

  const fetchLetovi = async () => {
    try {
      setLoading(true);
      setError(null);
      const params = {};
      if (filters.polaziste) params.polaziste = filters.polaziste;
      if (filters.odrediste) params.odrediste = filters.odrediste;
      // Promijenjeno: 
      if (filters.datumPolaska) params.datumOd = filters.datumPolaska;
      if (filters.datumDolaska) params.datumDo = filters.datumDolaska;
      if (filters.aviokompanija) params.aviokompanija = filters.aviokompanija;
      if (filters.vrijemePolaska)
        params.vrijemePolaska = formatTime(filters.vrijemePolaska);
      if (filters.vrijemeDolaska)
        params.vrijemeDolaska = formatTime(filters.vrijemeDolaska);      
  
      console.log("Pozivam API sa parametrima:", params);
      const response = await axios.get(`${getBaseUrl()}/api/letovi`, { params });
      console.log("API odgovor:", response.data);
  
      if (!response.data) {
        throw new Error("Nema podataka o letovima");
      }
      if (!Array.isArray(response.data)) {
        throw new Error("Neočekivani format podataka sa servera");
      }
  
      const formattedLetovi = response.data.map((let_) => ({
        _id: let_._id || "",
        origin: let_.origin || "",
        destination: let_.destination || "",
        departureTime: let_.departureTime || "",
        arrivalTime: let_.arrivalTime || "",
        dolazakSljedeciDan: let_.dolazakSljedeciDan || false,
        flightNumber: let_.flightNumber || "",
        cijena: generisiCijenu(),
        avionId: let_.avionId
          ? {
              naziv: let_.avionId.naziv || "",
              model: let_.avionId.model || "",
            }
          : null,
        aviokompanija: {
          naziv: let_.aviokompanija?.naziv || let_.aviokompanijaNaziv || "Nepoznata aviokompanija",
          kod: let_.aviokompanija?.kod || let_.aviokompanijaKod || "",
        },
      }));
  
      console.log("Formatirani letovi:", formattedLetovi);
      setLetovi(formattedLetovi);
    } catch (err) {
      console.error("Greška pri dohvatanju letova:", err);
      setError("Došlo je do greške pri učitavanju letova. Molimo pokušajte ponovo.");
      setLetovi([]);
    } finally {
      setLoading(false);
    }
  };
  

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchLetovi();
  };

  useEffect(() => {
    fetchDestinacije();
    fetchAviokompanije();
    // Letovi će se prikazivati tek nakon pretrage
  }, []);

  return (
    <div className="letovi-container">
      <h2>Pretraga Letova</h2>
      <form onSubmit={handleSearch} className="pretraga-forma">
        <div className="filter-grid">
          <div className="first-row">
            <div className="form-group">
              <label>Od:</label>
              <select name="polaziste" value={filters.polaziste} onChange={handleFilterChange} className="input-field select-field">
                <option value="">Sva polazista</option>
                {destinacije.map((dest) => (
                  <option key={`polaziste-${dest._id}`} value={dest.grad}>
                    {dest.grad} - {dest.nazivAerodroma}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Do:</label>
              <select name="odrediste" value={filters.odrediste} onChange={handleFilterChange} className="input-field select-field">
                <option value="">Sve destinacije</option>
                {destinacije.map((dest) => (
                  <option key={`odrediste-${dest._id}`} value={dest.grad}>
                    {dest.grad} - {dest.nazivAerodroma}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Datum polaska:</label>
              <input
                type="date"
                name="datumPolaska"
                value={filters.datumPolaska}
                onChange={handleFilterChange}
                className="input-field date-input"
                placeholder="mm-dd-yyyy"
                required
              />
            </div>
            <div className="form-group">
              <label>Datum dolaska:</label>
              <input
                type="date"
                name="datumDolaska"
                value={filters.datumDolaska}
                onChange={handleFilterChange}
                className="input-field date-input"
                placeholder="mm-dd-yyyy"
                required
              />
            </div>
          </div>
          <div className="second-row">
            <div className="form-group">
              <label>Aviokompanija:</label>
              <select name="aviokompanija" value={filters.aviokompanija} onChange={handleFilterChange} className="input-field select-field">
                <option value="">Sve aviokompanije</option>
                {aviokompanije.map((avio) => (
                  <option key={avio._id} value={avio._id}>
                    {avio.naziv} ({avio.kod})
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Vrijeme polaska:</label>
              <input
                type="time"
                name="vrijemePolaska"
                value={filters.vrijemePolaska}
                onChange={handleFilterChange}
                className="input-field"
                placeholder="hh:mm"
              />
            </div>
            <div className="form-group">
              <label>Vrijeme dolaska:</label>
              <input
                type="time"
                name="vrijemeDolaska"
                value={filters.vrijemeDolaska}
                onChange={handleFilterChange}
                className="input-field"
                placeholder="hh:mm"
              />
            </div>
          </div>
        </div>
        <div className="btn-row">
          <button type="submit" className="pretrazi-dugme" disabled={loading}>
            Pretraži
          </button>
        </div>
      </form>
      {loading && <div className="loading">Učitavanje...</div>}
      {error && <div className="error">{error}</div>}
      {letovi.length > 0 && (
        <div className="letovi-grid vertical">
          {letovi.map((let_) => (
            <div key={let_._id || `let-${let_.origin}-${let_.destination}`} className="let-kartica">
              <div className="let-info">
                <h3>Let {let_.flightNumber}</h3>
                <p>
                  Ruta: {let_.origin} → {let_.destination}
                </p>
                <p>
                  Vrijeme: {let_.departureTime} – {let_.arrivalTime}{" "}
                  {let_.dolazakSljedeciDan ? "(dolazak sljedeći dan)" : ""}
                </p>
                <p>Cijena: {let_.cijena} €</p>
                {let_.aviokompanija && (
                  <p>
                    Aviokompanija: {let_.aviokompanija.naziv}
                    {let_.aviokompanija.kod && ` (${let_.aviokompanija.kod})`}
                  </p>
                )}
                {let_.avionId && (
                  <p className="avion-info">
                    Avion: {let_.avionId.naziv} ({let_.avionId.model})
                  </p>
                )}
              </div>
              <button
                className="rezervisi-dugme"
                onClick={() =>
                  navigate(`/rezervacija/${let_._id}`, { state: { flight: let_ } })
                }
              >
                Rezerviši
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Letovi;
