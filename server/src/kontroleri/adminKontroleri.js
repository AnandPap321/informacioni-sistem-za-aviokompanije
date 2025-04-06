import User from "../modeli/userModel.js";

export const provjeraAplikacije = (req, res) => {
  return res.status(200).json({ poruka: "Sve ok!" });
};

export const dohvatiSveKorisnike = async (req, res) => {
  try {
    const korisnici = await User.find({}).select("-password");
    res.status(200).json(korisnici);
  } catch (error) {
    res.status(500).json({
      message: "Greška pri dohvaćanju korisnika",
      error: error.message,
    });
  }
};

export const dohvatiKorisnikaPoId = async (req, res) => {
  try {
    const korisnik = await User.findById(req.params.id).select("-password");

    if (korisnik) {
      res.status(200).json(korisnik);
    } else {
      res.status(404).json({ message: "Korisnik nije pronađen" });
    }
  } catch (error) {
    res.status(500).json({
      message: "Greška pri dohvaćanju korisnika",
      error: error.message,
    });
  }
};

export const promovirajUAdmina = async (req, res) => {
  try {
    const korisnik = await User.findById(req.params.id);

    if (!korisnik) {
      return res.status(404).json({ message: "Korisnik nije pronađen" });
    }

    if (korisnik.role === "admin") {
      return res.status(400).json({ message: "Korisnik je već admin" });
    }

    korisnik.role = "admin";
    const azuriraniKorisnik = await korisnik.save();

    res.status(200).json({
      _id: azuriraniKorisnik._id,
      name: azuriraniKorisnik.name,
      email: azuriraniKorisnik.email,
      role: azuriraniKorisnik.role,
    });
  } catch (error) {
    res.status(500).json({
      message: "Greška pri promoviranju korisnika",
      error: error.message,
    });
  }
};

export const demovirajUKorisnika = async (req, res) => {
  try {
    const korisnik = await User.findById(req.params.id);

    if (!korisnik) {
      return res.status(404).json({ message: "Korisnik nije pronađen" });
    }

    if (korisnik.role === "customer") {
      return res
        .status(400)
        .json({ message: "Korisnik je već običan korisnik" });
    }

    korisnik.role = "customer";
    const azuriraniKorisnik = await korisnik.save();

    res.status(200).json({
      _id: azuriraniKorisnik._id,
      name: azuriraniKorisnik.name,
      email: azuriraniKorisnik.email,
      role: azuriraniKorisnik.role,
    });
  } catch (error) {
    res.status(500).json({
      message: "Greška pri demoviranje korisnika",
      error: error.message,
    });
  }
};
