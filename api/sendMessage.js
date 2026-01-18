// API Evolution - Enviar Mensagem
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, apikey');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { number, message } = req.body;

    if (!number || !message) {
      return res.status(400).json({ error: 'Number and message are required' });
    }

    // Simular envio bem-sucedido
    const response = {
      success: true,
      messageId: `msg_${Date.now()}`,
      number: number,
      timestamp: new Date().toISOString()
    };

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
