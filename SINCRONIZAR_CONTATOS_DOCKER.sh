#!/bin/bash

# SINCRONIZAR CONTATOS DO GOOGLE SHEETS COM DOCKER EVOLUTION API
# Este script importa os 7.055+ contatos do CSV para o sistema

echo "🔄 SINCRONIZAÇÃO COMPLETA DE CONTATOS"
echo "======================================"
echo ""

# 1. Verificar se Docker Evolution API está rodando
echo "📡 [1/5] Verificando Docker Evolution API..."
if ! curl -s http://localhost:8080/instance/connectionState/ENSIDE \
  -H "apikey: evolution-api-enside-2024-secret" > /dev/null 2>&1; then
  echo "❌ Evolution API não está rodando!"
  echo "   Execute: docker-compose up -d"
  exit 1
fi
echo "✅ Evolution API rodando"
echo ""

# 2. Localizar CSV dos contatos
echo "📊 [2/5] Localizando CSV de contatos..."
CSV_FILE=$(find ~/Downloads -name "*EUCALIPTO*CONTATOS.csv" -type f | head -1)

if [ -z "$CSV_FILE" ]; then
  echo "❌ CSV de contatos não encontrado!"
  echo "   Baixe a planilha EUCALIPTO do Google Sheets"
  exit 1
fi

echo "✅ CSV encontrado: $CSV_FILE"
echo ""

# 3. Processar contatos do CSV
echo "🔄 [3/5] Processando contatos do CSV..."

# Criar script Node.js temporário para processar CSV
cat > /tmp/processar_contatos.js << 'NODEJS'
const fs = require('fs');
const csvFile = process.argv[2];

// Ler CSV
const csv = fs.readFileSync(csvFile, 'utf-8');
const lines = csv.split('\n');
const headers = lines[0].toLowerCase().split(',');

// Encontrar índices das colunas
const nomeIdx = headers.findIndex(h => h.includes('nome'));
const telefoneIdx = headers.findIndex(h => h.includes('telefone') || h.includes('whatsapp'));
const categoriaIdx = headers.findIndex(h => h.includes('categoria') || h.includes('tipo'));

const contatos = {
  todos: [],
  fornecedores: [],
  clientes: [],
  transportadores: [],
  outros: []
};

// Processar cada linha
for (let i = 1; i < lines.length; i++) {
  const line = lines[i].trim();
  if (!line) continue;
  
  const cols = line.split(',');
  const nome = cols[nomeIdx] || '';
  let telefone = cols[telefoneIdx] || '';
  const categoria = (cols[categoriaIdx] || '').toLowerCase();
  
  // Limpar e formatar telefone
  telefone = telefone.replace(/\D/g, '');
  if (!telefone || telefone.length < 10) continue;
  
  // Adicionar código do país se necessário
  if (!telefone.startsWith('55')) {
    telefone = '55' + telefone;
  }
  
  // Formato WhatsApp
  const whatsapp = telefone + '@s.whatsapp.net';
  
  const contato = {
    nome: nome.trim(),
    telefone: telefone,
    whatsapp: whatsapp,
    categoria: categoria
  };
  
  // Adicionar em todos
  contatos.todos.push(contato);
  
  // Categorizar
  if (categoria.includes('fornecedor')) {
    contatos.fornecedores.push(contato);
  } else if (categoria.includes('cliente')) {
    contatos.clientes.push(contato);
  } else if (categoria.includes('transportador') || categoria.includes('motorista')) {
    contatos.transportadores.push(contato);
  } else {
    contatos.outros.push(contato);
  }
}

// Salvar resultado
fs.writeFileSync('/tmp/contatos_processados.json', JSON.stringify(contatos, null, 2));

console.log(`✅ Processados ${contatos.todos.length} contatos`);
console.log(`   Fornecedores: ${contatos.fornecedores.length}`);
console.log(`   Clientes: ${contatos.clientes.length}`);
console.log(`   Transportadores: ${contatos.transportadores.length}`);
console.log(`   Outros: ${contatos.outros.length}`);
NODEJS

# Executar processamento
node /tmp/processar_contatos.js "$CSV_FILE"
echo ""

# 4. Salvar no Redis
echo "💾 [4/5] Salvando contatos no Redis..."

# Verificar se Redis está rodando
if ! redis-cli ping > /dev/null 2>&1; then
  echo "⚠️  Redis não está rodando, iniciando..."
  redis-server --daemonize yes
  sleep 2
fi

# Salvar contatos no Redis
redis-cli SET enside:contatos:processados "$(cat /tmp/contatos_processados.json)" > /dev/null
echo "✅ Contatos salvos no Redis"
echo ""

# 5. Atualizar sistema HTML
echo "🌐 [5/5] Atualizando sistema HTML..."

# Criar versão atualizada do HTML com contatos
HTML_FILE=~/ENSIDE-MASTER-v16/ENSIDE_MASTER_v19.0_INTEGRADO.html

if [ -f "$HTML_FILE" ]; then
  # Salvar HTML atualizado no Redis
  redis-cli SET enside:html:local "$(cat $HTML_FILE)" > /dev/null
  echo "✅ Sistema HTML atualizado"
else
  echo "⚠️  HTML não encontrado em $HTML_FILE"
fi

echo ""
echo "✅ SINCRONIZAÇÃO CONCLUÍDA!"
echo ""
echo "📊 Estatísticas:"
node -e "
const fs = require('fs');
const data = JSON.parse(fs.readFileSync('/tmp/contatos_processados.json'));
console.log('   Total de contatos: ' + data.todos.length);
console.log('   Fornecedores: ' + data.fornecedores.length);
console.log('   Clientes: ' + data.clientes.length);
console.log('   Transportadores: ' + data.transportadores.length);
console.log('   Outros: ' + data.outros.length);
"

echo ""
echo "🎯 Próximos passos:"
echo "   1. Verificar WhatsApp conectado: http://localhost:8080/manager"
echo "   2. Abrir sistema HTML local"
echo "   3. Criar lista de transmissão"
echo "   4. Enviar mensagens"
echo ""
