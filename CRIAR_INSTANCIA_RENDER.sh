#!/bin/bash

# ============================================
# CRIAR INSTÂNCIA EVOLUTION API COM CREDENCIAIS DO RENDER
# ============================================

clear
echo "╔════════════════════════════════════════════════════════════╗"
echo "║  🔧 CRIAR INSTÂNCIA EVOLUTION API - RENDER                ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Credenciais do Render (configuradas nas variáveis de ambiente)
EVOLUTION_URL="https://evolution-api-latest-poc1.onrender.com"
EVOLUTION_API_KEY="23D116F5-A4D3-404F-8D38-66EBF544A44A"
INSTANCE_NAME="enside-render"

echo "📋 Configurações:"
echo "   URL: $EVOLUTION_URL"
echo "   API Key: $EVOLUTION_API_KEY"
echo "   Instância: $INSTANCE_NAME"
echo ""

# ============================================
# 1. DELETAR INSTÂNCIA ANTIGA (se existir)
# ============================================

echo "1️⃣  Deletando instância antiga (se existir)..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

DELETE_RESPONSE=$(curl -s -X DELETE \
    "$EVOLUTION_URL/instance/delete/$INSTANCE_NAME" \
    -H "apikey: $EVOLUTION_API_KEY" 2>/dev/null)

if echo "$DELETE_RESPONSE" | grep -q "deleted"; then
    echo "✅ Instância antiga deletada"
elif echo "$DELETE_RESPONSE" | grep -q "not found"; then
    echo "ℹ️  Nenhuma instância antiga encontrada"
else
    echo "⚠️  Resposta: $DELETE_RESPONSE"
fi

echo ""
sleep 2

# ============================================
# 2. CRIAR NOVA INSTÂNCIA COM TOKEN DO RENDER
# ============================================

echo "2️⃣  Criando nova instância com credenciais do Render..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

CREATE_RESPONSE=$(curl -s -X POST \
    "$EVOLUTION_URL/instance/create" \
    -H "apikey: $EVOLUTION_API_KEY" \
    -H "Content-Type: application/json" \
    -d "{
        \"instanceName\": \"$INSTANCE_NAME\",
        \"token\": \"$EVOLUTION_API_KEY\",
        \"qrcode\": true,
        \"integration\": \"WHATSAPP-BAILEYS\"
    }" 2>/dev/null)

echo "$CREATE_RESPONSE" | jq .

if echo "$CREATE_RESPONSE" | grep -q "instance"; then
    echo ""
    echo "✅ Instância criada com sucesso!"
else
    echo ""
    echo "❌ Erro ao criar instância"
    exit 1
fi

echo ""
sleep 2

# ============================================
# 3. GERAR QR CODE
# ============================================

echo "3️⃣  Gerando QR Code..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Aguardar cold start
echo "⏳ Aguardando Evolution API (cold start pode demorar 30-60s)..."
sleep 10

QR_RESPONSE=$(curl -s \
    "$EVOLUTION_URL/instance/connect/$INSTANCE_NAME" \
    -H "apikey: $EVOLUTION_API_KEY" 2>/dev/null)

# Extrair base64 do QR Code
QR_BASE64=$(echo "$QR_RESPONSE" | jq -r '.base64' 2>/dev/null)

if [ -n "$QR_BASE64" ] && [ "$QR_BASE64" != "null" ]; then
    echo "✅ QR Code gerado!"
    
    # Criar HTML com QR Code
    QR_HTML="/tmp/qr_enside_render.html"
    
    cat > "$QR_HTML" << EOF
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>QR Code ENSIDE - Render</title>
    <style>
        body {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            text-align: center;
            font-family: 'Segoe UI', sans-serif;
            padding: 40px;
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
        }
        .container {
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
            border-radius: 20px;
            padding: 40px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
        }
        h1 {
            color: #fff;
            margin-bottom: 10px;
            font-size: 32px;
        }
        .info {
            background: rgba(255, 255, 255, 0.2);
            padding: 20px;
            border-radius: 10px;
            margin: 20px auto;
            max-width: 500px;
        }
        img {
            margin: 30px auto;
            width: 350px;
            border: 5px solid white;
            border-radius: 15px;
            padding: 15px;
            background: white;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        }
        .instructions {
            background: rgba(39, 174, 96, 0.9);
            color: white;
            padding: 20px;
            border-radius: 12px;
            margin: 20px auto;
            max-width: 500px;
        }
        .instructions ol {
            text-align: left;
            padding-left: 40px;
            margin: 15px 0;
        }
        .credentials {
            background: rgba(44, 62, 80, 0.9);
            padding: 20px;
            border-radius: 12px;
            margin: 20px auto;
            max-width: 500px;
            text-align: left;
            font-family: 'Courier New', monospace;
            font-size: 13px;
        }
        .badge {
            display: inline-block;
            background: #27ae60;
            color: white;
            padding: 8px 16px;
            border-radius: 20px;
            font-size: 14px;
            margin: 10px 5px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>📱 QR Code WhatsApp</h1>
        <h2>ENSIDE MASTER v19.0</h2>
        
        <div class="info">
            <h3>🌐 Evolution API - Render</h3>
            <div class="badge">Instância: $INSTANCE_NAME</div>
            <div class="badge">Versão: 2.2.3</div>
        </div>
        
        <img src="$QR_BASE64" alt="QR Code WhatsApp" />
        
        <div class="instructions">
            <h3>📲 Como Conectar:</h3>
            <ol>
                <li>Abra o <strong>WhatsApp</strong> no celular</li>
                <li>Vá em <strong>Configurações</strong> (⚙️)</li>
                <li>Toque em <strong>Dispositivos Conectados</strong></li>
                <li>Toque em <strong>Conectar um Dispositivo</strong></li>
                <li>Escaneie este QR Code</li>
                <li>Aguarde a confirmação ✅</li>
            </ol>
        </div>
        
        <div class="credentials">
            <strong>🔐 Credenciais Configuradas:</strong><br><br>
            <strong>URL:</strong> $EVOLUTION_URL<br>
            <strong>API Key:</strong> $EVOLUTION_API_KEY<br>
            <strong>Instância:</strong> $INSTANCE_NAME<br>
            <strong>Gerado em:</strong> $(date '+%d/%m/%Y às %H:%M:%S')<br><br>
            <strong>✅ Salvo no Redis:</strong> enside:evolution:render
        </div>
    </div>
</body>
</html>
EOF
    
    # Abrir QR Code no navegador
    open "$QR_HTML"
    
    echo ""
    echo "🌐 QR Code aberto no navegador!"
    echo ""
    
    # Salvar no Redis
    if redis-cli ping &> /dev/null; then
        echo "💾 Salvando no Redis..."
        redis-cli HSET enside:evolution:render \
            url "$EVOLUTION_URL" \
            apikey "$EVOLUTION_API_KEY" \
            instance "$INSTANCE_NAME" \
            qr_generated "$(date '+%Y-%m-%d %H:%M:%S')" > /dev/null
        echo "✅ Salvo no Redis: enside:evolution:render"
    fi
    
else
    echo "❌ Erro ao gerar QR Code"
    echo ""
    echo "Resposta da API:"
    echo "$QR_RESPONSE" | jq .
fi

echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║  ✅ PROCESSO CONCLUÍDO                                    ║"
echo "╠════════════════════════════════════════════════════════════╣"
echo "║                                                            ║"
echo "║  📱 Escaneie o QR Code com o WhatsApp                     ║"
echo "║  🔗 Evolution Manager:                                    ║"
echo "║     $EVOLUTION_URL/manager                                ║"
echo "║                                                            ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""
