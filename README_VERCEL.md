# ENSIDE Sistema - Configuração Vercel + Evolution API

## ✅ Arquitetura

```
VERCEL (Frontend)    RENDER (Evolution API)
```

## 📋 Arquivos Criados

- `vercel.json` - Configuração do Vercel
- `package.json` - Dependências do projeto
- `api/whatsapp.js` - API serverless para WhatsApp
- `api/status.js` - API para verificar status

## 🚀 Deploy

```bash
# Instalar Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

## 🔧 Variáveis de Ambiente (já configuradas)

- EVOLUTION_API_URL
- EVOLUTION_API_KEY
- EVOLUTION_INSTANCE

## 📱 Uso no Frontend

```javascript
// Enviar mensagem
fetch('/api/whatsapp', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    action: 'sendText',
    data: { number: '5518999999999', text: 'Olá!' }
  })
});
```

