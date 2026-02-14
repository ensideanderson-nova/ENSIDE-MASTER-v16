// 🤖 API de Aprendizados ESPECIALISTA-IA
// Arquivo: routes/aprendizados.js

module.exports = (app, redis) => {
  const REDIS_HOST = process.env.REDIS_HOST || 'localhost';
  const REDIS_PORT = process.env.REDIS_PORT || 6379;

  // GET /api/aprendizados - Listar aprendizados com paginação
  app.get('/api/aprendizados', (req, res) => {
    try {
      const { skip = 0, limit = 50, search = '' } = req.query;
      const client = redis.createClient({ host: REDIS_HOST, port: REDIS_PORT });
      
      client.keys('especialista_ia:aprendizado:*', (err, keys) => {
        if (err) {
          return res.json({ aprendizados: [], total: 0, erro: 'Redis desconectado' });
        }
        
        let aprendizados = [];
        let processados = 0;
        
        if (keys.length === 0) {
          return res.json({ 
            aprendizados: [], 
            total: 0,
            skip: parseInt(skip),
            limit: parseInt(limit)
          });
        }
        
        keys.forEach(key => {
          client.get(key, (err, data) => {
            if (data) {
              try {
                const apr = JSON.parse(data);
                // Filtrar por search se fornecido
                if (!search || 
                    apr.conteudo?.toLowerCase().includes(search.toLowerCase()) ||
                    apr.fonte?.toLowerCase().includes(search.toLowerCase()) ||
                    apr.tipo?.toLowerCase().includes(search.toLowerCase())) {
                  aprendizados.push({
                    id: apr.id,
                    tipo: apr.tipo,
                    fonte: apr.fonte?.substring(0, 150) || 'N/A',
                    data: apr.data,
                    preview: apr.conteudo?.substring(0, 300) || ''
                  });
                }
              } catch(e) {}
            }
            
            processados++;
            if (processados === keys.length) {
              aprendizados.sort((a, b) => b.id - a.id);
              const start = parseInt(skip);
              const lim = parseInt(limit);
              const paginado = aprendizados.slice(start, start + lim);
              
              res.json({
                aprendizados: paginado,
                total: aprendizados.length,
                skip: start,
                limit: lim,
                paginas: Math.ceil(aprendizados.length / lim)
              });
              client.quit();
            }
          });
        });
      });
    } catch(err) {
      res.json({ aprendizados: [], erro: err.message });
    }
  });

  // GET /api/aprendizados/:id - Detalhes de um aprendizado específico
  app.get('/api/aprendizados/:id', (req, res) => {
    try {
      const client = redis.createClient({ host: REDIS_HOST, port: REDIS_PORT });
      client.get(`especialista_ia:aprendizado:${req.params.id}`, (err, data) => {
        if (err || !data) {
          return res.json({ erro: 'Aprendizado não encontrado', id: req.params.id });
        }
        try {
          res.json(JSON.parse(data));
        } catch(e) {
          res.json({ erro: 'Erro ao parsear aprendizado', id: req.params.id });
        }
        client.quit();
      });
    } catch(err) {
      res.json({ erro: err.message });
    }
  });

  // GET /api/aprendizados/stats/info - Estatísticas de aprendizados
  app.get('/api/aprendizados/stats/info', (req, res) => {
    try {
      const client = redis.createClient({ host: REDIS_HOST, port: REDIS_PORT });
      client.keys('especialista_ia:aprendizado:*', (err, keys) => {
        if (err) {
          return res.json({ total: 0, tipos: {}, fontes: {} });
        }
        
        const stats = { 
          total: keys.length, 
          tipos: {}, 
          fontes: {},
          datas: {} 
        };
        let processados = 0;
        
        if (keys.length === 0) {
          return res.json(stats);
        }
        
        keys.forEach(key => {
          client.get(key, (err, data) => {
            if (data) {
              try {
                const apr = JSON.parse(data);
                stats.tipos[apr.tipo] = (stats.tipos[apr.tipo] || 0) + 1;
                const fonte = apr.fonte?.split('/').pop() || 'unknown';
                stats.fontes[fonte] = (stats.fontes[fonte] || 0) + 1;
                const data_parte = apr.data?.substring(0, 10) || 'unknown';
                stats.datas[data_parte] = (stats.datas[data_parte] || 0) + 1;
              } catch(e) {}
            }
            
            processados++;
            if (processados === keys.length) {
              res.json(stats);
              client.quit();
            }
          });
        });
      });
    } catch(err) {
      res.json({ erro: err.message });
    }
  });

  // GET /api/aprendizados/tipos/lista - Listar tipos de aprendizados
  app.get('/api/aprendizados/tipos/lista', (req, res) => {
    try {
      const client = redis.createClient({ host: REDIS_HOST, port: REDIS_PORT });
      client.keys('especialista_ia:aprendizado:*', (err, keys) => {
        if (err) return res.json({ tipos: {} });
        
        const tipos = {};
        let processados = 0;
        
        if (keys.length === 0) return res.json({ tipos: {} });
        
        keys.forEach(key => {
          client.get(key, (err, data) => {
            if (data) {
              try {
                const apr = JSON.parse(data);
                if (!tipos[apr.tipo]) {
                  tipos[apr.tipo] = [];
                }
                tipos[apr.tipo].push(apr.id);
              } catch(e) {}
            }
            
            processados++;
            if (processados === keys.length) {
              res.json({ tipos });
              client.quit();
            }
          });
        });
      });
    } catch(err) {
      res.json({ erro: err.message });
    }
  });
};
