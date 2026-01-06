#!/bin/bash
# ═══════════════════════════════════════════════════════════════
# INICIAR SISTEMA ENSIDE - Mac
# Duplo clique para abrir no navegador padrão
# ═══════════════════════════════════════════════════════════════

clear
echo "🌲 SISTEMA ENSIDE - MADEIRAS B2B"
echo "═══════════════════════════════════════════════════════"
echo ""

# Encontrar o diretório do script
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
HTML_FILE="$SCRIPT_DIR/sistema-enside-completo.html"

# Verificar se o arquivo HTML existe
if [ ! -f "$HTML_FILE" ]; then
    echo "❌ ERRO: Arquivo sistema-enside-completo.html não encontrado!"
    echo ""
    echo "📋 Certifique-se que os dois arquivos estão na mesma pasta:"
    echo "   - iniciar_enside.command"
    echo "   - sistema-enside-completo.html"
    echo ""
    read -p "Pressione ENTER para sair..."
    exit 1
fi

echo "✅ Arquivo encontrado: $HTML_FILE"
echo ""
echo "🚀 Abrindo sistema no navegador..."
echo ""

# Abrir no navegador padrão (Mac)
open "$HTML_FILE"

echo "✅ Sistema aberto com sucesso!"
echo ""
echo "═══════════════════════════════════════════════════════"
echo "💡 DICAS:"
echo "   • O sistema salva dados no navegador (localStorage)"
echo "   • Use 'Exportar Dados' para fazer backup"
echo "   • Os dados persistem mesmo fechando o navegador"
echo "═══════════════════════════════════════════════════════"
echo ""

# Manter terminal aberto por 3 segundos
sleep 3
