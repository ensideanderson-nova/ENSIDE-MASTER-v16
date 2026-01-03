#!/bin/bash

# 🤖 INSTALADOR DE IA E MCPs - Sistema de Cotação de Fretes
# Instala e configura Claude AI, MCPs e funcionalidades de IA

# 🎨 Cores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
WHITE='\033[1;37m'
BOLD='\033[1m'
NC='\033[0m'

# 📂 Diretório do script
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

# 🎯 Banner
clear
echo -e "${PURPLE}╔════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${PURPLE}║                                                                ║${NC}"
echo -e "${PURPLE}║${WHITE}          🤖  INSTALADOR DE IA E MCPs - FRETES  🤖            ${PURPLE}║${NC}"
echo -e "${PURPLE}║                                                                ║${NC}"
echo -e "${PURPLE}╚════════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Funções
success() { echo -e "${GREEN}✅ $1${NC}"; }
error() { echo -e "${RED}❌ $1${NC}"; }
warning() { echo -e "${YELLOW}⚠️  $1${NC}"; }
info() { echo -e "${BLUE}ℹ️  $1${NC}"; }
step() { echo -e "${CYAN}${BOLD}▶ $1${NC}"; }

# 🔍 ETAPA 1: Verificar Claude Desktop
echo -e "${YELLOW}════════════════════════════════════════════════════════════════${NC}"
echo -e "${YELLOW}${BOLD}🤖 ETAPA 1/5: Verificando Claude Desktop...${NC}"
echo -e "${YELLOW}════════════════════════════════════════════════════════════════${NC}"
echo ""

CLAUDE_CONFIG_DIR="$HOME/Library/Application Support/Claude"

if [ -d "$CLAUDE_CONFIG_DIR" ]; then
    success "Claude Desktop instalado!"
    info "Diretório: $CLAUDE_CONFIG_DIR"
else
    warning "Claude Desktop não encontrado!"
    info "Baixe em: https://claude.ai/download"
    echo ""
    read -p "Deseja continuar mesmo assim? (s/n): " CONTINUE
    if [ "$CONTINUE" != "s" ] && [ "$CONTINUE" != "S" ]; then
        exit 0
    fi
fi
echo ""

# 🔧 ETAPA 2: Configurar MCPs
echo -e "${YELLOW}════════════════════════════════════════════════════════════════${NC}"
echo -e "${YELLOW}${BOLD}🔧 ETAPA 2/5: Configurando MCPs...${NC}"
echo -e "${YELLOW}════════════════════════════════════════════════════════════════${NC}"
echo ""

step "Verificando arquivo mcp-config.json..."

if [ -f "mcp-config.json" ]; then
    info "Arquivo mcp-config.json encontrado"
    cat mcp-config.json
else
    step "Criando mcp-config.json com MCPs essenciais..."

    cat > mcp-config.json << 'EOF'
{
  "mcpServers": {
    "sqlite": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-sqlite",
        "--db-path",
        "./dados/cotacoes.db"
      ]
    },
    "filesystem": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "./backend",
        "./frontend",
        "./dados"
      ]
    },
    "fetch": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-fetch"
      ]
    },
    "everything": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-everything"
      ]
    }
  }
}
EOF

    success "mcp-config.json criado com 4 MCPs!"
fi
echo ""

# Copiar para Claude Desktop
if [ -d "$CLAUDE_CONFIG_DIR" ]; then
    step "Copiando configuração para Claude Desktop..."

    # Fazer backup se existir
    if [ -f "$CLAUDE_CONFIG_DIR/claude_desktop_config.json" ]; then
        cp "$CLAUDE_CONFIG_DIR/claude_desktop_config.json" "$CLAUDE_CONFIG_DIR/claude_desktop_config.json.backup"
        info "Backup criado: claude_desktop_config.json.backup"
    fi

    # Copiar nova configuração
    cp mcp-config.json "$CLAUDE_CONFIG_DIR/claude_desktop_config.json"
    success "Configuração copiada para Claude Desktop!"

    info "Reinicie o Claude Desktop para aplicar as mudanças"
else
    warning "Claude Desktop não encontrado, configuração salva localmente"
fi
echo ""

# 🧠 ETAPA 3: Configurar módulos de IA
echo -e "${YELLOW}════════════════════════════════════════════════════════════════${NC}"
echo -e "${YELLOW}${BOLD}🧠 ETAPA 3/5: Configurando módulos de IA...${NC}"
echo -e "${YELLOW}════════════════════════════════════════════════════════════════${NC}"
echo ""

# Criar diretórios se não existirem
mkdir -p backend frontend dados

# Verificar módulos de IA
IA_MODULES=(
    "backend/claude-ai-assistant.js"
    "backend/route-analyzer.js"
    "backend/price-recommender.js"
    "frontend/claude-ai-assistant.js"
    "frontend/route-analyzer.js"
    "frontend/price-recommender.js"
)

step "Verificando módulos de IA..."
FOUND_MODULES=0

for module in "${IA_MODULES[@]}"; do
    if [ -f "$module" ]; then
        success "$(basename $module) encontrado"
        FOUND_MODULES=$((FOUND_MODULES + 1))
    else
        warning "$(basename $module) não encontrado"
    fi
done

echo ""
info "Módulos de IA encontrados: $FOUND_MODULES/${#IA_MODULES[@]}"
echo ""

# 🔑 ETAPA 4: Configurar chaves de API
echo -e "${YELLOW}════════════════════════════════════════════════════════════════${NC}"
echo -e "${YELLOW}${BOLD}🔑 ETAPA 4/5: Configurando chaves de API...${NC}"
echo -e "${YELLOW}════════════════════════════════════════════════════════════════${NC}"
echo ""

step "Verificando arquivo .env..."

if [ ! -f ".env" ]; then
    cat > .env << 'EOF'
# 🤖 CONFIGURAÇÕES DE IA - Sistema de Fretes ENSIDE

# Claude AI
CLAUDE_API_KEY=sua-chave-claude-aqui
CLAUDE_MODEL=claude-3-sonnet-20240229

# OpenAI (opcional)
OPENAI_API_KEY=sua-chave-openai-aqui

# Google Maps API (opcional)
GOOGLE_MAPS_API_KEY=sua-chave-google-maps-aqui

# Evolution API (WhatsApp)
EVOLUTION_API_URL=http://localhost:8080
EVOLUTION_API_KEY=919AA333-AE59-4B06-B1EF-C9A9F9C8C0F6

# GitHub App - ESPECIALISTA-IA
GITHUB_APP_ID=2302130
GITHUB_CLIENT_ID=Iv23liLTN3V5XvOzhjW7

# Google Sheets
GOOGLE_SHEETS_ID=1FiP885Or0ncyRG_ZZaAvM2vP0sHhDzhLFYifYLjKyIE
EOF

    success "Arquivo .env criado com credenciais ENSIDE!"
else
    success "Arquivo .env já existe!"
fi

echo ""
info "Configuração automática aplicada com credenciais do sistema ENSIDE"
echo ""

# 🧪 ETAPA 5: Criar scripts de teste
echo -e "${YELLOW}════════════════════════════════════════════════════════════════${NC}"
echo -e "${YELLOW}${BOLD}🧪 ETAPA 5/5: Criando scripts de teste...${NC}"
echo -e "${YELLOW}════════════════════════════════════════════════════════════════${NC}"
echo ""

# Script de teste de IA
cat > testar-ia.js << 'EOF'
const fs = require('fs');
require('dotenv').config();

console.log('🧪 Testando configuração de IA - ENSIDE...\n');

// Verificar chaves
const checks = [
    { name: 'Claude API', key: process.env.CLAUDE_API_KEY },
    { name: 'Google Maps', key: process.env.GOOGLE_MAPS_API_KEY },
    { name: 'Evolution API URL', key: process.env.EVOLUTION_API_URL },
    { name: 'Evolution API Key', key: process.env.EVOLUTION_API_KEY },
    { name: 'GitHub App ID', key: process.env.GITHUB_APP_ID },
    { name: 'Google Sheets ID', key: process.env.GOOGLE_SHEETS_ID },
];

let configured = 0;
let missing = 0;

checks.forEach(check => {
    if (check.key && check.key !== 'sua-chave-aqui' && !check.key.includes('example')) {
        console.log(`✅ ${check.name}: Configurado`);
        configured++;
    } else {
        console.log(`⚠️  ${check.name}: Não configurado`);
        missing++;
    }
});

console.log('\n📊 Resumo:');
console.log(`   Configurados: ${configured}`);
console.log(`   Faltando: ${missing}`);

// Verificar MCPs
console.log('\n🔧 MCPs disponíveis:');
if (fs.existsSync('mcp-config.json')) {
    const mcpConfig = JSON.parse(fs.readFileSync('mcp-config.json', 'utf8'));
    const mcps = Object.keys(mcpConfig.mcpServers || {});
    mcps.forEach(mcp => {
        console.log(`   ✅ ${mcp}`);
    });
    console.log(`   Total: ${mcps.length} MCPs`);
} else {
    console.log('   ⚠️  mcp-config.json não encontrado');
}

// Resultado final
console.log('\n' + '═'.repeat(60));
if (configured >= 3) {
    console.log('✅ Sistema ENSIDE de IA está configurado e pronto!');
} else {
    console.log('⚠️  Sistema parcialmente configurado');
    console.log('   Configure as chaves faltantes no arquivo .env');
}
console.log('═'.repeat(60) + '\n');
EOF

success "Script testar-ia.js criado!"

# Script de teste de MCPs
cat > testar-mcps.sh << 'EOF'
#!/bin/bash

echo "🔧 Testando MCPs - ENSIDE..."
echo ""

# Verificar se Claude Desktop está rodando
if pgrep -x "Claude" > /dev/null; then
    echo "✅ Claude Desktop está rodando"
else
    echo "⚠️  Claude Desktop não está rodando"
    echo "   Inicie o Claude Desktop para usar os MCPs"
fi
echo ""

# Verificar configuração
if [ -f "$HOME/Library/Application Support/Claude/claude_desktop_config.json" ]; then
    echo "✅ Configuração de MCPs encontrada"
    echo ""
    echo "📋 MCPs configurados:"
    cat "$HOME/Library/Application Support/Claude/claude_desktop_config.json" | grep -o '"[^"]*":' | sed 's/://g' | sed 's/"//g' | head -10 | sed 's/^/   ✅ /g'
else
    echo "❌ Configuração de MCPs não encontrada"
    echo "   Execute: ./instalar-ia-mcps.sh"
fi
echo ""

# Verificar banco de dados
if [ -f "dados/cotacoes.db" ]; then
    echo "✅ Banco de dados SQLite disponível"
else
    echo "⚠️  Banco de dados não encontrado - será criado automaticamente"
fi
echo ""

echo "🎉 Teste concluído!"
EOF

chmod +x testar-mcps.sh
success "Script testar-mcps.sh criado!"
echo ""

# 🎉 CONCLUSÃO
echo -e "${GREEN}════════════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}${BOLD}🎉 INSTALAÇÃO DE IA E MCPs CONCLUÍDA! 🎉${NC}"
echo -e "${GREEN}════════════════════════════════════════════════════════════════${NC}"
echo ""

echo -e "${WHITE}${BOLD}📊 RESUMO DA INSTALAÇÃO:${NC}"
echo ""
echo -e "${CYAN}✅ Configuração de MCPs criada (mcp-config.json)${NC}"
echo -e "${CYAN}✅ Arquivo .env configurado com credenciais ENSIDE${NC}"
echo -e "${CYAN}✅ Scripts de teste criados${NC}"
if [ -d "$CLAUDE_CONFIG_DIR" ]; then
    echo -e "${CYAN}✅ Claude Desktop configurado${NC}"
else
    echo -e "${YELLOW}⚠️  Claude Desktop não encontrado${NC}"
fi
echo ""

echo -e "${WHITE}${BOLD}🤖 MCPs CONFIGURADOS:${NC}"
echo ""
echo -e "${PURPLE}1. 🗄️  SQLite MCP${NC} - Acesso direto ao banco de dados"
echo -e "${PURPLE}2. 📁 Filesystem MCP${NC} - Leitura e escrita de arquivos"
echo -e "${PURPLE}3. 🌐 Fetch MCP${NC} - Requisições HTTP"
echo -e "${PURPLE}4. ⚡ Everything MCP${NC} - Funcionalidades combinadas"
echo ""

echo -e "${WHITE}${BOLD}🧪 COMO TESTAR:${NC}"
echo ""
echo -e "${GREEN}node testar-ia.js${NC}"
echo -e "${GREEN}./testar-mcps.sh${NC}"
echo ""

echo -e "${GREEN}════════════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}${BOLD}🤖 IA e MCPs prontos! Sistema ENSIDE turbinado! 🚀${NC}"
echo -e "${GREEN}════════════════════════════════════════════════════════════════${NC}"
echo ""
