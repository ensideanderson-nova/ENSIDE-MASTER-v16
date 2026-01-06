#!/bin/bash

# ============================================
# ENSIDE MASTER v19.0 - INICIAR SISTEMA
# Sistema Completo Integrado
# ============================================

cd ~/Desktop/ENSIDE_SISTEMA_UNIFICADO

echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║     🌲 ENSIDE MASTER v19.0 - SISTEMA COMPLETO            ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# [1/4] Verificar Docker
echo "[1/4] Verificando Docker..."
if docker info > /dev/null 2>&1; then
    echo "   ✅ Docker rodando"
else
    echo "   ⚠️  Docker não está rodando. Iniciando..."
    open -a Docker
    sleep 5
fi

# [2/4] Verificar Redis
echo "[2/4] Verificando Redis..."
if redis-cli ping > /dev/null 2>&1; then
    echo "   ✅ Redis rodando (localhost:6379)"
else
    echo "   ⚠️  Redis não está rodando. Iniciando..."
    brew services start redis
    sleep 2
fi

# [3/4] Verificar Evolution API
echo "[3/4] Verificando Evolution API..."
if curl -s http://localhost:8080/manager > /dev/null 2>&1; then
    echo "   ✅ Evolution API rodando (localhost:8080)"
else
    echo "   ⚠️  Evolution API offline - verificar Docker"
fi

# [4/4] Abrir Sistema
echo "[4/4] Abrindo Sistema ENSIDE..."
open -a Firefox ~/Desktop/ENSIDE_SISTEMA_UNIFICADO/ENSIDE_MASTER_v19.0_INTEGRADO.html

echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║     ✅ SISTEMA INICIADO COM SUCESSO!                      ║"
echo "╠════════════════════════════════════════════════════════════╣"
echo "║  📊 7.055+ Contatos | 1.200+ Fornecedores | 377 Transp.   ║"
echo "║  🔗 Redis: localhost:6379                                 ║"
echo "║  📱 Evolution API: localhost:8080                         ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""
echo "Pressione qualquer tecla para fechar..."
read -n 1
