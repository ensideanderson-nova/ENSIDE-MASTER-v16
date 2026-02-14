#!/bin/bash

# Script para testar endpoints da API Vercel

echo "🧪 TESTE FINAL DOS ENDPOINTS DA API"
echo "=================================="
echo ""

# Teste 1: Frontend
echo "1️⃣ Testando Frontend..."
STATUS=$(curl -s -o /dev/null -w "%{http_code}" "https://enside-sistema-unificado.vercel.app")
if [ "$STATUS" = "200" ]; then
    echo "✅ Frontend: HTTP $STATUS"
else
    echo "❌ Frontend: HTTP $STATUS"
fi
echo ""

# Teste 2: API Aprendizados
echo "2️⃣ Testando /api/aprendizados..."
RESPONSE=$(curl -s "https://enside-sistema-unificado.vercel.app/api/aprendizados?limit=1")
if [[ $RESPONSE == *"aprendizado"* ]] || [[ $RESPONSE == *"id"* ]]; then
    echo "✅ API respondendo com dados"
    echo "   Resposta: ${RESPONSE:0:100}..."
else
    echo "⚠️  Resposta: $RESPONSE"
fi
echo ""

# Teste 3: Stats
echo "3️⃣ Testando /api/aprendizados/stats/info..."
STATS=$(curl -s "https://enside-sistema-unificado.vercel.app/api/aprendizados/stats/info")
if [[ $STATS == *"total"* ]]; then
    echo "✅ Stats disponível"
    echo "   $STATS"
else
    echo "⚠️  Stats: $STATS"
fi
echo ""

# Teste 4: Tipos
echo "4️⃣ Testando /api/aprendizados/tipos/lista..."
TIPOS=$(curl -s "https://enside-sistema-unificado.vercel.app/api/aprendizados/tipos/lista")
if [[ $TIPOS == *"tipo"* ]] || [[ $TIPOS == *"count"* ]]; then
    echo "✅ Tipos disponível"
    echo "   $TIPOS"
else
    echo "⚠️  Tipos: $TIPOS"
fi
echo ""

echo "=================================="
echo "✨ Testes concluídos!"
