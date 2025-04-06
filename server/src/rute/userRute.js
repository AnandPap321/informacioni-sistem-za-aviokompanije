import { Router } from "express";
import { registrujKorisnika } from "../kontroleri/userKontroleri.js";

const router = Router();

router.post("/registracija", registrujKorisnika);

export default router;
