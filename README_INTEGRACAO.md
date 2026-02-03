# 🚀 Integração Evolution API + Vercel - ENSIDE MASTER

## ✅ Status da Integração
- **Evolution API (Render)**: https://evolution-api-latest-poc1.onrender.com
- **Vercel**: https://enside-sistema.vercel.app
- **Instância WhatsApp**: ENSIDE

## 🔧 Configuração

### 1. Variáveis de Ambiente no Vercel
Configure no painel do Vercel (Settings > Environment Variables):

```
EVOLUTION_API_URL=https://evolution-api-latest-poc1.onrender.com
EVOLUTION_API_KEY=evolution-api-enside-2024-secret
EVOLUTION_INSTANCE=ENSIDE
GOOGLE_SHEETS_ID=1FiP885Or0ncyRG_ZZaAvM2vP0sHhDzhLFYifYLjKyIE
NODE_ENV=production
```

### 2. Endpoints Disponíveis

#### Status da Instância
```bash
GET https://enside-sistema.vercel.app/api/status
```

#### Enviar Mensagem
```bash
POST https://enside-sistema.vercel.app/api/sendMessage
Content-Type: application/json

{
  "number": "5518996540492",
  "message": "Olá, teste de mensagem!"
}
```

#### Webhook (Receber Mensagens)
```bash
POST https://enside-sistema.vercel.app/api/webhook
```

### 3. Testar Localmente
```bash
# Instalar dependências
npm install

# Copiar variáveis de ambiente
cp .env.example .env

# Editar .env com suas credenciais

# Rodar localmente
npm start
```

### 4. Deploy no Vercel
```bash
# Via Git
git add .
git commit -m "fix: corrige integração Evolution API"
git push

# Vercel fará deploy automático
```

## 📊 Arquitetura

```
Google Sheets (7.055+ contatos)
       ↓
Vercel (Frontend + API Routes)
       ↓
Evolution API (WhatsApp)
       ↓
WhatsApp Business
```

## 🔍 Troubleshooting

### Erro: "Evolution API not responding"
- Verifique se a URL está correta
- Confirme a API Key no painel do Render
- Aguarde 30s (cold start do Render)

### Erro: "Invalid instance"
- Certifique-se que o nome da instância é exatamente: `ENSIDE`
- Verifique no Manager: https://evolution-api-latest-poc1.onrender.com/manager

### Erro: "Unauthorized"
- Confirme a API Key: `evolution-api-enside-2024-secret`
- Verifique as variáveis de ambiente no Vercel
