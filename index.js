import express from 'express';
import axios from 'axios';

const app = express();

app.use(express.json());

const EVOLUTION_API_URL = process.env.EVOLUTION_API_URL || 'https://example.com';
const EVOLUTION_API_KEY = process.env.EVOLUTION_API_KEY || 'NO_KEY';
const EVOLUTION_INSTANCE = process.env.EVOLUTION_INSTANCE || 'ENSIDE';

app.get('/', (req, res) => {
  res.send(`
    <h1>🤖 ENSIDE SYSTEM</h1>
    <p>Status: ✅ Online</p>
    <p>API: ${EVOLUTION_API_URL}</p>
    <p><a href="/qrcode">🔗 Gerar QR Code</a></p>
    <p><a href="/status">📊 Status da API</a></p>
  `);
});

app.get('/status', async (req, res) => {
  try {
    const response = await axios.get(EVOLUTION_API_URL, {timeout: 5000});
    res.json({status: 'online', url: EVOLUTION_API_URL});
  } catch (error) {
    res.json({
      status: 'offline', 
      url: EVOLUTION_API_URL,
      error: error.message,
      message: '⚠️ Configure uma Evolution API válida'
    });
  }
});

app.get('/qrcode', async (req, res) => {
  try {
    const testUrls = [
      EVOLUTION_API_URL + '/instance/connect/' + EVOLUTION_INSTANCE,
      EVOLUTION_API_URL + '/manager/qrcode/' + EVOLUTION_INSTANCE
    ];
    
    res.send(`
      <h1>📱 QR Code</h1>
      <p>⚠️ API Evolution não configurada</p>
      <p>Testando: ${EVOLUTION_API_URL}</p>
      <p><a href="/">← Voltar</a></p>
    `);
  } catch (error) {
    res.status(500).send('Erro: ' + error.message);
  }
});

app.post('/webhook', (req, res) => {
  console.log('Webhook:', req.body);
  res.json({success: true});
});

export default app;
