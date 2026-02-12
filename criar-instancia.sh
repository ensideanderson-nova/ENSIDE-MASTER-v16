#!/bin/bash

# Cores para output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}🚀 CRIANDO INSTÂNCIA ENSIDE WHATSAPP${NC}"
echo ""

# Variáveis
API_URL="https://evolution-rust.vercel.app"
API_KEY="429683C4C977415CAAFCCE10F7D57E11"
INSTANCE_NAME="enside_whatsapp"

echo -e "${YELLOW}📋 Configuração:${NC}"
echo "API URL: $API_URL"
echo "Instance: $INSTANCE_NAME"
echo "API Key: ${API_KEY:0:10}..."
echo ""

# Passo 1: Criar instância
echo -e "${YELLOW}1️⃣  Criando instância...${NC}"
CREATE_RESPONSE=$(curl -s -X POST "$API_URL/instance/create" \
  -H "Content-Type: application/json" \
  -H "apikey: $API_KEY" \
  -d "{
    \"instanceName\": \"$INSTANCE_NAME\",
    \"qrcode\": true,
    \"token\": \"$API_KEY\"
  }")

echo "Resposta: $CREATE_RESPONSE"
echo ""

# Passo 2: Verificar status da instância
echo -e "${YELLOW}2️⃣  Verificando status da instância...${NC}"
STATUS_RESPONSE=$(curl -s -X GET "$API_URL/instance/$INSTANCE_NAME/connectionState" \
  -H "Content-Type: application/json" \
  -H "apikey: $API_KEY")

echo "Status: $STATUS_RESPONSE"
echo ""

# Passo 3: Gerar QR Code
echo -e "${YELLOW}3️⃣  Gerando QR Code...${NC}"
QR_RESPONSE=$(curl -s -X GET "$API_URL/instance/$INSTANCE_NAME/qrcode" \
  -H "apikey: $API_KEY")

echo "QR Code Response: $QR_RESPONSE"
echo ""

# Passo 4: Verificar API status
echo -e "${YELLOW}4️⃣  Verificando status da API...${NC}"
API_STATUS=$(curl -s -X GET "$API_URL/status" \
  -H "apikey: $API_KEY")

if echo "$API_STATUS" | grep -q "success"; then
  echo -e "${GREEN}✅ API Online${NC}"
  echo "Detalhes: $API_STATUS"
else
  echo -e "${RED}❌ API Offline${NC}"
  echo "Detalhes: $API_STATUS"
fi

echo ""
echo -e "${GREEN}✅ Instância criada com sucesso!${NC}"
echo -e "${GREEN}🔗 Acesse: https://evolution-rust.vercel.app/enside-master-v21.html${NC}"
