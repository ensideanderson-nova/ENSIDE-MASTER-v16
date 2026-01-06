#!/usr/bin/env node
/**
 * ENSIDE MASTER v19.0 - SISTEMA COMPLETO NO REDIS
 * Este script salva TODO o sistema no Redis e permite executá-lo de lá
 * 
 * COMO USAR:
 * 1. Salvar no Redis: node SISTEMA_REDIS_COMPLETO.js salvar
 * 2. Executar do Redis: node SISTEMA_REDIS_COMPLETO.js executar
 * 3. Ver status: node SISTEMA_REDIS_COMPLETO.js status
 */

const { createClient } = require('redis');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

// Configuração Redis
const REDIS_CONFIG = {
    host: 'localhost',
    port: 6379
};

// Chave principal do sistema
const CHAVE_SISTEMA = 'enside:sistema_executavel';

async function conectarRedis() {
    const client = createClient({
        socket: {
            host: REDIS_CONFIG.host,
            port: REDIS_CONFIG.port
        }
    });
    await client.connect();
    return client;
}

// ==================== SALVAR SISTEMA NO REDIS ====================
async function salvarSistemaNoRedis() {
    console.log('\n🔄 Salvando SISTEMA COMPLETO no Redis...');
    
    const client = await conectarRedis();
    const pastaBase = __dirname;
    
    // Arquivos principais para salvar
    const arquivos = {
        html_principal: 'ENSIDE_MASTER_v19.0_INTEGRADO.html',
        index: 'index.html',
        config: 'CONFIG/credenciais.json',
        env: '.env'
    };
    
    const sistemaCompleto = {
        versao: '19.0',
        nome: 'ENSIDE MASTER',
        dataBackup: new Date().toISOString(),
        arquivos: {},
        config: {
            evolution: {
                url: 'https://evolution-api-latest-poc1.onrender.com',
                apiKey: '919AA333-AE59-4B06-B1EF-C9A9F9C8C0F6',
                instancia: 'enside'
            },
            groq: {
                apiKey: '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'
            },
            redis: {
                host: 'localhost',
                port: 6379
            },
            n8n: {
                url: 'http://localhost:5678',
                workflow: 'http://localhost:5678/workflow/KYnFpUwSoQ62iDle'
            },
            googleSheets: {
                id: '1FiP885Or0ncyRG_ZZaAvM2vP0sHhDzhLFYifYLjKyIE',
                url: 'https://docs.google.com/spreadsheets/d/1FiP885Or0ncyRG_ZZaAvM2vP0sHhDzhLFYifYLjKyIE'
            },
            github: {
                repo: 'ensideanderson-nova/ENSIDE-MASTER-v16',
                url: 'https://github.com/ensideanderson-nova/ENSIDE-MASTER-v16'
            }
        },
        estatisticas: {
            contatos: 7055,
            fornecedores: 1200,
            transportadores: 377,
            clientes: 2500
        },
        categorias: ['FORNECEDOR', 'CLIENTE', 'TRANSPORTADOR', 'REPRESENTANTES'],
        aprendizados: [
            { id: 1, titulo: 'Formato WhatsApp', conteudo: 'Usar formato: numero@s.whatsapp.net' },
            { id: 2, titulo: 'Preços Mourões', conteudo: 'Mourão 2,20m: R$18-25 | 2,50m: R$22-30 | 3,00m: R$28-38' },
            { id: 3, titulo: 'Preços Postes', conteudo: 'Poste 7m: R$95-120 | 9m: R$150-180 | 11m: R$220-280' },
            { id: 4, titulo: 'Tratamento CCA', conteudo: 'R$300/m³ ou R$195/st. Durabilidade 15-25 anos' },
            { id: 5, titulo: 'Frete por KM', conteudo: 'Truck: R$4-6/km | Carreta: R$3-5/km | Bitrem: R$2,50-4/km' }
        ]
    };
    
    // Ler e salvar arquivos principais
    for (const [nome, arquivo] of Object.entries(arquivos)) {
        const caminhoCompleto = path.join(pastaBase, arquivo);
        if (fs.existsSync(caminhoCompleto)) {
            const conteudo = fs.readFileSync(caminhoCompleto, 'utf8');
            sistemaCompleto.arquivos[nome] = {
                nome: arquivo,
                conteudo: conteudo,
                tamanho: conteudo.length
            };
            console.log(`   ✅ ${arquivo} (${conteudo.length} bytes)`);
        }
    }
    
    // Salvar no Redis
    await client.set(CHAVE_SISTEMA, JSON.stringify(sistemaCompleto));
    
    // Salvar também as chaves individuais
    await client.set('enside:html', sistemaCompleto.arquivos.html_principal?.conteudo || '');
    await client.set('enside:config_json', JSON.stringify(sistemaCompleto.config));
    await client.set('enside:estatisticas', JSON.stringify(sistemaCompleto.estatisticas));
    await client.set('enside:aprendizados', JSON.stringify(sistemaCompleto.aprendizados));
    
    console.log('\n✅ SISTEMA COMPLETO SALVO NO REDIS!');
    console.log(`   Chave principal: ${CHAVE_SISTEMA}`);
    console.log(`   Tamanho total: ${JSON.stringify(sistemaCompleto).length} bytes`);
    
    await client.quit();
}

// ==================== EXECUTAR SISTEMA DO REDIS ====================
async function executarDoRedis() {
    console.log('\n🚀 Executando SISTEMA do Redis...');
    
    const client = await conectarRedis();
    
    // Buscar sistema do Redis
    const sistemaJSON = await client.get(CHAVE_SISTEMA);
    
    if (!sistemaJSON) {
        console.log('❌ Sistema não encontrado no Redis!');
        console.log('   Execute primeiro: node SISTEMA_REDIS_COMPLETO.js salvar');
        await client.quit();
        return;
    }
    
    const sistema = JSON.parse(sistemaJSON);
    console.log(`\n📦 Sistema encontrado: ${sistema.nome} v${sistema.versao}`);
    console.log(`   Backup de: ${sistema.dataBackup}`);
    
    // Criar arquivo temporário com o HTML
    const tempDir = '/tmp/enside_redis';
    if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir, { recursive: true });
    }
    
    const htmlPath = path.join(tempDir, 'ENSIDE_MASTER_v19.0_INTEGRADO.html');
    
    if (sistema.arquivos.html_principal) {
        fs.writeFileSync(htmlPath, sistema.arquivos.html_principal.conteudo);
        console.log(`\n✅ HTML extraído para: ${htmlPath}`);
        
        // Abrir no navegador
        console.log('\n🌐 Abrindo no Firefox...');
        exec(`open -a Firefox "file://${htmlPath}"`);
        
        console.log('\n╔════════════════════════════════════════════════════════════╗');
        console.log('║  🎉 SISTEMA EXECUTADO DO REDIS COM SUCESSO!                ║');
        console.log('╠════════════════════════════════════════════════════════════╣');
        console.log('║  O sistema foi carregado do Redis e aberto no Firefox      ║');
        console.log('║  Arquivo temporário: /tmp/enside_redis/                     ║');
        console.log('╚════════════════════════════════════════════════════════════╝');
    } else {
        console.log('❌ HTML não encontrado no backup!');
    }
    
    await client.quit();
}

// ==================== VER STATUS ====================
async function verStatus() {
    console.log('\n📊 STATUS DO SISTEMA NO REDIS');
    console.log('═'.repeat(60));
    
    const client = await conectarRedis();
    
    // Listar todas as chaves enside:
    const chaves = await client.keys('enside:*');
    console.log(`\n🔑 Chaves encontradas: ${chaves.length}`);
    
    for (const chave of chaves) {
        const tipo = await client.type(chave);
        let tamanho = 0;
        
        if (tipo === 'string') {
            const valor = await client.get(chave);
            tamanho = valor ? valor.length : 0;
        }
        
        console.log(`   ${chave} (${tipo}) - ${tamanho} bytes`);
    }
    
    // Verificar sistema executável
    const sistemaJSON = await client.get(CHAVE_SISTEMA);
    if (sistemaJSON) {
        const sistema = JSON.parse(sistemaJSON);
        console.log('\n📦 SISTEMA EXECUTÁVEL:');
        console.log(`   Nome: ${sistema.nome} v${sistema.versao}`);
        console.log(`   Backup: ${sistema.dataBackup}`);
        console.log(`   Arquivos: ${Object.keys(sistema.arquivos).length}`);
        console.log(`   Contatos: ${sistema.estatisticas.contatos}`);
        console.log(`   Fornecedores: ${sistema.estatisticas.fornecedores}`);
        console.log(`   Transportadores: ${sistema.estatisticas.transportadores}`);
    } else {
        console.log('\n⚠️  Sistema executável NÃO encontrado no Redis');
        console.log('   Execute: node SISTEMA_REDIS_COMPLETO.js salvar');
    }
    
    console.log('\n' + '═'.repeat(60));
    await client.quit();
}

// ==================== MAIN ====================
async function main() {
    const comando = process.argv[2] || 'status';
    
    console.log('╔════════════════════════════════════════════════════════════╗');
    console.log('║     🌲 ENSIDE MASTER v19.0 - SISTEMA NO REDIS              ║');
    console.log('╚════════════════════════════════════════════════════════════╝');
    
    switch (comando) {
        case 'salvar':
            await salvarSistemaNoRedis();
            break;
        case 'executar':
            await executarDoRedis();
            break;
        case 'status':
            await verStatus();
            break;
        default:
            console.log('\n📋 COMANDOS DISPONÍVEIS:');
            console.log('   node SISTEMA_REDIS_COMPLETO.js salvar   - Salva sistema no Redis');
            console.log('   node SISTEMA_REDIS_COMPLETO.js executar - Executa sistema do Redis');
            console.log('   node SISTEMA_REDIS_COMPLETO.js status   - Ver status no Redis');
    }
}

main().catch(console.error);
