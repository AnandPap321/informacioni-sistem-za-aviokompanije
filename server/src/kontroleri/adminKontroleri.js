import { Booking, Korisnik } from "../modeli/modeli.js";
import { startOfWeek, addWeeks, endOfWeek } from "date-fns";

export const provjeraAplikacije = (req, res) => {
  return res.status(200).json({ poruka: "Sve ok!" });
};

// Operacije nad korisnicima
const dohvatiSveKorisnike = async (req, res) => {
  try {
    const korisnici = await Korisnik.find({}).select("-password");

    res.status(200).json(korisnici);
  } catch (error) {
    res.status(500).json({
      message: "Greška pri dohvaćanju korisnika",

      error: error.message,
    });
  }
};

const dohvatiKorisnikaPoId = async (req, res) => {
  try {
    const korisnik = await Korisnik.findById(req.params.id).select("-password");

    if (korisnik) {
      res.json(korisnik);
    } else {
      res.status(404).json({ poruka: "Korisnik nije pronađen" });
    }
  } catch (error) {
    res.status(500).json({ poruka: "Greška na serveru", error: error.message });
  }
};

const promovirajUAdmina = async (req, res) => {
  try {
    const korisnik = await Korisnik.findById(req.params.id);

    if (!korisnik) {
      return res.status(404).json({ poruka: "Korisnik nije pronađen" });
    }

    if (korisnik.role === "admin") {
      return res.status(400).json({ poruka: "Korisnik je već administrator" });
    }

    korisnik.role = "admin";
    const azuriranKorisnik = await korisnik.save();

    res.json({
      _id: azuriranKorisnik._id,
      name: azuriranKorisnik.name,
      email: azuriranKorisnik.email,
      role: azuriranKorisnik.role,
    });
  } catch (error) {
    res.status(500).json({ poruka: "Greška na serveru", error: error.message });
  }
};

const demovirajUKorisnika = async (req, res) => {
  try {
    const korisnik = await Korisnik.findById(req.params.id);

    if (!korisnik) {
      return res.status(404).json({ poruka: "Korisnik nije pronađen" });
    }

    if (korisnik.role === "kupac") {
      return res.status(400).json({ poruka: "Korisnik je već obični korisnik" });
    }

    korisnik.role = "kupac";
    const azuriranKorisnik = await korisnik.save();

    res.json({
      _id: azuriranKorisnik._id,
      name: azuriranKorisnik.name,
      email: azuriranKorisnik.email,
      role: azuriranKorisnik.role,
    });
  } catch (error) {
    res.status(500).json({ poruka: "Greška na serveru", error: error.message });
  }
};

const obrisiKorisnika = async (req, res) => {
  try {
    const korisnik = await Korisnik.findById(req.params.id);
    if (!korisnik) {
      return res.status(404).json({ poruka: "Korisnik nije pronađen" });
    }
    await korisnik.deleteOne();
    res.json({ poruka: "Korisnik uspješno obrisan" });
  } catch (error) {
    res.status(500).json({ poruka: "Greška na serveru", error: error.message });
  }
};

const dodajNovogKorisnika = async (req, res) => {
  try {
    const { ime, prezime, email, lozinka, role, telefon } = req.body;

    // Provjeravamo da li korisnik već postoji
    const postojeciKorisnik = await Korisnik.findOne({ email });
    if (postojeciKorisnik) {
      return res.status(400).json({ poruka: "Korisnik s ovim emailom već postoji" });
    }

    // Kreiramo novog korisnika
    const noviKorisnik = new Korisnik({
      ime,
      prezime,
      email,
      lozinka, // Lozinka bi trebala biti hashed prije nego se pohrani
      role,
      telefon,
    });

    // Spremaj korisnika u bazu
    const kreiraniKorisnik = await noviKorisnik.save();

    // Vraćamo novog korisnika kao odgovor
    res.status(201).json({
      _id: kreiraniKorisnik._id,
      ime: kreiraniKorisnik.ime,
      prezime: kreiraniKorisnik.prezime,
      email: kreiraniKorisnik.email,
      role: kreiraniKorisnik.role,
    });
  } catch (error) {
    res.status(500).json({ poruka: "Greška pri dodavanju korisnika", error: error.message });
  }
};

function getStartAndEndOfISOWeek(godina, sedmicaOd, sedmicaDo) {
  const jan4 = new Date(godina, 0, 4);
  const startOfFirstWeek = startOfWeek(jan4, { weekStartsOn: 1 });
  const datumOd = addWeeks(startOfFirstWeek, sedmicaOd - 1);
  const datumDoPosljednja = addWeeks(startOfFirstWeek, sedmicaDo - 1);
  const datumDo = endOfWeek(datumDoPosljednja, { weekStartsOn: 1 });
  return { datumOd, datumDo };
}

function getAllWeeks(godina, sedmicaOd, sedmicaDo) {
  const sedmice = [];

  for (let index = sedmicaOd; index <= sedmicaDo; index++) {
    sedmice.push({
      godina: godina,
      sedmica: index,
    });
  }
  return sedmice;
}

export const pregledProdaje = async (req, res) => {
  try {
    const { godina, sedmicaOd, sedmicaDo } = req.query;
    const sedmicaOdBroj = Number(sedmicaOd);
    const sedmicaDoBroj = Number(sedmicaDo);
    const godinaBroj = Number(godina);
    // const { datumOd, datumDo } = getStartAndEndOfISOWeek(godina, sedmicaOd, sedmicaDo);
    const sedmice = getAllWeeks(godinaBroj, sedmicaOdBroj, sedmicaDoBroj);

    const bookingsByWeek = await Booking.aggregate([
      {
        $lookup: {
          from: "lets",
          localField: "flight",
          foreignField: "_id",
          as: "flight",
        },
      },
      { $unwind: { path: "$flight", preserveNullAndEmptyArrays: false } },
      {
        $addFields: {
          isoWeek: { $isoWeek: "$flight.datumPolaska" },
          isoWeekYear: { $isoWeekYear: "$flight.datumPolaska" },
        },
      },
      {
        $match: {
          isoWeek: { $gte: sedmicaOdBroj, $lte: sedmicaDoBroj },
        },
      },
      {
        $group: {
          _id: {
            godina: "$isoWeekYear",
            sedmica: "$isoWeek",
          },
          totalCijena: { $sum: "$cijenaKarte" },
          brojRezervacija: { $sum: 1 },
        },
      },
      {
        $sort: { "_id.godina": 1, "_id.sedmica": 1 },
      },
    ]);

    let lastTotalCijena = 0;

    const merged = sedmice.map(({ godina, sedmica }) => {
      const pronadena = bookingsByWeek.find((b) => b._id.godina == godina && b._id.sedmica === sedmica);

      if (pronadena) {
        lastTotalCijena = pronadena.totalCijena;
      }

      return {
        godina,
        sedmica,
        totalCijena: pronadena ? pronadena.totalCijena : lastTotalCijena,
        brojRezervacija: pronadena?.brojRezervacija || 0,
      };
    });

    res.status(200).json(merged);
  } catch (error) {
    console.log(error);

    return res.status(400);
  }
};

export {
  dohvatiSveKorisnike,
  dohvatiKorisnikaPoId,
  promovirajUAdmina,
  demovirajUKorisnika,
  obrisiKorisnika,
  dodajNovogKorisnika,
};
