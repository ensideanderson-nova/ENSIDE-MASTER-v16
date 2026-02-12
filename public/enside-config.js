// ==========================================
// ENSIDE SYSTEM - CONFIGURAÇÃO CENTRALIZADA
// Principal: https://evolution-rust.vercel.app/enside-master-v21.html
// ==========================================

// Configuração Global do Sistema
const ENSIDE_CONFIG = {
  // URLs de Acesso
  MAIN_DASHBOARD: "https://evolution-rust.vercel.app/enside-master-v21.html",
  CONTROL_CENTER: "https://evolution-rust.vercel.app/control-center-v21.html",
  EVOLUTION_MANAGER: "https://evolution-rust.vercel.app/evolution-manager",
  API_STATUS: "https://evolution-rust.vercel.app/api-status.html",
  
  // Configuração Local
  LOCAL_PORT: 3000,
  LOCAL_API_PORT: 8080,
  
  // Evolution API
  EVOLUTION: {
    API_URL_PROD: "https://evolution-api.production.vercel.app",
    API_URL_LOCAL: "http://localhost:8080",
    API_KEY: "429683C4C977415CAAFCCE10F7D57E11",
    INSTANCE_NAME: "enside_whatsapp",
    PROVIDER: "Baileys",
  },
  
  // Google Sheets
  SHEETS: {
    ID: "1FiP885Or0ncyRG_ZZaAvM2vP0sHhDzhLFYifYLjKyIE",
    NAME: "EUCALIPTO",
    TOTAL_CONTATOS: 7055,
  },
  
  // Vercel Deployment
  VERCEL: {
    URL: "https://evolution-rust.vercel.app",
    STATUS: "ONLINE",
    REGION: "vercel",
  },
  
  // Base URLs para API
  API: {
    LOCAL: "http://localhost:3000",
    VERCEL: "https://evolution-rust.vercel.app",
    CURRENT: null, // Será determinado dinamicamente
  },
  
  // Endpoints
  ENDPOINTS: {
    HEALTH: "/health",
    STATUS: "/status",
    INSTANCES: "/api/instances",
    SHEETS: "/api/sheets",
    SYNC: "/api/sync-instances",
    MANAGER: "/evolution-manager",
    DOCS: "/api/docs",
  },
  
  // Timeouts
  TIMEOUT: {
    LOCAL: 3000,
    VERCEL: 5000,
    SHEETS: 5000,
  }
};

// ==========================================
// FUNÇÕES UTILITÁRIAS DE DETECÇÃO
// ==========================================

async function detectAPI() {
  // Tentar API local primeiro
  try {
    const response = await fetch(
      `${ENSIDE_CONFIG.API.LOCAL}${ENSIDE_CONFIG.ENDPOINTS.HEALTH}`,
      { timeout: ENSIDE_CONFIG.TIMEOUT.LOCAL }
    );
    if (response.ok) {
      ENSIDE_CONFIG.API.CURRENT = ENSIDE_CONFIG.API.LOCAL;
      console.log("✅ API LOCAL detectada: " + ENSIDE_CONFIG.API.LOCAL);
      return ENSIDE_CONFIG.API.LOCAL;
    }
  } catch (err) {
    console.log("⚠️ API local não disponível");
  }
  
  // Fallback para Vercel
  ENSIDE_CONFIG.API.CURRENT = ENSIDE_CONFIG.API.VERCEL;
  console.log("✅ API VERCEL em uso: " + ENSIDE_CONFIG.API.VERCEL);
  return ENSIDE_CONFIG.API.VERCEL;
}

// ==========================================
// FETCH HELPERS COM DETECÇÃO AUTOMÁTICA
// ==========================================

async function fetchFromAPI(endpoint, options = {}) {
  const url = `${ENSIDE_CONFIG.API.CURRENT}${endpoint}`;
  const timeout = options.timeout || ENSIDE_CONFIG.TIMEOUT.VERCEL;
  
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });
    
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    console.error(`❌ Erro ao acessar ${url}:`, error);
    throw error;
  }
}

// ==========================================
// FUNÇÕES DE INICIALIZAÇÃO
// ==========================================

async function initializeENSIDE() {
  console.log("🚀 Inicializando ENSIDE System...");
  
  // Detectar API disponível
  await detectAPI();
  
  // Log de inicialização
  console.log("📊 Configuração ENSIDE:");
  console.log("  - Dashboard Principal: " + ENSIDE_CONFIG.MAIN_DASHBOARD);
  console.log("  - Evolution API: " + ENSIDE_CONFIG.EVOLUTION.API_KEY);
  console.log("  - Instância: " + ENSIDE_CONFIG.EVOLUTION.INSTANCE_NAME);
  console.log("  - Google Sheets: " + ENSIDE_CONFIG.SHEETS.NAME);
  console.log("  - API Atual: " + ENSIDE_CONFIG.API.CURRENT);
  
  return ENSIDE_CONFIG;
}

// ==========================================
// FUNÇÕES DE NAVEGAÇÃO
// ==========================================

function navigateToDashboard() {
  window.location.href = ENSIDE_CONFIG.MAIN_DASHBOARD;
}

function navigateToControlCenter() {
  window.location.href = ENSIDE_CONFIG.CONTROL_CENTER;
}

function navigateToManager() {
  window.location.href = ENSIDE_CONFIG.EVOLUTION_MANAGER;
}

function openInNewTab(url) {
  window.open(url, "_blank");
}

// ==========================================
// FUNÇÕES DE STATUS
// ==========================================

async function getSystemStatus() {
  try {
    const response = await fetchFromAPI(ENSIDE_CONFIG.ENDPOINTS.STATUS);
    if (response.ok) {
      return await response.json();
    }
  } catch (error) {
    console.error("❌ Erro ao obter status:", error);
  }
  return null;
}

async function getInstances() {
  try {
    const response = await fetchFromAPI(ENSIDE_CONFIG.ENDPOINTS.INSTANCES);
    if (response.ok) {
      return await response.json();
    }
  } catch (error) {
    console.error("❌ Erro ao obter instâncias:", error);
  }
  return null;
}

async function getSheets() {
  try {
    const response = await fetchFromAPI(ENSIDE_CONFIG.ENDPOINTS.SHEETS, {
      timeout: ENSIDE_CONFIG.TIMEOUT.SHEETS,
    });
    if (response.ok) {
      return await response.json();
    }
  } catch (error) {
    console.error("❌ Erro ao obter Google Sheets:", error);
  }
  return null;
}

async function syncInstances() {
  try {
    const response = await fetchFromAPI(ENSIDE_CONFIG.ENDPOINTS.SYNC, {
      method: "POST",
      body: JSON.stringify({}),
    });
    if (response.ok) {
      return await response.json();
    }
  } catch (error) {
    console.error("❌ Erro ao sincronizar:", error);
  }
  return null;
}

// ==========================================
// INICIALIZAÇÃO AUTOMÁTICA
// ==========================================

document.addEventListener("DOMContentLoaded", async () => {
  await initializeENSIDE();
});

// Exportar para acesso global
window.ENSIDE = {
  config: ENSIDE_CONFIG,
  detectAPI,
  fetchFromAPI,
  initializeENSIDE,
  navigateToDashboard,
  navigateToControlCenter,
  navigateToManager,
  openInNewTab,
  getSystemStatus,
  getInstances,
  getSheets,
  syncInstances,
};

console.log("✅ ENSIDE Configuration Module Loaded");
console.log("📚 Use window.ENSIDE para acessar funções globais");
