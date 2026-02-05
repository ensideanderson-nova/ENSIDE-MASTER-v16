// CONFIG/EVOLUTION_API_INTEGRATION.js

const EVOLUTION_CONFIG_KEYS = {
  URL: "evolution_url",
  API_KEY: "evolution_apikey",
  INSTANCE: "evolution_instance"
};

let evolutionConfig = {
  url: localStorage.getItem(EVOLUTION_CONFIG_KEYS.URL) || "",
  apiKey: localStorage.getItem(EVOLUTION_CONFIG_KEYS.API_KEY) || "",
  instance: localStorage.getItem(EVOLUTION_CONFIG_KEYS.INSTANCE) || ""
};

// ====== VALIDAÇÃO E SANITIZAÇÃO ======

function validarURL(url) {
  try {
    const urlObj = new URL(url);
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
  } catch {
    return false;
  }
}

function validarAPIKey(key) {
  return key && key.length >= 32 && /^[A-Z0-9]+$/.test(key);
}

function validarInstance(instance) {
  return instance && /^[A-Za-z0-9_-]+$/.test(instance);
}

function validarNumeroWhatsApp(numero) {
  const limpo = numero.replace(/\D/g, '');
  return limpo.length >= 10 && limpo.length <= 15;
}

function sanitizarTexto(texto) {
  const div = document.createElement('div');
  div.textContent = texto;
  return div.innerHTML;
}

// ====== FUNÇÕES DE UI ======

function mostrarMensagem(mensagem, tipo = 'info') {
  const alertDiv = document.createElement('div');
  alertDiv.className = `alert alert-${tipo}`;
  alertDiv.textContent = mensagem;
  
  const container = document.getElementById('alertContainer');
  if (container) {
    container.appendChild(alertDiv);
    setTimeout(() => alertDiv.remove(), 5000);
  } else {
    alert(mensagem);
  }
}

function atualizarStatus(status) {
  const statusEl = document.getElementById("evolutionStatus");
  if (!statusEl) return;
  
  const statusMap = {
    'open': { text: 'Conectado', class: 'status-ok' },
    'close': { text: 'Desconectado', class: 'status-off' },
    'connecting': { text: 'Conectando...', class: 'status-connecting' }
  };
  
  const config = statusMap[status] || { text: 'Desconhecido', class: 'status-unknown' };
  statusEl.textContent = config.text;
  statusEl.className = config.class;
}

// ====== REQUISIÇÕES À API ======

async function fazerRequisicao(endpoint, options = {}) {
  const { url, apiKey, instance } = evolutionConfig;
  
  if (!url || !apiKey || !instance) {
    throw new Error("Configuração incompleta");
  }
  
  const fullUrl = `${url}${endpoint}`.replace(/([^:]\/)\/+/g, "$1");
  
  const config = {
    ...options,
    headers: {
      'apikey': apiKey,
      'Content-Type': 'application/json',
      ...options.headers
    }
  };
  
  const response = await fetch(fullUrl, config);
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Erro HTTP ${response.status}: ${errorText}`);
  }
  
  return await response.json();
}

// ====== FUNÇÕES PRINCIPAIS ======

async function testarConexaoEvolution() {
  const url = document.getElementById("evolutionUrl")?.value.trim();
  const apiKey = document.getElementById("evolutionApiKey")?.value.trim();
  const instance = document.getElementById("evolutionInstance")?.value.trim();
  
  if (!url || !apiKey || !instance) {
    mostrarMensagem("Preencha todos os campos", 'warning');
    return false;
  }
  
  if (!validarURL(url)) {
    mostrarMensagem("URL inválida", 'error');
    return false;
  }
  
  if (!validarAPIKey(apiKey)) {
    mostrarMensagem("API Key inválida (deve ter 32+ caracteres alfanuméricos)", 'error');
    return false;
  }
  
  if (!validarInstance(instance)) {
    mostrarMensagem("Nome de instância inválido", 'error');
    return false;
  }
  
  try {
    const configBackup = { ...evolutionConfig };
    evolutionConfig = { url, apiKey, instance };
    
    const data = await fazerRequisicao(`/instance/connectionState/${instance}`);
    
    if (data.state === "open") {
      mostrarMensagem("✓ Conexão estabelecida com sucesso", 'success');
      atualizarStatus('open');
      return true;
    } else {
      mostrarMensagem(`WhatsApp desconectado. Status: ${data.state}`, 'warning');
      atualizarStatus(data.state);
      return false;
    }
  } catch (error) {
    console.error("Erro ao testar conexão:", error);
    mostrarMensagem(`Erro ao conectar: ${error.message}`, 'error');
    atualizarStatus('close');
    evolutionConfig = configBackup;
    return false;
  }
}

function salvarConfigEvolution() {
  const url = document.getElementById("evolutionUrl")?.value.trim();
  const apiKey = document.getElementById("evolutionApiKey")?.value.trim();
  const instance = document.getElementById("evolutionInstance")?.value.trim();
  
  if (!validarURL(url)) {
    mostrarMensagem("URL inválida", 'error');
    return;
  }
  
  if (!validarAPIKey(apiKey)) {
    mostrarMensagem("API Key inválida", 'error');
    return;
  }
  
  if (!validarInstance(instance)) {
    mostrarMensagem("Nome de instância inválido", 'error');
    return;
  }
  
  localStorage.setItem(EVOLUTION_CONFIG_KEYS.URL, url);
  localStorage.setItem(EVOLUTION_CONFIG_KEYS.API_KEY, apiKey);
  localStorage.setItem(EVOLUTION_CONFIG_KEYS.INSTANCE, instance);
  
  evolutionConfig = { url, apiKey, instance };
  
  mostrarMensagem("✓ Configuração salva com sucesso", 'success');
}

async function gerarQRCode() {
  const qrContainer = document.getElementById("qrCodeContainer");
  if (!qrContainer) return;
  
  try {
    qrContainer.innerHTML = '<p>Gerando QR Code...</p>';
    
    const data = await fazerRequisicao(`/instance/connect/${evolutionConfig.instance}`);
    
    const qrBase64 = data.base64 || data.qrcode?.base64;
    
    if (qrBase64) {
      const img = document.createElement('img');
      img.src = qrBase64;
      img.alt = "QR Code WhatsApp";
      img.style.maxWidth = "300px";
      img.style.border = "2px solid #ccc";
      img.style.padding = "10px";
      
      qrContainer.innerHTML = '';
      qrContainer.appendChild(img);
      
      mostrarMensagem("QR Code gerado. Escaneie com WhatsApp", 'info');
    } else {
      throw new Error("QR Code não retornado pela API");
    }
  } catch (error) {
    console.error("Erro ao gerar QR Code:", error);
    qrContainer.innerHTML = '<p style="color: red;">Erro ao gerar QR Code</p>';
    mostrarMensagem(`Erro: ${error.message}`, 'error');
  }
}

async function verificarConexao() {
  return await testarConexaoEvolution();
}

async function enviarMensagemEvolution() {
  const numeroInput = document.getElementById("evolutionNumero");
  const mensagemInput = document.getElementById("evolutionMensagem");
  
  if (!numeroInput || !mensagemInput) return;
  
  const numero = numeroInput.value.trim();
  const mensagem = mensagemInput.value.trim();
  
  if (!numero || !mensagem) {
    mostrarMensagem("Preencha o número e a mensagem", 'warning');
    return;
  }
  
  if (!validarNumeroWhatsApp(numero)) {
    mostrarMensagem("Número de WhatsApp inválido", 'error');
    return;
  }
  
  if (mensagem.length > 4096) {
    mostrarMensagem("Mensagem muito longa (máx. 4096 caracteres)", 'error');
    return;
  }
  
  try {
    const numeroFormatado = numero.replace(/\D/g, '') + '@s.whatsapp.net';
    
    const data = await fazerRequisicao(`/message/sendText/${evolutionConfig.instance}`, {
      method: "POST",
      body: JSON.stringify({
        number: numeroFormatado,
        text: mensagem
      })
    });
    
    if (data.key) {
      mostrarMensagem("✓ Mensagem enviada com sucesso", 'success');
      mensagemInput.value = '';
    } else {
      throw new Error("Resposta inválida da API");
    }
  } catch (error) {
    console.error("Erro ao enviar mensagem:", error);
    mostrarMensagem(`Erro ao enviar: ${error.message}`, 'error');
  }
}

// ====== INICIALIZAÇÃO ======

window.addEventListener("DOMContentLoaded", function() {
  const urlInput = document.getElementById("evolutionUrl");
  const apiKeyInput = document.getElementById("evolutionApiKey");
  const instanceInput = document.getElementById("evolutionInstance");
  
  if (urlInput && evolutionConfig.url) {
    urlInput.value = evolutionConfig.url;
  }
  
  if (apiKeyInput && evolutionConfig.apiKey) {
    apiKeyInput.value = evolutionConfig.apiKey;
    apiKeyInput.type = "password";
  }
  
  if (instanceInput && evolutionConfig.instance) {
    instanceInput.value = evolutionConfig.instance;
  }
  
  if (evolutionConfig.url && evolutionConfig.apiKey && evolutionConfig.instance) {
    verificarConexao().catch(console.error);
  }
});

// Exporta funções para uso global
window.evolutionAPI = {
  testarConexao: testarConexaoEvolution,
  salvarConfig: salvarConfigEvolution,
  gerarQRCode,
  verificarConexao,
  enviarMensagem: enviarMensagemEvolution
};
