export const proslijediDalje = (req, res, next) => {
  next();
};

/*export const authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res
        .status(401)
        .json({ message: "Pristup odbijen. Token nije pronađen." });
    }

    const decoded = jwt.verify(token, config.secret);
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({ message: "Korisnik nije pronađen." });
    }

    req.user = user;
    next();
  } catch (error) {
    return res
      .status(401)
      .json({ message: "Neispravan token. Pristup odbijen." });
  }
};*/

export const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res
      .status(403)
      .json({ message: "Pristup odbijen. Potrebna admin privilegija." });
  }
};
