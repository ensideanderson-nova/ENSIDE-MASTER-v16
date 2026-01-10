#!/bin/bash

# ============================================
# SINCRONIZAÇÃO EM TEMPO REAL
# HTML Local ↔ Vercel ↔ Redis
# ============================================

echo ""
echo "🔄 SINCRONIZAÇÃO EM TEMPO REAL ENSIDE"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Verificar Redis
if ! redis-cli ping > /dev/null 2>&1; then
    echo "⚠️  Redis não está rodando. Iniciando..."
    redis-server --daemonize yes
    sleep 2
fi

echo "✅ Redis rodando"

# Salvar HTML local no Redis
echo "📤 Salvando HTML local no Redis..."
cat ~/ENSIDE-MASTER-v16/ENSIDE_MASTER_v19.0_INTEGRADO.html | \
    redis-cli -x SET enside:html:local

echo "✅ HTML salvo no Redis (chave: enside:html:local)"

# Salvar timestamp
redis-cli SET enside:sync:timestamp "$(date '+%Y-%m-%d %H:%M:%S')"

# Salvar configurações
redis-cli HSET enside:config \
    evolution_url "http://localhost:8080" \
    evolution_api_key "evolution-api-enside-2024-secret" \
    evolution_instance "ENSIDE" \
    google_sheets_id "1FiP885Or0ncyRG_ZZaAvM2vP0sHhDzhLFYifYLjKyIE"

echo "✅ Configurações salvas no Redis"

# Criar script de sincronização automática
cat > ~/ENSIDE-MASTER-v16/AUTO_SYNC.sh << 'EOF'
#!/bin/bash
# Sincronização automática a cada 30 segundos

while true; do
    # Salvar HTML no Redis
    cat ~/ENSIDE-MASTER-v16/ENSIDE_MASTER_v19.0_INTEGRADO.html | \
        redis-cli -x SET enside:html:local > /dev/null 2>&1
    
    # Atualizar timestamp
    redis-cli SET enside:sync:timestamp "$(date '+%Y-%m-%d %H:%M:%S')" > /dev/null 2>&1
    
    # Aguardar 30 segundos
    sleep 30
done
EOF

chmod +x ~/ENSIDE-MASTER-v16/AUTO_SYNC.sh

echo ""
echo "╔════════════════════════════════════════════╗"
echo "║  ✅ SINCRONIZAÇÃO CONFIGURADA             ║"
echo "╠════════════════════════════════════════════╣"
echo "║                                            ║"
echo "║  📊 Dados no Redis:                        ║"
echo "║  • enside:html:local (HTML completo)       ║"
echo "║  • enside:config (configurações)           ║"
echo "║  • enside:sync:timestamp (última sync)     ║"
echo "║                                            ║"
echo "║  🔄 Sincronização automática:              ║"
echo "║  ~/ENSIDE-MASTER-v16/AUTO_SYNC.sh &        ║"
echo "║                                            ║"
echo "║  🌐 Acessar Redis Commander:               ║"
echo "║  http://localhost:8081                     ║"
echo "║                                            ║"
echo "╚════════════════════════════════════════════╝"
echo ""

# Perguntar se quer iniciar sync automática
read -p "Iniciar sincronização automática em background? (s/n): " resposta

if [[ "$resposta" == "s" || "$resposta" == "S" ]]; then
    nohup ~/ENSIDE-MASTER-v16/AUTO_SYNC.sh > /dev/null 2>&1 &
    echo "✅ Sincronização automática iniciada (PID: $!)"
    echo "   Para parar: pkill -f AUTO_SYNC.sh"
else
    echo "ℹ️  Sincronização manual concluída"
fi

echo ""
