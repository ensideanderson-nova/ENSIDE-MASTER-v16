#!/bin/bash

# ============================================
# SINCRONIZAÇÃO COMPLETA DE CONTATOS
# Google Sheets → Redis → Evolution API Local
# ============================================

echo ""
echo "╔════════════════════════════════════════════╗"
echo "║  🔄 SINCRONIZAÇÃO COMPLETA DE CONTATOS    ║"
echo "║     Google Sheets → Redis → Evolution     ║"
echo "╚════════════════════════════════════════════╝"
echo ""

# Configurações
SHEETS_ID="1FiP885Or0ncyRG_ZZaAvM2vP0sHhDzhLFYifYLjKyIE"
SHEETS_URL="https://docs.google.com/spreadsheets/d/${SHEETS_ID}/gviz/tq?tqx=out:csv&sheet=CONTATOS"
EVOLUTION_URL="http://localhost:8080"
EVOLUTION_API_KEY="evolution-api-enside-2024-secret"
EVOLUTION_INSTANCE="ENSIDE"

# ============================================
# 1️⃣ BAIXAR CONTATOS DO GOOGLE SHEETS
# ============================================

echo "1️⃣  Baixando contatos do Google Sheets..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

CSV_FILE="/tmp/contatos_enside.csv"
curl -s "$SHEETS_URL" > "$CSV_FILE"

TOTAL_LINHAS=$(wc -l < "$CSV_FILE" | tr -d ' ')
echo "✅ Planilha baixada: $TOTAL_LINHAS linhas"

# ============================================
# 2️⃣ PROCESSAR E SALVAR NO REDIS
# ============================================

echo ""
echo "2️⃣  Processando contatos e salvando no Redis..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Criar script Node.js temporário para processar CSV
cat > /tmp/processar_contatos.js << 'NODESCRIPT'
const fs = require('fs');
const { createClient } = require('redis');

async function processar() {
    const redis = createClient({ url: 'redis://localhost:6379' });
    await redis.connect();
    
    const csv = fs.readFileSync('/tmp/contatos_enside.csv', 'utf-8');
    const linhas = csv.split('\n').slice(1); // Pula cabeçalho
    
    const contatos = {
        todos: [],
        fornecedores: [],
        clientes: [],
        transportadores: []
    };
    
    let processados = 0;
    
    for (const linha of linhas) {
        if (!linha.trim()) continue;
        
        const campos = linha.split(',');
        if (campos.length < 3) continue;
        
        const nome = campos[0]?.replace(/"/g, '').trim();
        const telefone = campos[1]?.replace(/"/g, '').trim();
        const categoria = campos[2]?.replace(/"/g, '').trim().toLowerCase();
        
        if (!nome || !telefone) continue;
        
        // Formatar número WhatsApp
        const numero = telefone.replace(/\D/g, '');
        if (numero.length < 10) continue;
        
        const whatsapp = numero.startsWith('55') ? numero : '55' + numero;
        
        const contato = {
            nome,
            telefone: whatsapp,
            whatsapp: whatsapp + '@s.whatsapp.net',
            categoria
        };
        
        contatos.todos.push(contato);
        
        if (categoria.includes('fornec')) {
            contatos.fornecedores.push(contato);
        } else if (categoria.includes('client')) {
            contatos.clientes.push(contato);
        } else if (categoria.includes('transport')) {
            contatos.transportadores.push(contato);
        }
        
        processados++;
    }
    
    // Salvar no Redis
    await redis.set('enside:contatos:todos', JSON.stringify(contatos.todos));
    await redis.set('enside:contatos:fornecedores', JSON.stringify(contatos.fornecedores));
    await redis.set('enside:contatos:clientes', JSON.stringify(contatos.clientes));
    await redis.set('enside:contatos:transportadores', JSON.stringify(contatos.transportadores));
    
    // Atualizar estatísticas
    await redis.set('enside:estatisticas', JSON.stringify({
        total: contatos.todos.length,
        fornecedores: contatos.fornecedores.length,
        clientes: contatos.clientes.length,
        transportadores: contatos.transportadores.length,
        ultima_sync: new Date().toISOString()
    }));
    
    console.log(`✅ ${processados} contatos processados`);
    console.log(`   📊 Total: ${contatos.todos.length}`);
    console.log(`   🏭 Fornecedores: ${contatos.fornecedores.length}`);
    console.log(`   👥 Clientes: ${contatos.clientes.length}`);
    console.log(`   🚚 Transportadores: ${contatos.transportadores.length}`);
    
    await redis.disconnect();
}

processar().catch(console.error);
NODESCRIPT

# Executar processamento
cd /tmp
npm install redis 2>/dev/null
node processar_contatos.js

# ============================================
# 3️⃣ VERIFICAR EVOLUTION API
# ============================================

echo ""
echo "3️⃣  Verificando Evolution API..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Verificar se Docker está rodando
if ! docker ps | grep -q evolution; then
    echo "⚠️  Docker Evolution API não está rodando"
    echo "   Iniciando Docker..."
    cd ~/evolution-api
    docker-compose up -d
    sleep 30
fi

# Verificar conexão
STATUS=$(curl -s "${EVOLUTION_URL}/instance/connectionState/${EVOLUTION_INSTANCE}" \
    -H "apikey: ${EVOLUTION_API_KEY}" | jq -r '.state' 2>/dev/null)

if [ "$STATUS" = "open" ]; then
    echo "✅ Evolution API conectada"
else
    echo "⚠️  Evolution API desconectada (status: $STATUS)"
    echo "   Abra http://localhost:8080/manager e conecte o WhatsApp"
fi

# ============================================
# 4️⃣ ATUALIZAR SISTEMA HTML LOCAL
# ============================================

echo ""
echo "4️⃣  Atualizando sistema HTML local..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

HTML_FILE="$HOME/ENSIDE-MASTER-v16/ENSIDE_MASTER_v19.0_INTEGRADO.html"

if [ -f "$HTML_FILE" ]; then
    # Backup
    cp "$HTML_FILE" "${HTML_FILE}.backup.$(date +%Y%m%d_%H%M%S)"
    
    # Atualizar configurações no HTML
    sed -i '' "s|evolution_url:.*|evolution_url: 'http://localhost:8080',|g" "$HTML_FILE"
    sed -i '' "s|evolution_api_key:.*|evolution_api_key: 'evolution-api-enside-2024-secret',|g" "$HTML_FILE"
    sed -i '' "s|evolution_instance:.*|evolution_instance: 'ENSIDE',|g" "$HTML_FILE"
    
    echo "✅ Sistema HTML atualizado"
else
    echo "⚠️  Arquivo HTML não encontrado"
fi

# ============================================
# 5️⃣ SALVAR NO REDIS PARA SINCRONIZAÇÃO
# ============================================

echo ""
echo "5️⃣  Salvando configurações no Redis..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

redis-cli SET enside:config "$(cat <<EOF
{
  "evolution_url": "http://localhost:8080",
  "evolution_api_key": "evolution-api-enside-2024-secret",
  "evolution_instance": "ENSIDE",
  "google_sheets_id": "${SHEETS_ID}",
  "ultima_sync": "$(date -u +%Y-%m-%dT%H:%M:%SZ)"
}
EOF
)" > /dev/null

echo "✅ Configurações salvas no Redis"

# ============================================
# RESUMO FINAL
# ============================================

echo ""
echo "╔════════════════════════════════════════════╗"
echo "║  ✅ SINCRONIZAÇÃO CONCLUÍDA               ║"
echo "╠════════════════════════════════════════════╣"
echo "║                                            ║"
echo "║  📊 Dados sincronizados:                   ║"

# Ler estatísticas do Redis
STATS=$(redis-cli GET enside:estatisticas)
TOTAL=$(echo "$STATS" | jq -r '.total' 2>/dev/null || echo "0")
FORNEC=$(echo "$STATS" | jq -r '.fornecedores' 2>/dev/null || echo "0")
CLIENT=$(echo "$STATS" | jq -r '.clientes' 2>/dev/null || echo "0")
TRANSP=$(echo "$STATS" | jq -r '.transportadores' 2>/dev/null || echo "0")

echo "║     Total: $TOTAL contatos                    ║"
echo "║     Fornecedores: $FORNEC                     ║"
echo "║     Clientes: $CLIENT                         ║"
echo "║     Transportadores: $TRANSP                  ║"
echo "║                                            ║"
echo "║  🎯 Próximos passos:                       ║"
echo "║     1. Verificar WhatsApp conectado        ║"
echo "║     2. Abrir sistema HTML local            ║"
echo "║     3. Testar envio de mensagens           ║"
echo "║                                            ║"
echo "╚════════════════════════════════════════════╝"
echo ""
