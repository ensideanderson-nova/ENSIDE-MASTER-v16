#!/bin/bash

# Cores
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

API_URL="${1:-https://evolution-rust.vercel.app}"

echo -e "${BLUE}════════════════════════════════════════════${NC}"
echo -e "${BLUE}  🔧 Evolution Manager - Teste de Endpoints${NC}"
echo -e "${BLUE}════════════════════════════════════════════${NC}\n"

echo -e "${YELLOW}API Base:${NC} ${BLUE}${API_URL}${NC}\n"

# Teste 1: Health Check
echo -e "${YELLOW}[1/5]${NC} Testando ${BLUE}/health${NC}..."
HEALTH=$(curl -s "${API_URL}/health")
if echo "$HEALTH" | grep -q "OK"; then
    echo -e "${GREEN}✓${NC} Health Check OK\n"
else
    echo -e "${RED}✗${NC} Health Check falhou: $HEALTH\n"
fi

# Teste 2: Status
echo -e "${YELLOW}[2/5]${NC} Testando ${BLUE}/status${NC}..."
STATUS=$(curl -s "${API_URL}/status")
if echo "$STATUS" | grep -q "API Online"; then
    echo -e "${GREEN}✓${NC} Status OK\n"
else
    echo -e "${RED}✗${NC} Status falhou\n"
fi

# Teste 3: Instâncias
echo -e "${YELLOW}[3/5]${NC} Testando ${BLUE}/api/instances${NC}..."
INSTANCES=$(curl -s "${API_URL}/api/instances")
if echo "$INSTANCES" | grep -q "success"; then
    TOTAL=$(echo "$INSTANCES" | grep -o '"total":[0-9]*' | cut -d: -f2)
    echo -e "${GREEN}✓${NC} Instâncias encontradas: ${TOTAL}\n"
else
    echo -e "${RED}✗${NC} Erro ao carregar instâncias\n"
fi

# Teste 4: Google Sheets
echo -e "${YELLOW}[4/5]${NC} Testando ${BLUE}/api/sheets${NC}..."
SHEETS=$(curl -s "${API_URL}/api/sheets")
if echo "$SHEETS" | grep -q "EUCALIPTO"; then
    ROWS=$(echo "$SHEETS" | grep -o '"totalRows":[0-9]*' | cut -d: -f2)
    echo -e "${GREEN}✓${NC} Sheets carregado: ${ROWS} linhas\n"
else
    echo -e "${RED}✗${NC} Erro ao carregar Sheets\n"
fi

# Teste 5: Evolution Manager
echo -e "${YELLOW}[5/5]${NC} Testando ${BLUE}/evolution-manager${NC}..."
MANAGER=$(curl -s -I "${API_URL}/evolution-manager" | head -1)
if echo "$MANAGER" | grep -q "200\|OK"; then
    echo -e "${GREEN}✓${NC} Evolution Manager disponível\n"
else
    echo -e "${RED}✗${NC} Evolution Manager não respondeu\n"
fi

echo -e "${GREEN}════════════════════════════════════════════${NC}"
echo -e "${GREEN}✓ Testes concluídos!${NC}\n"

echo -e "${BLUE}📊 URLs Disponíveis:${NC}"
echo -e "  Dashboard:          ${BLUE}${API_URL}/enside-master-v21.html${NC}"
echo -e "  Evolution Manager:  ${BLUE}${API_URL}/evolution-manager${NC}"
echo -e "  API Docs:           ${BLUE}${API_URL}/api/docs${NC}"
echo -e "  Health Check:       ${BLUE}${API_URL}/health${NC}"
echo -e "  Instâncias:         ${BLUE}${API_URL}/api/instances${NC}"
echo -e "  Google Sheets:      ${BLUE}${API_URL}/api/sheets${NC}\n"
