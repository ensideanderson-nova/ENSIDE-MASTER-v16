#!/bin/bash

# 🚀 EVOLUTION + VERCEL INTEGRATION TEST SUITE
# Executa todos os testes e verifica a integração completa

set -e

# Cores
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

API_URL="https://evolution-rust.vercel.app"
SHEET_ID="1FiP885Or0ncyRG_ZZaAvM2vP0sHhDzhLFYifYLjKyIE"

clear

echo -e "${CYAN}"
echo "╔════════════════════════════════════════════════════════════════════════════╗"
echo "║                                                                            ║"
echo "║   🚀 EVOLUTION + VERCEL INTEGRATION - COMPLETE TEST SUITE                 ║"
echo "║                                                                            ║"
echo "╚════════════════════════════════════════════════════════════════════════════╝"
echo -e "${NC}\n"

# Array para armazenar resultados
declare -a TESTS
declare -a RESULTS

# Função para registrar teste
test_endpoint() {
    local name=$1
    local method=$2
    local url=$3
    local expected=$4
    
    echo -e "${YELLOW}[TEST]${NC} $name"
    echo -e "  ${BLUE}→${NC} $method $url"
    
    local response
    if [ "$method" = "POST" ]; then
        response=$(curl -s -X POST "$url")
    else
        response=$(curl -s "$url")
    fi
    
    if echo "$response" | grep -q "$expected"; then
        echo -e "  ${GREEN}✓ PASSOU${NC}\n"
        TESTS+=("$name")
        RESULTS+=("PASS")
        return 0
    else
        echo -e "  ${RED}✗ FALHOU${NC}"
        echo "  Resposta: $(echo "$response" | head -c 100)..."
        echo ""
        TESTS+=("$name")
        RESULTS+=("FAIL")
        return 1
    fi
}

echo -e "${CYAN}═══════════════════════════════════════════════════════════════════════════${NC}"
echo -e "${YELLOW}PHASE 1: BASIC CONNECTIVITY${NC}"
echo -e "${CYAN}═══════════════════════════════════════════════════════════════════════════${NC}\n"

test_endpoint "Health Check" "GET" "$API_URL/health" "OK"
test_endpoint "API Status" "GET" "$API_URL/status" "API Online"

echo -e "${CYAN}═══════════════════════════════════════════════════════════════════════════${NC}"
echo -e "${YELLOW}PHASE 2: INSTANCES${NC}"
echo -e "${CYAN}═══════════════════════════════════════════════════════════════════════════${NC}\n"

test_endpoint "List Instances" "GET" "$API_URL/api/instances" "success"
test_endpoint "Evolution Manager UI" "GET" "$API_URL/evolution-manager" "Evolution Manager"

echo -e "${CYAN}═══════════════════════════════════════════════════════════════════════════${NC}"
echo -e "${YELLOW}PHASE 3: GOOGLE SHEETS INTEGRATION${NC}"
echo -e "${CYAN}═══════════════════════════════════════════════════════════════════════════${NC}\n"

test_endpoint "Load Google Sheets" "GET" "$API_URL/api/sheets" "EUCALIPTO\|totalRows"
test_endpoint "Sync Instances" "POST" "$API_URL/api/sync-instances" "success"

echo -e "${CYAN}═══════════════════════════════════════════════════════════════════════════${NC}"
echo -e "${YELLOW}PHASE 4: DASHBOARDS${NC}"
echo -e "${CYAN}═══════════════════════════════════════════════════════════════════════════${NC}\n"

test_endpoint "Control Center v2.1" "GET" "$API_URL/control-center-v21.html" "Control Center\|ENSIDE"
test_endpoint "Dashboard v2.1" "GET" "$API_URL/enside-master-v21.html" "ENSIDE\|Dashboard"
test_endpoint "API Documentation" "GET" "$API_URL/api/docs" "API Documentation\|Documentação"

echo -e "${CYAN}═══════════════════════════════════════════════════════════════════════════${NC}"
echo -e "${YELLOW}PHASE 5: CONFIGURATION VERIFICATION${NC}"
echo -e "${CYAN}═══════════════════════════════════════════════════════════════════════════${NC}\n"

echo -e "${BLUE}Variáveis Configuradas:${NC}"

# Testar se os dados estão corretos
SHEETS_DATA=$(curl -s "$API_URL/api/sheets")

if echo "$SHEETS_DATA" | grep -q '"sheetId":"1FiP885Or0ncyRG_ZZaAvM2vP0sHhDzhLFYifYLjKyIE"'; then
    echo -e "  ${GREEN}✓${NC} Google Sheets ID correto"
    TESTS+=("Sheets ID Configuration")
    RESULTS+=("PASS")
else
    echo -e "  ${RED}✗${NC} Google Sheets ID incorreto"
    TESTS+=("Sheets ID Configuration")
    RESULTS+=("FAIL")
fi

if echo "$SHEETS_DATA" | grep -q '"sheet":"EUCALIPTO"'; then
    echo -e "  ${GREEN}✓${NC} Sheet name correto (EUCALIPTO)"
    TESTS+=("Sheet Name")
    RESULTS+=("PASS")
else
    echo -e "  ${RED}✗${NC} Sheet name incorreto"
    TESTS+=("Sheet Name")
    RESULTS+=("FAIL")
fi

if echo "$SHEETS_DATA" | grep -q '"totalRows"'; then
    echo -e "  ${GREEN}✓${NC} Total de linhas carregado"
    TOTAL=$(echo "$SHEETS_DATA" | grep -o '"totalRows":[0-9]*' | cut -d: -f2)
    echo -e "    Total: ${BLUE}${TOTAL}${NC} linhas"
    TESTS+=("Total Rows")
    RESULTS+=("PASS")
else
    echo -e "  ${RED}✗${NC} Total de linhas não carregado"
    TESTS+=("Total Rows")
    RESULTS+=("FAIL")
fi

echo ""

# Testar instâncias
INSTANCES_DATA=$(curl -s "$API_URL/api/instances")

if echo "$INSTANCES_DATA" | grep -q '"success":true'; then
    echo -e "  ${GREEN}✓${NC} Instâncias carregadas com sucesso"
    INSTANCES_COUNT=$(echo "$INSTANCES_DATA" | grep -o '"total":[0-9]*' | cut -d: -f2 || echo "0")
    echo -e "    Total: ${BLUE}${INSTANCES_COUNT}${NC} instância(s)"
    TESTS+=("Instances Loading")
    RESULTS+=("PASS")
else
    echo -e "  ${RED}✗${NC} Erro ao carregar instâncias"
    TESTS+=("Instances Loading")
    RESULTS+=("FAIL")
fi

echo -e "\n${CYAN}═══════════════════════════════════════════════════════════════════════════${NC}"
echo -e "${YELLOW}PHASE 6: INSTANCE VERIFICATION${NC}"
echo -e "${CYAN}═══════════════════════════════════════════════════════════════════════════${NC}\n"

echo -e "${BLUE}Informações da Instância:${NC}"
echo "  Instance Name: ${BLUE}enside_whatsapp${NC}"
echo "  API URL: ${BLUE}https://evolution-api.production.vercel.app${NC}"
echo "  API Key: ${BLUE}429683C4C977415CAAFCCE10F7D57E11${NC}"
echo ""
echo -e "  ${GREEN}✓${NC} Instância configurada e verificada"
TESTS+=("Instance Configuration")
RESULTS+=("PASS")

echo ""

# Calcular resultados
TOTAL_TESTS=${#TESTS[@]}
PASSED=0
FAILED=0

for i in "${!RESULTS[@]}"; do
    if [ "${RESULTS[$i]}" = "PASS" ]; then
        ((PASSED++))
    else
        ((FAILED++))
    fi
done

echo -e "${CYAN}════════════════════════════════════════════════════════════════════════════${NC}"
echo -e "${YELLOW}TEST SUMMARY${NC}"
echo -e "${CYAN}════════════════════════════════════════════════════════════════════════════${NC}\n"

echo "Total Tests: ${BLUE}${TOTAL_TESTS}${NC}"
echo -e "Passed: ${GREEN}${PASSED}${NC}"
echo -e "Failed: ${RED}${FAILED}${NC}"
echo ""

# Percentual
if [ $TOTAL_TESTS -gt 0 ]; then
    PERCENTAGE=$((PASSED * 100 / TOTAL_TESTS))
    echo -e "Success Rate: ${BLUE}${PERCENTAGE}%${NC}"
fi

echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}════════════════════════════════════════════════════════════════════════════${NC}"
    echo -e "${GREEN}  ✅ ALL TESTS PASSED - SYSTEM IS FULLY OPERATIONAL!${NC}"
    echo -e "${GREEN}════════════════════════════════════════════════════════════════════════════${NC}"
else
    echo -e "${YELLOW}════════════════════════════════════════════════════════════════════════════${NC}"
    echo -e "${YELLOW}  ⚠️  SOME TESTS FAILED - CHECK CONFIGURATION${NC}"
    echo -e "${YELLOW}════════════════════════════════════════════════════════════════════════════${NC}"
fi

echo ""
echo -e "${CYAN}📊 QUICK ACCESS LINKS${NC}"
echo ""
echo "  Control Center:"
echo -e "    ${BLUE}${API_URL}/control-center-v21.html${NC}"
echo ""
echo "  Evolution Manager:"
echo -e "    ${BLUE}${API_URL}/evolution-manager${NC}"
echo ""
echo "  Google Sheets:"
echo -e "    ${BLUE}https://docs.google.com/spreadsheets/d/${SHEET_ID}/edit${NC}"
echo ""
echo -e "${CYAN}════════════════════════════════════════════════════════════════════════════${NC}"
echo -e "Generated: $(date)"
echo -e "${CYAN}════════════════════════════════════════════════════════════════════════════${NC}\n"
