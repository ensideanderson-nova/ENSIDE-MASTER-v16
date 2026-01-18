export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const url = 'https://evolution-api-latest-poc1.onrender.com';
  const key = '23D116F5-A4D3-404F-8D38-66EBF544A44A';
  const instance = 'enside';

  try {
    const response = await fetch(`${url}/instance/connectionState/${instance}`, {
      headers: { 'apikey': key }
    });

    const data = await response.json();
    
    return res.status(200).json({
      success: true,
      connected: data.state === 'open',
      state: data.state,
      instance: instance
    });
  } catch (error) {
    return res.status(200).json({
      success: false,
      error: error.message
    });
  }
}
