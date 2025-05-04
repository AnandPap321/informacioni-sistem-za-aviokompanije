import { createTransport } from "nodemailer";

const resetPassword = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email je obavezan." });
  }

  try {
    const transporter = createTransport({
      host: "smtp.sendgrid.net",
      port: 587,
      secure: false,
      auth: { user: "apikey", pass: process.env.SENDGRID_API_KEY },
      tls: { rejectUnauthorized: false },
    });

    const mailOptions = {
      from: "anandpap@live.com",
      to: email,
      subject: "Reset passworda",
      text: "Kliknite na link za resetovanje passworda: https://informacioni-sistem-za-aviokompanije.vercel.app/reset-password",
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "Email poslan za resetovanje lozinke." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Greška pri slanju emaila." });
  }
};

export default resetPassword;
