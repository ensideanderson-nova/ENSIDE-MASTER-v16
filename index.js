import express from 'express';
import axios from 'axios';

const app = express();
app.use(express.json());

const EVOLUTION_API_URL = process.env.EVOLUTION_API_URL || 'http://localhost:8080';
const EVOLUTION_API_KEY = process.env.EVOLUTION_API_KEY || 'B6D711FCDE4D4FD5936544120E713976';
const EVOLUTION_INSTANCE = 'ENSIDE';

app.get('/', (req, res) => {
  res.send(`
    <h1>🤖 ENSIDE SYSTEM</h1>
    <p>✅ Status: Online</p>
    <p>🔗 API: ${EVOLUTION_API_URL}</p>
    <p><a href="/qrcode" style="padding:10px;background:green;color:white;text-decoration:none;border-radius:5px">📱 Gerar QR Code</a></p>
    <p><a href="/status">📊 Status da API</a></p>
  `);
});

app.get('/status', async (req, res) => {
  try {
    const response = await axios.get(EVOLUTION_API_URL);
    res.json({success: true, data: response.data});
  } catch (error) {
    res.json({success: false, error: error.message});
  }
});

app.get('/qrcode', async (req, res) => {
  try {
    const response = await axios.post(
      `${EVOLUTION_API_URL}/instance/create`,
      {
        instanceName: EVOLUTION_INSTANCE,
        qrcode: true,
        number: "",
        integration: "WHATSAPP-BAILEYS"
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'apikey': EVOLUTION_API_KEY
        }
      }
    );
    
    const qrCodeData = response.data.qrcode?.base64 || response.data.base64 || response.data.qrcode?.code;
    
    res.send(`
      <h1>📱 QR Code WhatsApp</h1>
      <p>Escaneie com o WhatsApp:</p>
      ${qrCodeData ? `<img src="${qrCodeData.includes('data:image') ? qrCodeData : 'data:image/png;base64,' + qrCodeData}" style="width:400px"/>` : '<p>QR Code gerado! Verifique os logs.</p>'}
      <pre>${JSON.stringify(response.data, null, 2)}</pre>
      <p><a href="/">← Voltar</a></p>
    `);
  } catch (error) {
    res.send(`
      <h1>❌ Erro</h1>
      <p>${error.message}</p>
      <pre>${JSON.stringify(error.response?.data, null, 2)}</pre>
      <p><a href="/">← Voltar</a></p>
    `);
  }
});

export default app;
