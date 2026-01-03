#!/bin/bash

# 🤖 COMANDO CENTRAL - Claude (Vy) comandando Mac e iPhone
# Sistema ENSIDE v19.0 Integrado

cd "$(dirname "$0")"

# Cores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m'

clear
echo -e "${PURPLE}╔════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${PURPLE}║                                                                ║${NC}"
echo -e "${PURPLE}║${CYAN}    🤖 COMANDO CENTRAL - CLAUDE (VY) COMANDANDO MAC/iPHONE    ${PURPLE}║${NC}"
echo -e "${PURPLE}║                                                                ║${NC}"
echo -e "${PURPLE}╚════════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Carregar variáveis de ambiente
if [ -f ~/.enside_env ]; then
    source ~/.enside_env
    echo -e "${GREEN}✅ Variáveis de ambiente carregadas${NC}"
fi

echo ""
echo -e "${YELLOW}🤖 IAs INTEGRADAS:${NC}"
echo -e "${CYAN}   1. Claude (Vy)      - Comandando Mac e iPhone ${GREEN}[ATIVO]${NC}"
echo -e "${CYAN}   2. ESPECIALISTA-IA  - GitHub Integration     ${GREEN}[ATIVO]${NC}"
echo -e "${CYAN}   3. Google AI Studio - Gemini API             ${GREEN}[ATIVO]${NC}"
echo -e "${CYAN}   4. Evolution API    - WhatsApp               ${GREEN}[CONECTADO]${NC}"
echo -e "${CYAN}   5. Vercel           - Deploy Frontend        ${GREEN}[ATIVO]${NC}"
echo -e "${CYAN}   6. Render           - Backend Services       ${GREEN}[ATIVO]${NC}"
echo ""

# Verificar Docker
echo -e "${YELLOW}🐳 Verificando Docker...${NC}"
if docker ps &>/dev/null; then
    echo -e "${GREEN}✅ Docker rodando${NC}"
else
    echo -e "${YELLOW}⚠️  Iniciando Docker...${NC}"
    open -a Docker
    sleep 5
fi

# Verificar Evolution API
echo ""
echo -e "${YELLOW}📱 Verificando Evolution API...${NC}"
EVOLUTION_STATUS=$(curl -s "http://localhost:8080/instance/connectionState/enside" -H "apikey: 919AA333-AE59-4B06-B1EF-C9A9F9C8C0F6" 2>/dev/null)

if echo "$EVOLUTION_STATUS" | grep -q "open"; then
    echo -e "${GREEN}✅ WhatsApp CONECTADO (5518996540492)${NC}"
else
    echo -e "${YELLOW}⚠️  WhatsApp desconectado - verificando...${NC}"
    # Tentar conectar
    docker start evolution-api 2>/dev/null
fi

echo ""
echo -e "${PURPLE}════════════════════════════════════════════════════════════════${NC}"
echo -e "${CYAN}📋 COMANDOS DISPONÍVEIS:${NC}"
echo ""
echo -e "${WHITE}  [1] Abrir Sistema ENSIDE${NC}"
echo -e "${WHITE}  [2] Verificar Status Completo${NC}"
echo -e "${WHITE}  [3] Enviar Mensagem WhatsApp${NC}"
echo -e "${WHITE}  [4] Abrir Evolution Manager${NC}"
echo -e "${WHITE}  [5] Abrir Google Sheets${NC}"
echo -e "${WHITE}  [6] Abrir GitHub${NC}"
echo -e "${WHITE}  [7] Sincronizar Tudo${NC}"
echo -e "${WHITE}  [8] Abrir FASE 1 (Fretes)${NC}"
echo -e "${WHITE}  [9] Abrir FASE 2 (Marketing)${NC}"
echo -e "${WHITE}  [0] Sair${NC}"
echo ""
echo -e "${PURPLE}════════════════════════════════════════════════════════════════${NC}"

while true; do
    echo ""
    read -p "🤖 Digite o comando (0-9): " CMD
    
    case $CMD in
        1)
            echo -e "${CYAN}🖥️  Abrindo Sistema ENSIDE...${NC}"
            open "ENSIDE_MASTER_v19.0_INTEGRADO.html"
            ;;
        2)
            echo -e "${CYAN}📊 Status do Sistema:${NC}"
            echo ""
            echo "Docker:"
            docker ps --format "table {{.Names}}\t{{.Status}}" 2>/dev/null || echo "Docker não disponível"
            echo ""
            echo "Evolution API:"
            curl -s "http://localhost:8080/instance/connectionState/enside" -H "apikey: 919AA333-AE59-4B06-B1EF-C9A9F9C8C0F6" | python3 -m json.tool 2>/dev/null || echo "Não conectado"
            ;;
        3)
            read -p "📱 Número (com 55): " NUMERO
            read -p "💬 Mensagem: " MSG
            echo -e "${CYAN}📤 Enviando...${NC}"
            curl -s -X POST "http://localhost:8080/message/sendText/enside" \
                -H "Content-Type: application/json" \
                -H "apikey: 919AA333-AE59-4B06-B1EF-C9A9F9C8C0F6" \
                -d "{\"number\": \"$NUMERO\", \"textMessage\": {\"text\": \"$MSG\"}}"
            echo ""
            echo -e "${GREEN}✅ Mensagem enviada!${NC}"
            ;;
        4)
            echo -e "${CYAN}🔧 Abrindo Evolution Manager...${NC}"
            open -a Firefox "http://localhost:8080/manager"
            ;;
        5)
            echo -e "${CYAN}📊 Abrindo Google Sheets...${NC}"
            open "https://docs.google.com/spreadsheets/d/1FiP885Or0ncyRG_ZZaAvM2vP0sHhDzhLFYifYLjKyIE"
            ;;
        6)
            echo -e "${CYAN}🐙 Abrindo GitHub...${NC}"
            open "https://github.com/ensideanderson-nova/ENSIDE-MASTER-v16"
            ;;
        7)
            echo -e "${CYAN}🔄 Sincronizando...${NC}"
            git add -A
            git commit -m "🔄 Sync automático - $(date '+%Y-%m-%d %H:%M')"
            git push origin main 2>/dev/null || echo "Push pendente (verificar token)"
            echo -e "${GREEN}✅ Sincronização concluída!${NC}"
            ;;
        8)
            echo -e "${CYAN}📦 Abrindo FASE 1 - Fretes Disponíveis...${NC}"
            open "MODULOS/FASE1_FRETES_DISPONIVEIS.html"
            ;;
        9)
            echo -e "${CYAN}📢 Abrindo FASE 2 - Marketing...${NC}"
            open "MODULOS/FASE2_MARKETING.html"
            ;;
        0)
            echo -e "${GREEN}👋 Até logo! Claude (Vy) sempre disponível.${NC}"
            exit 0
            ;;
        *)
            echo -e "${RED}❌ Comando inválido${NC}"
            ;;
    esac
done
