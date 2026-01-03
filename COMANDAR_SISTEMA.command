#!/bin/bash
# 🤖 COMANDAR SISTEMA - Orquestrador de IAs ENSIDE
# Inicia todos os serviços e abre o painel de controle

cd "$(dirname "$0")"

echo "🤖 ORQUESTRADOR DE IAs - ENSIDE"
echo "================================"
echo ""

# Carregar variáveis de ambiente
source ~/.enside_env 2>/dev/null

# 1. Verificar Docker
echo "🐳 Verificando Docker..."
if ! docker info > /dev/null 2>&1; then
    echo "   Iniciando Docker..."
    open -a Docker
    sleep 10
fi
echo "   ✅ Docker OK"

# 2. Iniciar Evolution API
echo "📱 Verificando Evolution API..."
if ! curl -s http://localhost:8080/health > /dev/null 2>&1; then
    echo "   Iniciando Evolution API..."
    docker start evolution-api 2>/dev/null || docker run -d --name evolution-api -p 8080:8080 atendai/evolution-api
    sleep 5
fi
echo "   ✅ Evolution API OK (localhost:8080)"

# 3. Verificar conexão WhatsApp
echo "📲 Verificando WhatsApp..."
WHATSAPP_STATUS=$(curl -s -H "apikey: $EVOLUTION_API_KEY" http://localhost:8080/instance/connectionState/enside 2>/dev/null | grep -o '"state":"[^"]*"' | cut -d'"' -f4)
if [ "$WHATSAPP_STATUS" = "open" ]; then
    echo "   ✅ WhatsApp CONECTADO ($WHATSAPP_NUMERO)"
else
    echo "   ⚠️  WhatsApp: $WHATSAPP_STATUS"
fi

# 4. Verificar GitHub
echo "🐙 Verificando GitHub..."
GITHUB_USER=$(curl -s -H "Authorization: Bearer $GITHUB_TOKEN" https://api.github.com/user 2>/dev/null | grep -o '"login":"[^"]*"' | cut -d'"' -f4)
if [ -n "$GITHUB_USER" ]; then
    echo "   ✅ GitHub: $GITHUB_USER"
else
    echo "   ⚠️  GitHub: Token inválido"
fi

# 5. Listar IAs instaladas
echo ""
echo "🤖 IAs INTEGRADAS:"
echo "   1. Claude (Vy) - Comandos Mac/iPhone"
echo "   2. ESPECIALISTA-IA - GitHub App"
echo "   3. Google AI Studio - Gemini"
echo "   4. Vercel - Deploy automático"
echo "   5. Render - Backend"
echo "   6. Evolution API - WhatsApp"

# 6. Abrir sistema principal
echo ""
echo "🚀 Abrindo Sistema Principal..."
open "ENSIDE_MASTER_v19.0_INTEGRADO.html"

# 7. Abrir Evolution Manager no Firefox
echo "📱 Abrindo Evolution Manager..."
open -a Firefox "http://localhost:8080/manager"

# 8. Mostrar comandos disponíveis
echo ""
echo "================================"
echo "📋 COMANDOS DISPONÍVEIS:"
echo ""
echo "  ./enviar-whatsapp.sh NUMERO MENSAGEM"
echo "  ./sync-github.sh"
echo "  ./deploy-vercel.sh"
echo "  ./status-sistema.sh"
echo ""
echo "🎯 Sistema pronto para receber comandos!"
echo "================================"

# Manter terminal aberto
read -p "Pressione ENTER para fechar..."
