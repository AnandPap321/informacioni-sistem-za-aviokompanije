import express from "express";
import mongoose from "mongoose";
import config from "./src/config.js";
import destinacijaRuta from "./src/rute/destinacijaRuta.js";

const app = express();

app.use(express.json());
app.use("/api/destinacije", destinacijaRuta);

mongoose
  .connect(config.mongo)
  .then(() => {
    console.log("Uspješno spojeni na bazu podataka.");
    app.listen(config.port, () => {
      console.log(`Server radi na portu: ${config.port}`);
    });
  })
  .catch((err) => {
    console.error("Greška pri povezivanju s bazom:", err);
  });
