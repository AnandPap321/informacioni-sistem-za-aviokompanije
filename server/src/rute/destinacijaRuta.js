import express from "express";
import {
  dohvatiDestinacije,
  jednaDestinacija,
  dodajDestinaciju,
  azurirajDestinaciju,
  obrisiDestinaciju
} from "../kontroleri/destinacijaKontroler.js";

const destinacijaRuta = express.Router();

destinacijaRuta.get("/", dohvatiDestinacije); // Sve destinacije
destinacijaRuta.get("/:id", jednaDestinacija); // Jedna destinacija
destinacijaRuta.post("/", dodajDestinaciju); // Dodavanje
destinacijaRuta.put("/:id", azurirajDestinaciju); // Ažuriranje
destinacijaRuta.delete("/:id", obrisiDestinaciju); // Brisanje

export default destinacijaRuta;
