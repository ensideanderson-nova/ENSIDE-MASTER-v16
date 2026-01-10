#!/bin/bash

# ============================================
# 🚀 ENSIDE MASTER - ENVIO DE LISTA WHATSAPP
# Script executável completo
# ============================================

echo ""
echo "╔════════════════════════════════════════════╗"
echo "║  📱 ENVIO DE LISTA WHATSAPP - ENSIDE      ║"
echo "║     Evolution API + Google Sheets         ║"
echo "╚════════════════════════════════════════════╝"
echo ""

# ============================================
# CONFIGURAÇÕES
# ============================================
EVOLUTION_URL="https://evolution-api-latest-poc1.onrender.com"
EVOLUTION_API_KEY="23D116F5-A4D3-404F-8D38-66EBF544A44A"
EVOLUTION_INSTANCE="enside-master"
GOOGLE_SHEETS_ID="1FiP885Or0ncyRG_ZZaAvM2vP0sHhDzhLFYifYLjKyIE"

# ============================================
# 1️⃣ VERIFICAR EVOLUTION API
# ============================================
echo "1️⃣  Verificando Evolution API..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$EVOLUTION_URL" -H "apikey: $EVOLUTION_API_KEY")

if [ "$STATUS" != "200" ]; then
  echo "❌ Evolution API não está respondendo (HTTP $STATUS)"
  echo "   Aguardando 30 segundos (cold start do Render)..."
  sleep 30
  STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$EVOLUTION_URL" -H "apikey: $EVOLUTION_API_KEY")
  if [ "$STATUS" != "200" ]; then
    echo "❌ Evolution API ainda não responde. Verifique o serviço."
    exit 1
  fi
fi

echo "✅ Evolution API online"
echo ""

# ============================================
# 2️⃣ VERIFICAR INSTÂNCIA
# ============================================
echo "2️⃣  Verificando instância WhatsApp..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

INSTANCE_STATUS=$(curl -s "$EVOLUTION_URL/instance/connectionState/$EVOLUTION_INSTANCE" \
  -H "apikey: $EVOLUTION_API_KEY" | jq -r '.state')

if [ "$INSTANCE_STATUS" != "open" ]; then
  echo "⚠️  WhatsApp desconectado (status: $INSTANCE_STATUS)"
  echo "   Abrindo Evolution Manager para conectar..."
  open "$EVOLUTION_URL/manager"
  echo ""
  echo "👉 Conecte o WhatsApp e execute o script novamente"
  exit 0
fi

echo "✅ WhatsApp conectado"
echo ""

# ============================================
# 3️⃣ SELECIONAR LISTA
# ============================================
echo "3️⃣  Selecione a lista para envio:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "  1) 🏭 Fornecedores (1.200)"
echo "  2) 👥 Clientes (2.500)"
echo "  3) 🚚 Transportadores (377)"
echo "  4) 📦 Todos (7.055)"
echo "  5) 🧪 Teste (5 contatos)"
echo ""
read -p "Digite o número da lista: " LISTA_OPCAO

case $LISTA_OPCAO in
  1)
    LISTA_NOME="Fornecedores"
    LISTA_CATEGORIA="fornecedores"
    LISTA_TOTAL=1200
    ;;
  2)
    LISTA_NOME="Clientes"
    LISTA_CATEGORIA="clientes"
    LISTA_TOTAL=2500
    ;;
  3)
    LISTA_NOME="Transportadores"
    LISTA_CATEGORIA="transportadores"
    LISTA_TOTAL=377
    ;;
  4)
    LISTA_NOME="Todos"
    LISTA_CATEGORIA="todos"
    LISTA_TOTAL=7055
    ;;
  5)
    LISTA_NOME="Teste"
    LISTA_CATEGORIA="teste"
    LISTA_TOTAL=5
    ;;
  *)
    echo "❌ Opção inválida"
    exit 1
    ;;
esac

echo ""
echo "✅ Lista selecionada: $LISTA_NOME ($LISTA_TOTAL contatos)"
echo ""

# ============================================
# 4️⃣ MENSAGEM
# ============================================
echo "4️⃣  Digite a mensagem para envio:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Dica: Use {nome} para personalizar"
echo ""
read -p "Mensagem: " MENSAGEM

if [ -z "$MENSAGEM" ]; then
  echo "❌ Mensagem não pode estar vazia"
  exit 1
fi

echo ""
echo "✅ Mensagem configurada"
echo ""

# ============================================
# 5️⃣ CONFIRMAÇÃO
# ============================================
echo "5️⃣  Confirmação:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "  Lista: $LISTA_NOME"
echo "  Total: $LISTA_TOTAL contatos"
echo "  Mensagem: $MENSAGEM"
echo ""
read -p "Confirma o envio? (s/n): " CONFIRMA

if [ "$CONFIRMA" != "s" ] && [ "$CONFIRMA" != "S" ]; then
  echo "❌ Envio cancelado"
  exit 0
fi

echo ""
echo "🚀 Iniciando envio..."
echo ""

# ============================================
# 6️⃣ ENVIO (SIMULADO - INTEGRAÇÃO REAL REQUER NODE.JS)
# ============================================
echo "⚠️  NOTA: Este é um script de demonstração"
echo "   Para envio real, use o sistema web ou Node.js"
echo ""
echo "   Acesse: https://enside-master-v16.onrender.com"
echo "   Ou execute: node enviar-lista.js"
echo ""

# ============================================
# RESUMO FINAL
# ============================================
echo "╔════════════════════════════════════════════╗"
echo "║  ✅ CONFIGURAÇÃO COMPLETA                 ║"
echo "╠════════════════════════════════════════════╣"
echo "║                                            ║"
echo "║  Evolution API: ✅ Online                 ║"
echo "║  WhatsApp: ✅ Conectado                   ║"
echo "║  Lista: $LISTA_NOME                        "
echo "║  Total: $LISTA_TOTAL contatos              "
echo "║                                            ║"
echo "║  Para envio real, acesse:                  ║"
echo "║  https://enside-master-v16.onrender.com    ║"
echo "║                                            ║"
echo "╚════════════════════════════════════════════╝"
echo ""
