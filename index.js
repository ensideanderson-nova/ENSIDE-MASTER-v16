import express from 'express';
import axios from 'axios';

const app = express();
app.use(express.json());

const EVOLUTION_API_URL = process.env.EVOLUTION_API_URL || 'http://localhost:8080';
const EVOLUTION_API_KEY = process.env.EVOLUTION_API_KEY || 'B6D711FCDE4D4FD5936544120E713976';
const INSTANCE_NAME = 'ENSIDE2';

// ============= PÁGINA PRINCIPAL =============
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>🤖 ENSIDE SYSTEM - WhatsApp Automation</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          min-height: 100vh;
          padding: 20px;
        }
        .container {
          max-width: 1200px;
          margin: 0 auto;
        }
        .header {
          text-align: center;
          color: white;
          margin-bottom: 40px;
        }
        .header h1 {
          font-size: 3em;
          margin-bottom: 10px;
          text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
        }
        .header p {
          font-size: 1.2em;
          opacity: 0.9;
        }
        .dashboard {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 20px;
          margin-bottom: 30px;
        }
        .card {
          background: white;
          border-radius: 15px;
          padding: 25px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.2);
          transition: transform 0.3s ease;
        }
        .card:hover {
          transform: translateY(-5px);
        }
        .card h2 {
          color: #667eea;
          margin-bottom: 15px;
          font-size: 1.5em;
        }
        .btn {
          display: inline-block;
          padding: 12px 24px;
          margin: 5px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          text-decoration: none;
          border-radius: 8px;
          font-weight: bold;
          transition: all 0.3s ease;
          border: none;
          cursor: pointer;
          font-size: 1em;
        }
        .btn:hover {
          transform: scale(1.05);
          box-shadow: 0 5px 15px rgba(0,0,0,0.3);
        }
        .btn-success { background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%); }
        .btn-danger { background: linear-gradient(135deg, #ee0979 0%, #ff6a00 100%); }
        .btn-info { background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); }
        .status {
          display: inline-block;
          padding: 8px 16px;
          border-radius: 20px;
          font-weight: bold;
          margin: 10px 0;
        }
        .status.online {
          background: #38ef7d;
          color: white;
        }
        .status.offline {
          background: #ff6a00;
          color: white;
        }
        .form-group {
          margin: 15px 0;
        }
        .form-group label {
          display: block;
          margin-bottom: 5px;
          font-weight: bold;
          color: #333;
        }
        .form-group input,
        .form-group textarea {
          width: 100%;
          padding: 12px;
          border: 2px solid #ddd;
          border-radius: 8px;
          font-size: 1em;
        }
        .form-group textarea {
          min-height: 120px;
          resize: vertical;
        }
        #response {
          margin-top: 20px;
          padding: 15px;
          border-radius: 8px;
          display: none;
        }
        #response.success {
          background: #d4edda;
          color: #155724;
          border: 1px solid #c3e6cb;
        }
        #response.error {
          background: #f8d7da;
          color: #721c24;
          border: 1px solid #f5c6cb;
        }
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
          <!-- CARD: STATUS -->
          <div class="card">
            <h2>📊 Status do Sistema</h2>
            <p><strong>API:</strong> <span id="api-status">Verificando...</span></p>
            <p><strong>WhatsApp:</strong> <span id="whatsapp-status">Verificando...</span></p>
            <p><strong>Instância:</strong> ${INSTANCE_NAME}</p>
            <button class="btn btn-info" onclick="checkStatus()">🔄 Atualizar Status</button>
          </div>

          <!-- CARD: QR CODE -->
          <div class="card">
            <h2>📱 Conectar WhatsApp</h2>
            <p>Gere um QR Code para conectar uma nova instância</p>
            <a href="/qrcode" class="btn btn-success">📷 Gerar QR Code</a>
          </div>

          <!-- CARD: ENVIAR MENSAGEM -->
          <div class="card">
            <h2>💬 Enviar Mensagem</h2>
            <form id="sendForm">
              <div class="form-group">
                <label>📱 Número (com DDI):</label>
                <input type="text" id="number" placeholder="5518996540492" required>
              </div>
              <div class="form-group">
                <label>💬 Mensagem:</label>
                <textarea id="message" placeholder="Digite sua mensagem..." required></textarea>
              </div>
              <button type="submit" class="btn btn-success">📤 Enviar</button>
            </form>
            <div id="response"></div>
          </div>

          <!-- CARD: WEBHOOK -->
          <div class="card">
            <h2>🔔 Webhook</h2>
            <p>Configure webhook para receber mensagens</p>
            <button class="btn btn-info" onclick="setupWebhook()">⚙️ Configurar Webhook</button>
            <div id="webhook-response"></div>
          </div>

          <!-- CARD: LOGS -->
          <div class="card">
            <h2>📝 Últimas Atividades</h2>
            <div id="logs">
              <p>🕐 Sistema iniciado</p>
              <p>✅ API conectada</p>
              <p>📱 Aguardando comandos...</p>
            </div>
            <button class="btn btn-info" onclick="clearLogs()">🗑️ Limpar Logs</button>
          </div>

          <!-- CARD: DOCUMENTAÇÃO -->
          <div class="card">
            <h2>📚 Documentação</h2>
            <a href="/api/docs" class="btn">📖 API Docs</a>
            <a href="https://doc.evolution-api.com" target="_blank" class="btn">🌐 Evolution API</a>
            <a href="https://github.com/ensideanderson-nova/ENSIDE-MASTER-v16" target="_blank" class="btn">💻 GitHub</a>
          </div>
        </div>
      </div>

      <script>
        // Verificar status
        async function checkStatus() {
          try {
            const apiResponse = await fetch('/status');
            const apiData = await apiResponse.json();
            document.getElementById('api-status').textContent = apiData.success ? '✅ Online' : '❌ Offline';

            const whatsappResponse = await fetch('/instance/status');
            const whatsappData = await whatsappResponse.json();
            document.getElementById('whatsapp-status').textContent = 
              whatsappData.state === 'open' ? '✅ Conectado' : '❌ Desconectado';
            
            addLog('✅ Status atualizado');
          } catch (error) {
            addLog('❌ Erro ao verificar status');
          }
        }

        // Enviar mensagem
        document.getElementById('sendForm').addEventListener('submit', async (e) => {
          e.preventDefault();
          const number = document.getElementById('number').value;
          const message = document.getElementById('message').value;
          const responseDiv = document.getElementById('response');

          try {
            const response = await fetch('/send-message', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ number, message })
            });

            const data = await response.json();
            responseDiv.style.display = 'block';
            
            if (data.success) {
              responseDiv.className = 'success';
              responseDiv.textContent = '✅ Mensagem enviada com sucesso!';
              addLog(\`📤 Mensagem enviada para \${number}\`);
              document.getElementById('sendForm').reset();
            } else {
              responseDiv.className = 'error';
              responseDiv.textContent = '❌ Erro: ' + data.error;
              addLog(\`❌ Falha ao enviar para \${number}\`);
            }
          } catch (error) {
            responseDiv.style.display = 'block';
            responseDiv.className = 'error';
            responseDiv.textContent = '❌ Erro de conexão';
            addLog('❌ Erro de conexão');
          }
        });

        // Configurar webhook
        async function setupWebhook() {
          const webhookDiv = document.getElementById('webhook-response');
          webhookDiv.textContent = '⏳ Configurando...';
          
          try {
            const response = await fetch('/webhook/setup', { method: 'POST' });
            const data = await response.json();
            webhookDiv.textContent = data.success ? '✅ Webhook configurado!' : '❌ Erro ao configurar';
            addLog(data.success ? '✅ Webhook configurado' : '❌ Erro no webhook');
          } catch (error) {
            webhookDiv.textContent = '❌ Erro de conexão';
            addLog('❌ Erro ao configurar webhook');
          }
        }

        // Adicionar log
        function addLog(message) {
          const logsDiv = document.getElementById('logs');
          const time = new Date().toLocaleTimeString('pt-BR');
          const p = document.createElement('p');
          p.textContent = \`[\${time}] \${message}\`;
          logsDiv.insertBefore(p, logsDiv.firstChild);
          if (logsDiv.children.length > 10) {
            logsDiv.removeChild(logsDiv.lastChild);
          }
        }

        // Limpar logs
        function clearLogs() {
          document.getElementById('logs').innerHTML = '<p>📝 Logs limpos</p>';
        }

        // Auto-check status on load
        checkStatus();
        setInterval(checkStatus, 30000); // A cada 30 segundos
      </script>
    </body>
    </html>
  `);
});

// ============= API ENDPOINTS =============

// Status da API
app.get('/status', async (req, res) => {
  try {
    const response = await axios.get(EVOLUTION_API_URL, {
      headers: { 'apikey': EVOLUTION_API_KEY }
    });
    res.json({ success: true, data: response.data });
  } catch (error) {
    res.json({ success: false, error: error.message });
  }
});

// Status da instância
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

// Gerar QR Code
app.get('/qrcode', async (req, res) => {
  try {
    const response = await axios.post(
      `${EVOLUTION_API_URL}/instance/create`,
      {
        instanceName: INSTANCE_NAME + '_NEW',
        integration: "WHATSAPP-BAILEYS",
        qrcode: true
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'apikey': EVOLUTION_API_KEY
        }
      }
    );
    
    const base64 = response.data.qrcode?.base64 || response.data.base64;
    
    res.send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>QR Code - ENSIDE</title>
        <style>
          body {
            font-family: Arial, sans-serif;
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
            font-weight: bold;
          }
        </style>
      </head>
      <body>
        <div class="qr-container">
          <h1>📱 Escaneie o QR Code</h1>
          ${base64 ? `<img src="${base64}" style="width:400px;">` : '<p>❌ QR Code não gerado</p>'}
          <p style="color:#666; margin-top:20px;">⏳ Aguardando conexão...</p>
          <a href="/">← Voltar ao Dashboard</a>
        </div>
      </body>
      </html>
    `);
  } catch (error) {
    res.send(`
      <html>
      <body style="text-align:center;padding:50px;">
        <h1>❌ Erro</h1>
        <p>${error.message}</p>
        <a href="/">← Voltar</a>
      </body>
      </html>
    `);
  }
});

// Enviar mensagem
app.post('/send-message', async (req, res) => {
  try {
    const { number, message } = req.body;
    
    const response = await axios.post(
      `${EVOLUTION_API_URL}/message/sendText/${INSTANCE_NAME}`,
      { number, text: message },
      { headers: {
        'Content-Type': 'application/json',
        'apikey': EVOLUTION_API_KEY
      }}
    );
    
    res.json({ success: true, data: response.data });
  } catch (error) {
    res.json({ success: false, error: error.message });
  }
});

// Configurar webhook
app.post('/webhook/setup', async (req, res) => {
  try {
    const webhookUrl = `${req.protocol}://${req.get('host')}/webhook`;
    
    const response = await axios.post(
      `${EVOLUTION_API_URL}/webhook/set/${INSTANCE_NAME}`,
      {
        url: webhookUrl,
        webhook_by_events: false,
        webhook_base64: false,
        events: [
          "QRCODE_UPDATED",
          "MESSAGES_UPSERT",
          "MESSAGES_UPDATE",
          "SEND_MESSAGE"
        ]
      },
      { headers: {
        'Content-Type': 'application/json',
        'apikey': EVOLUTION_API_KEY
      }}
    );
    
    res.json({ success: true, data: response.data });
  } catch (error) {
    res.json({ success: false, error: error.message });
  }
});

// Receber webhook
app.post('/webhook', (req, res) => {
  console.log('📨 Webhook recebido:', JSON.stringify(req.body, null, 2));
  
  // Aqui você pode processar as mensagens recebidas
  const data = req.body;
  
  if (data.event === 'messages.upsert') {
    const message = data.data.messages[0];
    console.log('💬 Nova mensagem:', message);
    
    // Exemplo: responder automaticamente
    // if (message.message?.conversation) {
    //   // Processar e responder
    // }
  }
  
  res.sendStatus(200);
});

// Documentação da API
app.get('/api/docs', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>API Docs - ENSIDE</title>
      <style>
        body {
          font-family: 'Courier New', monospace;
          max-width: 900px;
          margin: 50px auto;
          padding: 20px;
          background: #f5f5f5;
        }
        h1 { color: #667eea; }
        .endpoint {
          background: white;
          padding: 20px;
          margin: 15px 0;
          border-left: 4px solid #667eea;
          border-radius: 5px;
        }
        code {
          background: #eee;
          padding: 2px 6px;
          border-radius: 3px;
        }
        .method {
          display: inline-block;
          padding: 4px 8px;
          border-radius: 4px;
          font-weight: bold;
          margin-right: 10px;
        }
        .get { background: #61affe; color: white; }
        .post { background: #49cc90; color: white; }
      </style>
    </head>
    <body>
      <h1>📚 ENSIDE API Documentation</h1>
      
      <div class="endpoint">
        <span class="method get">GET</span>
        <code>/status</code>
        <p>Verifica o status da API Evolution</p>
      </div>

      <div class="endpoint">
        <span class="method get">GET</span>
        <code>/instance/status</code>
        <p>Verifica o status da instância WhatsApp</p>
      </div>

      <div class="endpoint">
        <span class="method get">GET</span>
        <code>/qrcode</code>
        <p>Gera QR Code para nova conexão</p>
      </div>

      <div class="endpoint">
        <span class="method post">POST</span>
        <code>/send-message</code>
        <p>Envia mensagem via WhatsApp</p>
        <pre>{ "number": "5518996540492", "message": "Olá!" }</pre>
      </div>

      <div class="endpoint">
        <span class="method post">POST</span>
        <code>/webhook/setup</code>
        <p>Configura webhook para receber mensagens</p>
      </div>

      <div class="endpoint">
        <span class="method post">POST</span>
        <code>/webhook</code>
        <p>Endpoint que recebe os eventos do webhook</p>
      </div>

      <a href="/" style="display:inline-block;margin-top:20px;padding:10px 20px;background:#667eea;color:white;text-decoration:none;border-radius:5px;">← Voltar</a>
    </body>
    </html>
  `);
});

export default app;
