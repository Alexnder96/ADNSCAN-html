const express = require('express');
const bodyParser = require('body-parser');
const { GoogleSpreadsheet } = require('google-spreadsheet');
const path = require('path');

const app = express();
const PORT = 3000;

const SHEET_ID = '1b3JR6nH9MOHCHnxyG2yZ-lP2DZhHVoVlAXL1LIYekHs';

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/login', async (req, res) => {
  const cedula = req.body.cedula;
  try {
    const doc = new GoogleSpreadsheet(SHEET_ID);
    await doc.useServiceAccountAuth({
    client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    });


    await doc.loadInfo();
    const sheet = doc.sheetsByIndex[0];
    const rows = await sheet.getRows();

    const match = rows.find(row => row["D.N.I"]?.toString() === cedula.toString());

    if (match) {
      res.json({ enlace: match.Drive || null }); // Accede al campo correcto (Drive)
    } else {
      res.json({ enlace: null });
    }
  } catch (err) {
    console.error('Error al buscar cédula:', err);
    res.status(500).json({ enlace: null });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
