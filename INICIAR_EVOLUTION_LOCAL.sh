#!/bin/bash

# ============================================
# SCRIPT SIMPLIFICADO - INICIAR EVOLUTION API LOCAL
# ============================================

echo ""
echo "╔════════════════════════════════════════════╗"
echo "║  🚀 INICIANDO EVOLUTION API LOCAL         ║"
echo "╚════════════════════════════════════════════╝"
echo ""

# ============================================
# 1. VERIFICAR SE DOCKER ESTÁ RODANDO
# ============================================

echo "1️⃣  Verificando Docker..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if ! docker ps &> /dev/null; then
    echo "⚠️  Docker não está rodando"
    echo "📱 Abrindo Docker Desktop..."
    open -a Docker
    echo "⏳ Aguardando Docker iniciar (30 segundos)..."
    sleep 30
fi

# Verificar novamente
if ! docker ps &> /dev/null; then
    echo "❌ Docker ainda não está rodando"
    echo "👉 Abra o Docker Desktop manualmente e execute este script novamente"
    exit 1
fi

echo "✅ Docker rodando"
echo ""

# ============================================
# 2. NAVEGAR PARA PASTA EVOLUTION API
# ============================================

echo "2️⃣  Navegando para pasta Evolution API..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

cd ~/evolution-api || {
    echo "❌ Pasta ~/evolution-api não encontrada"
    echo "👉 Execute primeiro o script RESETAR_DOCKER_EVOLUTION.sh"
    exit 1
}

echo "✅ Pasta encontrada"
echo ""

# ============================================
# 3. SUBIR CONTAINERS
# ============================================

echo "3️⃣  Subindo containers Evolution API..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

docker-compose up -d

echo "⏳ Aguardando containers ficarem prontos (15 segundos)..."
sleep 15

echo ""

# ============================================
# 4. VERIFICAR CONTAINERS
# ============================================

echo "4️⃣  Verificando containers..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

echo ""

# ============================================
# 5. ABRIR EVOLUTION MANAGER
# ============================================

echo "5️⃣  Abrindo Evolution Manager..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

open "http://localhost:8080/manager"

echo "✅ Evolution Manager aberto no navegador"
echo ""

# ============================================
# 6. INSTRUÇÕES FINAIS
# ============================================

echo "╔════════════════════════════════════════════╗"
echo "║  ✅ EVOLUTION API LOCAL RODANDO           ║"
echo "╠════════════════════════════════════════════╣"
echo "║                                            ║"
echo "║  📱 PRÓXIMOS PASSOS:                       ║"
echo "║                                            ║"
echo "║  1. No Evolution Manager que abriu:        ║"
echo "║     - Procure a instância 'enside-master'  ║"
echo "║     - Clique no botão 'Get QR Code'        ║"
echo "║                                            ║"
echo "║  2. No celular:                            ║"
echo "║     - Abra WhatsApp                        ║"
echo "║     - Configurações → Dispositivos         ║"
echo "║     - Conectar aparelho                    ║"
echo "║     - Escaneie o QR Code                   ║"
echo "║                                            ║"
echo "║  3. Aguarde status mudar para 'Connected'  ║"
echo "║                                            ║"
echo "║  🌐 URLs:                                  ║"
echo "║  Evolution API: http://localhost:8080      ║"
echo "║  Manager: http://localhost:8080/manager    ║"
echo "║                                            ║"
echo "║  🔑 Credenciais:                           ║"
echo "║  API Key: evolution-api-enside-2024-secret ║"
echo "║  Instância: enside-master                  ║"
echo "║                                            ║"
echo "╚════════════════════════════════════════════╝"
echo ""
