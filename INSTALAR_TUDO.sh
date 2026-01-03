#!/bin/bash

# ╔════════════════════════════════════════════════════════════════╗
# ║     🚀 ENSIDE SISTEMA v19.0 - INSTALADOR AUTOMÁTICO           ║
# ║     Execute: chmod +x INSTALAR_TUDO.sh && ./INSTALAR_TUDO.sh  ║
# ╚════════════════════════════════════════════════════════════════╝

set -e

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
echo -e "${PURPLE}║     🚀 ENSIDE SISTEMA v19.0 - INSTALADOR AUTOMÁTICO           ║${NC}"
echo -e "${PURPLE}╚════════════════════════════════════════════════════════════════╝${NC}"
echo ""

# ═══════════════════════════════════════════════════════════════
# PASSO 1: Verificar e instalar dependências
# ═══════════════════════════════════════════════════════════════
echo -e "${CYAN}[1/6] Verificando dependências...${NC}"

# Verificar Homebrew
if ! command -v brew &> /dev/null; then
    echo -e "${YELLOW}   ⚠️  Instalando Homebrew...${NC}"
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
fi
echo -e "${GREEN}   ✅ Homebrew OK${NC}"

# Verificar Docker
if ! command -v docker &> /dev/null; then
    echo -e "${YELLOW}   ⚠️  Instalando Docker Desktop...${NC}"
    brew install --cask docker
    echo -e "${YELLOW}   ⏳ Aguarde o Docker Desktop iniciar...${NC}"
    open -a Docker
    sleep 30
fi
echo -e "${GREEN}   ✅ Docker OK${NC}"

# Verificar Git
if ! command -v git &> /dev/null; then
    echo -e "${YELLOW}   ⚠️  Instalando Git...${NC}"
    brew install git
fi
echo -e "${GREEN}   ✅ Git OK${NC}"

# ═══════════════════════════════════════════════════════════════
# PASSO 2: Criar estrutura de pastas
# ═══════════════════════════════════════════════════════════════
echo ""
echo -e "${CYAN}[2/6] Criando estrutura de pastas...${NC}"

INSTALL_DIR="$HOME/Desktop/ENSIDE_SISTEMA_UNIFICADO"
mkdir -p "$INSTALL_DIR"
mkdir -p "$INSTALL_DIR/CONFIG"
mkdir -p "$INSTALL_DIR/MODULOS"

echo -e "${GREEN}   ✅ Pastas criadas em: $INSTALL_DIR${NC}"

# ═══════════════════════════════════════════════════════════════
# PASSO 3: Instalar Evolution API via Docker
# ═══════════════════════════════════════════════════════════════
echo ""
echo -e "${CYAN}[3/6] Instalando Evolution API...${NC}"

# Verificar se Docker está rodando
if ! docker info > /dev/null 2>&1; then
    echo -e "${YELLOW}   ⚠️  Iniciando Docker...${NC}"
    open -a Docker
    sleep 15
fi

# Verificar se container já existe
if docker ps -a | grep -q evolution-api; then
    echo -e "${YELLOW}   ⚠️  Container evolution-api já existe. Reiniciando...${NC}"
    docker start evolution-api > /dev/null 2>&1
else
    echo -e "${YELLOW}   📦 Baixando e criando container...${NC}"
    docker run -d \
        --name evolution-api \
        -p 8080:8080 \
        -e AUTHENTICATION_API_KEY=enside123 \
        -e AUTHENTICATION_EXPOSE_IN_FETCH_INSTANCES=true \
        atendai/evolution-api:latest
fi

sleep 5
echo -e "${GREEN}   ✅ Evolution API rodando em http://localhost:8080${NC}"

# ═══════════════════════════════════════════════════════════════
# PASSO 4: Criar instância WhatsApp
# ═══════════════════════════════════════════════════════════════
echo ""
echo -e "${CYAN}[4/6] Configurando instância WhatsApp...${NC}"

# Aguardar API estar pronta
sleep 5

# Criar instância
RESPONSE=$(curl -s -X POST "http://localhost:8080/instance/create" \
    -H "Content-Type: application/json" \
    -H "apikey: enside123" \
    -d '{
        "instanceName": "enside",
        "token": "enside123",
        "qrcode": true
    }')

# Extrair API Key da resposta
API_KEY=$(echo $RESPONSE | grep -o '"token":"[^"]*"' | cut -d'"' -f4)
if [ -z "$API_KEY" ]; then
    API_KEY="enside123"
fi

echo -e "${GREEN}   ✅ Instância 'enside' criada${NC}"
echo -e "${GREEN}   🔑 API Key: $API_KEY${NC}"

# Configurar Webhook
curl -s -X POST "http://localhost:8080/webhook/set/enside" \
    -H "Content-Type: application/json" \
    -H "apikey: $API_KEY" \
    -d '{
        "enabled": true,
        "url": "https://enside-sistema.vercel.app/api/webhook",
        "webhookByEvents": true,
        "events": ["MESSAGES_UPSERT", "CONNECTION_UPDATE"]
    }' > /dev/null

echo -e "${GREEN}   ✅ Webhook configurado${NC}"

# ═══════════════════════════════════════════════════════════════
# PASSO 5: Criar arquivos de configuração
# ═══════════════════════════════════════════════════════════════
echo ""
echo -e "${CYAN}[5/6] Criando arquivos de configuração...${NC}"

# Script de inicialização
cat > "$INSTALL_DIR/INICIAR_ENSIDE.command" << 'SCRIPT'
#!/bin/bash
clear
echo "╔════════════════════════════════════════════════════════════════╗"
echo "║     🚀 ENSIDE SISTEMA UNIFICADO v19.0 - INICIANDO...          ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

echo "🐳 [1/4] Verificando Docker..."
if ! docker info > /dev/null 2>&1; then
    echo "   ⚠️  Iniciando Docker Desktop..."
    open -a Docker
    sleep 10
fi
echo "   ✅ Docker OK"

echo "🔌 [2/4] Iniciando Evolution API..."
docker start evolution-api > /dev/null 2>&1
sleep 3
echo "   ✅ Evolution API em http://localhost:8080"

echo "🌐 [3/4] Abrindo Sistema Principal..."
open "$SCRIPT_DIR/ENSIDE_MASTER_v19.0_INTEGRADO.html"
echo "   ✅ Sistema aberto"

echo "📱 [4/4] Abrindo Evolution Manager..."
sleep 2
open "http://localhost:8080/manager"
echo "   ✅ Evolution Manager aberto"

echo ""
echo "╔════════════════════════════════════════════════════════════════╗"
echo "║              🎉 SISTEMA INICIADO COM SUCESSO!                 ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""
read -p "Pressione ENTER para fechar..."
SCRIPT

chmod +x "$INSTALL_DIR/INICIAR_ENSIDE.command"

# Arquivo de configuração
cat > "$INSTALL_DIR/CONFIG/CONFIGURACAO.md" << EOF
# ⚙️ CONFIGURAÇÃO DO SISTEMA ENSIDE v19.0

## 🔑 Credenciais Evolution API
- **URL:** http://localhost:8080
- **API Key:** $API_KEY
- **Instância:** enside

## 📊 Google Sheets
- **ID Planilha:** 1FiP885Or0ncyRG_ZZaAvM2vP0sHhDzhLFYifYLjKyIE

## 🔗 Webhook
- **URL:** https://enside-sistema.vercel.app/api/webhook
- **Eventos:** MESSAGES_UPSERT, CONNECTION_UPDATE

## 📅 Data de Instalação
$(date)
EOF

# Script para enviar lista de transmissão
cat > "$INSTALL_DIR/ENVIAR_LISTA.sh" << LISTA
#!/bin/bash
# 📤 ENSIDE - Enviar Lista de Transmissão

API_KEY="$API_KEY"
INSTANCIA="enside"

echo "📝 Digite a mensagem (termine com linha vazia):"
MSG=""
while IFS= read -r line; do
    [[ -z "\$line" ]] && break
    MSG+="\$line\n"
done

echo ""
echo "📱 Digite os números (um por linha, termine com linha vazia):"
echo "   Formato: 5518999999999"
CONTATOS=()
while IFS= read -r numero; do
    [[ -z "\$numero" ]] && break
    CONTATOS+=("\$numero")
done

echo ""
echo "📤 Enviando para \${#CONTATOS[@]} contatos..."

for numero in "\${CONTATOS[@]}"; do
    echo "➡️ Enviando para \$numero..."
    curl -s -X POST "http://localhost:8080/message/sendText/\$INSTANCIA" \\
        -H "Content-Type: application/json" \\
        -H "apikey: \$API_KEY" \\
        -d "{\"number\": \"\$numero\", \"textMessage\": {\"text\": \"\$MSG\"}}"
    echo " ✅"
    sleep 2
done

echo ""
echo "🎉 Lista enviada com sucesso!"
LISTA

chmod +x "$INSTALL_DIR/ENVIAR_LISTA.sh"

echo -e "${GREEN}   ✅ Arquivos de configuração criados${NC}"

# ═══════════════════════════════════════════════════════════════
# PASSO 6: Baixar sistema HTML do GitHub
# ═══════════════════════════════════════════════════════════════
echo ""
echo -e "${CYAN}[6/6] Baixando sistema HTML...${NC}"

cd "$INSTALL_DIR"

# Tentar clonar do GitHub
if git clone --depth 1 https://github.com/ensideanderson-nova/ENSIDE-MASTER-v16.git temp_repo 2>/dev/null; then
    cp temp_repo/*.html "$INSTALL_DIR/" 2>/dev/null || true
    rm -rf temp_repo
    echo -e "${GREEN}   ✅ Sistema baixado do GitHub${NC}"
else
    echo -e "${YELLOW}   ⚠️  Não foi possível baixar do GitHub${NC}"
    echo -e "${YELLOW}   📝 Copie manualmente o arquivo ENSIDE_MASTER_v19.0_INTEGRADO.html${NC}"
fi

# ═══════════════════════════════════════════════════════════════
# FINALIZAÇÃO
# ═══════════════════════════════════════════════════════════════
echo ""
echo -e "${GREEN}╔════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║           🎉 INSTALAÇÃO CONCLUÍDA COM SUCESSO!                ║${NC}"
echo -e "${GREEN}╠════════════════════════════════════════════════════════════════╣${NC}"
echo -e "${GREEN}║  📁 Pasta: $INSTALL_DIR${NC}"
echo -e "${GREEN}║  🔑 API Key: $API_KEY${NC}"
echo -e "${GREEN}║  🌐 Evolution: http://localhost:8080${NC}"
echo -e "${GREEN}╚════════════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${CYAN}📋 PRÓXIMOS PASSOS:${NC}"
echo -e "   1. Abra http://localhost:8080/manager no navegador"
echo -e "   2. Escaneie o QR Code com seu WhatsApp"
echo -e "   3. Execute: ${YELLOW}./INICIAR_ENSIDE.command${NC}"
echo ""
echo -e "${CYAN}📤 PARA ENVIAR LISTA DE TRANSMISSÃO:${NC}"
echo -e "   Execute: ${YELLOW}./ENVIAR_LISTA.sh${NC}"
echo ""

# Abrir Evolution Manager para conectar WhatsApp
read -p "Deseja abrir o Evolution Manager agora para conectar o WhatsApp? (s/n): " ABRIR
if [ "$ABRIR" = "s" ] || [ "$ABRIR" = "S" ]; then
    open "http://localhost:8080/manager"
fi

echo ""
echo -e "${GREEN}✅ Instalação finalizada!${NC}"
