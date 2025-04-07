import { Router } from "express";
import { provjeraAplikacije, unosDestinacijaIzJsonFajla } from "../kontroleri/adminKontroleri.js";
import { proslijediDalje } from "../middlewares.js";
import {
    dohvatiDestinacije,
    jednaDestinacija,
    dodajDestinaciju,
    azurirajDestinaciju,
    obrisiDestinaciju
} from "../kontroleri/adminKontroleri.js";

const router = Router();

router.get("/provjera", proslijediDalje, provjeraAplikacije);
router.post("/unesi-destinacije-json", unosDestinacijaIzJsonFajla);

router.get("/destinacije", dohvatiDestinacije);
router.get("/destinacije/:id", jednaDestinacija);
router.post("/destinacije", dodajDestinaciju);
router.put("/destinacije/:id", azurirajDestinaciju);
router.delete("/destinacije/:id", obrisiDestinaciju);

export default router;
