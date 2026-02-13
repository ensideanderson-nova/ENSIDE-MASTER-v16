#!/bin/bash

#################################
# RESET COMPLETO DO SISTEMA
# Use APENAS se o sistema não estiver funcionando
#################################

echo "⚠️  RESET COMPLETO DO SISTEMA ENSIDE v19.0"
echo "════════════════════════════════════════════"
echo ""
echo "Este script vai:"
echo "  1. Parar todos os containers"
echo "  2. Remover volumes antigos"
echo "  3. Reiniciar tudo do zero"
echo ""
echo "Pressione ENTER para continuar ou Ctrl+C para cancelar..."
read

cd /Users/andersonenside/evolution

echo ""
echo "🛑 Parando containers..."
docker-compose down 2>/dev/null || true

echo "🗑️  Removendo volumes..."
docker-compose down -v 2>/dev/null || true

echo "🧹 Limpando processos..."
pkill -f "http.server" 2>/dev/null || true
pkill -f "python3" 2>/dev/null || true

echo ""
echo "⏳ Aguardando 10 segundos..."
sleep 10

echo ""
echo "🚀 Reiniciando sistema..."
bash start
