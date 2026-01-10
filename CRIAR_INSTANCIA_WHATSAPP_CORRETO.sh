#!/bin/bash

# ============================================
# SCRIPT DEFINITIVO - CRIAR INSTÂNCIA EVOLUTION API
# Funciona no Render E no Docker Local
# ============================================

echo ""
echo "╔════════════════════════════════════════════╗"
echo "║  🚀 CRIAR INSTÂNCIA WHATSAPP EVOLUTION API ║"
echo "╚════════════════════════════════════════════╝"
echo ""

# ============================================
# CONFIGURAÇÕES
# ============================================

# Evolution API Render (Online)
RENDER_URL="https://evolution-api-latest-poc1.onrender.com"
RENDER_API_KEY="23D116F5-A4D3-404F-8D38-66EBF544A44A"
RENDER_INSTANCE="enside-master"

# Evolution API Local (Docker)
LOCAL_URL="http://localhost:8080"
LOCAL_API_KEY="evolution-api-enside-2024-secret"
LOCAL_INSTANCE="enside-local"

# ============================================
# MENU DE ESCOLHA
# ============================================

echo "Escolha onde criar a instância:"
echo ""
echo "1) 🌐 Render (Online) - https://evolution-api-latest-poc1.onrender.com"
echo "2) 🐳 Docker Local - http://localhost:8080"
echo "3) ✅ Ambos (Render + Local)"
echo ""
read -p "Digite sua escolha (1, 2 ou 3): " ESCOLHA

# ============================================
# FUNÇÃO: CRIAR INSTÂNCIA NO RENDER
# ============================================

criar_render() {
    echo ""
    echo "🌐 CRIANDO INSTÂNCIA NO RENDER..."
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    
    # Aguardar cold start do Render
    echo "⏳ Aguardando Render acordar (30 segundos)..."
    curl -s "$RENDER_URL" -H "apikey: $RENDER_API_KEY" > /dev/null
    sleep 30
    
    # Deletar instância antiga (se existir)
    echo "🧹 Deletando instância antiga (se existir)..."
    curl -s -X DELETE "$RENDER_URL/instance/delete/$RENDER_INSTANCE" \
        -H "apikey: $RENDER_API_KEY" > /dev/null
    
    sleep 5
    
    # Criar nova instância
    echo "🆕 Criando instância '$RENDER_INSTANCE'..."
    RESPONSE=$(curl -s -X POST "$RENDER_URL/instance/create" \
        -H "apikey: $RENDER_API_KEY" \
        -H "Content-Type: application/json" \
        -d "{
            \"instanceName\": \"$RENDER_INSTANCE\",
            \"token\": \"$RENDER_API_KEY\",
            \"integration\": \"WHATSAPP-BAILEYS\"
        }")
    
    echo "$RESPONSE" | jq .
    
    if echo "$RESPONSE" | grep -q "error"; then
        echo ""
        echo "❌ ERRO ao criar instância no Render"
        echo "⚠️  A instância deve ser criada MANUALMENTE pelo Evolution Manager:"
        echo ""
        echo "👉 1. Abrir: $RENDER_URL/manager"
        echo "👉 2. Clicar no botão verde 'Instance +'"
        echo "👉 3. Preencher:"
        echo "      - Instance Name: $RENDER_INSTANCE"
        echo "      - Token: (deixar vazio ou usar API Key)"
        echo "      - Integration: WHATSAPP-BAILEYS"
        echo "👉 4. Clicar 'Create'"
        echo "👉 5. Aguardar 30-60 segundos (cold start)"
        echo "👉 6. Clicar 'Get QR Code'"
        echo ""
        echo "🌐 Abrindo Evolution Manager..."
        open "$RENDER_URL/manager"
        return 1
    fi
    
    echo "✅ Instância criada no Render!"
    
    # Gerar QR Code
    echo ""
    echo "📱 Gerando QR Code..."
    sleep 5
    
    QR_RESPONSE=$(curl -s "$RENDER_URL/instance/connect/$RENDER_INSTANCE" \
        -H "apikey: $RENDER_API_KEY")
    
    QR_CODE=$(echo "$QR_RESPONSE" | jq -r '.qr')
    
    if [ "$QR_CODE" != "null" ] && [ -n "$QR_CODE" ]; then
        echo "✅ QR Code gerado!"
        
        # Salvar QR Code em HTML
        cat > /tmp/qr_render.html << EOF
<html>
<head><title>QR Code WhatsApp - Render</title></head>
<body style="background:#000;display:flex;justify-content:center;align-items:center;height:100vh;flex-direction:column;">
    <h1 style="color:#fff;font-family:sans-serif;">📱 Escaneie com WhatsApp</h1>
    <img src="$QR_CODE" style="width:400px;margin:20px;">
    <p style="color:#fff;font-family:sans-serif;">WhatsApp > Configurações > Dispositivos Conectados</p>
</body>
</html>
EOF
        
        open /tmp/qr_render.html
        echo "✅ QR Code aberto no navegador!"
    else
        echo "⚠️  QR Code não retornado (cold start do Render)"
        echo "👉 Abra manualmente: $RENDER_URL/manager"
        open "$RENDER_URL/manager"
    fi
}

# ============================================
# FUNÇÃO: CRIAR INSTÂNCIA NO DOCKER LOCAL
# ============================================

criar_local() {
    echo ""
    echo "🐳 CRIANDO INSTÂNCIA NO DOCKER LOCAL..."
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    
    # Verificar se Docker está rodando
    if ! docker ps > /dev/null 2>&1; then
        echo "❌ Docker não está rodando!"
        echo "👉 Inicie o Docker Desktop e tente novamente"
        return 1
    fi
    
    # Verificar se Evolution API está rodando
    if ! curl -s "$LOCAL_URL" > /dev/null 2>&1; then
        echo "❌ Evolution API local não está respondendo!"
        echo "👉 Verifique se o container está rodando: docker ps"
        return 1
    fi
    
    echo "✅ Docker e Evolution API rodando"
    
    # Deletar instância antiga (se existir)
    echo "🧹 Deletando instância antiga (se existir)..."
    curl -s -X DELETE "$LOCAL_URL/instance/delete/$LOCAL_INSTANCE" \
        -H "apikey: $LOCAL_API_KEY" > /dev/null
    
    sleep 2
    
    # Criar nova instância
    echo "🆕 Criando instância '$LOCAL_INSTANCE'..."
    RESPONSE=$(curl -s -X POST "$LOCAL_URL/instance/create" \
        -H "apikey: $LOCAL_API_KEY" \
        -H "Content-Type: application/json" \
        -d "{
            \"instanceName\": \"$LOCAL_INSTANCE\",
            \"token\": \"$LOCAL_API_KEY\",
            \"integration\": \"WHATSAPP-BAILEYS\"
        }")
    
    echo "$RESPONSE" | jq .
    
    if echo "$RESPONSE" | grep -q "error"; then
        echo "❌ Erro ao criar instância local"
        echo "👉 Verifique os logs: docker logs evolution_api"
        return 1
    fi
    
    echo "✅ Instância criada no Docker local!"
    
    # Gerar QR Code
    echo ""
    echo "📱 Gerando QR Code..."
    sleep 3
    
    QR_RESPONSE=$(curl -s "$LOCAL_URL/instance/connect/$LOCAL_INSTANCE" \
        -H "apikey: $LOCAL_API_KEY")
    
    QR_CODE=$(echo "$QR_RESPONSE" | jq -r '.qr')
    
    if [ "$QR_CODE" != "null" ] && [ -n "$QR_CODE" ]; then
        echo "✅ QR Code gerado!"
        
        # Salvar QR Code em HTML
        cat > /tmp/qr_local.html << EOF
<html>
<head><title>QR Code WhatsApp - Local</title></head>
<body style="background:#000;display:flex;justify-content:center;align-items:center;height:100vh;flex-direction:column;">
    <h1 style="color:#fff;font-family:sans-serif;">📱 Escaneie com WhatsApp</h1>
    <img src="$QR_CODE" style="width:400px;margin:20px;">
    <p style="color:#fff;font-family:sans-serif;">WhatsApp > Configurações > Dispositivos Conectados</p>
</body>
</html>
EOF
        
        open /tmp/qr_local.html
        echo "✅ QR Code aberto no navegador!"
    else
        echo "❌ QR Code não retornado"
        echo "👉 Abra manualmente: $LOCAL_URL/manager"
        open "$LOCAL_URL/manager"
    fi
}

# ============================================
# EXECUTAR CONFORME ESCOLHA
# ============================================

case $ESCOLHA in
    1)
        criar_render
        ;;
    2)
        criar_local
        ;;
    3)
        criar_render
        echo ""
        criar_local
        ;;
    *)
        echo "❌ Opção inválida!"
        exit 1
        ;;
esac

echo ""
echo "╔════════════════════════════════════════════╗"
echo "║  ✅ PROCESSO CONCLUÍDO                    ║"
echo "╚════════════════════════════════════════════╝"
echo ""
