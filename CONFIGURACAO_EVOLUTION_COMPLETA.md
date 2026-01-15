# 📱 EVOLUTION API - CONFIGURAÇÃO COMPLETA

## ✅ STATUS ATUAL

### Docker Local
- **URL**: http://localhost:8080
- **Versão**: 1.8.2
- **Status**: ✅ ONLINE
- **Manager**: http://localhost:8080/manager
- **Container**: evolution_api (Up 3 hours)
- **PostgreSQL**: postgres:15-alpine (Up 3 hours)

### Render (Online)
- **URL**: https://evolution-api-latest-poc1.onrender.com
- **API Key**: 23D116F5-A4D3-404F-8D38-66EBF544A44A
- **Instância**: enside-master
- **Manager**: https://evolution-api-latest-poc1.onrender.com/manager

## 🔧 INTEGRAÇÃO COM VERCEL

### Variáveis de Ambiente no Vercel

Adicione estas variáveis no painel do Vercel:

```env
EVOLUTION_URL=https://evolution-api-latest-poc1.onrender.com
EVOLUTION_API_KEY=23D116F5-A4D3-404F-8D38-66EBF544A44A
EVOLUTION_INSTANCE=enside-master
GOOGLE_SHEETS_ID=1FiP885Or0ncyRG_ZZaAvM2vP0sHhDzhLFYifYLjKyIE
```

### Arquivo de Integração (evolution-integration.js)

Crie este arquivo na pasta do projeto:

```javascript
// evolution-integration.js
const EVOLUTION_CONFIG = {
  url: process.env.EVOLUTION_URL || 'https://evolution-api-latest-poc1.onrender.com',
  apiKey: process.env.EVOLUTION_API_KEY || '23D116F5-A4D3-404F-8D38-66EBF544A44A',
  instance: process.env.EVOLUTION_INSTANCE || 'enside-master'
};

async function sendWhatsAppMessage(number, message) {
  const response = await fetch(
    `${EVOLUTION_CONFIG.url}/message/sendText/${EVOLUTION_CONFIG.instance}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': EVOLUTION_CONFIG.apiKey
      },
      body: JSON.stringify({
        number: number,
        textMessage: { text: message }
      })
    }
  );
  return response.json();
}

async function getContactsFromSheets() {
  const SHEETS_ID = process.env.GOOGLE_SHEETS_ID;
  // Implementar integração com Google Sheets API
  // Retornar lista de contatos
}

module.exports = {
  sendWhatsAppMessage,
  getContactsFromSheets,
  EVOLUTION_CONFIG
};
```

## 🚀 DEPLOY NO VERCEL

### 1. Conectar GitHub ao Vercel
```bash
# Já está conectado!
# Repositório: ensideanderson-nova/ENSIDE-MASTER-v16
# Branch: main
```

### 2. Configurar Variáveis de Ambiente
1. Acesse: https://vercel.com/dashboard
2. Selecione o projeto: enside-sistema
3. Vá em Settings > Environment Variables
4. Adicione as variáveis acima

### 3. Redeploy
```bash
# Após adicionar as variáveis, faça redeploy
git add .
git commit -m "feat: integra Evolution API com Vercel"
git push
```

## 📊 SINCRONIZAÇÃO COM GOOGLE SHEETS

### Planilha EUCALIPTO
- **ID**: 1FiP885Or0ncyRG_ZZaAvM2vP0sHhDzhLFYifYLjKyIE
- **Aba**: CONTATOS
- **Contatos**: 7.055+

### Fluxo de Dados
```
Google Sheets (7.055 contatos)
       
  Vercel API
       
Evolution API (WhatsApp)
       
  Envio de Mensagens
```

## ✅ CHECKLIST DE INTEGRAÇÃO

- [x] Docker Evolution API rodando
- [x] PostgreSQL conectado
- [x] Evolution API respondendo
- [x] GitHub sincronizado
- [x] Vercel online
- [ ] Variáveis de ambiente no Vercel
- [ ] WhatsApp conectado
- [ ] Teste de envio de mensagem

## 🔥 PRÓXIMOS PASSOS

1. **Conectar WhatsApp**
   ```bash
   open http://localhost:8080/manager
   # Ou
   open https://evolution-api-latest-poc1.onrender.com/manager
   ```

2. **Testar Envio**
   ```bash
   ./ENVIAR_LISTA_WHATSAPP.sh
   ```

3. **Verificar Logs**
   ```bash
   docker logs evolution_api
   ```

