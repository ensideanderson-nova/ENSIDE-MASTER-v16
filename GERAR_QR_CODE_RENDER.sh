#!/bin/bash

# ============================================
# GERAR QR CODE EVOLUTION API RENDER
# Credenciais atualizadas do Render
# ============================================

clear
echo "╔════════════════════════════════════════════════════════════╗"
echo "║  📱 GERAR QR CODE EVOLUTION API - RENDER                  ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Credenciais Evolution API Render
EVOLUTION_URL="https://evolution-api-latest-poc1.onrender.com"
EVOLUTION_API_KEY="23D116F5-A4D3-404F-8D38-66EBF544A44A"
EVOLUTION_INSTANCE="enside-master"

echo "🔍 Verificando Evolution API Render..."
echo "   URL: $EVOLUTION_URL"
echo "   Instância: $EVOLUTION_INSTANCE"
echo ""

# Aguardar cold start do Render (pode demorar até 60 segundos)
echo "⏳ Aguardando Evolution API acordar (cold start)..."
sleep 5

# Testar conexão
echo "🔌 Testando conexão..."
RESPONSE=$(curl -s -H "apikey: $EVOLUTION_API_KEY" "$EVOLUTION_URL" 2>/dev/null)

if echo "$RESPONSE" | grep -q "Welcome to the Evolution API"; then
    echo "✅ Evolution API: ONLINE"
    VERSION=$(echo "$RESPONSE" | grep -o '"version":"[^"]*' | cut -d'"' -f4)
    echo "   Versão: $VERSION"
else
    echo "⚠️  Evolution API pode estar em cold start..."
    echo "   Aguardando mais 30 segundos..."
    sleep 30
fi

echo ""
echo "📱 Gerando QR Code para instância '$EVOLUTION_INSTANCE'..."
echo ""

# Gerar QR Code
QR_RESPONSE=$(curl -s \
    "$EVOLUTION_URL/instance/connect/$EVOLUTION_INSTANCE" \
    -H "apikey: $EVOLUTION_API_KEY" 2>/dev/null)

# Verificar se retornou QR Code
if echo "$QR_RESPONSE" | grep -q "base64"; then
    echo "✅ QR Code gerado com sucesso!"
    echo ""
    
    # Extrair base64 do QR Code
    QR_BASE64=$(echo "$QR_RESPONSE" | jq -r '.base64' 2>/dev/null)
    
    if [ -n "$QR_BASE64" ] && [ "$QR_BASE64" != "null" ]; then
        # Criar HTML com QR Code
        QR_HTML="/tmp/qr_evolution_render.html"
        
        cat > "$QR_HTML" << EOF
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>QR Code Evolution API - ENSIDE</title>
    <style>
        body {
            background: #0f0f0f;
            color: white;
            text-align: center;
            font-family: 'Segoe UI', sans-serif;
            padding: 40px;
        }
        h1 {
            color: #27ae60;
            margin-bottom: 10px;
        }
        .info {
            background: #1a1a2e;
            padding: 20px;
            border-radius: 10px;
            margin: 20px auto;
            max-width: 500px;
        }
        img {
            margin: 30px auto;
            width: 350px;
            border: 5px solid #27ae60;
            border-radius: 10px;
            padding: 10px;
            background: white;
        }
        .instructions {
            background: #27ae60;
            color: white;
            padding: 15px;
            border-radius: 8px;
            margin: 20px auto;
            max-width: 500px;
        }
        .credentials {
            background: #2c3e50;
            padding: 15px;
            border-radius: 8px;
            margin: 20px auto;
            max-width: 500px;
            text-align: left;
            font-family: monospace;
            font-size: 12px;
        }
    </style>
</head>
<body>
    <h1>📱 QR Code WhatsApp - ENSIDE MASTER</h1>
    
    <div class="info">
        <h3>Evolution API - Render</h3>
        <p>Instância: <strong>$EVOLUTION_INSTANCE</strong></p>
        <p>URL: <strong>$EVOLUTION_URL</strong></p>
    </div>
    
    <img src="$QR_BASE64" alt="QR Code WhatsApp" />
    
    <div class="instructions">
        <h3>📲 Como Conectar:</h3>
        <ol style="text-align: left; padding-left: 40px;">
            <li>Abra o WhatsApp no celular</li>
            <li>Vá em <strong>Configurações</strong></li>
            <li>Toque em <strong>Dispositivos Conectados</strong></li>
            <li>Toque em <strong>Conectar um Dispositivo</strong></li>
            <li>Escaneie este QR Code</li>
        </ol>
    </div>
    
    <div class="credentials">
        <strong>🔐 Credenciais (salvas no Redis):</strong><br>
        URL: $EVOLUTION_URL<br>
        API Key: $EVOLUTION_API_KEY<br>
        Instância: $EVOLUTION_INSTANCE<br>
        Timestamp: $(date '+%Y-%m-%d %H:%M:%S')
    </div>
</body>
</html>
EOF
        
        # Abrir QR Code no navegador
        open "$QR_HTML"
        
        echo "🌐 QR Code aberto no navegador!"
        echo ""
        echo "📋 Instruções:"
        echo "   1. Escaneie o QR Code com o WhatsApp"
        echo "   2. Aguarde a conexão ser estabelecida"
        echo "   3. Verifique o status no Evolution Manager"
        echo ""
        echo "🔗 Evolution Manager:"
        echo "   $EVOLUTION_URL/manager"
        echo ""
        
        # Salvar credenciais no Redis
        if redis-cli ping &> /dev/null; then
            echo "💾 Salvando credenciais no Redis..."
            redis-cli HSET enside:evolution:render:current \
                url "$EVOLUTION_URL" \
                apikey "$EVOLUTION_API_KEY" \
                instance "$EVOLUTION_INSTANCE" \
                qr_generated "$(date '+%Y-%m-%d %H:%M:%S')" > /dev/null
            echo "✅ Credenciais salvas no Redis"
        fi
        
    else
        echo "❌ Erro ao extrair QR Code base64"
        echo "   Resposta da API:"
        echo "$QR_RESPONSE" | jq .
    fi
else
    echo "❌ Erro ao gerar QR Code"
    echo ""
    echo "📋 Resposta da API:"
    echo "$QR_RESPONSE" | jq .
    echo ""
    echo "💡 Possíveis causas:"
    echo "   • Evolution API em cold start (aguarde 60s e tente novamente)"
    echo "   • Instância não existe (verifique o nome)"
    echo "   • API Key incorreta"
    echo "   • Instância já conectada"
    echo ""
    echo "🔗 Verifique no Evolution Manager:"
    echo "   $EVOLUTION_URL/manager"
fi

echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║  ✅ PROCESSO CONCLUÍDO                                    ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""
