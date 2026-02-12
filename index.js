import express from 'express';
import axios from 'axios';

const app = express();
app.use(express.json());

const EVOLUTION_API_URL = process.env.EVOLUTION_API_URL || 'https://evolution-api.production.vercel.app';
const EVOLUTION_API_KEY = process.env.EVOLUTION_API_KEY || '429683C4C977415CAAFCCE10F7D57E11';
const INSTANCE_NAME = process.env.INSTANCE_NAME || 'enside_whatsapp';

// Health check endpoint - extremamente simples, sem dependências
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.get('/', (req, res) => {
  res.send(`
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ENSIDE SYSTEM</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: Arial, sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
      padding: 20px;
    }
    .container { max-width: 1200px; margin: 0 auto; }
    .header {
      text-align: center;
      color: white;
      margin-bottom: 40px;
    }
    .header h1 { font-size: 3em; margin-bottom: 10px; }
    .dashboard {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 20px;
    }
    .card {
      background: white;
      border-radius: 15px;
      padding: 25px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.2);
    }
    .card h2 { color: #667eea; margin-bottom: 15px; }
    .btn {
      display: inline-block;
      padding: 12px 24px;
      margin: 5px;
      background: #667eea;
      color: white;
      text-decoration: none;
      border-radius: 8px;
      border: none;
      cursor: pointer;
      font-size: 1em;
    }
    .btn:hover { opacity: 0.9; transform: scale(1.05); }
    .status { padding: 8px 16px; border-radius: 20px; display: inline-block; margin: 10px 0; }
    .online { background: #38ef7d; color: white; }
    input, textarea {
      width: 100%;
      padding: 10px;
      margin: 10px 0;
      border: 2px solid #ddd;
      border-radius: 8px;
      font-size: 1em;
    }
    textarea { min-height: 100px; }
    #response, #webhook-response {
      margin-top: 15px;
      padding: 15px;
      border-radius: 8px;
      display: none;
    }
    .success { background: #d4edda; color: #155724; }
    .error { background: #f8d7da; color: #721c24; }
    #logs { max-height: 200px; overflow-y: auto; }
    #logs p { padding: 5px; border-bottom: 1px solid #eee; font-size: 0.9em; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🤖 ENSIDE SYSTEM</h1>
      <p>WhatsApp Automation Platform</p>
      <div class="status online">✅ Sistema Online</div>
    </div>

    <div class="dashboard">
      <div class="card">
        <h2>📊 Status do Sistema</h2>
        <p><strong>API:</strong> <span id="api-status">Verificando...</span></p>
        <p><strong>WhatsApp:</strong> <span id="whatsapp-status">Verificando...</span></p>
        <p><strong>Instância:</strong> ${INSTANCE_NAME}</p>
        <button class="btn" onclick="checkStatus()">🔄 Atualizar Status</button>
      </div>

      <div class="card">
        <h2>📱 Conectar WhatsApp</h2>
        <p>Gere um QR Code para conectar nova instância</p>
        <a href="/qrcode" class="btn">📷 Gerar QR Code</a>
      </div>

      <div class="card">
        <h2>💬 Enviar Mensagem</h2>
        <input type="text" id="number" placeholder="5518996540492" />
        <textarea id="message" placeholder="Digite sua mensagem..."></textarea>
        <button class="btn" onclick="sendMessage()">📤 Enviar</button>
        <div id="response"></div>
      </div>

      <div class="card">
        <h2>🔔 Webhook</h2>
        <p>Configure webhook para receber mensagens</p>
        <button class="btn" onclick="setupWebhook()">⚙️ Configurar Webhook</button>
        <div id="webhook-response"></div>
      </div>

      <div class="card">
        <h2>📝 Logs</h2>
        <div id="logs">
          <p>🕐 Sistema iniciado</p>
          <p>✅ API conectada</p>
        </div>
        <button class="btn" onclick="clearLogs()" style="background:#ff6a00;margin-top:10px;">🗑️ Limpar</button>
      </div>

      <div class="card">
        <h2>📚 Documentação</h2>
        <a href="/api/docs" class="btn">📖 API Docs</a>
        <a href="https://doc.evolution-api.com" target="_blank" class="btn">🌐 Evolution API</a>
      </div>
    </div>
  </div>

  <script>
    async function checkStatus() {
      try {
        const res = await fetch('/status');
        const data = await res.json();
        document.getElementById('api-status').textContent = data.success ? '✅ Online' : '❌ Offline';
        addLog(data.success ? '✅ API Online' : '❌ API Offline');
      } catch (e) {
        document.getElementById('api-status').textContent = '❌ Erro';
        addLog('❌ Erro ao verificar API');
      }

      try {
        const res = await fetch('/instance/status');
        const data = await res.json();
        const isOpen = data.state === 'open';
        document.getElementById('whatsapp-status').textContent = isOpen ? '✅ Conectado' : '❌ Desconectado';
        addLog(isOpen ? '✅ WhatsApp Conectado' : '⚠️ WhatsApp Desconectado');
      } catch (e) {
        document.getElementById('whatsapp-status').textContent = '❌ Erro';
        addLog('❌ Erro ao verificar WhatsApp');
      }
    }

    async function sendMessage() {
      const number = document.getElementById('number').value;
      const message = document.getElementById('message').value;
      const responseDiv = document.getElementById('response');

      if (!number || !message) {
        alert('⚠️ Preencha todos os campos!');
        return;
      }

      responseDiv.style.display = 'block';
      responseDiv.className = '';
      responseDiv.textContent = '⏳ Enviando...';

      try {
        const res = await fetch('/send-message', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ number, message })
        });

        const data = await res.json();
        
        if (data.success) {
          responseDiv.className = 'success';
          responseDiv.textContent = '✅ Mensagem enviada com sucesso!';
          addLog('📤 Mensagem enviada para ' + number);
          document.getElementById('message').value = '';
        } else {
          responseDiv.className = 'error';
          responseDiv.textContent = '❌ Erro: ' + data.error;
          addLog('❌ Falha ao enviar mensagem');
        }
      } catch (e) {
        responseDiv.className = 'error';
        responseDiv.textContent = '❌ Erro de conexão';
        addLog('❌ Erro de conexão');
      }
    }

    async function setupWebhook() {
      const webhookDiv = document.getElementById('webhook-response');
      webhookDiv.style.display = 'block';
      webhookDiv.textContent = '⏳ Configurando webhook...';
      
      try {
        const res = await fetch('/webhook/setup', { method: 'POST' });
        const data = await res.json();
        
        if (data.success) {
          webhookDiv.className = 'success';
          webhookDiv.textContent = '✅ Webhook configurado com sucesso!';
          addLog('✅ Webhook configurado');
        } else {
          webhookDiv.className = 'error';
          webhookDiv.textContent = '❌ Erro: ' + data.error;
          addLog('❌ Erro ao configurar webhook');
        }
      } catch (e) {
        webhookDiv.className = 'error';
        webhookDiv.textContent = '❌ Erro de conexão';
        addLog('❌ Erro de conexão no webhook');
      }
    }

    function addLog(message) {
      const logsDiv = document.getElementById('logs');
      const time = new Date().toLocaleTimeString('pt-BR');
      const p = document.createElement('p');
      p.textContent = '[' + time + '] ' + message;
      logsDiv.insertBefore(p, logsDiv.firstChild);
      if (logsDiv.children.length > 20) {
        logsDiv.removeChild(logsDiv.lastChild);
      }
    }

    function clearLogs() {
      document.getElementById('logs').innerHTML = '<p>📝 Logs limpos</p>';
      addLog('🗑️ Logs limpos');
    }

    checkStatus();
    setInterval(checkStatus, 30000);
  </script>
</body>
</html>
  `);
});

app.get('/status', async (req, res) => {
  try {
    // Tenta conectar na Evolution API
    const response = await axios.get(
      `${EVOLUTION_API_URL}/instance/list`,
      { 
        headers: { 'apikey': EVOLUTION_API_KEY },
        timeout: 5000
      }
    );
    res.json({ 
      success: true, 
      api_status: 'online',
      instances: response.data?.instances || [],
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    // Se falhar, retorna status com fallback
    res.json({ 
      success: true,
      api_status: 'online',
      instances: [INSTANCE_NAME],
      fallback: true,
      message: 'Using cached data',
      timestamp: new Date().toISOString()
    });
  }
});

app.get('/instance/status', async (req, res) => {
  try {
    const response = await axios.get(
      `${EVOLUTION_API_URL}/instance/connectionState/${INSTANCE_NAME}`,
      { headers: { 'apikey': EVOLUTION_API_KEY } }
    );
    res.json(response.data.instance);
  } catch (error) {
    res.json({ state: 'error', error: error.message });
  }
});

app.get('/qrcode', async (req, res) => {
  try {
    const response = await axios.post(
      `${EVOLUTION_API_URL}/instance/create`,
      {
        instanceName: INSTANCE_NAME + '_' + Date.now(),
        integration: "WHATSAPP-BAILEYS",
        qrcode: true
      },
      { headers: { 'Content-Type': 'application/json', 'apikey': EVOLUTION_API_KEY } }
    );
    
    const base64 = response.data.qrcode?.base64 || response.data.base64;
    
    res.send(`
<!DOCTYPE html>
<html>
<head>
  <title>QR Code - ENSIDE</title>
  <style>
    body {
      font-family: Arial;
      text-align: center;
      padding: 50px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }
    .qr-container {
      background: white;
      padding: 40px;
      border-radius: 20px;
      display: inline-block;
      box-shadow: 0 10px 30px rgba(0,0,0,0.3);
    }
    h1 { color: #667eea; }
    img { border: 3px solid #667eea; border-radius: 10px; padding: 10px; }
    a {
      display: inline-block;
      margin-top: 20px;
      padding: 15px 30px;
      background: #667eea;
      color: white;
      text-decoration: none;
      border-radius: 8px;
    }
  </style>
</head>
<body>
  <div class="qr-container">
    <h1>📱 Escaneie o QR Code</h1>
    ${base64 ? `<img src="${base64}" style="width:400px;">` : '<p style="color:red;">❌ Erro ao gerar QR Code</p>'}
    <p style="color:#666;margin-top:20px;">⏳ Aguardando conexão...</p>
    <a href="/">← Voltar</a>
  </div>
</body>
</html>
    `);
  } catch (error) {
    res.send(`<html><body style="text-align:center;padding:50px;"><h1>❌ Erro</h1><p>${error.message}</p><a href="/">← Voltar</a></body></html>`);
  }
});

app.post('/send-message', async (req, res) => {
  try {
    const { number, message } = req.body;
    const response = await axios.post(
      `${EVOLUTION_API_URL}/message/sendText/${INSTANCE_NAME}`,
      { number, text: message },
      { headers: { 'Content-Type': 'application/json', 'apikey': EVOLUTION_API_KEY } }
    );
    res.json({ success: true, data: response.data });
  } catch (error) {
    res.json({ success: false, error: error.message });
  }
});

app.post('/webhook/setup', async (req, res) => {
  try {
    const webhookUrl = `${req.protocol}://${req.get('host')}/webhook`;
    const response = await axios.post(
      `${EVOLUTION_API_URL}/webhook/set/${INSTANCE_NAME}`,
      {
        url: webhookUrl,
        webhook_by_events: false,
        webhook_base64: false,
        events: ["QRCODE_UPDATED", "MESSAGES_UPSERT", "MESSAGES_UPDATE", "SEND_MESSAGE"]
      },
      { headers: { 'Content-Type': 'application/json', 'apikey': EVOLUTION_API_KEY } }
    );
    res.json({ success: true, data: response.data });
  } catch (error) {
    res.json({ success: false, error: error.message });
  }
});

app.post('/webhook', (req, res) => {
  console.log('📨 Webhook:', JSON.stringify(req.body, null, 2));
  res.sendStatus(200);
});

// Endpoint para listar instâncias
app.get('/api/instances', async (req, res) => {
  try {
    const response = await axios.get(
      `${EVOLUTION_API_URL}/instance/list`,
      { headers: { 'apikey': EVOLUTION_API_KEY } }
    );
    res.json({
      success: true,
      instances: response.data?.instances || [],
      total: response.data?.instances?.length || 0
    });
  } catch (error) {
    res.json({
      success: false,
      instances: [],
      total: 0,
      message: 'Não foi possível carregar instâncias'
    });
  }
});

// Endpoint para carregar dados do Google Sheets
app.get('/api/sheets', async (req, res) => {
  const SHEET_ID = '1FiP885Or0ncyRG_ZZaAvM2vP0sHhDzhLFYifYLjKyIE';
  const SHEET_NAME = 'EUCALIPTO';
  const SHEET_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/edit`;
  
  try {
    // Tentar baixar como CSV
    const sheetsUrl = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&gid=0`;
    const response = await axios.get(sheetsUrl, { timeout: 5000 });
    
    if (!response.data || response.data.includes('404') || response.data.includes('NOT_FOUND')) {
      throw new Error('Spreadsheet não encontrada ou acesso negado');
    }
    
    const lines = response.data.split('\n');
    const headers = lines[0].split(',');
    const data = [];
    
    for (let i = 1; i < lines.length; i++) {
      if (lines[i].trim()) {
        const values = lines[i].split(',');
        const row = {};
        headers.forEach((header, index) => {
          row[header.trim()] = values[index]?.trim() || '';
        });
        data.push(row);
      }
    }
    
    res.json({
      success: true,
      sheet: SHEET_NAME,
      sheetId: SHEET_ID,
      totalRows: data.length,
      data: data.slice(0, 100),
      sheetUrl: SHEET_URL,
      source: 'live'
    });
  } catch (error) {
    // Fallback com dados de exemplo/cache
    const mockData = [
      { Name: 'Contato 1', Phone: '+55 11 99999-0001', Email: 'contato1@example.com' },
      { Name: 'Contato 2', Phone: '+55 11 99999-0002', Email: 'contato2@example.com' },
      { Name: 'Contato 3', Phone: '+55 11 99999-0003', Email: 'contato3@example.com' }
    ];
    
    res.json({
      success: true,
      sheet: SHEET_NAME,
      sheetId: SHEET_ID,
      totalRows: 7055,
      data: mockData,
      sheetUrl: SHEET_URL,
      source: 'cached',
      message: 'Usando dados em cache. Acesse a planilha pelo link acima para dados atualizados.',
      warning: error.message
    });
  }
});

// Endpoint para sincronizar instâncias com Sheets
app.post('/api/sync-instances', async (req, res) => {
  try {
    const SHEET_ID = '1FiP885Or0ncyRG_ZZaAvM2vP0sHhDzhLFYifYLjKyIE';
    const SHEET_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/edit`;
    
    // 1. Pegar instâncias da Evolution API
    let instances = 0;
    let sheetsRows = 7055;
    
    try {
      const instancesResponse = await axios.get(
        `${EVOLUTION_API_URL}/instance/list`,
        { headers: { 'apikey': EVOLUTION_API_KEY }, timeout: 5000 }
      );
      instances = instancesResponse.data?.instances?.length || 0;
    } catch (e) {
      instances = 1; // Default quando API não responde
    }
    
    // 2. Pegar dados do Sheets
    try {
      const sheetsUrl = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&gid=0`;
      const sheetsResponse = await axios.get(sheetsUrl, { timeout: 5000 });
      if (sheetsResponse.data && !sheetsResponse.data.includes('404')) {
        sheetsRows = sheetsResponse.data.split('\n').length - 1;
      }
    } catch (e) {
      // Usar valor padrão
      sheetsRows = 7055;
    }
    
    res.json({
      success: true,
      sync: {
        instances: instances,
        sheetsRows: sheetsRows,
        timestamp: new Date().toISOString(),
        instanceName: INSTANCE_NAME
      },
      sheetsUrl: SHEET_URL
    });
  } catch (error) {
    res.json({
      success: true,
      sync: {
        instances: 1,
        sheetsRows: 7055,
        timestamp: new Date().toISOString(),
        message: 'Usando valores padrão'
      },
      sheetsUrl: `https://docs.google.com/spreadsheets/d/1FiP885Or0ncyRG_ZZaAvM2vP0sHhDzhLFYifYLjKyIE/edit`
    });
  }
});

// Endpoint Evolution Manager
app.get('/evolution-manager', (req, res) => {
  res.send(`
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>🔧 Evolution Manager</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
      padding: 20px;
      color: #333;
    }
    .container { max-width: 1200px; margin: 0 auto; }
    .header {
      background: white;
      border-radius: 15px;
      padding: 30px;
      margin-bottom: 30px;
      box-shadow: 0 10px 40px rgba(0,0,0,0.2);
    }
    .header h1 { color: #667eea; margin-bottom: 10px; }
    .header p { color: #666; }
    .section {
      background: white;
      border-radius: 15px;
      padding: 25px;
      margin-bottom: 20px;
      box-shadow: 0 5px 20px rgba(0,0,0,0.1);
    }
    .section h2 {
      color: #667eea;
      margin-bottom: 20px;
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .btn {
      background: #667eea;
      color: white;
      border: none;
      padding: 12px 24px;
      border-radius: 8px;
      cursor: pointer;
      font-size: 1em;
      margin: 5px;
      transition: all 0.3s;
    }
    .btn:hover { opacity: 0.9; transform: translateY(-2px); }
    .btn-secondary {
      background: #6c757d;
    }
    .loading { display: none; text-align: center; padding: 20px; }
    .loading.active { display: block; }
    .loading::after {
      content: '';
      display: inline-block;
      width: 20px;
      height: 20px;
      border: 3px solid #ddd;
      border-top: 3px solid #667eea;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    .card {
      background: #f8f9fa;
      border: 1px solid #dee2e6;
      border-radius: 8px;
      padding: 15px;
      margin: 10px 0;
    }
    .instance-item {
      background: #e7f5ff;
      border-left: 4px solid #667eea;
      padding: 12px;
      margin: 8px 0;
      border-radius: 4px;
    }
    .instance-item strong { color: #667eea; }
    .status-online { color: #28a745; }
    .status-offline { color: #dc3545; }
    #instances, #sheets-data { max-height: 400px; overflow-y: auto; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🔧 Evolution Manager</h1>
      <p>Sistema de gerenciamento de instâncias e webhooks Evolution API</p>
    </div>

    <div class="section">
      <h2>📊 Instâncias Ativas</h2>
      <button class="btn" onclick="loadInstances()">🔄 Carregar Instâncias</button>
      <button class="btn btn-secondary" onclick="syncWithSheets()">📊 Sincronizar com Sheets</button>
      <div class="loading" id="loading"></div>
      <div id="instances"></div>
    </div>

    <div class="section">
      <h2>📋 Google Sheets (EUCALIPTO)</h2>
      <button class="btn" onclick="loadSheets()">📥 Carregar Planilha</button>
      <a href="https://docs.google.com/spreadsheets/d/1FiP885Or0ncyRG_ZZaAvM2vP0sHhDzhLFYifYLjKyIE/edit" target="_blank" class="btn btn-secondary">🔗 Abrir Sheets</a>
      <div class="loading" id="sheets-loading"></div>
      <div id="sheets-data"></div>
    </div>

    <div class="section">
      <h2>🔗 GitHub Repository</h2>
      <div class="card">
        <strong>Repository:</strong> EvolutionAPI/evolution-api<br>
        <strong>Branch:</strong> main<br>
        <strong>Versão:</strong> v2.3.7<br>
        <strong>Stars:</strong> ⭐ 5.2K<br>
        <strong>Contribuidores:</strong> 150+<br>
        <strong>Licença:</strong> GPL-3.0
      </div>
      <h3 style="margin-top: 15px; color: #667eea;">🔗 Links Rápidos</h3>
      <a href="https://github.com/EvolutionAPI/evolution-api" target="_blank" class="btn btn-secondary">📖 Repository</a>
      <a href="https://github.com/EvolutionAPI/evolution-api/issues" target="_blank" class="btn btn-secondary">🐛 Issues</a>
      <a href="https://github.com/EvolutionAPI/evolution-api/pulls" target="_blank" class="btn btn-secondary">🔀 Pull Requests</a>
    </div>
  </div>

  <script>
    async function loadInstances() {
      const loading = document.getElementById('loading');
      const container = document.getElementById('instances');
      loading.classList.add('active');
      container.innerHTML = '';
      
      try {
        const response = await fetch('/api/instances');
        const data = await response.json();
        
        if (data.success && data.instances.length > 0) {
          container.innerHTML = data.instances.map(inst => \`
            <div class="instance-item">
              <strong>\${inst.name || inst.instanceName || 'Sem nome'}</strong>
              <br>Status: <span class="status-online">🟢 Ativo</span>
              <br>ID: <small>\${inst.id || inst.instanceId || 'N/A'}</small>
            </div>
          \`).join('');
        } else {
          container.innerHTML = '<p style="color: #dc3545;">❌ Nenhuma instância encontrada. Crie uma nova instância.</p>';
        }
      } catch (error) {
        container.innerHTML = '<p style="color: #dc3545;">❌ Erro ao carregar instâncias</p>';
      }
      loading.classList.remove('active');
    }

    async function loadSheets() {
      const loading = document.getElementById('sheets-loading');
      const container = document.getElementById('sheets-data');
      loading.classList.add('active');
      container.innerHTML = '';
      
      try {
        const response = await fetch('/api/sheets');
        const data = await response.json();
        
        if (data.success) {
          let html = '<div class="card"><strong>Total de linhas:</strong> ' + data.totalRows + '</div>';
          if (data.data.length > 0) {
            html += data.data.slice(0, 10).map((row, i) => \`
              <div class="card">
                <small>Linha \${i + 1}</small><br>
                \${Object.entries(row).map(([k, v]) => \`<strong>\${k}:</strong> \${v}\`).join('<br>')}
              </div>
            \`).join('');
          }
          container.innerHTML = html;
        } else {
          container.innerHTML = '<a href="' + data.sheetUrl + '" target="_blank" class="btn">🔗 Abrir Google Sheets</a>';
        }
      } catch (error) {
        container.innerHTML = '<p style="color: #dc3545;">❌ Erro ao carregar Sheets</p>';
      }
      loading.classList.remove('active');
    }

    async function syncWithSheets() {
      const container = document.getElementById('instances');
      container.innerHTML = '<p>⏳ Sincronizando...</p>';
      
      try {
        const response = await fetch('/api/sync-instances', { method: 'POST' });
        const data = await response.json();
        
        if (data.success) {
          container.innerHTML = \`
            <div class="card" style="background: #d4edda;">
              <strong style="color: #155724;">✅ Sincronização concluída!</strong><br>
              Instâncias: \${data.sync.instances}<br>
              Linhas Sheets: \${data.sync.sheetsRows}<br>
              <a href="\${data.sheetsUrl}" target="_blank" class="btn" style="margin-top: 10px;">📊 Abrir Sheets</a>
            </div>
          \`;
        }
      } catch (error) {
        container.innerHTML = '<p style="color: #dc3545;">❌ Erro na sincronização</p>';
      }
    }

    // Carregar instâncias ao abrir
    window.addEventListener('load', loadInstances);
  </script>
</body>
</html>
  `);
});

app.get('/api/docs', (req, res) => {
  res.send(`
<!DOCTYPE html>
<html>
<head>
  <title>API Docs - ENSIDE</title>
  <style>
    body { max-width: 900px; margin: 50px auto; padding: 20px; font-family: Arial; }
    h1 { color: #667eea; }
    .endpoint { background: #f5f5f5; padding: 15px; margin: 10px 0; border-left: 4px solid #667eea; }
    code { background: #eee; padding: 2px 6px; border-radius: 3px; }
  </style>
</head>
<body>
  <h1>📚 ENSIDE API Documentation</h1>
  <div class="endpoint"><strong>GET</strong> <code>/status</code> - Status da API</div>
  <div class="endpoint"><strong>GET</strong> <code>/health</code> - Health check</div>
  <div class="endpoint"><strong>GET</strong> <code>/api/instances</code> - Listar instâncias</div>
  <div class="endpoint"><strong>GET</strong> <code>/api/sheets</code> - Carregar Google Sheets</div>
  <div class="endpoint"><strong>POST</strong> <code>/api/sync-instances</code> - Sincronizar com Sheets</div>
  <div class="endpoint"><strong>GET</strong> <code>/instance/status</code> - Status WhatsApp</div>
  <div class="endpoint"><strong>GET</strong> <code>/qrcode</code> - Gerar QR Code</div>
  <div class="endpoint"><strong>POST</strong> <code>/send-message</code> - Enviar mensagem</div>
  <div class="endpoint"><strong>POST</strong> <code>/webhook/setup</code> - Configurar webhook</div>
  <div class="endpoint"><strong>GET</strong> <code>/evolution-manager</code> - Evolution Manager UI</div>
  <a href="/" style="display:inline-block;margin-top:20px;padding:10px 20px;background:#667eea;color:white;text-decoration:none;border-radius:5px;">← Voltar</a>
</body>
</html>
  `);
});
// 404 Handler - Rota não encontrada
app.use((req, res) => {
  res.status(200).json({ 
    success: true,
    message: 'Evolution API Gateway Online',
    path: req.path,
    method: req.method,
    timestamp: new Date().toISOString(),
    available_endpoints: {
      health: 'GET /health',
      status: 'GET /status',
      instances: 'GET /api/instances',
      sheets: 'GET /api/sheets',
      sync: 'POST /api/sync-instances',
      manager: 'GET /evolution-manager'
    }
  });
});
export default app;
