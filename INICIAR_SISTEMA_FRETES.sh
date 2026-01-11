#!/bin/bash

# ================================================
# SCRIPT DE INICIALIZAÇÃO - SISTEMA DE FRETES
# Anderson Enside Logística
# ================================================

echo "🚀 ================================================"
echo "   SISTEMA DE CAPTAÇÃO DE FRETES - ENSIDE"
echo "   Anderson Enside Logística"
echo "================================================"
echo ""

# Verificar se está na pasta correta
if [ ! -d "MODULOS/CAPTACAO_FRETES" ]; then
    echo "❌ ERRO: Execute este script na pasta raiz do projeto"
    echo "   Comando: cd ENSIDE-MASTER-v16 && ./INICIAR_SISTEMA_FRETES.sh"
    exit 1
fi

echo "✅ Pasta do projeto encontrada"
echo ""

# Navegar para a pasta do sistema
cd MODULOS/CAPTACAO_FRETES

echo "📋 VERIFICANDO ARQUIVOS DO SISTEMA..."
echo ""

# Verificar arquivos essenciais
arquivos=(
    "config.js"
    "api-integration.js"
    "README.md"
    "INSTALACAO.md"
    "ADMIN/admin_cadastro_fretes.html"
    "ADMIN/admin_propostas_recebidas.html"
    "ADMIN/admin_rotas_preferidas.html"
    "MOTORISTAS/landing_captacao.html"
    "MOTORISTAS/fretes_disponiveis.html"
    "MOTORISTAS/minhas_propostas.html"
    "MOTORISTAS/minhas_rotas_preferidas.html"
)

todos_ok=true
for arquivo in "${arquivos[@]}"; do
    if [ -f "$arquivo" ]; then
        echo "✅ $arquivo"
    else
        echo "❌ $arquivo - NÃO ENCONTRADO"
        todos_ok=false
    fi
done

echo ""

if [ "$todos_ok" = false ]; then
    echo "❌ Alguns arquivos estão faltando. Clone o repositório novamente."
    exit 1
fi

echo "✅ Todos os arquivos estão OK!"
echo ""

# Mostrar credenciais configuradas
echo "🔑 CREDENCIAIS CONFIGURADAS:"
echo ""
echo "📊 Google Sheets:"
echo "   ID: 1FiP885Or0ncyRG_ZZaAvM2vP0sHhDzhLFYifYLjKyIE"
echo "   URL: https://docs.google.com/spreadsheets/d/1FiP885Or0ncyRG_ZZaAvM2vP0sHhDzhLFYifYLjKyIE/edit"
echo ""
echo "📱 Evolution API (WhatsApp):"
echo "   URL: https://evolution-api-latest-poc1.onrender.com"
echo "   Instance: ENSIDE"
echo "   WhatsApp: 5518996540492"
echo ""

# Verificar se Python está instalado
echo "🔍 VERIFICANDO PYTHON..."
if command -v python3 &> /dev/null; then
    PYTHON_CMD="python3"
    echo "✅ Python 3 encontrado: $(python3 --version)"
elif command -v python &> /dev/null; then
    PYTHON_CMD="python"
    echo "✅ Python encontrado: $(python --version)"
else
    echo "❌ Python não encontrado"
    echo ""
    echo "📖 Como abrir o sistema sem Python:"
    echo "   1. Navegue até: MODULOS/CAPTACAO_FRETES"
    echo "   2. Abra os arquivos .html diretamente no navegador"
    echo ""
    echo "   Para Admin: ADMIN/admin_cadastro_fretes.html"
    echo "   Para Motoristas: MOTORISTAS/landing_captacao.html"
    echo ""
    exit 0
fi

echo ""
echo "🌐 INICIANDO SERVIDOR HTTP LOCAL..."
echo ""
echo "================================================"
echo "   SERVIDOR RODANDO EM: http://localhost:8000"
echo "================================================"
echo ""
echo "📂 PÁGINAS DISPONÍVEIS:"
echo ""
echo "👨‍💼 PAINEL ADMINISTRATIVO:"
echo "   • Cadastro de Fretes:"
echo "     http://localhost:8000/ADMIN/admin_cadastro_fretes.html"
echo ""
echo "   • Propostas Recebidas:"
echo "     http://localhost:8000/ADMIN/admin_propostas_recebidas.html"
echo ""
echo "   • Rotas Preferidas:"
echo "     http://localhost:8000/ADMIN/admin_rotas_preferidas.html"
echo ""
echo "🚚 PORTAL DO MOTORISTA:"
echo "   • Landing Page:"
echo "     http://localhost:8000/MOTORISTAS/landing_captacao.html"
echo ""
echo "   • Fretes Disponíveis:"
echo "     http://localhost:8000/MOTORISTAS/fretes_disponiveis.html"
echo ""
echo "   • Minhas Propostas:"
echo "     http://localhost:8000/MOTORISTAS/minhas_propostas.html"
echo ""
echo "   • Minhas Rotas:"
echo "     http://localhost:8000/MOTORISTAS/minhas_rotas_preferidas.html"
echo ""
echo "================================================"
echo "   Pressione Ctrl+C para parar o servidor"
echo "================================================"
echo ""

# Iniciar servidor HTTP
$PYTHON_CMD -m http.server 8000
