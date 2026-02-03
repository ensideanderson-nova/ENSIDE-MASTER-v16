// API Evolution - Status da Instância
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, apikey');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const evolutionUrl = process.env.EVOLUTION_API_URL || 'https://evolution-api-latest-poc1.onrender.com';
    const apiKey = process.env.EVOLUTION_API_KEY || 'evolution-api-enside-2024-secret';
    const instance = process.env.EVOLUTION_INSTANCE || 'ENSIDE';

    const response = await fetch(`${evolutionUrl}/instance/connectionState/${instance}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'apikey': apiKey
      }
    });

    if (!response.ok) {
      throw new Error(`Evolution API error: ${response.status}`);
    }

    const data = await response.json();
    res.status(200).json({
      success: true,
      data,
      config: {
        url: evolutionUrl,
        instance
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: error.message,
      details: 'Erro ao conectar com Evolution API'
    });
  }
}
