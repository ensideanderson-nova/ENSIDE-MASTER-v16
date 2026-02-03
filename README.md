# 🚀 ENSIDE MASTER v2.0 - Sistema Integrado

Sistema de gestão integrado com Evolution API (WhatsApp), Google Sheets e Vercel.

## 📋 Índice

- [Configuração](#configuração)
- [Variáveis de Ambiente](#variáveis-de-ambiente)
- [Instalação](#instalação)
- [Uso](#uso)
- [API Endpoints](#api-endpoints)
- [Deploy no Vercel](#deploy-no-vercel)

---

## 🔧 Configuração

### Ambientes Suportados

1. **Produção (Render)** - Evolution API hospedada no Render
2. **Local (Docker)** - Evolution API rodando localmente via Docker

### Configuração Padrão - Produção

```javascript
URL: https://evolution-api-latest-poc1.onrender.com
API Key: evolution-api-enside-2024-secret
Instance: enside
```

### Configuração Local - Desenvolvimento

```javascript
URL: http://localhost:8080
API Key: 919AA333-AE59-4B06-B1EF-C9A9F9C8C0F6
Instance: enside
```

---

## 🔐 Variáveis de Ambiente

### Arquivo `.env` (Produção)

```env
# Evolution API - Produção
EVOLUTION_API_URL=https://evolution-api-latest-poc1.onrender.com
EVOLUTION_API_KEY=evolution-api-enside-2024-secret
EVOLUTION_INSTANCE=enside

# Evolution API - Local
EVOLUTION_API_URL_LOCAL=http://localhost:8080
EVOLUTION_API_KEY_LOCAL=919AA333-AE59-4B06-B1EF-C9A9F9C8C0F6
EVOLUTION_INSTANCE_LOCAL=enside

# Outras configurações
WHATSAPP_NUMBER=5518996540492
GOOGLE_SHEETS_ID=1FiP885Or0ncyRG_ZZaAvM2vP0sHhDzhLFYifYLjKyIE
VERCEL_URL=https://enside-sistema.vercel.app
```

**⚠️ IMPORTANTE:** Nunca commite o arquivo `.env` com suas chaves reais. Use `.env.example` como template.

---

## 📦 Instalação

### 1. Clone o Repositório

```bash
git clone https://github.com/ensideanderson-nova/ENSIDE-MASTER-v16.git
cd ENSIDE-MASTER-v16
```

### 2. Instale as Dependências

```bash
npm install
```

### 3. Configure as Variáveis de Ambiente

```bash
cp .env.example .env
# Edite o arquivo .env com suas credenciais
```

### 4. Inicie o Servidor

```bash
npm start        # Produção
npm run dev      # Desenvolvimento
```

---

## 🎯 Uso

### Testar Integração

```bash
npm test
```

ou com ambiente específico:

```bash
NODE_ENV=production npm test
```

### Enviar Mensagem WhatsApp (via código)

```javascript
import { sendWhatsAppMessage } from './evolution-integration.js';

const result = await sendWhatsAppMessage('5518996540492', 'Olá! Teste de mensagem');
console.log(result);
```

### Verificar Status da Instância

```javascript
import { checkInstanceStatus } from './evolution-integration.js';

const status = await checkInstanceStatus();
console.log(status);
```

---

## 🌐 API Endpoints

### 1. Status da Instância Evolution API

**Endpoint:** `GET /api/status`

**Resposta:**
```json
{
  "state": "open",
  "instance": "enside"
}
```

### 2. Enviar Mensagem WhatsApp

**Endpoint:** `POST /api/sendMessage`

**Body:**
```json
{
  "number": "5518996540492",
  "message": "Sua mensagem aqui"
}
```

**Resposta:**
```json
{
  "success": true,
  "messageId": "..."
}
```

### 3. Webhook para Mensagens Recebidas

**Endpoint:** `POST /api/webhook`

Recebe notificações do Evolution API quando mensagens são recebidas no WhatsApp.

---

## ☁️ Deploy no Vercel

### 1. Configure as Environment Variables

No painel do Vercel, adicione as seguintes variáveis de ambiente:

**Opção A: Usando valores diretos (mais simples)**

| Variável | Valor |
|----------|-------|
| `EVOLUTION_API_URL` | `https://evolution-api-latest-poc1.onrender.com` |
| `EVOLUTION_API_KEY` | `evolution-api-enside-2024-secret` |
| `EVOLUTION_INSTANCE` | `enside` |
| `GOOGLE_SHEETS_ID` | `1FiP885Or0ncyRG_ZZaAvM2vP0sHhDzhLFYifYLjKyIE` |
| `NODE_ENV` | `production` |

**Opção B: Usando Vercel Secrets (mais seguro)**

1. Crie um secret no Vercel:
   ```bash
   vercel secrets add evolution-api-key "evolution-api-enside-2024-secret"
   ```

2. O `vercel.json` já está configurado para usar `@evolution-api-key` que referencia este secret

3. Configure as outras variáveis normalmente no painel

**⚠️ Nota:** O `vercel.json` usa `@evolution-api-key` que é uma referência a um Vercel Secret. Se você optar por não usar secrets, pode configurar `EVOLUTION_API_KEY` diretamente no painel do Vercel.

### 2. Deploy

```bash
vercel --prod
```

### 3. Configure o Webhook

No painel do Evolution API (Render), configure o webhook para:

```
https://seu-dominio.vercel.app/api/webhook
```

---

## 📁 Estrutura do Projeto

```
ENSIDE-MASTER-v16/
├── api/                          # Endpoints da API Vercel
│   ├── status.js                # Status da instância
│   ├── sendMessage.js           # Enviar mensagem
│   └── webhook.js               # Receber mensagens
├── CONFIG/                       # Configurações
│   └── EVOLUTION_API_CONFIG.js  # Config Evolution API
├── evolution-integration.js      # Módulo de integração principal
├── server.js                     # Servidor Express
├── testar-integracao.js         # Script de teste
├── package.json                  # Dependências
├── vercel.json                   # Configuração Vercel
├── .env                          # Variáveis de ambiente (não commitado)
└── .env.example                  # Template de variáveis
```

---

## 🔄 Changelog v2.0.0

### ✅ Correções Implementadas

1. **Padronização de URLs**
   - Todos os arquivos agora usam `https://evolution-api-latest-poc1.onrender.com`
   - Removida URL antiga `https://evolution-api-enside.onrender.com`

2. **Padronização de API Keys**
   - Produção: `evolution-api-enside-2024-secret`
   - Local: `919AA333-AE59-4B06-B1EF-C9A9F9C8C0F6`
   - Removida key antiga `23D116F5-A4D3-404F-8D38-66EBF544A44A`

3. **Padronização de Nomes de Instância**
   - Todos os arquivos agora usam `enside` (lowercase)
   - Removido `ENSIDE` (uppercase)

4. **Novo Arquivo `vercel.json`**
   - Configuração adequada para deploy no Vercel
   - Headers CORS configurados
   - Environment variables definidas

5. **Novo Arquivo `.env.example`**
   - Template para variáveis de ambiente
   - Documentação de todas as variáveis necessárias

6. **Conversão para ES Modules**
   - `evolution-integration.js` convertido de CommonJS para ES modules
   - `testar-integracao.js` atualizado para usar `import`
   - Consistência com `"type": "module"` no `package.json`

7. **Package.json Aprimorado**
   - Versão atualizada para 2.0.0
   - Scripts `dev` e `test` adicionados
   - Engines requirement adicionado (Node >= 18)

---

## 🛠️ Tecnologias

- **Node.js** >= 18.0.0
- **Express** 4.19.2
- **Evolution API** (WhatsApp API)
- **Vercel** (Hosting)
- **Google Sheets** (Database)

---

## 📞 Suporte

Para problemas ou dúvidas:

1. Verifique se todas as variáveis de ambiente estão configuradas
2. Execute `npm test` para validar a conexão
3. Verifique os logs do Vercel em caso de erro no deploy
4. Confirme que a instância Evolution API está conectada

---

## ⚠️ Notas de Segurança

- **Nunca** commite o arquivo `.env` com chaves reais
- Mantenha o `.env` no `.gitignore`
- Use variáveis de ambiente no Vercel para produção
- Não exponha API Keys em código público

---

## 📄 Licença

Projeto proprietário - ENSIDE Madeiras © 2026
