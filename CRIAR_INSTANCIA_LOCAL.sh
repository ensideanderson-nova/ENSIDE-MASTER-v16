#!/bin/bash

# ============================================
# 🚀 CRIAR INSTÂNCIA EVOLUTION API LOCAL
# Docker localhost:8080
# ============================================

echo ""
echo "╔════════════════════════════════════════════╗"
echo "║ 🚀 CRIAR INSTÂNCIA EVOLUTION API LOCAL     ║"
echo "║    Docker localhost:8080                   ║"
echo "╚════════════════════════════════════════════╝"
echo ""

# Configurações
API_URL="http://localhost:8080"
API_KEY="B6E3F4A1-2C5D-4E8F-9A0B-1C2D3E4F5A6B"
INSTANCE_NAME="enside-local"

# ============================================
# 1️⃣ VERIFICAR DOCKER
# ============================================

echo "1️⃣ Verificando Docker..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if ! docker ps &>/dev/null; then
    echo "❌ Docker não está rodando"
    echo "👉 Abra o Docker Desktop e tente novamente"
    exit 1
fi

echo "✅ Docker rodando"
echo ""

# ============================================
# 2️⃣ VERIFICAR EVOLUTION API LOCAL
# ============================================

echo "2️⃣ Verificando Evolution API local..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

RESPONSE=$(curl -s "$API_URL" -H "apikey: $API_KEY")

if echo "$RESPONSE" | grep -q "Welcome to the Evolution API"; then
    echo "✅ Evolution API local respondendo"
    VERSION=$(echo "$RESPONSE" | jq -r '.version' 2>/dev/null || echo "desconhecida")
    echo "   Versão: $VERSION"
else
    echo "❌ Evolution API local não está respondendo"
    echo "👉 Verifique se o container está rodando: docker ps"
    exit 1
fi

echo ""

# ============================================
# 3️⃣ DELETAR INSTÂNCIA ANTIGA (se existir)
# ============================================

echo "3️⃣ Deletando instância antiga (se existir)..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

curl -s -X DELETE "$API_URL/instance/delete/$INSTANCE_NAME" \
    -H "apikey: $API_KEY" > /dev/null 2>&1

echo "✅ Instância antiga removida (se existia)"
echo ""

sleep 2

# ============================================
# 4️⃣ CRIAR INSTÂNCIA NOVA
# ============================================

echo "4️⃣ Criando instância NOVA..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

CREATE_RESPONSE=$(curl -s -X POST "$API_URL/instance/create" \
    -H "apikey: $API_KEY" \
    -H "Content-Type: application/json" \
    -d "{
        \"instanceName\": \"$INSTANCE_NAME\",
        \"token\": \"$API_KEY\",
        \"integration\": \"WHATSAPP-BAILEYS\"
    }")

echo "$CREATE_RESPONSE" | jq .

if echo "$CREATE_RESPONSE" | grep -q "error"; then
    echo ""
    echo "❌ Erro ao criar instância"
    echo "$CREATE_RESPONSE" | jq -r '.response.message' 2>/dev/null || echo "$CREATE_RESPONSE"
    exit 1
fi

echo ""
echo "✅ Instância criada com sucesso!"
echo ""

sleep 3

# ============================================
# 5️⃣ GERAR QR CODE
# ============================================

echo "5️⃣ Gerando QR Code..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

QR_RESPONSE=$(curl -s "$API_URL/instance/connect/$INSTANCE_NAME" \
    -H "apikey: $API_KEY")

QR_BASE64=$(echo "$QR_RESPONSE" | jq -r '.base64' 2>/dev/null)

if [ "$QR_BASE64" != "null" ] && [ -n "$QR_BASE64" ]; then
    echo "✅ QR Code gerado!"
    echo ""
    
    # Criar HTML com QR Code
    cat > /tmp/qr_enside_local.html << EOF
<!DOCTYPE html>
<html>
<head>
    <title>QR Code WhatsApp - ENSIDE LOCAL</title>
    <style>
        body {
            background: #0f0f0f;
            color: white;
            text-align: center;
            font-family: 'Segoe UI', sans-serif;
            padding: 50px;
        }
        h1 { color: #25D366; }
        img {
            margin-top: 30px;
            width: 400px;
            border: 5px solid #25D366;
            border-radius: 15px;
        }
        .info {
            background: #1a1a1a;
            padding: 20px;
            border-radius: 10px;
            margin-top: 30px;
            max-width: 500px;
            margin-left: auto;
            margin-right: auto;
        }
    </style>
</head>
<body>
    <h1>📱 Escaneie com o WhatsApp</h1>
    <p>Instância: <strong>$INSTANCE_NAME</strong></p>
    <p>Servidor: <strong>localhost:8080</strong></p>
    <img src="$QR_BASE64" />
    <div class="info">
        <p><strong>Como conectar:</strong></p>
        <p>1. Abra WhatsApp no celular</p>
        <p>2. Vá em Configurações → Dispositivos Conectados</p>
        <p>3. Toque em "Conectar um aparelho"</p>
        <p>4. Escaneie este QR Code</p>
    </div>
</body>
</html>
EOF
    
    # Abrir QR Code no navegador
    open /tmp/qr_enside_local.html
    
    echo "📱 QR Code aberto no navegador!"
    echo ""
    echo "👉 Escaneie com WhatsApp > Dispositivos Conectados"
    echo ""
else
    echo "❌ QR Code não foi gerado"
    echo "$QR_RESPONSE" | jq .
    echo ""
    echo "👉 Abra manualmente: http://localhost:8080/manager"
fi

# ============================================
# 6️⃣ ABRIR EVOLUTION MANAGER LOCAL
# ============================================

echo "6️⃣ Abrindo Evolution Manager local..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

open "http://localhost:8080/manager"

echo "✅ Evolution Manager aberto!"
echo ""

# ============================================
# 7️⃣ SALVAR CONFIGURAÇÕES NO REDIS
# ============================================

echo "7️⃣ Salvando configurações no Redis..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

redis-cli SET enside:evolution:local "$(cat << EOF
{
  "url": "$API_URL",
  "apiKey": "$API_KEY",
  "instanceName": "$INSTANCE_NAME",
  "type": "local",
  "createdAt": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")"
}
EOF
)" > /dev/null 2>&1

echo "✅ Configurações salvas no Redis"
echo ""

# ============================================
# RESUMO FINAL
# ============================================

echo "╔════════════════════════════════════════════╗"
echo "║ ✅ INSTÂNCIA LOCAL CRIADA COM SUCESSO!    ║"
echo "╠════════════════════════════════════════════╣"
echo "║                                            ║"
echo "║  📍 URL: http://localhost:8080             ║"
echo "║  🔑 API Key: $API_KEY                      ║"
echo "║  📱 Instância: $INSTANCE_NAME              ║"
echo "║                                            ║"
echo "║  👉 PRÓXIMOS PASSOS:                       ║"
echo "║  1. Escaneie o QR Code no navegador        ║"
echo "║  2. Aguarde status mudar para 'Connected'  ║"
echo "║  3. Teste envio de mensagem                ║"
echo "║                                            ║"
echo "╚════════════════════════════════════════════╝"
echo ""
