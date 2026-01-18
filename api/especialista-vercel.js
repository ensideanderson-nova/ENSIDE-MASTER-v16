// API ESPECIALISTA-IA para Vercel Serverless Functions
// ENSIDE Sistema Integrado v19.0
// Otimizado para timeout de 10s do plano gratuito

export const config = {
  maxDuration: 10 // Máximo 10 segundos no plano gratuito
};

export default async function handler(req, res) {
  // Configurar CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const startTime = Date.now();
  const timeout = 9000; // 9s para ficar dentro do limite

  try {
    // GET - Status e Health Check
    if (req.method === 'GET') {
      const { action } = req.query;
      
      switch (action) {
        case 'health':
          return res.status(200).json({
            sucesso: true,
            servico: 'ESPECIALISTA-IA API',
            versao: '19.0',
            ambiente: process.env.VERCEL ? 'vercel' : 'local',
            timestamp: new Date().toISOString()
          });
          
        case 'status':
          return res.status(200).json({
            sucesso: true,
            status: 'online',
            sistema: 'ENSIDE MASTER v19.0',
            modulos: ['especialista-ia', 'webhook', 'sync'],
            timestamp: new Date().toISOString()
          });
          
        default:
          return res.status(200).json({
            sucesso: true,
            mensagem: 'ESPECIALISTA-IA API v19.0',
            endpoints: {
              'GET ?action=health': 'Health check',
              'GET ?action=status': 'Status do sistema',
              'POST': 'Executar comando'
            },
            timestamp: new Date().toISOString()
          });
      }
    }

    // POST - Executar comandos
    if (req.method === 'POST') {
      const { comando, dados } = req.body || {};
      
      if (!comando) {
        return res.status(400).json({
          sucesso: false,
          erro: 'Comando é obrigatório'
        });
      }

      // Verificar timeout antes de processar
      if (Date.now() - startTime > timeout) {
        return res.status(408).json({
          sucesso: false,
          erro: 'Timeout - operação muito longa'
        });
      }

      let resultado;
      
      switch (comando) {
        case 'aprender':
          resultado = {
            sucesso: true,
            mensagem: 'Aprendizado registrado',
            dados: dados,
            timestamp: new Date().toISOString()
          };
          break;
          
        case 'consultar':
          resultado = {
            sucesso: true,
            mensagem: 'Consulta realizada',
            dados: dados,
            timestamp: new Date().toISOString()
          };
          break;
          
        case 'sync':
          resultado = {
            sucesso: true,
            mensagem: 'Sincronização iniciada',
            timestamp: new Date().toISOString()
          };
          break;
          
        default:
          resultado = {
            sucesso: true,
            comando: comando,
            dados: dados,
            mensagem: 'Comando processado',
            timestamp: new Date().toISOString()
          };
      }

      return res.status(200).json(resultado);
    }

    // Método não permitido
    return res.status(405).json({ 
      sucesso: false,
      erro: 'Método não permitido' 
    });

  } catch (error) {
    console.error('Erro na API:', error);
    return res.status(500).json({
      sucesso: false,
      erro: error.message,
      timestamp: new Date().toISOString()
    });
  }
}
