import express from 'express';
import axios from 'axios';
import path from 'path';
import { fileURLToPath } from 'url';

import aprendizadosRoutes from './routes/aprendizados.js';
import chatRoutes from './routes/chat.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

// ===== IMPORTANTE: Servir HTMLs ANTES de outras rotas =====
app.use(express.static(path.join(__dirname, 'public')));

// Rotas explícitas para HTMLs principais
app.get('/index-v19-funcional.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index-v19-funcional.html'));
});

app.get('/v19', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index-v19-funcional.html'));
});

app.get('/enside-master-v21.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'enside-master-v21.html'));
});

app.get('/ENSIDE_MASTER_v19.0_INTEGRADO.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'ENSIDE_MASTER_v19.0_INTEGRADO.html'));
});

app.get('/control-center-v21.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'control-center-v21.html'));
});

app.get('/index-hub.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index-hub.html'));
});

app.get('/api-status.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'api-status.html'));
});

app.get('/evolution-manager.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'evolution-manager.html'));
});

app.get('/evolution-manager', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'evolution-manager.html'));
});

app.get('/index.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Rota raiz retorna index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ===== API ROUTES =====

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/status', (req, res) => {
  res.json({
    status: 'operational',
    service: 'ENSIDE Sistema Unificado',
    version: '19.0',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// ===== EVOLUTION API PROXY =====
const EVOLUTION_API_URL = process.env.EVOLUTION_API_URL || 'https://evolution-api-enside.onrender.com';
const EVOLUTION_API_KEY = process.env.EVOLUTION_API_KEY || '919AA333-AE59-4B06-B1EF-C9A9F9C8C0F6';
const EVOLUTION_INSTANCE = process.env.EVOLUTION_INSTANCE || 'enside';

// Proxy para Evolution API
app.post('/api/evolution/*', async (req, res) => {
  try {
    const path = req.params[0];
    const url = `${EVOLUTION_API_URL}/${path}`;
    
    const response = await axios({
      method: req.method,
      url: url,
      headers: {
        'Authorization': `Bearer ${EVOLUTION_API_KEY}`,
        'Content-Type': 'application/json'
      },
      data: req.body
    });

    res.json(response.data);
  } catch (error) {
    res.status(500).json({
      error: 'Evolution API error',
      message: error.message
    });
  }
});

// ===== ESPECIALISTA-IA ROUTES =====
// 🤖 Registrar rotas de aprendizados
aprendizadosRoutes(app);

// 🧠 Registrar rotas de chat/IA
chatRoutes(app);

// 404 Handler - deve estar no final
app.use((req, res) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.path,
    method: req.method
  });
});

// Vercel serverless function handler
export default app;

// Para desenvolvimento local
if (import.meta.url === `file://${process.argv[1]}`) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}
