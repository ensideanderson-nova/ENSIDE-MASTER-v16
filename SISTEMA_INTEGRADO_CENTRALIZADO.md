# ✅ ENSIDE SYSTEM - INTEGRAÇÃO CENTRALIZADA

## 🎯 DASHBOARD PRINCIPAL

**URL:** `https://evolution-rust.vercel.app/enside-master-v21.html`

**Status:** ✅ 100% Integrado e Operacional

---

## 🔗 HUB INTEGRADOR (NOVO)

**URL:** `https://evolution-rust.vercel.app/index-hub.html`

**Função:** Dashboard centralizado que integra todos os componentes do sistema

**Recursos:**
- ✅ Acesso rápido a todos os dashboards
- ✅ Status em tempo real de API, Sheets e Instâncias
- ✅ Detecção automática de API (Local ou Vercel)
- ✅ Links diretos para cada módulo

---

## 📦 ARQUIVOS CRIADOS

### 1. `public/enside-config.js` (Módulo de Configuração)
```javascript
// Configuração centralizada global
const ENSIDE_CONFIG = {
  MAIN_DASHBOARD: "https://evolution-rust.vercel.app/enside-master-v21.html",
  EVOLUTION: {
    API_URL_PROD: "https://evolution-api.production.vercel.app",
    API_KEY: "429683C4C977415CAAFCCE10F7D57E11",
    INSTANCE_NAME: "enside_whatsapp"
  },
  SHEETS: {
    ID: "1FiP885Or0ncyRG_ZZaAvM2vP0sHhDzhLFYifYLjKyIE",
    NAME: "EUCALIPTO",
    TOTAL_CONTATOS: 7055
  },
  API: {
    LOCAL: "http://localhost:3000",
    VERCEL: "https://evolution-rust.vercel.app"
  }
}
```

**Funções Disponíveis:**
- `detectAPI()` - Detectar API local ou Vercel
- `fetchFromAPI(endpoint, options)` - Fetch com detecção automática
- `getSystemStatus()` - Status do sistema
- `getInstances()` - Listar instâncias
- `getSheets()` - Carregar Google Sheets
- `syncInstances()` - Sincronizar com Sheets
- `navigateToDashboard()` - Ir para dashboard principal
- `navigateToControlCenter()` - Ir para control center
- `navigateToManager()` - Ir para manager

**Acesso Global:**
```javascript
window.ENSIDE.getSystemStatus()
window.ENSIDE.navigateToDashboard()
window.ENSIDE.config
```

### 2. `public/index-hub.html` (Hub Integrador)
```
Dashboard centralizado com 6 cards:
1. Dashboard v2.1 (PRINCIPAL)
2. Control Center
3. Evolution Manager
4. API Status
5. Google Sheets
6. Documentação API
```

**Status em Tempo Real:**
- API Status (Local/Vercel)
- Instância (enside_whatsapp)
- Google Sheets (EUCALIPTO)
- Vercel Status

---

## 🌐 INTEGRAÇÃO DE TODOS OS HTMLs

### Dashboard Principal
```html
<!-- enside-master-v21.html -->
<script src="/enside-config.js"></script>
```
✅ Configurado para usar ENSIDE_CONFIG

### Control Center
```html
<!-- control-center-v21.html -->
<script src="/enside-config.js"></script>
```
✅ Configurado para usar endpoints centralizados

### Evolution Manager
```html
<!-- evolution-manager (dinâmico no index.js) -->
```
✅ Usa endpoints do index.js

### API Status
```html
<!-- api-status.html -->
<script src="/enside-config.js"></script>
```
✅ Acesso a status centralizado

---

## ✅ ENDPOINTS INTEGRADOS

| Endpoint | Método | Função |
|----------|--------|--------|
| `/` | GET | Redireciona para hub |
| `/health` | GET | Health check |
| `/status` | GET | Status da API |
| `/api/instances` | GET | Listar instâncias |
| `/api/sheets` | GET | Google Sheets |
| `/api/sync-instances` | POST | Sincronizar |
| `/evolution-manager` | GET | Manager UI |
| `/api/docs` | GET | Documentação |
| `/enside-config.js` | GET | Módulo config |
| `/index-hub.html` | GET | Hub integrador |
| `/enside-master-v21.html` | GET | Dashboard principal |
| `/control-center-v21.html` | GET | Control center |

---

## 🔧 DETECÇÃO AUTOMÁTICA DE API

**Prioridade:**
1. Tenta API Local (localhost:3000)
2. Se falha → Usa Vercel (evolution-rust.vercel.app)
3. Sempre mantém fallback para Vercel

**Implementação:**
```javascript
async function detectAPI() {
  // Tenta local
  // Se falha, usa Vercel
  // Configura ENSIDE_CONFIG.API.CURRENT
}
```

---

## 📊 EVOLUTION API INTEGRADA

**Em Todos os HTMLs:**
- ✅ URL: `https://evolution-api.production.vercel.app`
- ✅ API Key: `429683C4C977415CAAFCCE10F7D57E11`
- ✅ Instância: `enside_whatsapp`
- ✅ Provider: Baileys

---

## 🔌 GOOGLE SHEETS INTEGRADO

**Configuração Centralizada:**
- ✅ Sheet ID: `1FiP885Or0ncyRG_ZZaAvM2vP0sHhDzhLFYifYLjKyIE`
- ✅ Nome: `EUCALIPTO`
- ✅ Contatos: `7.055+`
- ✅ Sincronização: Automática

---

## 🚀 COMO USAR

### Acessar o Hub Integrador
```
https://evolution-rust.vercel.app/index-hub.html
```

### Ir para Dashboard Principal
```javascript
window.ENSIDE.navigateToDashboard()
// Abre: https://evolution-rust.vercel.app/enside-master-v21.html
```

### Obter Status do Sistema
```javascript
const status = await window.ENSIDE.getSystemStatus()
console.log(status)
```

### Sincronizar com Sheets
```javascript
const result = await window.ENSIDE.syncInstances()
console.log(result)
```

---

## 📁 ESTRUTURA DE ARQUIVOS

```
evolution/
├── public/
│   ├── enside-config.js              # Módulo de configuração
│   ├── index-hub.html                # Hub integrador
│   ├── enside-master-v21.html        # Dashboard principal
│   ├── control-center-v21.html       # Control center
│   ├── api-status.html               # Status da API
│   └── [outros arquivos]
├── index.js                          # Servidor Express
├── vercel.json                       # Config Vercel
└── [outros arquivos]
```

---

## ✅ VERIFICAÇÃO FINAL

✅ **Módulo de Configuração**
- Arquivo: `public/enside-config.js`
- Funções: 8 principais
- Acesso Global: `window.ENSIDE`

✅ **Hub Integrador**
- Arquivo: `public/index-hub.html`
- Cards: 6 módulos
- Status: Real-time

✅ **Todos os HTMLs Integrados**
- ✅ enside-master-v21.html (PRINCIPAL)
- ✅ control-center-v21.html
- ✅ api-status.html
- ✅ Dinâmicos via index.js

✅ **Evolution API**
- ✅ Integrada em todos os HTMLs
- ✅ Detecção automática
- ✅ Fallback para Vercel

✅ **Google Sheets**
- ✅ Sincronização centralizada
- ✅ Endpoint `/api/sheets`
- ✅ Endpoint `/api/sync-instances`

---

## 🎯 RESUMO DE INTEGRAÇÃO

**Dashboard Principal:** https://evolution-rust.vercel.app/enside-master-v21.html
**Hub Integrador:** https://evolution-rust.vercel.app/index-hub.html

**Todos os componentes do sistema estão:**
- ✅ Integrados e centralizados
- ✅ Conectados à Evolution API
- ✅ Sincronizados com Google Sheets
- ✅ Operacionais no Vercel
- ✅ Acessíveis via URLs diretas

---

**Commit:** `1c9f0ad6 - feat: add ENSIDE integrated configuration system`
**Status:** ✅ 100% OPERACIONAL
**Data:** 12 de Fevereiro de 2026
