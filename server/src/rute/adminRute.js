import { Router } from "express";
import {
  provjeraAplikacije,
  dohvatiSveKorisnike,
  dohvatiKorisnikaPoId,
  promovirajUAdmina,
  demovirajUKorisnika,
} from "../kontroleri/adminKontroleri.js";
import { proslijediDalje /*authenticate*/, adminOnly } from "../middlewares.js";

const router = Router();

router.get("/provjera", proslijediDalje, provjeraAplikacije);

router.get("/korisnici", /*authenticate*/ /*adminOnly*/ dohvatiSveKorisnike);
router.get(
  "/korisnici/:id",
  /*authenticate*/ /*adminOnly*/ dohvatiKorisnikaPoId
);
router.put(
  "/korisnici/:id/promoviraj",
  /*authenticate*/ /*adminOnly*/
  promovirajUAdmina
);
router.put(
  "/korisnici/:id/demoviraj",

  /*authenticate*/ /*adminOnly*/
  demovirajUKorisnika
);

export default router;
