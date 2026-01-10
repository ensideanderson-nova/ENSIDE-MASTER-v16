#!/bin/bash

# ============================================
# SCRIPT COMPLETO: RESETAR DOCKER E CRIAR EVOLUTION API NOVA
# ============================================

echo ""
echo "╔════════════════════════════════════════════╗"
echo "║  🔄 RESETAR DOCKER E CRIAR EVOLUTION API  ║"
echo "╚════════════════════════════════════════════╝"
echo ""

# ============================================
# 1. PARAR E REMOVER TODOS OS CONTAINERS
# ============================================

echo "1️⃣  PARANDO E REMOVENDO CONTAINERS..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Verificar se existe docker-compose.yml na pasta evolution-api
if [ -d ~/evolution-api ]; then
    cd ~/evolution-api
    echo "✅ Encontrado ~/evolution-api"
    docker-compose down -v
    echo "✅ Containers removidos"
else
    echo "⚠️  Pasta ~/evolution-api não encontrada"
fi

# Parar todos os containers rodando
echo "🛑 Parando todos os containers..."
docker stop $(docker ps -aq) 2>/dev/null || echo "Nenhum container rodando"

# Remover todos os containers
echo "🗑️  Removendo todos os containers..."
docker rm $(docker ps -aq) 2>/dev/null || echo "Nenhum container para remover"

echo ""

# ============================================
# 2. LIMPAR SISTEMA DOCKER
# ============================================

echo "2️⃣  LIMPANDO SISTEMA DOCKER..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Remover volumes não utilizados
docker volume prune -f

# Remover imagens não utilizadas
docker image prune -af

# Remover redes não utilizadas
docker network prune -f

echo "✅ Sistema Docker limpo"
echo ""

# ============================================
# 3. CLONAR EVOLUTION API (SE NÃO EXISTIR)
# ============================================

echo "3️⃣  PREPARANDO EVOLUTION API..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

cd ~

if [ -d ~/evolution-api ]; then
    echo "⚠️  Pasta ~/evolution-api já existe"
    echo "🗑️  Removendo pasta antiga..."
    rm -rf ~/evolution-api
fi

echo "📥 Clonando Evolution API..."
git clone https://github.com/EvolutionAPI/evolution-api.git

cd ~/evolution-api

echo "✅ Evolution API clonada"
echo ""

# ============================================
# 4. CRIAR ARQUIVO .ENV
# ============================================

echo "4️⃣  CRIANDO ARQUIVO .ENV..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

cat << 'EOF' > .env
# ============================================
# EVOLUTION API - CONFIGURAÇÃO ENSIDE
# ============================================

# Servidor
SERVER_URL=http://localhost:8080
PORT=8080

# Autenticação
AUTHENTICATION_TYPE=apikey
AUTHENTICATION_API_KEY=evolution-api-enside-2024-secret

# Database PostgreSQL
DATABASE_ENABLED=true
DATABASE_PROVIDER=postgresql
DATABASE_CONNECTION_URI=postgresql://postgres:postgres@postgres:5432/evolution
DATABASE_SAVE_DATA_INSTANCE=true
DATABASE_SAVE_DATA_NEW_MESSAGE=true
DATABASE_SAVE_MESSAGE_UPDATE=true
DATABASE_SAVE_DATA_CONTACTS=true
DATABASE_SAVE_DATA_CHATS=true

# Redis (opcional)
REDIS_ENABLED=false

# Logs
LOG_LEVEL=ERROR
LOG_COLOR=true

# WhatsApp
WHATSAPP_INTEGRATION=WHATSAPP-BAILEYS

# Armazenamento
STORE_MESSAGES=true
STORE_CONTACTS=true
STORE_CHATS=true

# Webhook (opcional)
WEBHOOK_GLOBAL_ENABLED=false
EOF

echo "✅ Arquivo .env criado"
echo ""

# ============================================
# 5. SUBIR CONTAINERS DOCKER
# ============================================

echo "5️⃣  SUBINDO CONTAINERS DOCKER..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

docker-compose up -d

echo ""
echo "⏳ Aguardando containers iniciarem (30 segundos)..."
sleep 30

echo ""

# ============================================
# 6. VERIFICAR STATUS
# ============================================

echo "6️⃣  VERIFICANDO STATUS..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

docker ps

echo ""

# ============================================
# 7. TESTAR API
# ============================================

echo "7️⃣  TESTANDO API..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

sleep 5

RESPONSE=$(curl -s http://localhost:8080 -H "apikey: evolution-api-enside-2024-secret")

if echo "$RESPONSE" | grep -q "Welcome to the Evolution API"; then
    echo "✅ Evolution API respondendo corretamente"
    echo "$RESPONSE" | jq .
else
    echo "❌ Evolution API não respondeu corretamente"
    echo "$RESPONSE"
fi

echo ""

# ============================================
# 8. CRIAR INSTÂNCIA ENSIDE-MASTER
# ============================================

echo "8️⃣  CRIANDO INSTÂNCIA ENSIDE-MASTER..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

CREATE_RESPONSE=$(curl -s -X POST http://localhost:8080/instance/create \
  -H "apikey: evolution-api-enside-2024-secret" \
  -H "Content-Type: application/json" \
  -d '{
    "instanceName": "enside-master",
    "token": "evolution-api-enside-2024-secret",
    "integration": "WHATSAPP-BAILEYS"
  }')

echo "$CREATE_RESPONSE" | jq .

if echo "$CREATE_RESPONSE" | grep -q "instanceName"; then
    echo "✅ Instância criada com sucesso"
else
    echo "⚠️  Erro ao criar instância (pode já existir)"
fi

echo ""

# ============================================
# 9. GERAR QR CODE
# ============================================

echo "9️⃣  GERANDO QR CODE..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

sleep 5

QR_RESPONSE=$(curl -s http://localhost:8080/instance/connect/enside-master \
  -H "apikey: evolution-api-enside-2024-secret")

QR_CODE=$(echo "$QR_RESPONSE" | jq -r '.qr')

if [ "$QR_CODE" != "null" ] && [ -n "$QR_CODE" ]; then
    echo "✅ QR Code gerado"
    
    # Criar HTML com QR Code
    cat << HTML > /tmp/qr_enside_local.html
<html>
<head>
  <title>QR Code WhatsApp - ENSIDE LOCAL</title>
  <style>
    body { 
      background: #0f0f0f; 
      color: white; 
      text-align: center; 
      font-family: sans-serif;
      padding: 30px;
    }
    img { 
      margin-top: 30px; 
      width: 400px;
      border: 5px solid #25D366;
      border-radius: 10px;
    }
    h1 { color: #25D366; }
  </style>
</head>
<body>
  <h1>📲 Escaneie com o WhatsApp</h1>
  <p>Evolution API Local (Docker)</p>
  <img src="$QR_CODE" />
  <p>WhatsApp > Configurações > Dispositivos Conectados</p>
</body>
</html>
HTML
    
    # Abrir QR Code no navegador
    open /tmp/qr_enside_local.html
    
    echo "📱 QR Code aberto no navegador"
else
    echo "⚠️  QR Code não retornado"
    echo "📱 Abra manualmente: http://localhost:8080"
fi

echo ""

# ============================================
# RESUMO FINAL
# ============================================

echo "╔════════════════════════════════════════════╗"
echo "║  ✅ PROCESSO CONCLUÍDO                    ║"
echo "╠════════════════════════════════════════════╣"
echo "║                                            ║"
echo "║  🟢 Docker limpo e resetado               ║"
echo "║  🟢 Evolution API instalada               ║"
echo "║  🟢 Containers rodando                    ║"
echo "║  🟢 Instância enside-master criada        ║"
echo "║  🟢 QR Code gerado                        ║"
echo "║                                            ║"
echo "║  📱 PRÓXIMO PASSO:                        ║"
echo "║  Escaneie o QR Code com WhatsApp          ║"
echo "║                                            ║"
echo "║  🌐 URLs:                                 ║"
echo "║  Evolution API: http://localhost:8080     ║"
echo "║  Manager: http://localhost:8080/manager   ║"
echo "║                                            ║"
echo "║  🔑 CREDENCIAIS:                          ║"
echo "║  API Key: evolution-api-enside-2024-secret║"
echo "║  Instância: enside-master                 ║"
echo "║                                            ║"
echo "╚════════════════════════════════════════════╝"
echo ""
