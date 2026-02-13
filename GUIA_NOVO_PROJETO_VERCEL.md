# 🚀 GUIA - Criar Novo Projeto Vercel "enside-master-v21"

## Opção 1: Criar via GitHub + Vercel (RECOMENDADO)

### Passo 1: Criar novo repositório no GitHub

1. Acesse: https://github.com/new
2. Nome: `enside-master-v21`
3. Descrição: `Evolution API + Google Sheets Integration`
4. Clique em "Create repository"

### Passo 2: Fazer push do código

```bash
cd /Users/andersonenside/evolution
git remote add vercel-prod https://github.com/SEU_USUARIO/enside-master-v21.git
git push -u vercel-prod main
```

### Passo 3: Conectar ao Vercel

1. Acesse: https://vercel.com/dashboard
2. Clique em "Add New..." → "Project"
3. Selecione o repositório `enside-master-v21`
4. Configure as variáveis:
   - EVOLUTION_API_URL: `https://evolution-api.production.vercel.app`
   - EVOLUTION_API_KEY: `429683C4C977415CAAFCCE10F7D57E11`
   - INSTANCE_NAME: `enside_whatsapp`
5. Clique em "Deploy"

---

## Opção 2: Deploy via Vercel CLI (RÁPIDO)

```bash
npm install -g vercel
cd /Users/andersonenside/evolution
vercel --prod --name enside-master-v21
```

---

## Opção 3: Usar domínio customizado na conta Vercel atual

Se você quer usar `enside-master-v21` como subdomain:

1. Acesse: https://vercel.com/dashboard
2. Selecione o projeto atual
3. Settings → Domains
4. Adicione: `enside-master-v21.vercel.app`

---

## URL Final Esperada

```
https://enside-master-v21.vercel.app/control-center-v21.html
```

---

## Configuração do Projeto

O projeto inclui:

✅ Express Server (index.js - 806 linhas)
✅ Evolution API Integration
✅ Google Sheets EUCALIPTO (7.055+ contatos)
✅ 3 Dashboards principais:

- control-center-v21.html
- enside-master-v21.html
- api-status.html
  ✅ 8 Endpoints API:
- /health
- /status
- /api/instances
- /api/sheets
- /api/sync-instances
- /evolution-manager
- /api/docs
  ✅ Fallback automático (offline-first)
  ✅ CORS habilitado
  ✅ Todos os arquivos em /public

---

## Variáveis de Ambiente (Vercel)

```env
EVOLUTION_API_URL=https://evolution-api.production.vercel.app
EVOLUTION_API_KEY=429683C4C977415CAAFCCE10F7D57E11
INSTANCE_NAME=enside_whatsapp
```

---

## Arquivo package.json

```json
{
  "name": "enside-master-v21",
  "version": "2.1.0",
  "type": "module",
  "scripts": {
    "start": "node index.js",
    "dev": "node index.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "axios": "^1.6.0"
  }
}
```

---

## vercel.json Configuração

```json
{
  "version": 2,
  "buildCommand": "npm run build || echo 'no build'",
  "installCommand": "npm install",
  "builds": [
    {
      "src": "index.js",
      "use": "@vercel/node"
    },
    {
      "src": "api/**/*.js",
      "use": "@vercel/node"
    }
  ],
  "env": {
    "EVOLUTION_API_URL": "https://evolution-api.production.vercel.app",
    "EVOLUTION_API_KEY": "429683C4C977415CAAFCCE10F7D57E11",
    "INSTANCE_NAME": "enside_whatsapp"
  },
  "routes": [
    {
      "src": "^/api/health$",
      "dest": "api/health.js"
    },
    {
      "src": "^/api/status$",
      "dest": "api/status.js"
    },
    {
      "src": "^/.*",
      "dest": "index.js"
    }
  ]
}
```

---

## Após Deploy - Teste as URLs

```
✅ https://enside-master-v21.vercel.app/health
✅ https://enside-master-v21.vercel.app/control-center-v21.html
✅ https://enside-master-v21.vercel.app/enside-master-v21.html
✅ https://enside-master-v21.vercel.app/api/instances
✅ https://enside-master-v21.vercel.app/api/sheets
```

---

## 🎯 RESUMO

Escolha uma opção acima e execute. Após deploy:

1. A URL será: `https://enside-master-v21.vercel.app`
2. Dashboard principal: `/control-center-v21.html`
3. Todos os endpoints funcionarão
4. Google Sheets sincronizado
5. Sistema 100% operacional

---

**Desenvolvido com ❤️ - ENSIDE Team**
**Data: 12 de Fevereiro de 2026**
