#!/bin/bash

# ============================================
# CRIAR INSTÂNCIA EVOLUTION API RENDER
# Do jeito CORRETO para o QR Code funcionar
# ============================================

EVOLUTION_URL="https://evolution-api-latest-poc1.onrender.com"
API_KEY="23D116F5-A4D3-404F-8D38-66EBF544A44A"
INSTANCE_NAME="enside"

echo ""
echo "╔════════════════════════════════════════════╗"
echo "║  🚀 CRIAR INSTÂNCIA EVOLUTION API RENDER  ║"
echo "║     Do jeito CORRETO                      ║"
echo "╚════════════════════════════════════════════╝"
echo ""

# ============================================
# 1. DELETAR INSTÂNCIA ANTIGA (se existir)
# ============================================

echo "1️⃣  Deletando instância antiga (se existir)..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

curl -s -X DELETE \
  "$EVOLUTION_URL/instance/delete/$INSTANCE_NAME" \
  -H "apikey: $API_KEY" > /dev/null 2>&1

echo "✅ Instância antiga removida"
echo ""
sleep 3

# ============================================
# 2. AGUARDAR RENDER "ACORDAR" (COLD START)
# ============================================

echo "2️⃣  Aguardando Render acordar (cold start)..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Fazer request para acordar
curl -s "$EVOLUTION_URL" -H "apikey: $API_KEY" > /dev/null 2>&1

echo "⏳ Aguardando 30 segundos..."
sleep 30

echo "✅ Render acordado"
echo ""

# ============================================
# 3. CRIAR INSTÂNCIA NOVA (JEITO CORRETO)
# ============================================

echo "3️⃣  Criando instância NOVA..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# IMPORTANTE: usar o mesmo token da API Key
CREATE_RESPONSE=$(curl -s -X POST \
  "$EVOLUTION_URL/instance/create" \
  -H "apikey: $API_KEY" \
  -H "Content-Type: application/json" \
  -d "{
    \"instanceName\": \"$INSTANCE_NAME\",
    \"token\": \"$API_KEY\",
    \"qrcode\": true,
    \"integration\": \"WHATSAPP-BAILEYS\"
  }")

echo "$CREATE_RESPONSE" | jq .

if echo "$CREATE_RESPONSE" | grep -q "error"; then
  echo "❌ Erro ao criar instância"
  echo "$CREATE_RESPONSE"
  exit 1
fi

echo "✅ Instância criada com sucesso"
echo ""
sleep 5

# ============================================
# 4. CONECTAR E GERAR QR CODE
# ============================================

echo "4️⃣  Gerando QR Code..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

QR_RESPONSE=$(curl -s \
  "$EVOLUTION_URL/instance/connect/$INSTANCE_NAME" \
  -H "apikey: $API_KEY")

echo "$QR_RESPONSE" | jq .

# Extrair QR Code base64
QR_BASE64=$(echo "$QR_RESPONSE" | jq -r '.base64' 2>/dev/null)

if [ "$QR_BASE64" != "null" ] && [ -n "$QR_BASE64" ]; then
  echo ""
  echo "✅ QR Code gerado com sucesso!"
  echo ""
  echo "📱 ABRIR QR CODE NO NAVEGADOR..."
  
  # Criar HTML temporário com QR Code
  cat > /tmp/qr_enside_render.html << EOF
<!DOCTYPE html>
<html>
<head>
  <title>QR Code WhatsApp - ENSIDE</title>
  <style>
    body {
      background: #0f0f0f;
      color: white;
      text-align: center;
      font-family: sans-serif;
      padding: 50px;
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
  <p>WhatsApp → Configurações → Dispositivos Conectados → Conectar aparelho</p>
  <img src="$QR_BASE64" />
  <p style="margin-top: 30px; color: #888;">
    Instância: $INSTANCE_NAME<br>
    Evolution API: Render
  </p>
</body>
</html>
EOF

  # Abrir no navegador
  open /tmp/qr_enside_render.html
  
  echo "✅ QR Code aberto no navegador!"
  echo ""
else
  echo "⚠️  QR Code não retornado pela API"
  echo ""
  echo "📱 ABRINDO EVOLUTION MANAGER..."
  open "$EVOLUTION_URL/manager"
  echo ""
  echo "👉 No Evolution Manager:"
  echo "   1. Clique na instância '$INSTANCE_NAME'"
  echo "   2. Clique em 'Get QR Code'"
  echo "   3. Aguarde carregar (pode demorar)"
  echo "   4. Escaneie com WhatsApp"
fi

echo ""
echo "╔════════════════════════════════════════════╗"
echo "║  ✅ PROCESSO CONCLUÍDO                    ║"
echo "╠════════════════════════════════════════════╣"
echo "║                                            ║"
echo "║  📱 Escaneie o QR Code com WhatsApp       ║"
echo "║  ⏳ Aguarde status mudar para CONNECTED   ║"
echo "║                                            ║"
echo "║  Depois execute:                           ║"
echo "║  ./SISTEMA_EVOLUTION_COMPLETO.sh          ║"
echo "║                                            ║"
echo "╚════════════════════════════════════════════╝"
echo ""
