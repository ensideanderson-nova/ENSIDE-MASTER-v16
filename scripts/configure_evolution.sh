#!/bin/bash

# ============================================================================
# 🔧 SCRIPT DE CONFIGURAÇÃO - EVOLUTION API
# ============================================================================

set -e

echo ""
echo "============================================================================"
echo "🔧 CONFIGURAÇÃO EVOLUTION API"
echo "============================================================================"
echo ""

# Carregar .env se existir
if [ -f .env ]; then
    export $(grep -v '^#' .env | xargs)
    echo "✅ Configurações carregadas de .env"
else
    echo "⚠️  Arquivo .env não encontrado. Criando a partir do .env.example..."
    cp .env.example .env
    echo "📝 Edite o arquivo .env com suas credenciais"
    exit 1
fi

# Exibir configuração (sem mostrar a chave completa)
echo ""
echo "📋 CONFIGURAÇÃO ATUAL:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "URL:      ${EVOLUTION_URL}"
echo "API Key:  ${EVOLUTION_API_KEY:0:8}******************"
echo "Instance: ${EVOLUTION_INSTANCE}"
echo "Manager:  ${WHATSAPP_MANAGER_NUMBER}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Testar conexão
echo "🔍 Testando conexão com Evolution API..."
response=$(curl -s -o /dev/null -w "%{http_code}" "${EVOLUTION_URL}/" || echo "000")

if [ "$response" = "200" ] || [ "$response" = "404" ]; then
    echo "✅ Evolution API está acessível (HTTP ${response})"
else
    echo "❌ Evolution API não está acessível (HTTP ${response})"
    echo "⚠️  Verifique se a URL está correta e o serviço está rodando"
fi

echo ""
echo "============================================================================"
echo "📋 PRÓXIMOS PASSOS:"
echo "============================================================================"
echo ""
echo "1️⃣  Configure no navegador (aperte F12 e cole no Console):"
echo ""
echo "   localStorage.setItem('evolution_url', '${EVOLUTION_URL}');"
echo "   localStorage.setItem('evolution_apikey', '${EVOLUTION_API_KEY}');"
echo "   localStorage.setItem('evolution_instance', '${EVOLUTION_INSTANCE}');"
echo "   location.reload();"
echo ""
echo "2️⃣  Acesse o sistema e teste a conexão"
echo ""
echo "3️⃣  Se necessário, gere o QR Code para conectar o WhatsApp"
echo ""
echo "============================================================================"
