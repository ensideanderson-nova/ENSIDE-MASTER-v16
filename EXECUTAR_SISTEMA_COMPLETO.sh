#!/bin/bash

# ============================================
# 🚀 ENSIDE MASTER - SISTEMA COMPLETO
# Script executável único com menu interativo
# Version: 1.0.0
# ============================================

# Cores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
MAGENTA='\033[0;35m'
CYAN='\033[0;36m'
WHITE='\033[1;37m'
NC='\033[0m' # No Color
BOLD='\033[1m'

# Diretório base
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# Criar diretórios necessários
mkdir -p logs relatorios dados

# Carregar variáveis de ambiente
if [ -f ".env" ]; then
    set -a
    source .env
    set +a
fi

# Configurações (com fallback para .env)
EVOLUTION_API_URL="${EVOLUTION_API_URL:-https://evolution-api-latest-poc1.onrender.com}"
EVOLUTION_API_KEY="${EVOLUTION_API_KEY:-evolution-api-enside-2024-secret}"
EVOLUTION_INSTANCE="${EVOLUTION_INSTANCE:-ENSIDE}"
GOOGLE_SHEETS_ID="${GOOGLE_SHEETS_ID:-1FiP885Or0ncyRG_ZZaAvM2vP0sHhDzhLFYifYLjKyIE}"
VERCEL_URL="${VERCEL_URL:-https://enside-sistema.vercel.app}"
WHATSAPP_NUMBER="${WHATSAPP_NUMBER:-5518996540492}"

# Arquivo de log do dia
LOG_FILE="logs/envios_$(date +%Y%m%d).log"
ERROR_LOG="logs/erros_$(date +%Y%m%d).log"

# ============================================
# FUNÇÕES AUXILIARES
# ============================================

# Função para logging
log_action() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" >> "$LOG_FILE"
}

log_error() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] ERROR: $1" >> "$ERROR_LOG"
}

# Função para exibir cabeçalho
show_header() {
    clear
    echo -e "${CYAN}╔═══════════════════════════════════════════╗${NC}"
    echo -e "${CYAN}║   ${WHITE}${BOLD}🚀 ENSIDE MASTER - SISTEMA COMPLETO${NC}${CYAN}    ║${NC}"
    echo -e "${CYAN}╚═══════════════════════════════════════════╝${NC}"
    echo ""
}

# Função para exibir loading
show_loading() {
    local message="$1"
    local duration="${2:-2}"
    echo -ne "${YELLOW}⏳ $message"
    for i in $(seq 1 $duration); do
        echo -n "."
        sleep 1
    done
    echo -e "${NC}"
}

# Função para exibir barra de progresso
show_progress() {
    local current=$1
    local total=$2
    local width=40
    local percentage=$((current * 100 / total))
    local filled=$((width * current / total))
    local empty=$((width - filled))
    
    printf "\r${CYAN}["
    printf "%${filled}s" | tr ' ' '='
    printf "%${empty}s" | tr ' ' ' '
    printf "] ${WHITE}%3d%%${NC} (%d/%d)" $percentage $current $total
}

# ============================================
# VERIFICAÇÃO DE DEPENDÊNCIAS
# ============================================

check_dependencies() {
    echo -e "${YELLOW}🔍 Verificando dependências...${NC}"
    
    local missing_deps=()
    
    # Verificar curl
    if command -v curl &> /dev/null; then
        echo -e "  ${GREEN}✅ curl instalado${NC}"
    else
        echo -e "  ${RED}⚠️  curl não encontrado${NC}"
        missing_deps+=("curl")
    fi
    
    # Verificar jq
    if command -v jq &> /dev/null; then
        echo -e "  ${GREEN}✅ jq instalado${NC}"
    else
        echo -e "  ${YELLOW}⚠️  jq não encontrado${NC}"
        echo -e "  ${CYAN}📦 Instalando jq...${NC}"
        
        # Tentar instalar jq
        if [[ "$OSTYPE" == "darwin"* ]]; then
            # macOS
            if command -v brew &> /dev/null; then
                brew install jq
            else
                echo -e "  ${RED}❌ Homebrew não encontrado. Por favor, instale jq manualmente.${NC}"
                missing_deps+=("jq")
            fi
        elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
            # Linux
            if command -v apt-get &> /dev/null; then
                sudo apt-get install -y jq
            elif command -v yum &> /dev/null; then
                sudo yum install -y jq
            else
                echo -e "  ${RED}❌ Gerenciador de pacotes não identificado. Por favor, instale jq manualmente.${NC}"
                missing_deps+=("jq")
            fi
        fi
        
        # Verificar se instalou
        if command -v jq &> /dev/null; then
            echo -e "  ${GREEN}✅ jq instalado com sucesso!${NC}"
        fi
    fi
    
    # Verificar git
    if command -v git &> /dev/null; then
        echo -e "  ${GREEN}✅ git instalado${NC}"
    else
        echo -e "  ${YELLOW}⚠️  git não encontrado (opcional)${NC}"
    fi
    
    # Verificar node (opcional)
    if command -v node &> /dev/null; then
        echo -e "  ${GREEN}✅ node instalado ($(node --version))${NC}"
    else
        echo -e "  ${YELLOW}⚠️  node não encontrado (opcional)${NC}"
    fi
    
    echo ""
    
    if [ ${#missing_deps[@]} -gt 0 ]; then
        echo -e "${RED}❌ Dependências obrigatórias faltando: ${missing_deps[*]}${NC}"
        echo -e "${YELLOW}Por favor, instale as dependências e execute novamente.${NC}"
        return 1
    fi
    
    return 0
}

# ============================================
# VERIFICAÇÃO EVOLUTION API
# ============================================

check_evolution_api() {
    echo -e "${YELLOW}🌐 Conectando à Evolution API...${NC}"
    echo -e "   URL: ${CYAN}$EVOLUTION_API_URL${NC}"
    
    # Testar conexão
    local response=$(curl -s -o /dev/null -w "%{http_code}" "$EVOLUTION_API_URL" -H "apikey: $EVOLUTION_API_KEY" 2>/dev/null)
    
    if [ "$response" != "200" ]; then
        echo -e "   ${YELLOW}⏳ Aguardando Render acordar (cold start)...${NC}"
        show_loading "   Aguardando" 30
        
        response=$(curl -s -o /dev/null -w "%{http_code}" "$EVOLUTION_API_URL" -H "apikey: $EVOLUTION_API_KEY" 2>/dev/null)
    fi
    
    if [ "$response" = "200" ]; then
        echo -e "   ${GREEN}✅ Evolution API: ONLINE${NC}"
        
        # Tentar pegar versão
        local version=$(curl -s "$EVOLUTION_API_URL" -H "apikey: $EVOLUTION_API_KEY" 2>/dev/null | grep -o '"version":"[^"]*' | cut -d'"' -f4)
        if [ -n "$version" ]; then
            echo -e "   Versão: $version"
        fi
        return 0
    else
        echo -e "   ${RED}❌ Evolution API: OFFLINE (HTTP $response)${NC}"
        return 1
    fi
}

# ============================================
# VERIFICAÇÃO WHATSAPP
# ============================================

check_whatsapp_status() {
    local show_output="${1:-true}"
    
    local response=$(curl -s "$EVOLUTION_API_URL/instance/connectionState/$EVOLUTION_INSTANCE" \
        -H "apikey: $EVOLUTION_API_KEY" 2>/dev/null)
    
    local state=$(echo "$response" | jq -r '.instance.state' 2>/dev/null)
    
    if [ "$state" = "open" ]; then
        if [ "$show_output" = "true" ]; then
            echo -e "${GREEN}🟢 WhatsApp: CONECTADO${NC}"
        fi
        return 0
    else
        if [ "$show_output" = "true" ]; then
            echo -e "${RED}🔴 WhatsApp: DESCONECTADO${NC}"
            if [ -n "$state" ] && [ "$state" != "null" ]; then
                echo -e "   Status: $state"
            fi
        fi
        return 1
    fi
}

# ============================================
# VERIFICAÇÃO GOOGLE SHEETS
# ============================================

check_google_sheets() {
    local show_output="${1:-true}"
    
    local csv_url="https://docs.google.com/spreadsheets/d/$GOOGLE_SHEETS_ID/export?format=csv&gid=0"
    local response=$(curl -sL "$csv_url" 2>/dev/null | wc -l | tr -d ' ')
    
    if [ "$response" -gt 0 ]; then
        if [ "$show_output" = "true" ]; then
            echo -e "${GREEN}🟢 Google Sheets: $response contatos${NC}"
        fi
        echo "$response"
        return 0
    else
        if [ "$show_output" = "true" ]; then
            echo -e "${RED}🔴 Google Sheets: ERRO${NC}"
        fi
        return 1
    fi
}

# ============================================
# STATUS COMPLETO
# ============================================

show_status() {
    show_header
    echo -e "${BOLD}STATUS DO SISTEMA:${NC}"
    echo ""
    
    # Evolution API
    if check_evolution_api; then
        :
    fi
    echo ""
    
    # WhatsApp
    check_whatsapp_status
    echo ""
    
    # Google Sheets
    local contacts=$(check_google_sheets)
    echo ""
    
    # Vercel
    echo -e "${GREEN}🟢 Vercel: ONLINE${NC}"
    echo -e "   URL: ${CYAN}$VERCEL_URL${NC}"
    echo ""
    
    read -p "Pressione ENTER para voltar ao menu..."
}

# ============================================
# CONECTAR WHATSAPP (QR CODE)
# ============================================

connect_whatsapp() {
    show_header
    echo -e "${BOLD}📱 CONECTAR WHATSAPP${NC}"
    echo ""
    
    # Verificar se já está conectado
    if check_whatsapp_status false; then
        echo -e "${GREEN}✅ WhatsApp já está conectado!${NC}"
        echo ""
        read -p "Deseja reconectar? (s/n): " reconnect
        if [ "$reconnect" != "s" ] && [ "$reconnect" != "S" ]; then
            return
        fi
    fi
    
    echo -e "${YELLOW}👉 Vamos conectar o WhatsApp agora!${NC}"
    echo -e "   1. Vou gerar um QR Code"
    echo -e "   2. Abrir no seu navegador"
    echo -e "   3. Você escaneia com WhatsApp"
    echo ""
    read -p "Pressione ENTER para continuar..."
    
    echo ""
    echo -e "${YELLOW}📱 Gerando QR Code...${NC}"
    
    # Gerar QR Code
    local qr_response=$(curl -s "$EVOLUTION_API_URL/instance/connect/$EVOLUTION_INSTANCE" \
        -H "apikey: $EVOLUTION_API_KEY" 2>/dev/null)
    
    local qr_code=$(echo "$qr_response" | jq -r '.qrcode.base64' 2>/dev/null)
    
    if [ -n "$qr_code" ] && [ "$qr_code" != "null" ]; then
        echo -e "${GREEN}✅ QR Code gerado!${NC}"
        
        # Salvar QR Code
        local qr_file="qrcode_$(date +%Y%m%d_%H%M%S).txt"
        echo "$qr_code" > "$qr_file"
        echo -e "   Salvo em: ${CYAN}$qr_file${NC}"
        
        # Tentar abrir no navegador
        local manager_url="$EVOLUTION_API_URL/manager"
        echo -e "${YELLOW}🌐 Abrindo Evolution Manager...${NC}"
        
        if [[ "$OSTYPE" == "darwin"* ]]; then
            open "$manager_url"
        elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
            xdg-open "$manager_url" 2>/dev/null || echo -e "   ${YELLOW}Abra manualmente: $manager_url${NC}"
        fi
        
        echo ""
        echo -e "${YELLOW}⏳ Aguardando conexão...${NC}"
        echo -e "   (Escaneie o QR Code no Evolution Manager com seu WhatsApp)"
        echo ""
        
        # Aguardar conexão (verificar a cada 5 segundos por até 2 minutos)
        local attempts=0
        local max_attempts=24
        while [ $attempts -lt $max_attempts ]; do
            if check_whatsapp_status false; then
                echo ""
                echo -e "${GREEN}✅ WhatsApp CONECTADO com sucesso!${NC}"
                log_action "WhatsApp conectado via QR Code"
                sleep 2
                return 0
            fi
            
            echo -ne "   Tentativa $((attempts + 1))/$max_attempts\r"
            sleep 5
            attempts=$((attempts + 1))
        done
        
        echo ""
        echo -e "${RED}⚠️  Tempo esgotado. Por favor, tente novamente.${NC}"
        log_error "Timeout ao aguardar conexão WhatsApp"
    else
        echo -e "${RED}❌ Erro ao gerar QR Code${NC}"
        echo -e "   Resposta: $qr_response"
        log_error "Erro ao gerar QR Code: $qr_response"
    fi
    
    echo ""
    read -p "Pressione ENTER para voltar ao menu..."
}

# ============================================
# ENVIAR MENSAGEM INDIVIDUAL
# ============================================

send_individual_message() {
    show_header
    echo -e "${BOLD}📨 ENVIAR MENSAGEM INDIVIDUAL${NC}"
    echo ""
    
    # Verificar conexão WhatsApp
    if ! check_whatsapp_status false; then
        echo -e "${RED}❌ WhatsApp não está conectado!${NC}"
        echo -e "${YELLOW}Use a opção 2 do menu para conectar.${NC}"
        echo ""
        read -p "Pressione ENTER para voltar ao menu..."
        return
    fi
    
    # Solicitar número
    echo -e "${YELLOW}Digite o número (com DDD, ex: 18996540492):${NC}"
    read -p "→ " numero
    
    # Limpar número (remover espaços e caracteres especiais)
    numero=$(echo "$numero" | tr -d ' ()-')
    
    # Adicionar código do país se não tiver
    if [[ ! "$numero" =~ ^55 ]]; then
        numero="55$numero"
    fi
    
    echo ""
    echo -e "${YELLOW}Digite a mensagem:${NC}"
    read -p "→ " mensagem
    
    echo ""
    echo -e "${CYAN}Confirmação:${NC}"
    echo -e "  Número: ${WHITE}$numero${NC}"
    echo -e "  Mensagem: ${WHITE}$mensagem${NC}"
    echo ""
    read -p "Confirma envio? (s/n): " confirma
    
    if [ "$confirma" != "s" ] && [ "$confirma" != "S" ]; then
        echo -e "${YELLOW}Envio cancelado.${NC}"
        sleep 1
        return
    fi
    
    echo ""
    echo -e "${YELLOW}📤 Enviando...${NC}"
    
    # Enviar mensagem
    local response=$(curl -s -X POST "$EVOLUTION_API_URL/message/sendText/$EVOLUTION_INSTANCE" \
        -H "apikey: $EVOLUTION_API_KEY" \
        -H "Content-Type: application/json" \
        -d "{
            \"number\": \"$numero\",
            \"textMessage\": {
                \"text\": \"$mensagem\"
            }
        }" 2>/dev/null)
    
    # Verificar resposta
    local key=$(echo "$response" | jq -r '.key.id' 2>/dev/null)
    
    if [ -n "$key" ] && [ "$key" != "null" ]; then
        echo -e "${GREEN}✅ Mensagem enviada com sucesso!${NC}"
        echo -e "   ID: $key"
        log_action "Mensagem individual enviada para $numero"
    else
        echo -e "${RED}❌ Erro ao enviar mensagem${NC}"
        echo -e "   Resposta: $response"
        log_error "Erro ao enviar para $numero: $response"
    fi
    
    echo ""
    read -p "Pressione ENTER para voltar ao menu..."
}

# ============================================
# ENVIO EM MASSA
# ============================================

send_bulk_messages() {
    show_header
    echo -e "${BOLD}📢 ENVIO EM MASSA DE MENSAGENS${NC}"
    echo ""
    
    # Verificar conexão WhatsApp
    if ! check_whatsapp_status false; then
        echo -e "${RED}❌ WhatsApp não está conectado!${NC}"
        echo -e "${YELLOW}Use a opção 2 do menu para conectar.${NC}"
        echo ""
        read -p "Pressione ENTER para voltar ao menu..."
        return
    fi
    
    echo -e "${YELLOW}Selecione a lista:${NC}"
    echo -e "  ${WHITE}1)${NC} 🧪 Teste (5 contatos)"
    echo -e "  ${WHITE}2)${NC} 🏭 Fornecedores (primeiros 50)"
    echo -e "  ${WHITE}3)${NC} 👥 Clientes (primeiros 50)"
    echo -e "  ${WHITE}4)${NC} 📦 Todos (primeiros 100)"
    echo -e "  ${WHITE}0)${NC} ❌ Cancelar"
    echo ""
    read -p "Digite sua escolha: " lista_escolha
    
    local limite=5
    local nome_lista="Teste"
    
    case $lista_escolha in
        1)
            limite=5
            nome_lista="Teste"
            ;;
        2)
            limite=50
            nome_lista="Fornecedores"
            ;;
        3)
            limite=50
            nome_lista="Clientes"
            ;;
        4)
            limite=100
            nome_lista="Todos"
            ;;
        0)
            return
            ;;
        *)
            echo -e "${RED}Opção inválida!${NC}"
            sleep 2
            return
            ;;
    esac
    
    echo ""
    echo -e "${GREEN}✅ Lista: $nome_lista ($limite contatos)${NC}"
    echo ""
    
    echo -e "${YELLOW}Digite a mensagem (use {nome} para personalizar):${NC}"
    read -p "→ " mensagem
    
    echo ""
    echo -e "${YELLOW}Delay entre mensagens (segundos) [padrão: 20]:${NC}"
    read -p "→ " delay
    delay=${delay:-20}
    
    echo ""
    echo -e "${CYAN}CONFIRMAÇÃO:${NC}"
    echo -e "  Lista: ${WHITE}$nome_lista${NC}"
    echo -e "  Total: ${WHITE}$limite contatos${NC}"
    echo -e "  Mensagem: ${WHITE}$mensagem${NC}"
    echo -e "  Delay: ${WHITE}$delay segundos${NC}"
    echo ""
    read -p "Confirma envio? (s/n): " confirma
    
    if [ "$confirma" != "s" ] && [ "$confirma" != "S" ]; then
        echo -e "${YELLOW}Envio cancelado.${NC}"
        sleep 1
        return
    fi
    
    echo ""
    echo -e "${GREEN}🚀 Iniciando envio...${NC}"
    echo ""
    
    # Baixar contatos do Google Sheets
    local csv_file="/tmp/contatos_massa_$$.csv"
    curl -sL "https://docs.google.com/spreadsheets/d/$GOOGLE_SHEETS_ID/export?format=csv&gid=0" > "$csv_file"
    
    local enviados=0
    local falhas=0
    local total_linhas=$(wc -l < "$csv_file" | tr -d ' ')
    
    if [ "$total_linhas" -lt 2 ]; then
        echo -e "${RED}❌ Erro ao baixar contatos do Google Sheets${NC}"
        rm -f "$csv_file"
        read -p "Pressione ENTER para voltar ao menu..."
        return
    fi
    
    local start_time=$(date +%s)
    
    # Processar CSV (pular cabeçalho) - usando process substitution para evitar subshell
    while IFS=',' read -r nome telefone categoria vip email obs; do
        enviados=$((enviados + 1))
        
        # Limpar nome e telefone (remover apenas aspas duplas, não vírgulas internas)
        nome=$(echo "$nome" | sed 's/^"//;s/"$//' | xargs)
        telefone=$(echo "$telefone" | sed 's/^"//;s/"$//' | tr -d ' ()-')
        
        # Adicionar código do país se não tiver
        if [[ ! "$telefone" =~ ^55 ]]; then
            telefone="55$telefone"
        fi
        
        # Personalizar mensagem
        local msg_personalizada="${mensagem/\{nome\}/$nome}"
        
        echo -e "${CYAN}[$enviados/$limite]${NC} ${WHITE}$nome${NC} ($telefone)"
        
        # Enviar mensagem
        local response=$(curl -s -X POST "$EVOLUTION_API_URL/message/sendText/$EVOLUTION_INSTANCE" \
            -H "apikey: $EVOLUTION_API_KEY" \
            -H "Content-Type: application/json" \
            -d "{
                \"number\": \"$telefone\",
                \"textMessage\": {
                    \"text\": \"$msg_personalizada\"
                }
            }" 2>/dev/null)
        
        local key=$(echo "$response" | jq -r '.key.id' 2>/dev/null)
        
        if [ -n "$key" ] && [ "$key" != "null" ]; then
            echo -e "  ${GREEN}✅ Enviado${NC}"
            log_action "Massa: Enviado para $nome ($telefone)"
        else
            echo -e "  ${RED}❌ Falha${NC}"
            falhas=$((falhas + 1))
            log_error "Massa: Falha ao enviar para $nome ($telefone): $response"
        fi
        
        # Delay entre mensagens (não no último)
        if [ $enviados -lt $limite ]; then
            echo -e "  ${YELLOW}⏳ Aguardando ${delay}s...${NC}"
            sleep "$delay"
        fi
        
        echo ""
    done < <(tail -n +2 "$csv_file" | head -n "$limite")
    
    local end_time=$(date +%s)
    local duration=$((end_time - start_time))
    local sucesso=$((limite - falhas))
    local taxa_sucesso=$((sucesso * 100 / limite))
    
    # Limpar arquivo temporário
    rm -f "$csv_file"
    
    # Resultado final
    echo ""
    echo -e "${CYAN}╔═══════════════════════════════════════╗${NC}"
    echo -e "${CYAN}║   ${GREEN}✅ ENVIO CONCLUÍDO${NC}${CYAN}                  ║${NC}"
    echo -e "${CYAN}╠═══════════════════════════════════════╣${NC}"
    echo -e "${CYAN}║                                       ║${NC}"
    echo -e "${CYAN}║${NC}  Total enviados: ${WHITE}${sucesso}${NC}$(printf '%*s' $((23 - ${#sucesso})) '')${CYAN}║${NC}"
    echo -e "${CYAN}║${NC}  Falhas: ${WHITE}${falhas}${NC}$(printf '%*s' $((29 - ${#falhas})) '')${CYAN}║${NC}"
    echo -e "${CYAN}║${NC}  Taxa de sucesso: ${WHITE}${taxa_sucesso}%${NC}$(printf '%*s' $((19 - ${#taxa_sucesso})) '')${CYAN}║${NC}"
    echo -e "${CYAN}║${NC}  Tempo total: ${WHITE}${duration}s${NC}$(printf '%*s' $((23 - ${#duration})) '')${CYAN}║${NC}"
    echo -e "${CYAN}║                                       ║${NC}"
    echo -e "${CYAN}║${NC}  📊 Log salvo em:                   ${CYAN}║${NC}"
    echo -e "${CYAN}║${NC}  ${YELLOW}$LOG_FILE${NC}$(printf '%*s' $((39 - ${#LOG_FILE})) '')${CYAN}║${NC}"
    echo -e "${CYAN}║                                       ║${NC}"
    echo -e "${CYAN}╚═══════════════════════════════════════╝${NC}"
    
    log_action "Envio em massa concluído: $sucesso enviados, $falhas falhas"
    
    echo ""
    read -p "Pressione ENTER para voltar ao menu..."
}

# ============================================
# VALIDAR CONTATOS
# ============================================

validate_contacts() {
    show_header
    echo -e "${BOLD}✅ VALIDAR CONTATOS (GOOGLE SHEETS)${NC}"
    echo ""
    
    echo -e "${YELLOW}📊 Baixando contatos do Google Sheets...${NC}"
    
    local csv_file="/tmp/contatos_validacao_$$.csv"
    curl -sL "https://docs.google.com/spreadsheets/d/$GOOGLE_SHEETS_ID/export?format=csv&gid=0" > "$csv_file"
    
    local total=$(wc -l < "$csv_file" | tr -d ' ')
    total=$((total - 1))  # Remover cabeçalho
    
    if [ "$total" -lt 1 ]; then
        echo -e "${RED}❌ Erro ao baixar contatos${NC}"
        rm -f "$csv_file"
        read -p "Pressione ENTER para voltar ao menu..."
        return
    fi
    
    echo -e "${GREEN}✅ Total: $total contatos${NC}"
    echo ""
    
    echo -e "${YELLOW}📊 Analisando contatos...${NC}"
    
    # Análise de categorias
    local fornecedores=$(tail -n +2 "$csv_file" | grep -i "fornecedor" | wc -l | tr -d ' ')
    local clientes=$(tail -n +2 "$csv_file" | grep -i "cliente" | wc -l | tr -d ' ')
    local transportadores=$(tail -n +2 "$csv_file" | grep -i "transport" | wc -l | tr -d ' ')
    
    # Validação de números
    local invalidos=0
    while IFS=',' read -r nome telefone resto; do
        telefone=$(echo "$telefone" | tr -d '"' | tr -d ' ()-')
        # Verificar se tem pelo menos 10 dígitos
        if [ ${#telefone} -lt 10 ]; then
            invalidos=$((invalidos + 1))
        fi
    done < <(tail -n +2 "$csv_file")
    
    rm -f "$csv_file"
    
    echo ""
    echo -e "${CYAN}╔═══════════════════════════════════════╗${NC}"
    echo -e "${CYAN}║   ${WHITE}ESTATÍSTICAS DE CONTATOS${NC}${CYAN}          ║${NC}"
    echo -e "${CYAN}╠═══════════════════════════════════════╣${NC}"
    echo -e "${CYAN}║                                       ║${NC}"
    echo -e "${CYAN}║${NC}  ${GREEN}✅ Total: ${WHITE}$total contatos${NC}$(printf '%*s' $((20 - ${#total})) '')${CYAN}║${NC}"
    echo -e "${CYAN}║${NC}  ${GREEN}✅ Fornecedores: ${WHITE}$fornecedores${NC}$(printf '%*s' $((18 - ${#fornecedores})) '')${CYAN}║${NC}"
    echo -e "${CYAN}║${NC}  ${GREEN}✅ Clientes: ${WHITE}$clientes${NC}$(printf '%*s' $((22 - ${#clientes})) '')${CYAN}║${NC}"
    echo -e "${CYAN}║${NC}  ${GREEN}✅ Transportadores: ${WHITE}$transportadores${NC}$(printf '%*s' $((14 - ${#transportadores})) '')${CYAN}║${NC}"
    
    if [ "$invalidos" -gt 0 ]; then
        echo -e "${CYAN}║${NC}  ${YELLOW}⚠️  Números inválidos: ${WHITE}$invalidos${NC}$(printf '%*s' $((9 - ${#invalidos})) '')${CYAN}║${NC}"
    fi
    
    echo -e "${CYAN}║                                       ║${NC}"
    echo -e "${CYAN}╚═══════════════════════════════════════╝${NC}"
    
    log_action "Validação: $total contatos ($invalidos inválidos)"
    
    echo ""
    read -p "Pressione ENTER para voltar ao menu..."
}

# ============================================
# SINCRONIZAR CONTATOS
# ============================================

sync_contacts() {
    show_header
    echo -e "${BOLD}🔄 SINCRONIZAR CONTATOS${NC}"
    echo ""
    
    echo -e "${YELLOW}📊 Baixando contatos do Google Sheets...${NC}"
    
    local csv_file="dados/contatos_sincronizados_$(date +%Y%m%d_%H%M%S).csv"
    local json_file="dados/contatos_sincronizados_$(date +%Y%m%d_%H%M%S).json"
    
    curl -sL "https://docs.google.com/spreadsheets/d/$GOOGLE_SHEETS_ID/export?format=csv&gid=0" > "$csv_file"
    
    local total=$(wc -l < "$csv_file" | tr -d ' ')
    total=$((total - 1))
    
    if [ "$total" -lt 1 ]; then
        echo -e "${RED}❌ Erro ao baixar contatos${NC}"
        rm -f "$csv_file"
        read -p "Pressione ENTER para voltar ao menu..."
        return
    fi
    
    echo -e "${GREEN}✅ Baixados: $total contatos${NC}"
    echo ""
    
    echo -e "${YELLOW}📝 Criando arquivo JSON...${NC}"
    
    # Criar JSON
    echo "{" > "$json_file"
    echo "  \"updated_at\": \"$(date -u +%Y-%m-%dT%H:%M:%SZ)\"," >> "$json_file"
    echo "  \"total\": $total," >> "$json_file"
    echo "  \"contacts\": [" >> "$json_file"
    
    local count=0
    while IFS=',' read -r nome telefone categoria vip email obs; do
        count=$((count + 1))
        
        # Limpar dados - remover apenas aspas duplas, preservar vírgulas em nomes
        nome=$(echo "$nome" | sed 's/^"//;s/"$//')
        telefone=$(echo "$telefone" | sed 's/^"//;s/"$//' | tr -d ' ()-')
        categoria=$(echo "$categoria" | sed 's/^"//;s/"$//')
        
        # Escapar aspas duplas e barras invertidas no nome para JSON
        nome=$(echo "$nome" | sed 's/\\/\\\\/g' | sed 's/"/\\"/g')
        
        # Adicionar código do país
        if [[ ! "$telefone" =~ ^55 ]]; then
            telefone="55$telefone"
        fi
        
        # Adicionar ao JSON
        echo "    {" >> "$json_file"
        echo "      \"nome\": \"$nome\"," >> "$json_file"
        echo "      \"telefone\": \"$telefone\"," >> "$json_file"
        echo "      \"categoria\": \"$categoria\"" >> "$json_file"
        
        if [ $count -lt $total ]; then
            echo "    }," >> "$json_file"
        else
            echo "    }" >> "$json_file"
        fi
    done < <(tail -n +2 "$csv_file")
    
    echo "  ]" >> "$json_file"
    echo "}" >> "$json_file"
    
    echo -e "${GREEN}✅ Sincronização concluída!${NC}"
    echo ""
    echo -e "${CYAN}Arquivos salvos:${NC}"
    echo -e "  📄 CSV: ${WHITE}$csv_file${NC}"
    echo -e "  📄 JSON: ${WHITE}$json_file${NC}"
    
    log_action "Sincronização: $total contatos salvos em $json_file"
    
    echo ""
    read -p "Pressione ENTER para voltar ao menu..."
}

# ============================================
# ABRIR SISTEMAS NO NAVEGADOR
# ============================================

open_evolution_manager() {
    local url="$EVOLUTION_API_URL/manager"
    echo -e "${YELLOW}🌐 Abrindo Evolution Manager...${NC}"
    echo -e "   URL: ${CYAN}$url${NC}"
    
    if [[ "$OSTYPE" == "darwin"* ]]; then
        open "$url"
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        xdg-open "$url" 2>/dev/null || echo -e "   ${YELLOW}Abra manualmente: $url${NC}"
    fi
    
    sleep 2
}

open_vercel_system() {
    echo -e "${YELLOW}🌐 Abrindo Sistema Web (Vercel)...${NC}"
    echo -e "   URL: ${CYAN}$VERCEL_URL${NC}"
    
    if [[ "$OSTYPE" == "darwin"* ]]; then
        open "$VERCEL_URL"
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        xdg-open "$VERCEL_URL" 2>/dev/null || echo -e "   ${YELLOW}Abra manualmente: $VERCEL_URL${NC}"
    fi
    
    sleep 2
}

open_google_sheets() {
    local url="https://docs.google.com/spreadsheets/d/$GOOGLE_SHEETS_ID"
    echo -e "${YELLOW}🌐 Abrindo Google Sheets...${NC}"
    echo -e "   URL: ${CYAN}$url${NC}"
    
    if [[ "$OSTYPE" == "darwin"* ]]; then
        open "$url"
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        xdg-open "$url" 2>/dev/null || echo -e "   ${YELLOW}Abra manualmente: $url${NC}"
    fi
    
    sleep 2
}

# ============================================
# MENU PRINCIPAL
# ============================================

show_menu() {
    show_header
    
    # Status compacto
    echo -e "${BOLD}STATUS DO SISTEMA:${NC}"
    
    # Evolution API
    if curl -s -o /dev/null -w "%{http_code}" "$EVOLUTION_API_URL" -H "apikey: $EVOLUTION_API_KEY" 2>/dev/null | grep -q "200"; then
        echo -e "  ${GREEN}🟢 Evolution API: ONLINE${NC}"
    else
        echo -e "  ${RED}🔴 Evolution API: OFFLINE${NC}"
    fi
    
    # WhatsApp
    if check_whatsapp_status false; then
        echo -e "  ${GREEN}🟢 WhatsApp: CONECTADO${NC}"
    else
        echo -e "  ${RED}🔴 WhatsApp: DESCONECTADO${NC}"
    fi
    
    # Google Sheets
    local contacts=$(check_google_sheets false)
    if [ -n "$contacts" ] && [ "$contacts" -gt 0 ]; then
        echo -e "  ${GREEN}🟢 Google Sheets: $contacts contatos${NC}"
    else
        echo -e "  ${YELLOW}🟡 Google Sheets: verificando...${NC}"
    fi
    
    # Vercel
    echo -e "  ${GREEN}🟢 Vercel: ONLINE${NC}"
    
    echo ""
    echo -e "${BOLD}MENU PRINCIPAL:${NC}"
    echo -e "  ${WHITE}1)${NC} 📊 Verificar Status Completo"
    echo -e "  ${WHITE}2)${NC} 📱 Conectar WhatsApp (QR Code)"
    echo -e "  ${WHITE}3)${NC} 📨 Enviar Mensagem Individual"
    echo -e "  ${WHITE}4)${NC} 📢 Envio em Massa"
    echo -e "  ${WHITE}5)${NC} ✅ Validar Contatos (Sheets)"
    echo -e "  ${WHITE}6)${NC} 🔄 Sincronizar Contatos"
    echo -e "  ${WHITE}7)${NC} 🌐 Abrir Evolution Manager"
    echo -e "  ${WHITE}8)${NC} 🎨 Abrir Sistema Web (Vercel)"
    echo -e "  ${WHITE}9)${NC} 📊 Abrir Google Sheets"
    echo -e "  ${WHITE}0)${NC} ❌ Sair"
    echo ""
    read -p "Digite sua escolha: " choice
    
    case $choice in
        1) show_status ;;
        2) connect_whatsapp ;;
        3) send_individual_message ;;
        4) send_bulk_messages ;;
        5) validate_contacts ;;
        6) sync_contacts ;;
        7) open_evolution_manager ;;
        8) open_vercel_system ;;
        9) open_google_sheets ;;
        0) 
            echo ""
            echo -e "${GREEN}👋 Até logo!${NC}"
            log_action "Sistema encerrado"
            exit 0
            ;;
        *)
            echo -e "${RED}Opção inválida!${NC}"
            sleep 2
            ;;
    esac
}

# ============================================
# INICIALIZAÇÃO
# ============================================

initialize_system() {
    show_header
    echo -e "${GREEN}🚀 Bem-vindo ao ENSIDE MASTER!${NC}"
    echo ""
    
    log_action "Sistema iniciado"
    
    # Verificar dependências
    if ! check_dependencies; then
        exit 1
    fi
    
    echo ""
    
    # Verificar Evolution API
    if ! check_evolution_api; then
        echo -e "${RED}⚠️  Não foi possível conectar à Evolution API${NC}"
        echo -e "${YELLOW}Verifique se o Render está ativo e tente novamente.${NC}"
        echo ""
        read -p "Pressione ENTER para continuar mesmo assim..."
    fi
    
    echo ""
    echo -e "${GREEN}✅ Sistema pronto para uso!${NC}"
    echo ""
    sleep 2
}

# ============================================
# MAIN
# ============================================

main() {
    # Verificar se é primeira execução
    if [ ! -f ".system_initialized" ]; then
        initialize_system
        touch .system_initialized
    fi
    
    # Loop do menu
    while true; do
        show_menu
    done
}

# Executar
main
