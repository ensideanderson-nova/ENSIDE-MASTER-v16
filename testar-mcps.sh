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
