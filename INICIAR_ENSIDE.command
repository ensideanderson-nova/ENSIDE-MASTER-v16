#!/bin/bash
clear
echo "╔════════════════════════════════════════════════════════════════╗"
echo "║     🚀 ENSIDE SISTEMA UNIFICADO v19.0 - INICIANDO...          ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

echo "🐳 [1/4] Verificando Docker..."
if ! docker info > /dev/null 2>&1; then
    echo "   ⚠️  Iniciando Docker Desktop..."
    open -a Docker
    sleep 10
fi
echo "   ✅ Docker OK"

echo "🔌 [2/4] Iniciando Evolution API..."
if docker ps -a | grep -q evolution-api; then
    docker start evolution-api > /dev/null 2>&1
fi
sleep 3
echo "   ✅ Evolution API em http://localhost:8080"

echo "🌐 [3/4] Abrindo Sistema Principal..."
open "$SCRIPT_DIR/ENSIDE_MASTER_v19.0_INTEGRADO.html"
echo "   ✅ Sistema aberto"

echo "📱 [4/4] Abrindo Evolution Manager..."
sleep 2
open -a Firefox "http://localhost:8080/manager"
echo "   ✅ Evolution Manager aberto"

echo ""
echo "╔════════════════════════════════════════════════════════════════╗"
echo "║              🎉 SISTEMA INICIADO COM SUCESSO!                 ║"
echo "╠════════════════════════════════════════════════════════════════╣"
echo "║  🔑 API Key: 919AA333-AE59-4B06-B1EF-C9A9F9C8C0F6             ║"
echo "║  📞 WhatsApp: 5518996540492                                    ║"
echo "║  🌐 Evolution: http://localhost:8080                           ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""
read -p "Pressione ENTER para fechar..."
