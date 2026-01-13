/**
 * 🤖 SERVIDOR ESPECIALISTA-IA MASTER
 * Servidor Node.js completo com Redis, Express e CORS
 */

const express = require('express');
const cors = require('cors');
const redis = require('redis');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Cliente Redis
let redisClient;

async function conectarRedis() {
    if (!redisClient) {
        redisClient = redis.createClient({
            socket: {
                host: 'localhost',
                port: 6379
            }
        });

        redisClient.on('error', (err) => {
            console.error('❌ Redis Error:', err);
        });

        redisClient.on('connect', () => {
            console.log('✅ Redis conectado');
        });

        await redisClient.connect();
    }
    return redisClient;
}

// ==================== ROTAS REDIS ====================

app.get('/redis/ping', async (req, res) => {
    try {
        const client = await conectarRedis();
        const pong = await client.ping();
        res.json({ sucesso: true, resposta: pong });
    } catch (error) {
        res.status(500).json({ sucesso: false, erro: error.message });
    }
});

app.post('/redis/get', async (req, res) => {
    try {
        const { key } = req.body;
        const client = await conectarRedis();
        const valor = await client.get(key);
        
        res.json({ 
            sucesso: true, 
            key, 
            valor,
            existe: valor !== null 
        });
    } catch (error) {
        res.status(500).json({ sucesso: false, erro: error.message });
    }
});

app.post('/redis/set', async (req, res) => {
    try {
        const { key, value, expireSeconds } = req.body;
        const client = await conectarRedis();
        
        if (expireSeconds) {
            await client.setEx(key, expireSeconds, value);
        } else {
            await client.set(key, value);
        }
        
        res.json({ sucesso: true, key, salvo: true });
    } catch (error) {
        res.status(500).json({ sucesso: false, erro: error.message });
    }
});

app.post('/redis/keys', async (req, res) => {
    try {
        const { pattern = '*' } = req.body;
        const client = await conectarRedis();
        const chaves = await client.keys(pattern);
        
        res.json({ sucesso: true, pattern, chaves, total: chaves.length });
    } catch (error) {
        res.status(500).json({ sucesso: false, erro: error.message });
    }
});

// ==================== ROTAS ESPECIALISTA-IA ====================

app.get('/api/especialista/status', async (req, res) => {
    try {
        const client = await conectarRedis();
        const statusStr = await client.get('enside:especialista_ia:status');
        const totalStr = await client.get('enside:especialista_ia:total_aprendizados');
        
        const status = statusStr ? JSON.parse(statusStr) : null;
        const total = totalStr ? parseInt(totalStr) : 0;
        
        res.json({
            sucesso: true,
            status,
            totalAprendizados: total,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({ sucesso: false, erro: error.message });
    }
});

app.get('/api/especialista/aprendizados', async (req, res) => {
    try {
        const { categoria, termo, limite = 100 } = req.query;
        const client = await conectarRedis();
        
        const aprendizadosStr = await client.get('enside:especialista_ia:aprendizados');
        let aprendizados = aprendizadosStr ? JSON.parse(aprendizadosStr) : [];
        
        if (categoria) {
            aprendizados = aprendizados.filter(a => 
                a.categoria && a.categoria.toLowerCase() === categoria.toLowerCase()
            );
        }
        
        if (termo) {
            aprendizados = aprendizados.filter(a =>
                a.titulo.toLowerCase().includes(termo.toLowerCase()) ||
                a.conteudo.toLowerCase().includes(termo.toLowerCase())
            );
        }
        
        aprendizados = aprendizados.slice(0, parseInt(limite));
        
        res.json({
            sucesso: true,
            aprendizados,
            total: aprendizados.length
        });
    } catch (error) {
        res.status(500).json({ sucesso: false, erro: error.message });
    }
});

app.post('/api/especialista/aprender', async (req, res) => {
    try {
        const { titulo, conteudo, categoria = 'geral' } = req.body;
        
        if (!titulo || !conteudo) {
            return res.status(400).json({ 
                sucesso: false, 
                erro: 'Título e conteúdo são obrigatórios' 
            });
        }
        
        const client = await conectarRedis();
        
        const aprendizadosStr = await client.get('enside:especialista_ia:aprendizados');
        const aprendizados = aprendizadosStr ? JSON.parse(aprendizadosStr) : [];
        
        const novoAprendizado = {
            id: aprendizados.length + 1,
            titulo,
            conteudo,
            categoria,
            data: new Date().toISOString(),
            fonte: 'API Backend'
        };
        
        aprendizados.push(novoAprendizado);
        
        await client.set('enside:especialista_ia:aprendizados', JSON.stringify(aprendizados));
        await client.set('enside:especialista_ia:total_aprendizados', aprendizados.length.toString());
        
        console.log(`✅ Novo aprendizado: ${titulo}`);
        
        res.json({
            sucesso: true,
            aprendizado: novoAprendizado,
            total: aprendizados.length
        });
    } catch (error) {
        res.status(500).json({ sucesso: false, erro: error.message });
    }
});

app.post('/api/especialista/sync', async (req, res) => {
    try {
        const { aprendizados, comandos, timestamp } = req.body;
        
        const client = await conectarRedis();
        
        if (aprendizados) {
            await client.set('enside:especialista_ia:aprendizados', JSON.stringify(aprendizados));
            await client.set('enside:especialista_ia:total_aprendizados', aprendizados.length.toString());
        }
        
        if (comandos) {
            await client.set('enside:especialista_ia:comandos', JSON.stringify(comandos));
        }
        
        const sync = {
            timestamp: timestamp || new Date().toISOString(),
            aprendizados: aprendizados ? aprendizados.length : 0,
            comandos: comandos ? comandos.length : 0
        };
        
        await client.set('enside:especialista_ia:ultima_sync', JSON.stringify(sync));
        
        console.log('🔄 Sincronização realizada:', sync);
        
        res.json({
            sucesso: true,
            sincronizado: sync
        });
    } catch (error) {
        res.status(500).json({ sucesso: false, erro: error.message });
    }
});

app.get('/api/health', (req, res) => {
    res.json({
        sucesso: true,
        servico: 'ESPECIALISTA-IA MASTER API',
        versao: '10.0',
        timestamp: new Date().toISOString()
    });
});

// ==================== INICIALIZAÇÃO ====================

async function iniciar() {
    try {
        // Conectar Redis
        await conectarRedis();
        
        // Iniciar servidor
        app.listen(PORT, () => {
            console.log('');
            console.log('╔══════════════════════════════════════════════════════════════╗');
            console.log('║      🤖 ESPECIALISTA-IA MASTER - SERVIDOR INICIADO          ║');
            console.log('╠══════════════════════════════════════════════════════════════╣');
            console.log(`║ Porta: ${PORT}`);
            console.log(`║ URL: http://localhost:${PORT}`);
            console.log('║ Redis: ✅ Conectado');
            console.log('╠══════════════════════════════════════════════════════════════╣');
            console.log('║ ENDPOINTS DISPONÍVEIS:');
            console.log('║ • GET  /api/health');
            console.log('║ • GET  /api/especialista/status');
            console.log('║ • GET  /api/especialista/aprendizados');
            console.log('║ • POST /api/especialista/aprender');
            console.log('║ • POST /api/especialista/sync');
            console.log('║ • GET  /redis/ping');
            console.log('║ • POST /redis/get');
            console.log('║ • POST /redis/set');
            console.log('╚══════════════════════════════════════════════════════════════╝');
            console.log('');
        });
        
    } catch (error) {
        console.error('❌ Erro ao iniciar servidor:', error);
        process.exit(1);
    }
}

// Tratamento de erros
process.on('SIGINT', async () => {
    console.log('\n⏸️  Encerrando servidor...');
    if (redisClient) {
        await redisClient.quit();
    }
    process.exit(0);
});

// Iniciar
iniciar();
