#!/bin/bash

# ================================================
# EXECUTÁVEL DUPLO CLIQUE - SISTEMA DE FRETES
# Anderson Enside Logística
# ================================================

# Obter o diretório onde o script está localizado
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$DIR"

clear

echo "🚀 ================================================"
echo "   SISTEMA DE CAPTAÇÃO DE FRETES - ENSIDE"
echo "   Anderson Enside Logística"
echo "   INICIALIZAÇÃO AUTOMÁTICA"
echo "================================================"
echo ""

# Verificar se está na pasta correta
if [ ! -d "MODULOS/CAPTACAO_FRETES" ]; then
    echo "❌ ERRO: Pasta do projeto não encontrada"
    echo "   Certifique-se de que está na pasta correta"
    read -p "Pressione ENTER para fechar..."
    exit 1
fi

echo "✅ Sistema encontrado"
echo ""

# Navegar para a pasta do sistema
cd MODULOS/CAPTACAO_FRETES

echo "🔍 Verificando requisitos..."
echo ""

# Verificar Python
if command -v python3 &> /dev/null; then
    PYTHON_CMD="python3"
    echo "✅ Python 3 encontrado"
elif command -v python &> /dev/null; then
    PYTHON_CMD="python"
    echo "✅ Python encontrado"
else
    echo "❌ Python não encontrado"
    echo ""
    echo "📖 Instalando Python (aguarde)..."
    echo ""
    
    # Tentar instalar Python via Homebrew
    if command -v brew &> /dev/null; then
        brew install python3
        PYTHON_CMD="python3"
    else
        echo "❌ Não foi possível instalar Python automaticamente"
        echo ""
        echo "Por favor, instale Python manualmente:"
        echo "1. Acesse: https://www.python.org/downloads/"
        echo "2. Baixe e instale Python 3"
        echo "3. Execute este arquivo novamente"
        echo ""
        read -p "Pressione ENTER para fechar..."
        exit 1
    fi
fi

echo ""
echo "🔑 CREDENCIAIS CONFIGURADAS:"
echo "   ✅ Google Sheets: 1FiP885Or0ncyRG_ZZaAvM2vP0sHhDzhLFYifYLjKyIE"
echo "   ✅ Evolution API: https://evolution-api-latest-poc1.onrender.com"
echo "   ✅ WhatsApp: 5518996540492"
echo ""

echo "🌐 INICIANDO SERVIDOR LOCAL..."
echo ""

# Aguardar 2 segundos
sleep 2

# Iniciar servidor em background
$PYTHON_CMD -m http.server 8000 &
SERVER_PID=$!

# Aguardar servidor iniciar
sleep 3

echo "✅ Servidor iniciado com sucesso!"
echo ""
echo "================================================"
echo "   🌐 SERVIDOR RODANDO"
echo "   http://localhost:8000"
echo "================================================"
echo ""

# Abrir páginas no navegador padrão
echo "🚀 Abrindo sistema no navegador..."
echo ""

# Página inicial para motoristas
open "http://localhost:8000/MOTORISTAS/landing_captacao.html" 2>/dev/null || \
xdg-open "http://localhost:8000/MOTORISTAS/landing_captacao.html" 2>/dev/null || \
start "http://localhost:8000/MOTORISTAS/landing_captacao.html" 2>/dev/null

sleep 2

# Página admin
open "http://localhost:8000/ADMIN/admin_cadastro_fretes.html" 2>/dev/null || \
xdg-open "http://localhost:8000/ADMIN/admin_cadastro_fretes.html" 2>/dev/null || \
start "http://localhost:8000/ADMIN/admin_cadastro_fretes.html" 2>/dev/null

echo "================================================"
echo "   ✅ SISTEMA ABERTO NO NAVEGADOR!"
echo "================================================"
echo ""
echo "📂 PÁGINAS DISPONÍVEIS:"
echo ""
echo "👨‍💼 ADMIN:"
echo "   • Cadastro: http://localhost:8000/ADMIN/admin_cadastro_fretes.html"
echo "   • Propostas: http://localhost:8000/ADMIN/admin_propostas_recebidas.html"
echo "   • Rotas: http://localhost:8000/ADMIN/admin_rotas_preferidas.html"
echo ""
echo "🚚 MOTORISTAS:"
echo "   • Início: http://localhost:8000/MOTORISTAS/landing_captacao.html"
echo "   • Fretes: http://localhost:8000/MOTORISTAS/fretes_disponiveis.html"
echo "   • Propostas: http://localhost:8000/MOTORISTAS/minhas_propostas.html"
echo "   • Rotas: http://localhost:8000/MOTORISTAS/minhas_rotas_preferidas.html"
echo ""
echo "================================================"
echo ""
echo "⚠️  IMPORTANTE:"
echo "   • NÃO FECHE esta janela (servidor está rodando)"
echo "   • Pressione Ctrl+C para parar o servidor"
echo "   • Ou simplesmente feche esta janela quando terminar"
echo ""
echo "================================================"
echo ""

# Função para limpar ao sair
cleanup() {
    echo ""
    echo "🛑 Parando servidor..."
    kill $SERVER_PID 2>/dev/null
    echo "✅ Servidor parado. Até logo!"
    exit 0
}

# Capturar sinais de saída
trap cleanup EXIT INT TERM

# Manter o script rodando e mostrar logs do servidor
wait $SERVER_PID
