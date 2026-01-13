/**
 * API Backend para ESPECIALISTA-IA MASTER
 * Endpoints para integração Redis, Vercel e GitHub
 */

const express = require('express');
const redis = require('redis');
const router = express.Router();

// Cliente Redis
let redisClient;

async function conectarRedis() {
    if (!redisClient) {
        redisClient = redis.createClient({
            host: 'localhost',
            port: 6379
        });

        redisClient.on('error', (err) => {
            console.error('Redis Error:', err);
        });

        await redisClient.connect();
    }
    return redisClient;
}

// ==================== ENDPOINTS REDIS ====================

// Ping Redis
router.get('/redis/ping', async (req, res) => {
    try {
        const client = await conectarRedis();
        const pong = await client.ping();
        res.json({ sucesso: true, resposta: pong });
    } catch (error) {
        res.status(500).json({ sucesso: false, erro: error.message });
    }
});

// GET valor do Redis
router.post('/redis/get', async (req, res) => {
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

// SET valor no Redis
router.post('/redis/set', async (req, res) => {
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

// LPUSH (adicionar à lista)
router.post('/redis/lpush', async (req, res) => {
    try {
        const { key, value } = req.body;
        const client = await conectarRedis();
        const tamanho = await client.lPush(key, value);
        
        res.json({ sucesso: true, key, tamanho });
    } catch (error) {
        res.status(500).json({ sucesso: false, erro: error.message });
    }
});

// LRANGE (obter lista)
router.post('/redis/lrange', async (req, res) => {
    try {
        const { key, start = 0, stop = -1 } = req.body;
        const client = await conectarRedis();
        const lista = await client.lRange(key, start, stop);
        
        res.json({ sucesso: true, key, lista, tamanho: lista.length });
    } catch (error) {
        res.status(500).json({ sucesso: false, erro: error.message });
    }
});

// KEYS (buscar chaves)
router.post('/redis/keys', async (req, res) => {
    try {
        const { pattern = '*' } = req.body;
        const client = await conectarRedis();
        const chaves = await client.keys(pattern);
        
        res.json({ sucesso: true, pattern, chaves, total: chaves.length });
    } catch (error) {
        res.status(500).json({ sucesso: false, erro: error.message });
    }
});

// ==================== ENDPOINTS ESPECIALISTA-IA ====================

// Status do ESPECIALISTA-IA
router.get('/status', async (req, res) => {
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

// Listar aprendizados
router.get('/aprendizados', async (req, res) => {
    try {
        const { categoria, termo, limite = 100 } = req.query;
        const client = await conectarRedis();
        
        const aprendizadosStr = await client.get('enside:especialista_ia:aprendizados');
        let aprendizados = aprendizadosStr ? JSON.parse(aprendizadosStr) : [];
        
        // Filtrar por categoria
        if (categoria) {
            aprendizados = aprendizados.filter(a => 
                a.categoria && a.categoria.toLowerCase() === categoria.toLowerCase()
            );
        }
        
        // Buscar por termo
        if (termo) {
            aprendizados = aprendizados.filter(a =>
                a.titulo.toLowerCase().includes(termo.toLowerCase()) ||
                a.conteudo.toLowerCase().includes(termo.toLowerCase())
            );
        }
        
        // Limitar resultados
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

// Adicionar aprendizado
router.post('/aprender', async (req, res) => {
    try {
        const { titulo, conteudo, categoria = 'geral' } = req.body;
        
        if (!titulo || !conteudo) {
            return res.status(400).json({ 
                sucesso: false, 
                erro: 'Título e conteúdo são obrigatórios' 
            });
        }
        
        const client = await conectarRedis();
        
        // Carregar aprendizados existentes
        const aprendizadosStr = await client.get('enside:especialista_ia:aprendizados');
        const aprendizados = aprendizadosStr ? JSON.parse(aprendizadosStr) : [];
        
        // Criar novo aprendizado
        const novoAprendizado = {
            id: aprendizados.length + 1,
            titulo,
            conteudo,
            categoria,
            data: new Date().toISOString(),
            fonte: 'API Backend'
        };
        
        aprendizados.push(novoAprendizado);
        
        // Salvar de volta
        await client.set('enside:especialista_ia:aprendizados', JSON.stringify(aprendizados));
        await client.set('enside:especialista_ia:total_aprendizados', aprendizados.length.toString());
        
        res.json({
            sucesso: true,
            aprendizado: novoAprendizado,
            total: aprendizados.length
        });
    } catch (error) {
        res.status(500).json({ sucesso: false, erro: error.message });
    }
});

// Executar comando
router.post('/comando', async (req, res) => {
    try {
        const { comando, parametros = {} } = req.body;
        
        if (!comando) {
            return res.status(400).json({ 
                sucesso: false, 
                erro: 'Comando é obrigatório' 
            });
        }
        
        const client = await conectarRedis();
        
        // Registrar execução
        const execucao = {
            comando,
            parametros,
            timestamp: new Date().toISOString()
        };
        
        await client.lPush('enside:especialista_ia:execucoes', JSON.stringify(execucao));
        
        // Executar comando específico
        let resultado;
        switch (comando) {
            case 'status':
                const statusStr = await client.get('enside:especialista_ia:status');
                resultado = statusStr ? JSON.parse(statusStr) : null;
                break;
                
            case 'total':
                const totalStr = await client.get('enside:especialista_ia:total_aprendizados');
                resultado = { total: totalStr ? parseInt(totalStr) : 0 };
                break;
                
            default:
                resultado = { mensagem: 'Comando executado', comando, parametros };
        }
        
        res.json({
            sucesso: true,
            comando,
            resultado
        });
    } catch (error) {
        res.status(500).json({ sucesso: false, erro: error.message });
    }
});

// Sincronizar com Vercel
router.post('/sync', async (req, res) => {
    try {
        const { aprendizados, comandos, timestamp } = req.body;
        
        const client = await conectarRedis();
        
        // Salvar dados recebidos
        if (aprendizados) {
            await client.set('enside:especialista_ia:aprendizados', JSON.stringify(aprendizados));
            await client.set('enside:especialista_ia:total_aprendizados', aprendizados.length.toString());
        }
        
        if (comandos) {
            await client.set('enside:especialista_ia:comandos', JSON.stringify(comandos));
        }
        
        // Registrar sincronização
        const sync = {
            timestamp: timestamp || new Date().toISOString(),
            aprendizados: aprendizados ? aprendizados.length : 0,
            comandos: comandos ? comandos.length : 0
        };
        
        await client.set('enside:especialista_ia:ultima_sync', JSON.stringify(sync));
        
        res.json({
            sucesso: true,
            sincronizado: sync
        });
    } catch (error) {
        res.status(500).json({ sucesso: false, erro: error.message });
    }
});

// Backup
router.post('/backup', async (req, res) => {
    try {
        const client = await conectarRedis();
        
        // Coletar todos os dados
        const aprendizadosStr = await client.get('enside:especialista_ia:aprendizados');
        const comandosStr = await client.get('enside:especialista_ia:comandos');
        const statusStr = await client.get('enside:especialista_ia:status');
        
        const backup = {
            timestamp: new Date().toISOString(),
            aprendizados: aprendizadosStr ? JSON.parse(aprendizadosStr) : [],
            comandos: comandosStr ? JSON.parse(comandosStr) : [],
            status: statusStr ? JSON.parse(statusStr) : null
        };
        
        // Salvar backup
        const backupKey = `enside:especialista_ia:backup:${Date.now()}`;
        await client.set(backupKey, JSON.stringify(backup));
        
        res.json({
            sucesso: true,
            backup,
            chave: backupKey
        });
    } catch (error) {
        res.status(500).json({ sucesso: false, erro: error.message });
    }
});

// Health check
router.get('/health', (req, res) => {
    res.json({
        sucesso: true,
        servico: 'ESPECIALISTA-IA API',
        versao: '10.0',
        timestamp: new Date().toISOString()
    });
});

module.exports = router;
