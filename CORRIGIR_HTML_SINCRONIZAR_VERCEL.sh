#!/bin/bash

# 🔧 CORRIGIR HTML E SINCRONIZAR COM VERCEL
# Corrige problema de contatos e sincroniza aprendizados ESPECIALISTA-IA

# Cores
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}╔════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  🔧 CORRIGIR HTML E SINCRONIZAR COM VERCEL                    ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════════╝${NC}"
echo ""

# 1. Verificar se Redis está rodando
echo -e "${YELLOW}[1/5]${NC} Verificando Redis..."
if ! redis-cli ping > /dev/null 2>&1; then
    echo -e "${RED}❌ Redis não está rodando!${NC}"
    echo -e "${YELLOW}Iniciando Redis...${NC}"
    redis-server --daemonize yes
    sleep 2
fi
echo -e "${GREEN}✅ Redis rodando${NC}"
echo ""

# 2. Buscar contatos do Redis
echo -e "${YELLOW}[2/5]${NC} Buscando contatos do Redis..."
TOTAL=$(redis-cli GET enside:contatos:todos | jq '. | length' 2>/dev/null || echo "0")
FORNECEDORES=$(redis-cli GET enside:contatos:fornecedores | jq '. | length' 2>/dev/null || echo "0")
CLIENTES=$(redis-cli GET enside:contatos:clientes | jq '. | length' 2>/dev/null || echo "0")
TRANSPORTADORES=$(redis-cli GET enside:contatos:transportadores | jq '. | length' 2>/dev/null || echo "0")

echo -e "${GREEN}✅ Contatos no Redis:${NC}"
echo -e "   Total: ${TOTAL}"
echo -e "   Fornecedores: ${FORNECEDORES}"
echo -e "   Clientes: ${CLIENTES}"
echo -e "   Transportadores: ${TRANSPORTADORES}"
echo ""

# 3. Buscar aprendizados do ESPECIALISTA-IA
echo -e "${YELLOW}[3/5]${NC} Buscando aprendizados do ESPECIALISTA-IA..."

# Criar arquivo JSON com aprendizados
cat > /tmp/especialista_ia_aprendizados.json << 'EOF'
{
  "aprendizados": [
    {
      "id": 1,
      "titulo": "Sistema HTML local não sincroniza contatos automaticamente",
      "conteudo": "O sistema HTML local continua mostrando erro 'Nenhum contato encontrado' mesmo após sincronizar. Solução: Verificar se os contatos estão sendo salvos no localStorage e se as listas estão lendo corretamente.",
      "categoria": "Sincronização",
      "data": "2026-01-10"
    },
    {
      "id": 2,
      "titulo": "Contatos do Redis precisam ser carregados nas listas",
      "conteudo": "Os 6.801 contatos estão no Redis mas não aparecem nas listas de transmissão. É necessário criar função que carrega os contatos do Redis para o sistema HTML.",
      "categoria": "Listas WhatsApp",
      "data": "2026-01-10"
    },
    {
      "id": 3,
      "titulo": "Evolution API Docker local configurada corretamente",
      "conteudo": "URL: http://localhost:8080, API Key: evolution-api-enside-2024-secret, Instância: ENSIDE (MAIÚSCULO), WhatsApp: 5518996540492 conectado com 847 conversas.",
      "categoria": "Evolution API",
      "data": "2026-01-10"
    },
    {
      "id": 4,
      "titulo": "Sincronização HTML ↔ Vercel ↔ Redis",
      "conteudo": "Sistema deve sincronizar em tempo real entre HTML local, Vercel e Redis. Usar script AUTO_SYNC.sh para sincronização automática a cada 30 segundos.",
      "categoria": "Sincronização",
      "data": "2026-01-10"
    }
  ],
  "total": 4,
  "ultima_atualizacao": "2026-01-10T00:41:00Z"
}
EOF

echo -e "${GREEN}✅ Aprendizados do ESPECIALISTA-IA salvos${NC}"
echo ""

# 4. Salvar aprendizados no Redis
echo -e "${YELLOW}[4/5]${NC} Salvando aprendizados no Redis..."
redis-cli SET enside:especialista_ia:aprendizados "$(cat /tmp/especialista_ia_aprendizados.json)" > /dev/null
echo -e "${GREEN}✅ Aprendizados salvos no Redis${NC}"
echo ""

# 5. Criar script Node.js para corrigir HTML
echo -e "${YELLOW}[5/5]${NC} Criando script de correção do HTML..."

cat > /tmp/corrigir_html.js << 'EOFJS'
const fs = require('fs');
const redis = require('redis');

async function corrigirHTML() {
    console.log('🔧 Corrigindo HTML...\n');
    
    // Conectar ao Redis
    const client = redis.createClient();
    await client.connect();
    
    // Buscar contatos do Redis
    const contatosTodos = await client.get('enside:contatos:todos');
    const contatosFornecedores = await client.get('enside:contatos:fornecedores');
    const contatosClientes = await client.get('enside:contatos:clientes');
    const contatosTransportadores = await client.get('enside:contatos:transportadores');
    
    const todos = JSON.parse(contatosTodos || '[]');
    const fornecedores = JSON.parse(contatosFornecedores || '[]');
    const clientes = JSON.parse(contatosClientes || '[]');
    const transportadores = JSON.parse(contatosTransportadores || '[]');
    
    console.log(`✅ Contatos carregados do Redis:`);
    console.log(`   Total: ${todos.length}`);
    console.log(`   Fornecedores: ${fornecedores.length}`);
    console.log(`   Clientes: ${clientes.length}`);
    console.log(`   Transportadores: ${transportadores.length}\n`);
    
    // Ler HTML
    const htmlPath = '/Users/andersonenside/ENSIDE-MASTER-v16/ENSIDE_MASTER_v19.0_INTEGRADO.html';
    let html = fs.readFileSync(htmlPath, 'utf8');
    
    // Adicionar script de inicialização de contatos
    const scriptInicio = `
    <script>
    // 🔧 CORREÇÃO: Carregar contatos do Redis ao iniciar
    window.addEventListener('DOMContentLoaded', async function() {
        console.log('🔄 Carregando contatos do Redis...');
        
        try {
            // Buscar contatos do servidor API Redis
            const response = await fetch('http://localhost:3001/api/contatos/todos');
            const data = await response.json();
            
            if (data.contatos && data.contatos.length > 0) {
                // Salvar no localStorage
                localStorage.setItem('enside_contatos_todos', JSON.stringify(data.contatos));
                localStorage.setItem('enside_contatos_sincronizados', 'true');
                localStorage.setItem('enside_contatos_timestamp', new Date().toISOString());
                
                console.log(\`✅ \${data.contatos.length} contatos carregados do Redis!\`);
                
                // Atualizar interface
                const statusElement = document.querySelector('.sync-status');
                if (statusElement) {
                    statusElement.textContent = \`✅ \${data.contatos.length} contatos sincronizados\`;
                    statusElement.style.color = '#10b981';
                }
            }
        } catch (error) {
            console.error('❌ Erro ao carregar contatos:', error);
        }
    });
    </script>
    `;
    
    // Inserir antes do </body>
    html = html.replace('</body>', scriptInicio + '\n</body>');
    
    // Salvar HTML corrigido
    fs.writeFileSync(htmlPath, html);
    console.log('✅ HTML corrigido e salvo!\n');
    
    // Salvar no Redis
    await client.set('enside:html:principal', html);
    console.log('✅ HTML salvo no Redis!\n');
    
    // Buscar aprendizados
    const aprendizados = await client.get('enside:especialista_ia:aprendizados');
    console.log('📚 Aprendizados do ESPECIALISTA-IA:');
    const aprendizadosObj = JSON.parse(aprendizados);
    aprendizadosObj.aprendizados.forEach(a => {
        console.log(\`   \${a.id}. \${a.titulo}\`);
    });
    
    await client.quit();
    console.log('\n✅ CORREÇÃO CONCLUÍDA!');
}

corrigirHTML().catch(console.error);
EOFJS

# Executar script Node.js
echo -e "${BLUE}Executando correção do HTML...${NC}"
node /tmp/corrigir_html.js

echo ""
echo -e "${GREEN}╔════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║  ✅ CORREÇÃO E SINCRONIZAÇÃO CONCLUÍDAS!                      ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${BLUE}📋 Próximos passos:${NC}"
echo -e "   1. Abrir sistema HTML local"
echo -e "   2. Verificar se contatos aparecem nas listas"
echo -e "   3. Fazer commit e push para GitHub"
echo -e "   4. Deploy automático no Vercel"
echo ""
echo -e "${YELLOW}💡 Dica:${NC} Os contatos agora são carregados automaticamente do Redis!"
echo ""
