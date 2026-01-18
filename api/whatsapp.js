// API Serverless para intermediar chamadas à Evolution API
export default async function handler(req, res) {
  // Configurar CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const { EVOLUTION_API_URL, EVOLUTION_API_KEY, EVOLUTION_INSTANCE } = process.env;
  
  if (req.method === 'POST') {
    const { action, data } = req.body;
    
    try {
      let endpoint = '';
      let method = 'POST';
      
      switch(action) {
        case 'sendText':
          endpoint = `/message/sendText/${EVOLUTION_INSTANCE}`;
          break;
        case 'sendMedia':
          endpoint = `/message/sendMedia/${EVOLUTION_INSTANCE}`;
          break;
        case 'getChats':
          endpoint = `/chat/findChats/${EVOLUTION_INSTANCE}`;
          method = 'GET';
          break;
        case 'getStatus':
          endpoint = `/instance/connectionState/${EVOLUTION_INSTANCE}`;
          method = 'GET';
          break;
        case 'getQRCode':
          endpoint = `/instance/connect/${EVOLUTION_INSTANCE}`;
          method = 'GET';
          break;
        default:
          return res.status(400).json({ error: 'Ação inválida' });
      }
      
      const fetchOptions = {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'apikey': EVOLUTION_API_KEY
        }
      };
      
      if (method === 'POST' && data) {
        fetchOptions.body = JSON.stringify(data);
      }
      
      const response = await fetch(`${EVOLUTION_API_URL}${endpoint}`, fetchOptions);
      
      const result = await response.json();
      return res.status(response.status).json(result);
      
    } catch (error) {
      console.error('Erro na API:', error);
      return res.status(500).json({ error: error.message });
    }
  }
  
  if (req.method === 'GET') {
    return res.status(200).json({ 
      status: 'API WhatsApp funcionando',
      evolution_url: process.env.EVOLUTION_API_URL,
      instance: process.env.EVOLUTION_INSTANCE
    });
  }
  
  return res.status(405).json({ error: 'Método não permitido' });
}
