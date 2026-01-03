const fs = require('fs');
require('dotenv').config();

console.log('🧪 Testando configuração de IA - ENSIDE...\n');

// Verificar chaves
const checks = [
    { name: 'Claude API', key: process.env.CLAUDE_API_KEY },
    { name: 'Google Maps', key: process.env.GOOGLE_MAPS_API_KEY },
    { name: 'Evolution API URL', key: process.env.EVOLUTION_API_URL },
    { name: 'Evolution API Key', key: process.env.EVOLUTION_API_KEY },
    { name: 'GitHub App ID', key: process.env.GITHUB_APP_ID },
    { name: 'Google Sheets ID', key: process.env.GOOGLE_SHEETS_ID },
];

let configured = 0;
let missing = 0;

checks.forEach(check => {
    if (check.key && check.key !== 'sua-chave-aqui' && !check.key.includes('example')) {
        console.log(`✅ ${check.name}: Configurado`);
        configured++;
    } else {
        console.log(`⚠️  ${check.name}: Não configurado`);
        missing++;
    }
});

console.log('\n📊 Resumo:');
console.log(`   Configurados: ${configured}`);
console.log(`   Faltando: ${missing}`);

// Verificar MCPs
console.log('\n🔧 MCPs disponíveis:');
if (fs.existsSync('mcp-config.json')) {
    const mcpConfig = JSON.parse(fs.readFileSync('mcp-config.json', 'utf8'));
    const mcps = Object.keys(mcpConfig.mcpServers || {});
    mcps.forEach(mcp => {
        console.log(`   ✅ ${mcp}`);
    });
    console.log(`   Total: ${mcps.length} MCPs`);
} else {
    console.log('   ⚠️  mcp-config.json não encontrado');
}

// Resultado final
console.log('\n' + '═'.repeat(60));
if (configured >= 3) {
    console.log('✅ Sistema ENSIDE de IA está configurado e pronto!');
} else {
    console.log('⚠️  Sistema parcialmente configurado');
    console.log('   Configure as chaves faltantes no arquivo .env');
}
console.log('═'.repeat(60) + '\n');
