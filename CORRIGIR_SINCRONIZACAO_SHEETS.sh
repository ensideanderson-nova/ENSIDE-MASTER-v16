#!/bin/bash

# ============================================
# SCRIPT COMPLETO: CORRIGIR SINCRONIZAÇÃO GOOGLE SHEETS
# E CRIAR LISTA DE TRANSMISSÃO WHATSAPP
# ============================================

echo ""
echo "╔════════════════════════════════════════════╗"
echo "║  🔧 CORRIGIR SINCRONIZAÇÃO GOOGLE SHEETS  ║"
echo "║     + LISTA DE TRANSMISSÃO WHATSAPP       ║"
echo "╚════════════════════════════════════════════╝"
echo ""

# ============================================
# CONFIGURAÇÕES
# ============================================
SHEETS_ID="1FiP885Or0ncyRG_ZZaAvM2vP0sHhDzhLFYifYLjKyIE"
SHEETS_URL="https://docs.google.com/spreadsheets/d/${SHEETS_ID}/gviz/tq?tqx=out:csv&sheet=CONTATOS"
EVOLUTION_URL="http://localhost:8080"
EVOLUTION_API_KEY="evolution-api-enside-2024-secret"
INSTANCE_NAME="ENSIDE"
HTML_FILE="$HOME/ENSIDE-MASTER-v16/ENSIDE_MASTER_v19.0_INTEGRADO.html"

# ============================================
# 1. BAIXAR CONTATOS DO GOOGLE SHEETS
# ============================================
echo "1️⃣  Baixando contatos do Google Sheets..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

TEMP_CSV="/tmp/contatos_enside.csv"

curl -s -L "$SHEETS_URL" -o "$TEMP_CSV"

if [ ! -f "$TEMP_CSV" ]; then
    echo "❌ Erro ao baixar planilha"
    exit 1
fi

TOTAL_LINHAS=$(wc -l < "$TEMP_CSV")
echo "✅ Planilha baixada: $TOTAL_LINHAS linhas"

# ============================================
# 2. PROCESSAR CONTATOS E CRIAR JSON
# ============================================
echo ""
echo "2️⃣  Processando contatos..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Criar arquivo JSON com contatos
cat > /tmp/processar_contatos.js << 'JSEOF'
const fs = require('fs');
const csv = fs.readFileSync('/tmp/contatos_enside.csv', 'utf-8');

const linhas = csv.split('\n').slice(1); // Pular cabeçalho
const contatos = [];

linhas.forEach(linha => {
    if (!linha.trim()) return;
    
    const colunas = linha.split(',');
    const nome = colunas[0] || 'Sem Nome';
    const telefone = colunas[1] || '';
    const categoria = colunas[2] || 'outros';
    
    if (telefone && telefone.match(/\d{10,}/)) {
        // Formatar número WhatsApp
        let numero = telefone.replace(/\D/g, '');
        if (!numero.startsWith('55')) numero = '55' + numero;
        
        contatos.push({
            nome: nome.replace(/"/g, ''),
            telefone: numero,
            whatsapp: numero + '@s.whatsapp.net',
            categoria: categoria.toLowerCase()
        });
    }
});

// Separar por categoria
const fornecedores = contatos.filter(c => c.categoria.includes('fornecedor'));
const clientes = contatos.filter(c => c.categoria.includes('cliente'));
const transportadores = contatos.filter(c => c.categoria.includes('transport'));
const outros = contatos.filter(c => !['fornecedor', 'cliente', 'transport'].some(cat => c.categoria.includes(cat)));

const resultado = {
    total: contatos.length,
    fornecedores: fornecedores,
    clientes: clientes,
    transportadores: transportadores,
    outros: outros,
    todos: contatos
};

fs.writeFileSync('/tmp/contatos_processados.json', JSON.stringify(resultado, null, 2));

console.log(`✅ Total de contatos: ${contatos.length}`);
console.log(`   📊 Fornecedores: ${fornecedores.length}`);
console.log(`   👥 Clientes: ${clientes.length}`);
console.log(`   🚚 Transportadores: ${transportadores.length}`);
console.log(`   📋 Outros: ${outros.length}`);
JSEOF

# Executar processamento
cd ~/ENSIDE-MASTER-v16
node /tmp/processar_contatos.js

if [ ! -f "/tmp/contatos_processados.json" ]; then
    echo "❌ Erro ao processar contatos"
    exit 1
fi

# ============================================
# 3. ATUALIZAR HTML COM CONTATOS
# ============================================
echo ""
echo "3️⃣  Atualizando sistema HTML..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Criar backup
cp "$HTML_FILE" "$HTML_FILE.backup.$(date +%Y%m%d_%H%M%S)"

# Injetar contatos no HTML
cat > /tmp/injetar_contatos.js << 'JSEOF2'
const fs = require('fs');

const html = fs.readFileSync(process.env.HOME + '/ENSIDE-MASTER-v16/ENSIDE_MASTER_v19.0_INTEGRADO.html', 'utf-8');
const contatos = JSON.parse(fs.readFileSync('/tmp/contatos_processados.json', 'utf-8'));

// Procurar onde injetar os contatos (antes do </script> final)
const marcador = '// CONTATOS_SINCRONIZADOS_PLACEHOLDER';
const contatosJS = `
// ============================================
// CONTATOS SINCRONIZADOS DO GOOGLE SHEETS
// Atualizado em: ${new Date().toLocaleString('pt-BR')}
// ============================================
const CONTATOS_SINCRONIZADOS = ${JSON.stringify(contatos, null, 2)};

// Função para carregar contatos sincronizados
function carregarContatosSincronizados() {
    console.log('✅ Contatos carregados do cache:', CONTATOS_SINCRONIZADOS.total);
    return CONTATOS_SINCRONIZADOS;
}

// Substituir função antiga de buscar do Google Sheets
window.CONTATOS_ENSIDE = CONTATOS_SINCRONIZADOS;
`;

let htmlAtualizado;
if (html.includes(marcador)) {
    // Substituir marcador existente
    htmlAtualizado = html.replace(new RegExp(marcador + '[\\s\\S]*?(?=</script>)'), contatosJS);
} else {
    // Adicionar antes do último </script>
    const ultimoScript = html.lastIndexOf('</script>');
    htmlAtualizado = html.slice(0, ultimoScript) + contatosJS + '\n' + html.slice(ultimoScript);
}

fs.writeFileSync(process.env.HOME + '/ENSIDE-MASTER-v16/ENSIDE_MASTER_v19.0_INTEGRADO.html', htmlAtualizado);
console.log('✅ HTML atualizado com contatos sincronizados');
JSEOF2

node /tmp/injetar_contatos.js

echo "✅ Sistema HTML atualizado"

# ============================================
# 4. VERIFICAR EVOLUTION API
# ============================================
echo ""
echo "4️⃣  Verificando Evolution API..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

STATUS=$(curl -s "$EVOLUTION_URL/instance/connectionState/$INSTANCE_NAME" \
    -H "apikey: $EVOLUTION_API_KEY" | grep -o '"state":"[^"]*' | cut -d'"' -f4)

if [ "$STATUS" = "open" ]; then
    echo "✅ WhatsApp conectado"
else
    echo "⚠️  WhatsApp desconectado (status: $STATUS)"
    echo "   Abra: http://localhost:8080/manager"
    echo "   E conecte o WhatsApp antes de enviar mensagens"
fi

# ============================================
# 5. MENU DE LISTAS
# ============================================
echo ""
echo "5️⃣  Selecione a lista para transmissão:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "1) 🏭 Fornecedores"
echo "2) 👥 Clientes"
echo "3) 🚚 Transportadores"
echo "4) 📋 Todos os contatos"
echo "5) 🧪 Teste (5 contatos)"
echo "0) ❌ Cancelar"
echo ""
read -p "Escolha uma opção: " OPCAO

case $OPCAO in
    1) LISTA="fornecedores" ;;
    2) LISTA="clientes" ;;
    3) LISTA="transportadores" ;;
    4) LISTA="todos" ;;
    5) LISTA="teste" ;;
    0) echo "❌ Cancelado"; exit 0 ;;
    *) echo "❌ Opção inválida"; exit 1 ;;
esac

# ============================================
# 6. CRIAR LISTA DE TRANSMISSÃO
# ============================================
echo ""
echo "6️⃣  Criando lista de transmissão..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Extrair contatos da lista selecionada
cat > /tmp/criar_lista.js << JSEOF3
const fs = require('fs');
const contatos = JSON.parse(fs.readFileSync('/tmp/contatos_processados.json', 'utf-8'));

let lista;
if ('$LISTA' === 'teste') {
    lista = contatos.todos.slice(0, 5);
} else {
    lista = contatos['$LISTA'] || [];
}

const numeros = lista.map(c => c.whatsapp);
console.log(\`✅ Lista "$LISTA" criada: \${numeros.length} contatos\`);

fs.writeFileSync('/tmp/lista_transmissao.json', JSON.stringify({
    nome: '$LISTA',
    total: numeros.length,
    numeros: numeros,
    contatos: lista
}, null, 2));
JSEOF3

node /tmp/criar_lista.js

# ============================================
# 7. SOLICITAR MENSAGEM
# ============================================
echo ""
echo "7️⃣  Digite a mensagem para envio:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
read -p "Mensagem: " MENSAGEM

if [ -z "$MENSAGEM" ]; then
    echo "❌ Mensagem vazia. Cancelado."
    exit 1
fi

# ============================================
# 8. CONFIRMAÇÃO
# ============================================
TOTAL=$(node -p "JSON.parse(require('fs').readFileSync('/tmp/lista_transmissao.json')).total")

echo ""
echo "╔════════════════════════════════════════════╗"
echo "║  ⚠️  CONFIRMAÇÃO DE ENVIO                 ║"
echo "╠════════════════════════════════════════════╣"
echo "║                                            ║"
echo "║  Lista: $LISTA"
echo "║  Total: $TOTAL contatos"
echo "║  Mensagem: $MENSAGEM"
echo "║                                            ║"
echo "╚════════════════════════════════════════════╝"
echo ""
read -p "Confirma o envio? (s/N): " CONFIRMA

if [ "$CONFIRMA" != "s" ] && [ "$CONFIRMA" != "S" ]; then
    echo "❌ Envio cancelado"
    exit 0
fi

# ============================================
# 9. ENVIAR MENSAGENS
# ============================================
echo ""
echo "9️⃣  Enviando mensagens..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

cat > /tmp/enviar_mensagens.js << 'JSEOF4'
const https = require('http');
const fs = require('fs');

const lista = JSON.parse(fs.readFileSync('/tmp/lista_transmissao.json'));
const mensagem = process.argv[2];

const EVOLUTION_URL = 'localhost';
const EVOLUTION_PORT = 8080;
const EVOLUTION_API_KEY = 'evolution-api-enside-2024-secret';
const INSTANCE_NAME = 'ENSIDE';
const INTERVALO = 20000; // 20 segundos entre mensagens

let enviados = 0;
let erros = 0;

async function enviarMensagem(numero, index) {
    return new Promise((resolve) => {
        const data = JSON.stringify({
            number: numero.replace('@s.whatsapp.net', ''),
            text: mensagem
        });

        const options = {
            hostname: EVOLUTION_URL,
            port: EVOLUTION_PORT,
            path: `/message/sendText/${INSTANCE_NAME}`,
            method: 'POST',
            headers: {
                'apikey': EVOLUTION_API_KEY,
                'Content-Type': 'application/json',
                'Content-Length': data.length
            }
        };

        const req = https.request(options, (res) => {
            let body = '';
            res.on('data', chunk => body += chunk);
            res.on('end', () => {
                if (res.statusCode === 200 || res.statusCode === 201) {
                    enviados++;
                    console.log(`✅ [${index + 1}/${lista.total}] ${numero}`);
                } else {
                    erros++;
                    console.log(`❌ [${index + 1}/${lista.total}] ${numero} - Erro: ${res.statusCode}`);
                }
                resolve();
            });
        });

        req.on('error', (error) => {
            erros++;
            console.log(`❌ [${index + 1}/${lista.total}] ${numero} - ${error.message}`);
            resolve();
        });

        req.write(data);
        req.end();
    });
}

async function enviarTodos() {
    console.log(`🚀 Iniciando envio para ${lista.total} contatos...\n`);
    
    for (let i = 0; i < lista.numeros.length; i++) {
        await enviarMensagem(lista.numeros[i], i);
        
        if (i < lista.numeros.length - 1) {
            await new Promise(resolve => setTimeout(resolve, INTERVALO));
        }
    }
    
    console.log('\n╔════════════════════════════════════════════╗');
    console.log('║  ✅ ENVIO CONCLUÍDO                       ║');
    console.log('╠════════════════════════════════════════════╣');
    console.log(`║  Enviados: ${enviados}`);
    console.log(`║  Erros: ${erros}`);
    console.log(`║  Total: ${lista.total}`);
    console.log('╚════════════════════════════════════════════╝');
}

enviarTodos();
JSEOF4

node /tmp/enviar_mensagens.js "$MENSAGEM"

echo ""
echo "✅ Processo concluído!"
echo ""
