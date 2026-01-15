#!/bin/bash

# ============================================
# 🚀 SISTEMA ENSIDE COMPLETO - EVOLUTION API
# Integração total: Render + Vercel + Sheets
# ============================================

clear
echo "╔════════════════════════════════════════════╗"
echo "║  🚀 ENSIDE MASTER - SISTEMA COMPLETO      ║"
echo "║     Evolution API + WhatsApp              ║"
echo "╚════════════════════════════════════════════╝"
echo ""

# Credenciais Evolution API Render (do painel Environment)
EVOLUTION_URL="https://evolution-api-latest-poc1.onrender.com"
EVOLUTION_API_KEY="23D116F5-A4D3-404F-8D38-66EBF544A44A"
EVOLUTION_INSTANCE="enside-master"

# ============================================
# 1️⃣ VERIFICAR EVOLUTION API (COM RETRY PARA COLD START)
# ============================================

echo "1️⃣ Verificando Evolution API Render..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Primeiro request para "acordar" o Render
curl -s "$EVOLUTION_URL" -H "apikey: $EVOLUTION_API_KEY" > /dev/null
echo "⏳ Aguardando cold start do Render (30s)..."
sleep 30

# Segundo request para verificar
STATUS=$(curl -s "$EVOLUTION_URL" -H "apikey: $EVOLUTION_API_KEY" | jq -r '.status' 2>/dev/null)

if [ "$STATUS" = "200" ]; then
    echo "✅ Evolution API ONLINE"
else
    echo "❌ Evolution API não respondeu"
    echo "   Abrindo Evolution Manager para verificar..."
    open "$EVOLUTION_URL/manager"
    exit 1
fi

echo ""

# ============================================
# 2️⃣ VERIFICAR INSTÂNCIA WHATSAPP
# ============================================

echo "2️⃣ Verificando instância WhatsApp..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

CONN_STATE=$(curl -s "$EVOLUTION_URL/instance/connectionState/$EVOLUTION_INSTANCE" \
    -H "apikey: $EVOLUTION_API_KEY" | jq -r '.instance.state' 2>/dev/null)

if [ "$CONN_STATE" = "open" ]; then
    echo "✅ WhatsApp CONECTADO"
else
    echo "⚠️  WhatsApp DESCONECTADO (status: $CONN_STATE)"
    echo ""
    echo "📱 Abrindo Evolution Manager para conectar..."
    open "$EVOLUTION_URL/manager"
    echo ""
    echo "👉 Passos para conectar:"
    echo "   1. Clique no botão 'Get QR Code'"
    echo "   2. Aguarde 30-60s (cold start do Render)"
    echo "   3. Escaneie com WhatsApp > Dispositivos Conectados"
    echo "   4. Execute este script novamente"
    echo ""
    exit 0
fi

echo ""

# ============================================
# 3️⃣ ABRIR TODOS OS SISTEMAS
# ============================================

echo "3️⃣ Abrindo todos os sistemas..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Sistema Vercel
open "https://enside-sistema.vercel.app"
echo "✅ Sistema ENSIDE (Vercel)"

# Evolution Manager
open "$EVOLUTION_URL/manager"
echo "✅ Evolution Manager (Render)"

# Google Sheets
open "https://docs.google.com/spreadsheets/d/1FiP885Or0ncyRG_ZZaAvM2vP0sHhDzhLFYifYLjKyIE/edit"
echo "✅ Google Sheets (EUCALIPTO)"

echo ""

# ============================================
# 4️⃣ RESUMO FINAL
# ============================================

echo "╔════════════════════════════════════════════╗"
echo "║  ✅ SISTEMA 100% OPERACIONAL              ║"
echo "╠════════════════════════════════════════════╣"
echo "║                                            ║"
echo "║  🌐 Vercel: https://enside-sistema.vercel.app"
echo "║  📱 Evolution: $EVOLUTION_URL"
echo "║  📊 Sheets: EUCALIPTO (7.055+ contatos)"
echo "║                                            ║"
echo "║  ✅ WhatsApp: CONECTADO"
echo "║  ✅ Pronto para envio em massa"
echo "║                                            ║"
echo "╚════════════════════════════════════════════╝"
echo ""

