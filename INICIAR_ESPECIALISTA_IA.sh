#!/bin/bash

# 🤖 ESPECIALISTA-IA MASTER - Script de Inicialização
# Versão 10.0 - JavaScript Puro (SEM Python)

clear

echo "╔══════════════════════════════════════════════════════════════╗"
echo "║      🤖 ESPECIALISTA-IA MASTER v10.0 - INICIALIZANDO        ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo ""

# Diretório do projeto
cd "$(dirname "$0")"

echo "📁 Diretório: $(pwd)"
echo ""

# 1. Verificar Redis
echo "1️⃣  Verificando Redis..."
if redis-cli ping > /dev/null 2>&1; then
    echo "   ✅ Redis está rodando"
    REDIS_KEYS=$(redis-cli DBSIZE | grep -o '[0-9]*')
    echo "   📊 $REDIS_KEYS chaves no Redis"
else
    echo "   ❌ Redis não está rodando"
    echo "   💡 Iniciando Redis..."
    redis-server --daemonize yes
    sleep 2
    if redis-cli ping > /dev/null 2>&1; then
        echo "   ✅ Redis iniciado com sucesso"
    else
        echo "   ❌ Erro ao iniciar Redis"
        exit 1
    fi
fi
echo ""

# 2. Verificar Node.js
echo "2️⃣  Verificando Node.js..."
if command -v node > /dev/null 2>&1; then
    NODE_VERSION=$(node --version)
    echo "   ✅ Node.js $NODE_VERSION instalado"
else
    echo "   ❌ Node.js não encontrado"
    echo "   💡 Instale Node.js: https://nodejs.org"
    exit 1
fi
echo ""

# 3. Instalar dependências
echo "3️⃣  Verificando dependências..."
if [ ! -d "node_modules" ]; then
    echo "   📦 Instalando dependências..."
    npm install express cors redis
else
    echo "   ✅ Dependências já instaladas"
fi
echo ""

# 4. Verificar arquivos
echo "4️⃣  Verificando arquivos do sistema..."
FILES=(
    "CONFIG/ESPECIALISTA_IA_MASTER.js"
    "CONFIG/ESPECIALISTA_IA.js"
    "CONFIG/CHAT_FLUTUANTE_IA.js"
    "server-especialista.js"
)

ALL_OK=true
for file in "${FILES[@]}"; do
    if [ -f "$file" ]; then
        echo "   ✅ $file"
    else
        echo "   ❌ $file (não encontrado)"
        ALL_OK=false
    fi
done

if [ "$ALL_OK" = false ]; then
    echo ""
    echo "   ⚠️  Alguns arquivos estão faltando!"
    exit 1
fi
echo ""

# 5. Iniciar servidor
echo "5️⃣  Iniciando servidor ESPECIALISTA-IA MASTER..."
echo ""

# Matar processos anteriores na porta 3001
lsof -ti:3001 | xargs kill -9 2>/dev/null

# Iniciar servidor em background
node server-especialista.js &
SERVER_PID=$!

sleep 2

# Verificar se servidor está rodando
if ps -p $SERVER_PID > /dev/null; then
    echo "✅ Servidor iniciado com sucesso (PID: $SERVER_PID)"
    echo ""
    echo "╔══════════════════════════════════════════════════════════════╗"
    echo "║           🎉 ESPECIALISTA-IA MASTER ATIVO!                   ║"
    echo "╠══════════════════════════════════════════════════════════════╣"
    echo "║ 🌐 Servidor: http://localhost:3001"
    echo "║ 🔴 Redis: localhost:6379"
    echo "║ 📊 API: http://localhost:3001/api/health"
    echo "╠══════════════════════════════════════════════════════════════╣"
    echo "║ PRÓXIMOS PASSOS:"
    echo "║ 1. Abra o navegador em: http://localhost:3001"
    echo "║ 2. Ou abra: index.html"
    echo "║ 3. Clique no botão 🤖 no canto inferior direito"
    echo "╠══════════════════════════════════════════════════════════════╣"
    echo "║ COMANDOS ÚTEIS:"
    echo "║ • Ver logs: tail -f logs/especialista-ia.log"
    echo "║ • Parar servidor: kill $SERVER_PID"
    echo "║ • Testar API: curl http://localhost:3001/api/health"
    echo "╚══════════════════════════════════════════════════════════════╝"
    echo ""
    
    # Salvar PID
    echo $SERVER_PID > .especialista-ia.pid
    
    # Abrir navegador (opcional)
    read -p "🌐 Abrir navegador? (s/n): " ABRIR
    if [ "$ABRIR" = "s" ] || [ "$ABRIR" = "S" ]; then
        open "http://localhost:3001/index.html"
    fi
    
    # Manter terminal aberto
    echo ""
    echo "📝 Pressione Ctrl+C para parar o servidor"
    wait $SERVER_PID
    
else
    echo "❌ Erro ao iniciar servidor"
    exit 1
fi
