export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const url = 'https://evolution-api-latest-poc1.onrender.com';
  const key = '23D116F5-A4D3-404F-8D38-66EBF544A44A';
  const instance = 'enside';

  const { action, data } = req.body;

  try {
    let endpoint = '';
    
    if (action === 'sendText') {
      endpoint = `/message/sendText/${instance}`;
    } else if (action === 'getChats') {
      endpoint = `/chat/findChats/${instance}`;
    } else {
      return res.status(400).json({ error: 'A\u00e7\u00e3o inv\u00e1lida' });
    }

    const response = await fetch(`${url}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': key
      },
      body: JSON.stringify(data)
    });

    const result = await response.json();
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
