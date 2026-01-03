#!/bin/bash
# 📊 Status do Sistema ENSIDE

source ~/.enside_env 2>/dev/null

echo "📊 STATUS DO SISTEMA ENSIDE"
echo "==========================="
echo ""

# Docker
echo "🐳 Docker:"
if docker info > /dev/null 2>&1; then
    echo "   ✅ Rodando"
else
    echo "   ❌ Parado"
fi

# Evolution API
echo ""
echo "📱 Evolution API:"
if curl -s http://localhost:8080/health > /dev/null 2>&1; then
    echo "   ✅ Online (localhost:8080)"
    WHATSAPP_STATUS=$(curl -s -H "apikey: $EVOLUTION_API_KEY" http://localhost:8080/instance/connectionState/enside 2>/dev/null | grep -o '"state":"[^"]*"' | cut -d'"' -f4)
    echo "   📲 WhatsApp: $WHATSAPP_STATUS"
else
    echo "   ❌ Offline"
fi

# GitHub
echo ""
echo "🐙 GitHub:"
GITHUB_USER=$(curl -s -H "Authorization: Bearer $GITHUB_TOKEN" https://api.github.com/user 2>/dev/null | grep -o '"login":"[^"]*"' | cut -d'"' -f4)
if [ -n "$GITHUB_USER" ]; then
    echo "   ✅ Conectado: $GITHUB_USER"
else
    echo "   ❌ Desconectado"
fi

# Google Sheets
echo ""
echo "📊 Google Sheets:"
echo "   ID: $GOOGLE_SHEETS_ID"

# Variáveis de ambiente
echo ""
echo "🔑 Variáveis de Ambiente:"
echo "   GITHUB_TOKEN: $(echo $GITHUB_TOKEN | head -c 20)..."
echo "   EVOLUTION_API_KEY: $(echo $EVOLUTION_API_KEY | head -c 20)..."
echo "   GOOGLE_SHEETS_ID: $GOOGLE_SHEETS_ID"
echo "   WHATSAPP_NUMERO: $WHATSAPP_NUMERO"

echo ""
echo "==========================="
