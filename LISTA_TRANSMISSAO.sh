#!/bin/bash

# 📱 LISTA DE TRANSMISSÃO WHATSAPP - ENSIDE v19.0
# Envia mensagens para múltiplos números via Evolution API

# Configurações
API_URL="http://localhost:8080"
INSTANCE="enside"
API_KEY="919AA333-AE59-4B06-B1EF-C9A9F9C8C0F6"

# Cores
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo ""
echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║     📱 LISTA DE TRANSMISSÃO WHATSAPP - ENSIDE v19.0       ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Função para enviar mensagem
enviar_mensagem() {
    local numero=$1
    local mensagem=$2
    
    response=$(curl -s -X POST "$API_URL/message/sendText/$INSTANCE" \
        -H "Content-Type: application/json" \
        -H "apikey: $API_KEY" \
        -d "{\"number\": \"${numero}@s.whatsapp.net\", \"textMessage\": {\"text\": \"$mensagem\"}}")
    
    if echo "$response" | grep -q "remoteJid"; then
        echo -e "${GREEN}✅ Enviado para $numero${NC}"
        return 0
    else
        echo -e "${RED}❌ Falha para $numero${NC}"
        return 1
    fi
}

# Lista de números (adicione mais números aqui)
NUMEROS=(
    "5518996540492"
)

# Mensagem padrão
MENSAGEM="🚛 ENSIDE LOGISTICS - Lista de Transmissao

Ola! Temos fretes disponiveis para sua regiao.

📍 Rotas: SP, PR, SC, RS
💰 Valores competitivos
📱 Responda esta mensagem para mais info

Sistema ENSIDE v19.0 - Automatizado"

# Se passou argumentos, usa eles
if [ ! -z "$1" ]; then
    MENSAGEM="$1"
fi

echo -e "${YELLOW}📋 Números na lista: ${#NUMEROS[@]}${NC}"
echo -e "${YELLOW}💬 Mensagem: ${NC}"
echo "$MENSAGEM"
echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

# Contadores
ENVIADOS=0
FALHAS=0

# Enviar para cada número
for numero in "${NUMEROS[@]}"; do
    echo -e "${BLUE}📤 Enviando para $numero...${NC}"
    
    if enviar_mensagem "$numero" "$MENSAGEM"; then
        ((ENVIADOS++))
    else
        ((FALHAS++))
    fi
    
    # Aguardar 2 segundos entre envios (evitar bloqueio)
    sleep 2
done

echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}✅ Enviados: $ENVIADOS${NC}"
echo -e "${RED}❌ Falhas: $FALHAS${NC}"
echo -e "${BLUE}📊 Total: ${#NUMEROS[@]}${NC}"
echo ""
