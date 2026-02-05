// ═══════════════════════════════════════════════════════════════════════════
// EVOLUTION API INTEGRATION - EXAMPLE CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════
//
// ⚠️ IMPORTANT SECURITY INSTRUCTIONS ⚠️
//
// 1. DO NOT commit this file with real credentials to version control
// 2. Copy this file to EVOLUTION_API_INTEGRATION.js (without .example)
// 3. Replace the empty strings below with your actual credentials
// 4. Add EVOLUTION_API_INTEGRATION.js to .gitignore if using real credentials
//
// ═══════════════════════════════════════════════════════════════════════════
// SETUP INSTRUCTIONS
// ═══════════════════════════════════════════════════════════════════════════
//
// Step 1: Get your Evolution API credentials
// - Deploy Evolution API server (e.g., on Render, Railway, or local Docker)
// - Access the Evolution API Manager interface
// - Create an API Key in the settings
// - Create or note your instance name
//
// Step 2: Configure this file
// - Replace "" with your actual URL (e.g., "https://your-server.com")
// - Replace "" with your actual API Key
// - Replace "" with your instance name (e.g., "MYCOMPANY")
//
// Step 3: Test the connection
// - Open your HTML page with Evolution API integration
// - Fill in the configuration form
// - Click "Test Connection" to verify settings
// - Save the configuration
//
// ═══════════════════════════════════════════════════════════════════════════
// SECURITY BEST PRACTICES
// ═══════════════════════════════════════════════════════════════════════════
//
// ⚠️ localStorage is NOT secure for production environments
//    - Anyone with browser access can read localStorage
//    - Credentials are stored in plain text
//    - Use only for development/testing
//
// ✅ For production, consider:
//    - Backend proxy: Route API calls through your server
//    - Environment variables: Store credentials server-side
//    - Secure authentication: Use OAuth or similar
//    - API Gateway: Add rate limiting and security
//
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Evolution API Configuration
 * Replace empty strings with your actual values
 * @type {Object}
 */
let evolutionConfig = {
  // Your Evolution API server URL
  // Example: "https://evolution-api.yourserver.com"
  // Example: "https://your-app.onrender.com"
  // DO NOT include trailing slash
  url: localStorage.getItem("evolution_url") || "",
  
  // Your Evolution API Key
  // Example: "YOUR-SECURE-API-KEY-HERE-32-CHARS"
  // Find this in your Evolution API Manager settings
  apiKey: localStorage.getItem("evolution_apikey") || "",
  
  // Your Evolution API Instance name
  // Example: "MYCOMPANY" or "PRODUCTION"
  // Create this in your Evolution API Manager
  instance: localStorage.getItem("evolution_instance") || ""
};

// ═══════════════════════════════════════════════════════════════════════════
// API ENDPOINT CONSTANTS
// ═══════════════════════════════════════════════════════════════════════════

const API_ENDPOINTS = {
  CONNECTION_STATE: "/instance/connectionState/",
  CONNECT: "/instance/connect/",
  SEND_TEXT: "/message/sendText/"
};

// Request timeout in milliseconds (10 seconds)
const REQUEST_TIMEOUT = 10000;

// ═══════════════════════════════════════════════════════════════════════════
// VALIDATION FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Validates phone number format (must include country code)
 * @param {string} numero - Phone number to validate
 * @returns {boolean} True if valid, false otherwise
 * @example
 * validarNumeroTelefone("+5511999999999") // returns true
 * validarNumeroTelefone("11999999999") // returns false (missing country code)
 */
function validarNumeroTelefone(numero) {
  if (!numero || typeof numero !== "string") {
    return false;
  }
  // Remove spaces, dashes, and parentheses
  const cleaned = numero.replace(/[\s\-\(\)]/g, "");
  // Must start with + and country code, followed by 8-15 digits
  const phoneRegex = /^\+\d{8,15}$/;
  return phoneRegex.test(cleaned);
}

/**
 * Validates URL format
 * @param {string} url - URL to validate
 * @returns {boolean} True if valid, false otherwise
 */
function validarURL(url) {
  if (!url || typeof url !== "string") {
    return false;
  }
  try {
    const urlObj = new URL(url);
    return urlObj.protocol === "http:" || urlObj.protocol === "https:";
  } catch (error) {
    console.error("URL validation error:", error.message);
    return false;
  }
}

/**
 * Validates API key is not empty
 * @param {string} key - API key to validate
 * @returns {boolean} True if valid, false otherwise
 */
function validarAPIKey(key) {
  return !!(key && typeof key === "string" && key.trim().length > 0);
}

/**
 * Creates a fetch request with timeout
 * @param {string} url - Request URL
 * @param {Object} options - Fetch options
 * @param {number} timeout - Timeout in milliseconds
 * @returns {Promise<Response>} Fetch response
 */
async function fetchWithTimeout(url, options = {}, timeout = REQUEST_TIMEOUT) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === "AbortError") {
      throw new Error("Request timeout - servidor não respondeu em " + (timeout / 1000) + " segundos");
    }
    throw error;
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Tests connection to Evolution API
 * @returns {Promise<void>}
 */
async function testarConexaoEvolution() {
  const urlElement = document.getElementById("evolutionUrl");
  const apiKeyElement = document.getElementById("evolutionApiKey");
  const instanceElement = document.getElementById("evolutionInstance");
  const statusElement = document.getElementById("evolutionStatus");
  
  // DOM safety checks
  if (!urlElement || !apiKeyElement || !instanceElement) {
    console.error("Elementos do formulário não encontrados no DOM");
    alert("Erro: Elementos do formulário não encontrados. Verifique se a página foi carregada corretamente.");
    return;
  }
  
  const url = urlElement.value.trim();
  const apiKey = apiKeyElement.value.trim();
  const instance = instanceElement.value.trim();
  
  // Input validation
  if (!url || !apiKey || !instance) {
    alert("❌ Preencha todos os campos: URL, API Key e Instância");
    console.warn("Campos obrigatórios não preenchidos");
    return;
  }
  
  if (!validarURL(url)) {
    alert("❌ URL inválida. Use formato: https://seu-servidor.com");
    console.error("URL inválida:", url);
    return;
  }
  
  if (!validarAPIKey(apiKey)) {
    alert("❌ API Key não pode estar vazia");
    console.error("API Key inválida");
    return;
  }
  
  console.log("Testando conexão com Evolution API...", { url, instance });
  
  try {
    const endpoint = url + API_ENDPOINTS.CONNECTION_STATE + instance;
    const response = await fetchWithTimeout(endpoint, {
      headers: { "apikey": apiKey }
    });
    
    if (!response.ok) {
      throw new Error("Servidor retornou erro: " + response.status + " " + response.statusText);
    }
    
    const data = await response.json();
    
    // Validate response structure
    if (!data || typeof data.state === "undefined") {
      throw new Error("Resposta da API inválida - estrutura não reconhecida");
    }
    
    console.log("Resposta da API:", data);
    
    if (data.state === "open") {
      alert("✅ Conexão OK - WhatsApp conectado!");
      if (statusElement) {
        statusElement.textContent = "✅ OK";
        statusElement.style.color = "green";
      }
      console.log("WhatsApp conectado com sucesso");
    } else {
      alert("⚠️ WhatsApp desconectado - Estado: " + data.state);
      if (statusElement) {
        statusElement.textContent = "❌ OFF";
        statusElement.style.color = "red";
      }
      console.warn("WhatsApp desconectado. Estado:", data.state);
    }
  } catch (error) {
    console.error("Erro ao testar conexão:", error);
    alert("❌ Erro ao conectar: " + error.message + "\n\nVerifique:\n- URL está correta\n- API Key está válida\n- Instância existe\n- Servidor está online");
    if (statusElement) {
      statusElement.textContent = "❌ ERRO";
      statusElement.style.color = "red";
    }
  }
}

/**
 * Saves Evolution API configuration to localStorage
 * ⚠️ WARNING: localStorage is not secure for production
 * @returns {void}
 */
function salvarConfigEvolution() {
  const urlElement = document.getElementById("evolutionUrl");
  const apiKeyElement = document.getElementById("evolutionApiKey");
  const instanceElement = document.getElementById("evolutionInstance");
  
  // DOM safety checks
  if (!urlElement || !apiKeyElement || !instanceElement) {
    console.error("Elementos do formulário não encontrados no DOM");
    alert("Erro: Elementos do formulário não encontrados");
    return;
  }
  
  const url = urlElement.value.trim();
  const apiKey = apiKeyElement.value.trim();
  const instance = instanceElement.value.trim();
  
  // Input validation
  if (!url || !apiKey || !instance) {
    alert("❌ Preencha todos os campos antes de salvar");
    console.warn("Tentativa de salvar configuração incompleta");
    return;
  }
  
  if (!validarURL(url)) {
    alert("❌ URL inválida. Use formato: https://seu-servidor.com");
    console.error("Tentativa de salvar URL inválida:", url);
    return;
  }
  
  if (!validarAPIKey(apiKey)) {
    alert("❌ API Key não pode estar vazia");
    console.error("Tentativa de salvar API Key inválida");
    return;
  }
  
  try {
    localStorage.setItem("evolution_url", url);
    localStorage.setItem("evolution_apikey", apiKey);
    localStorage.setItem("evolution_instance", instance);
    evolutionConfig = { url, apiKey, instance };
    
    console.log("Configuração salva com sucesso", { url, instance });
    alert("✅ Configuração salva com sucesso!");
  } catch (error) {
    console.error("Erro ao salvar configuração:", error);
    alert("❌ Erro ao salvar: " + error.message);
  }
}

/**
 * Generates QR Code for WhatsApp connection
 * @returns {Promise<void>}
 */
async function gerarQRCode() {
  const qrContainer = document.getElementById("qrCodeContainer");
  
  // DOM safety check
  if (!qrContainer) {
    console.error("Elemento qrCodeContainer não encontrado no DOM");
    alert("Erro: Container do QR Code não encontrado");
    return;
  }
  
  const url = evolutionConfig.url;
  const apiKey = evolutionConfig.apiKey;
  const instance = evolutionConfig.instance;
  
  // Validate configuration
  if (!url || !apiKey || !instance) {
    alert("❌ Configure a Evolution API primeiro (URL, API Key e Instância)");
    console.warn("Tentativa de gerar QR Code sem configuração completa");
    return;
  }
  
  if (!validarURL(url)) {
    alert("❌ URL inválida na configuração");
    console.error("URL inválida:", url);
    return;
  }
  
  console.log("Gerando QR Code...", { url, instance });
  qrContainer.innerHTML = "<p>⏳ Gerando QR Code...</p>";
  
  try {
    const endpoint = url + API_ENDPOINTS.CONNECT + instance;
    const response = await fetchWithTimeout(endpoint, {
      headers: { "apikey": apiKey }
    });
    
    if (!response.ok) {
      throw new Error("Servidor retornou erro: " + response.status + " " + response.statusText);
    }
    
    const data = await response.json();
    console.log("Resposta da API:", data);
    
    // Try multiple possible QR code paths in response
    const qrBase64 = data.base64 || (data.qrcode && data.qrcode.base64) || (data.qr && data.qr.base64);
    
    if (qrBase64) {
      qrContainer.innerHTML = '<img src="' + qrBase64 + '" style="max-width:300px; border: 2px solid #ccc; border-radius: 8px; padding: 10px;" alt="QR Code para conectar WhatsApp">';
      console.log("QR Code gerado com sucesso");
      alert("✅ QR Code gerado! Escaneie com WhatsApp");
    } else {
      throw new Error("QR Code não encontrado na resposta da API");
    }
  } catch (error) {
    console.error("Erro ao gerar QR Code:", error);
    qrContainer.innerHTML = "<p style='color: red;'>❌ Erro ao gerar QR Code</p>";
    alert("❌ Erro ao gerar QR Code: " + error.message + "\n\nVerifique:\n- Configuração está correta\n- Instância está criada no servidor\n- WhatsApp não está já conectado");
  }
}

/**
 * Verifies connection status (wrapper for testarConexaoEvolution)
 * @returns {Promise<void>}
 */
async function verificarConexao() {
  await testarConexaoEvolution();
}

/**
 * Sends text message via Evolution API
 * @returns {Promise<void>}
 */
async function enviarMensagemEvolution() {
  const numeroElement = document.getElementById("evolutionNumero");
  const mensagemElement = document.getElementById("evolutionMensagem");
  
  // DOM safety checks
  if (!numeroElement || !mensagemElement) {
    console.error("Elementos do formulário de mensagem não encontrados no DOM");
    alert("Erro: Elementos do formulário não encontrados");
    return;
  }
  
  const numero = numeroElement.value.trim();
  const mensagem = mensagemElement.value.trim();
  const url = evolutionConfig.url;
  const apiKey = evolutionConfig.apiKey;
  const instance = evolutionConfig.instance;
  
  // Input validation
  if (!numero || !mensagem) {
    alert("❌ Preencha o número e a mensagem");
    console.warn("Tentativa de enviar mensagem sem dados completos");
    return;
  }
  
  if (!validarNumeroTelefone(numero)) {
    alert("❌ Número inválido. Use formato internacional com código do país: +5511999999999");
    console.error("Número de telefone inválido:", numero);
    return;
  }
  
  // Validate configuration
  if (!url || !apiKey || !instance) {
    alert("❌ Configure a Evolution API primeiro");
    console.warn("Tentativa de enviar mensagem sem configuração completa");
    return;
  }
  
  if (!validarURL(url)) {
    alert("❌ URL inválida na configuração");
    console.error("URL inválida:", url);
    return;
  }
  
  console.log("Enviando mensagem...", { numero, instance });
  
  try {
    const endpoint = url + API_ENDPOINTS.SEND_TEXT + instance;
    const response = await fetchWithTimeout(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "apikey": apiKey
      },
      body: JSON.stringify({
        number: numero,
        text: mensagem
      })
    });
    
    if (!response.ok) {
      throw new Error("Servidor retornou erro: " + response.status + " " + response.statusText);
    }
    
    const data = await response.json();
    console.log("Resposta da API:", data);
    
    // Validate response has message key
    if (data.key || data.message || data.id) {
      alert("✅ Mensagem enviada com sucesso!");
      console.log("Mensagem enviada:", data);
      // Clear form
      mensagemElement.value = "";
    } else {
      console.warn("Resposta da API não contém confirmação esperada:", data);
      alert("⚠️ Mensagem pode ter sido enviada, mas resposta inesperada");
    }
  } catch (error) {
    console.error("Erro ao enviar mensagem:", error);
    alert("❌ Erro ao enviar mensagem: " + error.message + "\n\nVerifique:\n- WhatsApp está conectado\n- Número está correto (formato internacional)\n- Configuração está válida");
  }
}

/**
 * Initializes form fields on page load
 */
window.addEventListener("DOMContentLoaded", function() {
  console.log("Evolution API Integration carregado");
  
  try {
    const urlElement = document.getElementById("evolutionUrl");
    const apiKeyElement = document.getElementById("evolutionApiKey");
    const instanceElement = document.getElementById("evolutionInstance");
    
    // Check if form elements exist
    if (!urlElement || !apiKeyElement || !instanceElement) {
      console.warn("Elementos do formulário Evolution API não encontrados. Isso é normal se a página não contém o formulário.");
      return;
    }
    
    // Load saved configuration if available
    if (evolutionConfig.url) {
      urlElement.value = evolutionConfig.url;
      console.log("URL carregada:", evolutionConfig.url);
    } else {
      console.warn("⚠️ URL não configurada. Configure a Evolution API para usar.");
    }
    
    if (evolutionConfig.apiKey) {
      apiKeyElement.value = evolutionConfig.apiKey;
      console.log("API Key carregada");
    } else {
      console.warn("⚠️ API Key não configurada. Configure a Evolution API para usar.");
    }
    
    if (evolutionConfig.instance) {
      instanceElement.value = evolutionConfig.instance;
      console.log("Instância carregada:", evolutionConfig.instance);
    } else {
      console.warn("⚠️ Instância não configurada. Configure a Evolution API para usar.");
    }
    
    // Show warning if configuration is incomplete
    if (!evolutionConfig.url || !evolutionConfig.apiKey || !evolutionConfig.instance) {
      console.warn("⚠️ Configuração da Evolution API incompleta. Preencha todos os campos.");
    } else {
      console.log("✅ Configuração da Evolution API carregada com sucesso");
    }
  } catch (error) {
    console.error("Erro ao inicializar Evolution API Integration:", error);
  }
});

// ═══════════════════════════════════════════════════════════════════════════
// TROUBLESHOOTING GUIDE
// ═══════════════════════════════════════════════════════════════════════════
//
// Common Issues and Solutions:
//
// 1. "Erro ao conectar" or timeout errors
//    - Check if Evolution API server is running
//    - Verify URL is correct (no typos, no trailing slash)
//    - Check firewall/network settings
//    - Try accessing URL directly in browser
//
// 2. "API Key inválida" or 401 Unauthorized
//    - Verify API Key is correct
//    - Check if API Key hasn't expired
//    - Ensure no extra spaces in API Key
//
// 3. "Instância não existe"
//    - Create instance in Evolution API Manager
//    - Verify instance name matches exactly
//    - Check instance status in Manager
//
// 4. "WhatsApp desconectado"
//    - Generate new QR Code
//    - Scan QR Code with WhatsApp
//    - Check if phone has internet connection
//    - Wait a few seconds after scanning
//
// 5. "Número inválido"
//    - Use international format: +[country][area][number]
//    - Example Brazil: +5511999999999
//    - Example USA: +15551234567
//    - Include + and country code
//
// 6. Phone number format examples by country:
//    - Brazil: +5511999999999 (55 = country, 11 = area)
//    - USA/Canada: +15551234567 (1 = country)
//    - UK: +447911123456 (44 = country)
//    - Argentina: +5491123456789 (54 = country)
//    - Portugal: +351911234567 (351 = country)
//
// ═══════════════════════════════════════════════════════════════════════════
