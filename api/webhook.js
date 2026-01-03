// API Webhook para Evolution API (WhatsApp)
// ENSIDE Sistema Integrado

export default function handler(req, res) {
  // Configurar CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // GET - Status do webhook
  if (req.method === 'GET') {
    return res.status(200).json({
      status: 'online',
      sistema: 'ENSIDE MASTER v19.0',
      webhook: 'Evolution API',
      timestamp: new Date().toISOString()
    });
  }

  // POST - Receber mensagens do WhatsApp
  if (req.method === 'POST') {
    try {
      const data = req.body;
      
      console.log('Webhook recebido:', JSON.stringify(data, null, 2));
      
      // Processar evento
      if (data.event === 'messages.upsert' || data.event === 'MESSAGES_UPSERT') {
        const message = data.data || data;
        console.log('Nova mensagem:', message);
        
        // Aqui você pode adicionar lógica para processar mensagens
        // Por exemplo: salvar no banco, responder automaticamente, etc.
      }
      
      if (data.event === 'connection.update' || data.event === 'CONNECTION_UPDATE') {
        console.log('Status conexão:', data.data || data);
      }
      
      return res.status(200).json({
        success: true,
        message: 'Webhook processado com sucesso',
        timestamp: new Date().toISOString()
      });
      
    } catch (error) {
      console.error('Erro no webhook:', error);
      return res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  // Método não permitido
  return res.status(405).json({ error: 'Method not allowed' });
}
