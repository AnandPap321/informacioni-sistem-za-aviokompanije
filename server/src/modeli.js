import mongoose from "mongoose";

const destinacijaSchema = new mongoose.Schema({
  grad: { type: String, required: true },
  nazivAerodroma: { type: String, required: true },
  IATA: { type: String, required: true },
  ICAO: { type: String, required: true },
});

const Destinacija = mongoose.model("Destinacija", destinacijaSchema);

export { Destinacija };
