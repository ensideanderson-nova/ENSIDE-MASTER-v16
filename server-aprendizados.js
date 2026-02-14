// 🤖 Server de Teste - ESPECIALISTA-IA Aprendizados
import express from 'express';
import redis from 'redis';
import aprendizadosRoutes from './routes/aprendizados.js';

const app = express();
app.use(express.json());

// Integrar rotas de aprendizados
aprendizadosRoutes(app, redis);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Iniciar servidor
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🤖 ESPECIALISTA-IA API Server rodando em http://localhost:${PORT}`);
  console.log(`📚 Endpoints disponíveis:`);
  console.log(`   GET /api/aprendizados?limit=50&skip=0`);
  console.log(`   GET /api/aprendizados/:id`);
  console.log(`   GET /api/aprendizados/stats/info`);
  console.log(`   GET /api/aprendizados/tipos/lista`);
  console.log(`   GET /health`);
});
