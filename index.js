import express from 'express';
import axios from 'axios';

const app = express();
app.use(express.json());

const EVOLUTION_API_URL = process.env.EVOLUTION_API_URL || 'http://localhost:8080';
const EVOLUTION_API_KEY = process.env.EVOLUTION_API_KEY || 'B6D711FCDE4D4FD5936544120E713976';

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
    const response = await axios.get(EVOLUTION_API_URL, {
      headers: { 'apikey': EVOLUTION_API_KEY }
    });
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
        instanceName: "ENSIDE",
        integration: "WHATSAPP-BAILEYS",
        qrcode: true
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'apikey': EVOLUTION_API_KEY
        }
      }
    );
    
    const base64 = response.data.qrcode?.base64 || response.data.base64;
    
    res.send(`
      <html>
      <head><title>QR Code WhatsApp - ENSIDE</title></head>
      <body style="text-align:center;font-family:Arial;padding:50px;">
        <h1>📱 QR Code WhatsApp</h1>
        <p style="font-size:18px;">✅ Instância <strong>ENSIDE</strong> criada!</p>
        <p>Escaneie com seu WhatsApp:</p>
        ${base64 ? `<img src="${base64}" style="width:400px;border:2px solid #000;padding:10px;">` : '<p>❌ QR Code não gerado</p>'}
        <p style="margin-top:30px;color:green;">⏳ Aguardando conexão...</p>
        <pre style="text-align:left;background:#f5f5f5;padding:20px;overflow:auto;">${JSON.stringify(response.data, null, 2)}</pre>
        <p><a href="/" style="padding:10px 20px;background:#007bff;color:white;text-decoration:none;border-radius:5px;">← Voltar</a></p>
      </body>
      </html>
    `);
  } catch (error) {
    res.send(`
      <html>
      <body style="text-align:center;font-family:Arial;padding:50px;">
        <h1>❌ Erro</h1>
        <p>${error.message}</p>
        <pre style="text-align:left;background:#f5f5f5;padding:20px;">${JSON.stringify(error.response?.data || error, null, 2)}</pre>
        <p><a href="/" style="padding:10px 20px;background:#007bff;color:white;text-decoration:none;border-radius:5px;">← Voltar</a></p>
      </body>
      </html>
    `);
  }
});

export default app;
