import mongoose from "mongoose";

const OdeljakSchema = new mongoose.Schema({
    tip: { type: String, enum: ["F", "C", "Y"], required: true }, // F = Prva, C = Biznis, Y = Ekonomija
    brojSjedistaURedu: Number,
    ukupnoSjedista: Number,
});

const AvionSchema = new mongoose.Schema({
    tip: { type: String, required: true }, // npr. "747", "320"
    registracija: { type: String, required: true, unique: true },
    konfiguracijaSjedista: [OdeljakSchema],
});

export default mongoose.model("Avion", AvionSchema);
