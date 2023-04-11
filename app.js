const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
const app = express();
dotenv.config();
// Middleware pour parser le corps de la requête
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});


// Route pour gérer les requêtes POST à l'URL /send-email
app.post('/send-email', (req, res) => {
  const { fullName, email, need, phone, workTypeCreation, workTypeRenovation  } = req.body.contact;
  console.log(req.body.contact)

  // Configurer le transporteur SMTP pour l'envoi de courrier électronique
  const transporter = nodemailer.createTransport({
     host: 'smtp.gmail.com',
  port: 465,
  secure: true,
    auth: {
      user: process.env.MAIL,
      pass: process.env.PASS
    }
  });

  // Définir le corps de l'e-mail
  const mailOptions = {
    from: 'skredesign@gmail.com',
    to: 'skredesign@gmail.com',
    subject: 'Demande de devis',
    html: `
    <h1>Nouvelle demande de devis:</h1>
    <table>
      <tr>
        <th style="text-align:left">Nom Prénon:</th>
        <td>${fullName}</td>
      </tr>
      <tr>
        <th style="text-align:left">Email:</th>
        <td>${email}</td>
      </tr>
      <tr>
        <th style="text-align:left">Téléphone:</th>
        <td>${phone}</td>
      </tr>
      <tr>
        <th style="text-align:left">Type de travail:</th>
        <td>
          ${workTypeCreation ? 'Création' : ''}
          ${workTypeRenovation ? 'Rénovation' : ''}
        </td>
      </tr>
      <tr>
        <th style="text-align:left">Besoin:</th>
        <td>${need}</td>
      </tr>
    </table>
  `
};

  // Envoyer l'e-mail
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      res.status(500).json({ message: 'Internal Server Error' });
    } else {
      console.log('Email sent: ' + info.response);
      res.status(200).json({ message: 'Email sent' });
    }
  });
});


module.exports = app;

