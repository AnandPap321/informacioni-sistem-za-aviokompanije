import User from "../modeli/userModel.js";

export const registrujKorisnika = async (req, res) => {
  const { name, email, password, phoneNumber } = req.body;

  try {
    const postoji = await User.findOne({ email });
    if (postoji) {
      return res.status(400).json({ message: "Korisnik već postoji." });
    }

    const korisnik = new User({
      name,
      email,
      password,
      phoneNumber,
    });

    const noviKorisnik = await korisnik.save();

    res.status(201).json({
      _id: noviKorisnik._id,
      name: noviKorisnik.name,
      email: noviKorisnik.email,
      role: noviKorisnik.role,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Greška pri registraciji", error: error.message });
  }
};
