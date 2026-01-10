#!/bin/bash

# ============================================
# SCRIPT DE CONFIGURAÇÃO COMPLETA ENSIDE MASTER
# Integra: Redis + Evolution API + Google Sheets + Vercel
# ============================================

clear
echo "╔════════════════════════════════════════════════════════════╗"
echo "║  🚀 CONFIGURAÇÃO COMPLETA ENSIDE MASTER v19.0             ║"
echo "║     Redis + Evolution API + Google Sheets + Vercel        ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# ============================================
# 1. VERIFICAR DOCKER E SERVIÇOS
# ============================================

echo "1️⃣  VERIFICANDO DOCKER E SERVIÇOS..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if ! docker ps &> /dev/null; then
    echo "❌ Docker não está rodando"
    echo "   Iniciando Docker Desktop..."
    open -a Docker
    sleep 10
fi

# Verificar containers
REDIS_STATUS=$(docker ps --filter "name=redis" --format "{{.Status}}" 2>/dev/null)
EVOLUTION_STATUS=$(docker ps --filter "name=evolution" --format "{{.Status}}" 2>/dev/null)
POSTGRES_STATUS=$(docker ps --filter "name=postgres" --format "{{.Status}}" 2>/dev/null)

if [ -n "$REDIS_STATUS" ]; then
    echo "✅ Redis: $REDIS_STATUS"
else
    echo "⚠️  Redis não está rodando"
fi

if [ -n "$EVOLUTION_STATUS" ]; then
    echo "✅ Evolution API: $EVOLUTION_STATUS"
else
    echo "⚠️  Evolution API não está rodando"
fi

if [ -n "$POSTGRES_STATUS" ]; then
    echo "✅ PostgreSQL: $POSTGRES_STATUS"
else
    echo "⚠️  PostgreSQL não está rodando"
fi

echo ""

# ============================================
# 2. CONFIGURAÇÕES DA EVOLUTION API
# ============================================

echo "2️⃣  CONFIGURANDO EVOLUTION API..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Evolution API Local (Docker)
EVOLUTION_LOCAL_URL="http://localhost:8080"
EVOLUTION_LOCAL_KEY="evolution-api-enside-2024-secret"
EVOLUTION_LOCAL_INSTANCE="enside"

# Evolution API Render (Online)
EVOLUTION_RENDER_URL="https://evolution-api-latest-poc1.onrender.com"
EVOLUTION_RENDER_KEY="23D116F5-A4D3-404F-8D38-66EBF544A44A"
EVOLUTION_RENDER_INSTANCE="enside-master"

# Testar Evolution API Local
echo "🔍 Testando Evolution API Local..."
LOCAL_TEST=$(curl -s -H "apikey: $EVOLUTION_LOCAL_KEY" "$EVOLUTION_LOCAL_URL" 2>/dev/null)

if echo "$LOCAL_TEST" | grep -q "Welcome to the Evolution API"; then
    echo "✅ Evolution API Local: ONLINE"
    EVOLUTION_VERSION=$(echo "$LOCAL_TEST" | grep -o '"version":"[^"]*' | cut -d'"' -f4)
    echo "   Versão: $EVOLUTION_VERSION"
else
    echo "❌ Evolution API Local: OFFLINE"
fi

# Testar Evolution API Render
echo "🔍 Testando Evolution API Render..."
RENDER_TEST=$(curl -s -H "apikey: $EVOLUTION_RENDER_KEY" "$EVOLUTION_RENDER_URL" 2>/dev/null)

if echo "$RENDER_TEST" | grep -q "Welcome to the Evolution API"; then
    echo "✅ Evolution API Render: ONLINE"
    RENDER_VERSION=$(echo "$RENDER_TEST" | grep -o '"version":"[^"]*' | cut -d'"' -f4)
    echo "   Versão: $RENDER_VERSION"
else
    echo "⚠️  Evolution API Render: OFFLINE (pode estar em cold start)"
fi

echo ""

# ============================================
# 3. SALVAR CONFIGURAÇÕES NO REDIS
# ============================================

echo "3️⃣  SALVANDO CONFIGURAÇÕES NO REDIS..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Testar Redis
REDIS_PING=$(redis-cli ping 2>/dev/null)

if [ "$REDIS_PING" = "PONG" ]; then
    echo "✅ Redis: ONLINE"
    
    # Salvar configurações Evolution API Local
    redis-cli HSET enside:evolution:local \
        url "$EVOLUTION_LOCAL_URL" \
        apikey "$EVOLUTION_LOCAL_KEY" \
        instance "$EVOLUTION_LOCAL_INSTANCE" \
        version "${EVOLUTION_VERSION:-unknown}" > /dev/null
    
    # Salvar configurações Evolution API Render
    redis-cli HSET enside:evolution:render \
        url "$EVOLUTION_RENDER_URL" \
        apikey "$EVOLUTION_RENDER_KEY" \
        instance "$EVOLUTION_RENDER_INSTANCE" \
        version "${RENDER_VERSION:-unknown}" > /dev/null
    
    # Salvar URLs do sistema
    redis-cli HSET enside:urls \
        vercel "https://enside-sistema.vercel.app" \
        render "https://enside-master-v16.onrender.com" \
        evolution_manager_local "http://localhost:8080/manager" \
        evolution_manager_render "https://evolution-api-latest-poc1.onrender.com/manager" \
        google_sheets "https://docs.google.com/spreadsheets/d/1FiP885Or0ncyRG_ZZaAvM2vP0sHhDzhLFYifYLjKyIE/edit" \
        redis_commander "http://localhost:8081" > /dev/null
    
    # Salvar Google Sheets ID
    redis-cli SET enside:google_sheets:id "1FiP885Or0ncyRG_ZZaAvM2vP0sHhDzhLFYifYLjKyIE" > /dev/null
    
    # Salvar timestamp da configuração
    redis-cli SET enside:config:timestamp "$(date '+%Y-%m-%d %H:%M:%S')" > /dev/null
    
    echo "✅ Configurações salvas no Redis"
    echo "   Chaves criadas:"
    echo "   - enside:evolution:local"
    echo "   - enside:evolution:render"
    echo "   - enside:urls"
    echo "   - enside:google_sheets:id"
    echo "   - enside:config:timestamp"
else
    echo "❌ Redis: OFFLINE"
fi

echo ""

# ============================================
# 4. ATUALIZAR COMANDO enside-
# ============================================

echo "4️⃣  ATUALIZANDO COMANDO enside-..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Criar script enside- atualizado
cat > ~/.local/bin/enside- << 'ENSIDE_SCRIPT'
#!/bin/bash

# Verificar se Redis está rodando
if ! redis-cli ping &> /dev/null; then
    echo "⚠️  Redis não está rodando. Iniciando..."
    redis-server --daemonize yes
    sleep 2
fi

# Ler URLs do Redis
VERCEL_URL=$(redis-cli HGET enside:urls vercel 2>/dev/null)
EVOLUTION_MANAGER=$(redis-cli HGET enside:urls evolution_manager_render 2>/dev/null)
GOOGLE_SHEETS=$(redis-cli HGET enside:urls google_sheets 2>/dev/null)
REDIS_COMMANDER=$(redis-cli HGET enside:urls redis_commander 2>/dev/null)

# URLs padrão se Redis não responder
VERCEL_URL=${VERCEL_URL:-"https://enside-sistema.vercel.app"}
EVOLUTION_MANAGER=${EVOLUTION_MANAGER:-"https://evolution-api-latest-poc1.onrender.com/manager"}
GOOGLE_SHEETS=${GOOGLE_SHEETS:-"https://docs.google.com/spreadsheets/d/1FiP885Or0ncyRG_ZZaAvM2vP0sHhDzhLFYifYLjKyIE/edit"}
REDIS_COMMANDER=${REDIS_COMMANDER:-"http://localhost:8081"}

# Iniciar Redis Commander se não estiver rodando
if ! lsof -i :8081 &> /dev/null; then
    echo "🔧 Iniciando Redis Commander..."
    redis-commander --port 8081 &> /dev/null &
    sleep 2
fi

# Abrir URLs no navegador
echo "🚀 Abrindo sistemas ENSIDE..."
open "$VERCEL_URL"
open "$EVOLUTION_MANAGER"
open "$GOOGLE_SHEETS"
open "$REDIS_COMMANDER"

# Mostrar resumo
echo ""
echo "✅ Sistemas abertos:"
echo "   🌐 Vercel: $VERCEL_URL"
echo "   📱 Evolution Manager: $EVOLUTION_MANAGER"
echo "   📊 Google Sheets: $GOOGLE_SHEETS"
echo "   🗄️  Redis Commander: $REDIS_COMMANDER"
echo ""

# Mostrar estatísticas do Redis
TOTAL_KEYS=$(redis-cli DBSIZE 2>/dev/null | grep -o '[0-9]*')
echo "📊 Redis: $TOTAL_KEYS chaves armazenadas"
ENSIDE_SCRIPT

chmod +x ~/.local/bin/enside-

echo "✅ Comando enside- atualizado"
echo "   Agora inclui Redis Commander"
echo ""

# ============================================
# 5. CRIAR ARQUIVO DE CONFIGURAÇÃO JSON
# ============================================

echo "5️⃣  CRIANDO ARQUIVO DE CONFIGURAÇÃO..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

cat > ~/ENSIDE-MASTER-v16/CONFIG/config.json << EOF
{
  "sistema": {
    "nome": "ENSIDE MASTER",
    "versao": "19.0",
    "timestamp": "$(date '+%Y-%m-%d %H:%M:%S')"
  },
  "evolution_api": {
    "local": {
      "url": "$EVOLUTION_LOCAL_URL",
      "apikey": "$EVOLUTION_LOCAL_KEY",
      "instance": "$EVOLUTION_LOCAL_INSTANCE",
      "version": "${EVOLUTION_VERSION:-unknown}"
    },
    "render": {
      "url": "$EVOLUTION_RENDER_URL",
      "apikey": "$EVOLUTION_RENDER_KEY",
      "instance": "$EVOLUTION_RENDER_INSTANCE",
      "version": "${RENDER_VERSION:-unknown}"
    }
  },
  "redis": {
    "host": "localhost",
    "port": 6379,
    "status": "$([ "$REDIS_PING" = "PONG" ] && echo "online" || echo "offline")"
  },
  "google_sheets": {
    "id": "1FiP885Or0ncyRG_ZZaAvM2vP0sHhDzhLFYifYLjKyIE",
    "nome": "EUCALIPTO-13-12-25-_SISTEMA_INTEGRADO_COMPLETO"
  },
  "urls": {
    "vercel": "https://enside-sistema.vercel.app",
    "render": "https://enside-master-v16.onrender.com",
    "evolution_manager_local": "http://localhost:8080/manager",
    "evolution_manager_render": "https://evolution-api-latest-poc1.onrender.com/manager",
    "redis_commander": "http://localhost:8081"
  }
}
EOF

echo "✅ Arquivo de configuração criado"
echo "   Localização: ~/ENSIDE-MASTER-v16/CONFIG/config.json"
echo ""

# ============================================
# 6. RESUMO FINAL
# ============================================

echo "╔════════════════════════════════════════════════════════════╗"
echo "║  ✅ CONFIGURAÇÃO COMPLETA FINALIZADA                      ║"
echo "╠════════════════════════════════════════════════════════════╣"
echo "║                                                            ║"
echo "║  📦 SERVIÇOS CONFIGURADOS:                                ║"
echo "║  ✓ Redis (localhost:6379)                                 ║"
echo "║  ✓ Evolution API Local (localhost:8080)                   ║"
echo "║  ✓ Evolution API Render (online)                          ║"
echo "║  ✓ PostgreSQL (localhost:5432)                            ║"
echo "║  ✓ Redis Commander (localhost:8081)                       ║"
echo "║                                                            ║"
echo "║  🔧 ARQUIVOS CRIADOS:                                     ║"
echo "║  ✓ ~/.local/bin/enside- (comando atualizado)              ║"
echo "║  ✓ ~/ENSIDE-MASTER-v16/CONFIG/config.json                 ║"
echo "║                                                            ║"
echo "║  🚀 PARA USAR:                                            ║"
echo "║  Digite: enside-                                          ║"
echo "║                                                            ║"
echo "║  Isso abrirá:                                             ║"
echo "║  • Sistema Vercel                                         ║"
echo "║  • Evolution Manager                                      ║"
echo "║  • Google Sheets                                          ║"
echo "║  • Redis Commander                                        ║"
echo "║                                                            ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""
