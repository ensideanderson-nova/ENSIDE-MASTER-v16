#!/bin/bash
# Script para abrir URL no navegador com retry

URL="${1:-http://localhost:9999/public/index-v19-funcional.html}"

echo "🌐 Abrindo navegador em: $URL"
sleep 3

# Tentar macOS open command (recomendado)
if command -v open &> /dev/null; then
  open "$URL" 2>/dev/null
  echo "✅ Navegador aberto com sucesso"
  exit 0
fi

echo "⚠️  Navegador não conseguiu abrir automaticamente"
echo "   Acesse manualmente: $URL"
exit 1
