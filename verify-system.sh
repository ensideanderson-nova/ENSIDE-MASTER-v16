#!/bin/bash
# ENSIDE - Verificação do Sistema
# Use este script para verificar se tudo está funcionando

echo "🔍 VERIFICAÇÃO DO SISTEMA ENSIDE v19.0"
echo "════════════════════════════════════════"
echo ""

# 1. Verificar se arquivo principal existe
echo "1️⃣ Verificando arquivo principal..."
if [ -f "public/index-v19-funcional.html" ]; then
  echo "   ✅ index-v19-funcional.html encontrado"
  LINES=$(wc -l < public/index-v19-funcional.html)
  echo "   📝 Linhas: $LINES"
else
  echo "   ❌ Arquivo não encontrado"
  exit 1
fi

# 2. Verificar script start
echo ""
echo "2️⃣ Verificando script de inicialização..."
if [ -f "start" ] && [ -x "start" ]; then
  echo "   ✅ Script 'start' existe e é executável"
else
  echo "   ❌ Script 'start' não encontrado ou não é executável"
fi

# 3. Verificar docker-compose
echo ""
echo "3️⃣ Verificando docker-compose..."
if [ -f "docker-compose.yaml" ]; then
  echo "   ✅ docker-compose.yaml encontrado"
else
  echo "   ⚠️ docker-compose.yaml não encontrado"
fi

# 4. Verificar comando enside
echo ""
echo "4️⃣ Verificando comando enside..."
if command -v enside &> /dev/null; then
  echo "   ✅ Comando 'enside' está configurado"
  echo "   📍 Localização: $(which enside)"
else
  echo "   ⚠️ Comando 'enside' não está no PATH"
  echo "   💡 Execute: source ~/.zshrc"
fi

# 5. Verificar Alias
echo ""
echo "5️⃣ Verificando alias no shell..."
if alias enside &> /dev/null; then
  echo "   ✅ Alias 'enside' configurado"
  alias enside
else
  echo "   ⚠️ Alias não encontrado"
fi

# 6. Resumo de pastas
echo ""
echo "6️⃣ Estrutura de pastas:"
for dir in Docker public src api prisma; do
  if [ -d "$dir" ]; then
    COUNT=$(find $dir -type f | wc -l)
    echo "   ✅ $dir/ ($COUNT arquivos)"
  fi
done

echo ""
echo "════════════════════════════════════════"
echo "✅ Verificação concluída!"
echo ""
echo "🚀 Para iniciar: enside"
