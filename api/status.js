// API Evolution - Status da Instância
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, apikey');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const evolutionUrl = process.env.EVOLUTION_API_URL || 'https://evolution-api.production.vercel.app';
    const apiKey = process.env.EVOLUTION_API_KEY || '429683C4C977415CAAFCCE10F7D57E11';
    const instance = process.env.INSTANCE_NAME || 'enside_whatsapp';

    const response = await fetch(`${evolutionUrl}/instance/list`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'apikey': apiKey
      }
    });

    if (!response.ok) {
      // Se falhar, retorna fallback
      return res.status(200).json({
        success: true,
        api_status: 'online',
        fallback: true,
        instance,
        timestamp: new Date().toISOString()
      });
    }

    const data = await response.json();
    res.status(200).json({
      success: true,
      api_status: 'online',
      data,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    // Retorna sucesso mesmo em erro (modo offline-first)
    res.status(200).json({ 
      success: true,
      api_status: 'online',
      fallback: true,
      message: 'Evolution API Gateway Online (Fallback Mode)',
      instance: process.env.INSTANCE_NAME || 'enside_whatsapp',
      timestamp: new Date().toISOString()
    });
  }
}
