const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.json());

const EVOLUTION_API_URL = process.env.EVOLUTION_API_URL;
const EVOLUTION_API_KEY = process.env.EVOLUTION_API_KEY;
const EVOLUTION_INSTANCE = process.env.EVOLUTION_INSTANCE;

app.get('/', (req, res) => {
  res.send('<h1>🤖 ENSIDE SYSTEM</h1><p>API: ' + EVOLUTION_API_URL + '</p><a href="/qrcode">Gerar QR Code</a>');
});

app.get('/qrcode', async (req, res) => {
  try {
    await axios.post(EVOLUTION_API_URL + '/instance/create', {instanceName: EVOLUTION_INSTANCE, qrcode: true}, {headers: {apikey: EVOLUTION_API_KEY}}).catch(() => {});
    const response = await axios.get(EVOLUTION_API_URL + '/instance/connect/' + EVOLUTION_INSTANCE, {headers: {apikey: EVOLUTION_API_KEY}});
    const qrBase64 = response.data.base64 || response.data.qrcode?.base64;
    if (qrBase64) {
      res.send('<h1>QR Code</h1><img src="' + qrBase64 + '" style="width:400px">');
    } else {
      res.send('QR Code não disponível');
    }
  } catch (error) {
    res.status(500).send('Erro: ' + error.message);
  }
});

app.post('/webhook', (req, res) => {
  console.log('Webhook:', req.body);
  res.json({success: true});
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Servidor rodando'));

module.exports = app;
