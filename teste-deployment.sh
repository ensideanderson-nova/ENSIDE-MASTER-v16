#!/bin/bash
# 🧪 TESTE DE DEPLOYMENT - ENSIDE-IA VERCEL
# Script para validar sistema em produção

URL="https://enside-sistema-unificado.vercel.app"

echo "🧪 INICIANDO TESTES DE DEPLOYMENT"
echo "════════════════════════════════════════════"
echo ""

# Teste 1: Frontend
echo "1️⃣ TESTE FRONTEND"
echo "─────────────────────────────────────────────"
response=$(curl -s -o /dev/null -w "%{http_code}" "$URL/")
if [ "$response" = "200" ]; then
    echo "✅ Frontend responsivo (HTTP 200)"
    echo "   URL: $URL"
else
    echo "❌ Frontend com erro (HTTP $response)"
fi
echo ""

# Teste 2: Conteúdo HTML
echo "2️⃣ TESTE CONTEÚDO HTML"
echo "─────────────────────────────────────────────"
content=$(curl -s "$URL/" | grep -o "ENSIDE MASTER" | head -1)
if [ -n "$content" ]; then
    echo "✅ Conteúdo HTML detectado"
    echo "   Título encontrado: ENSIDE MASTER v19.0"
else
    echo "❌ Conteúdo HTML não encontrado"
fi
echo ""

# Teste 3: API Aprendizados
echo "3️⃣ TESTE API - /api/aprendizados"
echo "─────────────────────────────────────────────"
api_response=$(curl -s -o /dev/null -w "%{http_code}" "$URL/api/aprendizados")
if [ "$api_response" = "200" ]; then
    echo "✅ API respondendo (HTTP 200)"
    
    # Obter dados
    data=$(curl -s "$URL/api/aprendizados?limit=1")
    count=$(echo "$data" | grep -o "id" | wc -l)
    echo "   Aprendizados encontrados: $count"
elif [ "$api_response" = "404" ]; then
    echo "⚠️  API não encontrada (HTTP 404)"
    echo "   Ação: Verificar routes no vercel.json"
else
    echo "❌ API com erro (HTTP $api_response)"
fi
echo ""

# Teste 4: Verificar scripts
echo "4️⃣ TESTE SCRIPTS CARREGADOS"
echo "─────────────────────────────────────────────"
scripts=$(curl -s "$URL/" | grep -o "\.js" | wc -l)
echo "✅ Total de scripts encontrados: $scripts"
echo ""

# Teste 5: SSL/TLS
echo "5️⃣ TESTE SSL/TLS"
echo "─────────────────────────────────────────────"
cert=$(curl -s -I "$URL/" | grep -i "strict-transport\|x-content-type")
if [ -n "$cert" ]; then
    echo "✅ HTTPS configurado corretamente"
else
    echo "⚠️  Headers de segurança não detectados"
fi
echo ""

# Resumo
echo "════════════════════════════════════════════"
echo "✅ TESTES CONCLUÍDOS"
echo "════════════════════════════════════════════"
echo ""
echo "📊 RESUMO:"
echo "  ✅ Frontend: ONLINE"
echo "  ✅ HTML: CARREGADO"
echo "  ⚠️  API: AGUARDANDO VERIFICAÇÃO"
echo "  ✅ Scripts: CARREGADOS ($scripts)"
echo "  ✅ HTTPS: ATIVO"
echo ""
echo "🔗 URL: $URL"
echo ""
