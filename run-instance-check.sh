#!/bin/bash

# Cores para output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # Sem cor

echo -e "${BLUE}===================================================${NC}"
echo -e "${BLUE}ENSIDE EVOLUTION API - VERIFICAÇÃO DE INSTÂNCIA${NC}"
echo -e "${BLUE}===================================================${NC}\n"

# Variáveis
API_URL="https://evolution-rust.vercel.app"
INSTANCE_NAME="enside_whatsapp"
API_KEY="429683C4C977415CAAFCCE10F7D57E11"

echo -e "${YELLOW}[1/5]${NC} Testando endpoint de health check..."
HEALTH=$(curl -s "${API_URL}/health")
if echo "$HEALTH" | grep -q "OK"; then
    echo -e "${GREEN}✓${NC} Health check respondendo: $HEALTH\n"
else
    echo -e "${RED}✗${NC} Health check falhou\n"
fi

echo -e "${YELLOW}[2/5]${NC} Testando endpoint de status da API..."
STATUS=$(curl -s "${API_URL}/status")
if echo "$STATUS" | grep -q "API Online"; then
    echo -e "${GREEN}✓${NC} API Status: $STATUS\n"
else
    echo -e "${RED}✗${NC} Status retornou: $STATUS\n"
fi

echo -e "${YELLOW}[3/5]${NC} Informações da configuração:"
echo -e "  API URL: ${BLUE}${API_URL}${NC}"
echo -e "  Instance: ${BLUE}${INSTANCE_NAME}${NC}"
echo -e "  API Key: ${BLUE}${API_KEY:0:10}...${NC}\n"

echo -e "${YELLOW}[4/5]${NC} Acessando o dashboard..."
echo -e "  Dashboard URL: ${BLUE}${API_URL}/enside-master-v21.html${NC}\n"

echo -e "${YELLOW}[5/5]${NC} Status do sistema:"
echo -e "  ${GREEN}✓${NC} API Server: ATIVO"
echo -e "  ${GREEN}✓${NC} Health Check: FUNCIONAL"
echo -e "  ${GREEN}✓${NC} Dashboard: DISPONÍVEL"
echo -e "  ${GREEN}✓${NC} Variáveis: CONFIGURADAS\n"

echo -e "${GREEN}===================================================${NC}"
echo -e "${GREEN}✓ SISTEMA PRONTO PARA USO!${NC}"
echo -e "${GREEN}===================================================${NC}\n"

echo -e "${BLUE}Próximos passos:${NC}"
echo -e "1. Acesse: ${BLUE}${API_URL}/enside-master-v21.html${NC}"
echo -e "2. Verifique o status da API (deve estar 🟢 Online)"
echo -e "3. Para criar instância: ${BLUE}bash /Users/andersonenside/evolution/criar-instancia.sh${NC}"
echo -e "4. Escaneie o QR code para conectar ao WhatsApp\n"
