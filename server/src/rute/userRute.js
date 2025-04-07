import { Router } from "express";
import { login, registracija, azurirajKorisnika, dohvatiProfil, zaboravljenaLozinka, resetujLozinku } from "../kontroleri/userKontroleri.js";
import { autentifikacija } from "../middlewares.js";
import bcrypt from 'bcryptjs';
import { Korisnik } from '../modeli.js';

const router = Router();

// Glavne rute za autentifikaciju
router.post('/prijava', login);
router.post('/registracija', registracija);

// Rute za profil
router.get('/profil', autentifikacija, dohvatiProfil);
router.put('/profil', autentifikacija, azurirajKorisnika);
router.put('/update/:id', autentifikacija, azurirajKorisnika);

// Ruta za resetovanje lozinke
router.post('/forgot-password', zaboravljenaLozinka);
router.post('/reset-password', resetujLozinku);

// Privremena ruta za hashiranje lozinke
router.post('/hash', async (req, res) => {
    try {
        const { lozinka } = req.body;
        const hashedLozinka = await bcrypt.hash(lozinka, 10);
        res.json({ hashedLozinka });
    } catch (error) {
        res.status(500).json({ message: 'Greška pri hashiranju' });
    }
});

// Privremena ruta za kreiranje testnog korisnika
router.post('/create-test', async (req, res) => {
    try {
        const { ime, prezime, email, lozinka } = req.body;
        const hashedLozinka = await bcrypt.hash(lozinka, 10);
        
        const korisnik = new Korisnik({
            ime,
            prezime,
            email,
            lozinka: hashedLozinka,
            role: 'kupac'
        });

        await korisnik.save();
        res.status(201).json({ message: 'Test korisnik kreiran' });
    } catch (error) {
        res.status(500).json({ message: 'Greška pri kreiranju korisnika' });
    }
});

export default router;
