const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_FROM,
    pass: process.env.EMAIL_PASS,
  },
});

const enviarEmail = async (to, subject, html) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to,
      subject,
      html,
    });
    console.log(`E-mail enviado para ${to}`);
  } catch (err) {
    console.error('Erro ao enviar e-mail:', err.message);
    throw err;
  }
};

module.exports = enviarEmail;
