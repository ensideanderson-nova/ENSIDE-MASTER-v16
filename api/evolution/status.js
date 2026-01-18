// API Evolution - Status da Instância
module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, apikey');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const status = {
      instance: process.env.EVOLUTION_INSTANCE || 'enside',
      state: 'open',
      status: 'connected',
      qrcode: null,
      timestamp: new Date().toISOString()
    };

    res.status(200).json(status);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
