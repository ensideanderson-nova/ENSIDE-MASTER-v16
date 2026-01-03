#!/bin/bash

# ========================================
# ENSIDE - ABRIR TUDO
# Abre todos os sistemas necessarios
# ========================================

echo ""
echo "========================================"
echo "   ENSIDE - INICIANDO SISTEMAS"
echo "========================================"
echo ""

# 1. Verificar e iniciar Docker
echo "[1/4] Verificando Docker..."
if ! docker info > /dev/null 2>&1; then
    echo "    Iniciando Docker..."
    open -a Docker
    sleep 10
else
    echo "    Docker ja esta rodando"
fi

# 2. Verificar Evolution API
echo "[2/4] Verificando Evolution API..."
if docker ps | grep -q evolution; then
    echo "    Evolution API ja esta rodando"
else
    echo "    Iniciando Evolution API..."
    docker start evolution_api 2>/dev/null || echo "    Container nao encontrado"
fi
sleep 2

# 3. Abrir Sistema ENSIDE
echo "[3/4] Abrindo Sistema ENSIDE..."
open "/Users/andersonenside/Desktop/ENSIDE_SISTEMA_UNIFICADO/ENSIDE_MASTER_v19.0_INTEGRADO.html"

# 4. Abrir Google Sheets
echo "[4/4] Abrindo Google Sheets..."
open "https://docs.google.com/spreadsheets/d/1FiP885Or0ncyRG_ZZaAvM2vP0sHhDzhLFYifYLjKyIE/edit#gid=1689968688"

echo ""
echo "========================================"
echo "   SISTEMAS INICIADOS COM SUCESSO!"
echo "========================================"
echo ""
echo "URLs disponiveis:"
echo "  - Sistema ENSIDE: arquivo local"
echo "  - Evolution Manager: http://localhost:8080/manager/enside"
echo "  - Google Sheets: planilha EUCALIPTO"
echo ""
echo "Pressione ENTER para fechar..."
read
