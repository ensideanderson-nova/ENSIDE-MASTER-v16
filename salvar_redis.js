/**
 * SALVAR SISTEMA ENSIDE NO REDIS
 * Script para persistir todos os dados do sistema no Redis
 */

const { createClient } = require('redis');

const REDIS_CONFIG = {
    host: 'localhost',
    port: 6379
};

// Dados do Sistema ENSIDE
const SISTEMA_ENSIDE = {
    // Configurações gerais
    config: {
        nome: 'ENSIDE MASTER v19.0',
        versao: '19.0',
        dataAtualizacao: new Date().toISOString(),
        status: 'online'
    },
    
    // Credenciais das APIs
    apis: {
        evolution: {
            url: 'https://evolution-api-latest-poc1.onrender.com',
            urlLocal: 'http://localhost:8080',
            apiKey: '919AA333-AE59-4B06-B1EF-C9A9F9C8C0F6',
            apiKeyRender: 'evolution-api-enside-2024-secret',
            instance: 'enside',
            whatsapp: '5518996540492'
        },
        groq: {
            apiKey: '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',
            model: 'llama-3.3-70b-versatile'
        },
        github: {
            token: 'Github_pat_11B2HPWRQ0jAY7HwKQQBR9_XBQOZWISGDOf45h8a0ByyrbMlfw2r3peS4J2IGNQax3HOF6FYPXFVRng6A8',
            owner: 'ensideanderson-nova',
            repo: 'ENSIDE-MASTER-v16'
        },
        googleSheets: {
            spreadsheetId: '1FiP885Or0ncyRG_ZZaAvM2vP0sHhDzhLFYifYLjKyIE',
            abas: ['CONTATOS', 'FRETES_DISPONIVEIS', 'CAPTACAO_FRETES']
        }
    },
    
    // Estatísticas
    estatisticas: {
        totalContatos: 7055,
        fornecedores: 1200,
        clientes: 2500,
        transportadores: 377,
        categorias: ['FORNECEDOR', 'CLIENTE', 'TRANSPORTADOR', 'REPRESENTANTES']
    },
    
    // Aprendizados da IA
    aprendizados: [
        { id: 1, titulo: 'Formato WhatsApp', conteudo: 'Usar formato: numero@s.whatsapp.net' },
        { id: 2, titulo: 'Preços Mourões', conteudo: 'Mourão 2,20m: R$18-25 | 2,50m: R$22-30 | 3,00m: R$28-38' },
        { id: 3, titulo: 'Preços Postes', conteudo: 'Poste 7m: R$95-120 | 9m: R$150-180 | 11m: R$220-280' },
        { id: 4, titulo: 'Tratamento CCA', conteudo: 'R$300/m³ ou R$195/st. Aumenta durabilidade 15-25 anos' },
        { id: 5, titulo: 'Frete por KM', conteudo: 'Truck: R$4-6/km | Carreta: R$3-5/km | Bitrem: R$2,50-4/km' }
    ],
    
    // URLs do sistema
    urls: {
        n8n: 'http://localhost:5678',
        workflow: 'http://localhost:5678/workflow/KYnFpUwSoQ62iDle',
        evolutionManager: 'https://evolution-api-latest-poc1.onrender.com/manager',
        googleSheets: 'https://docs.google.com/spreadsheets/d/1FiP885Or0ncyRG_ZZaAvM2vP0sHhDzhLFYifYLjKyIE',
        github: 'https://github.com/ensideanderson-nova/ENSIDE-MASTER-v16'
    }
};

async function salvarNoRedis() {
    const client = createClient({
        socket: {
            host: REDIS_CONFIG.host,
            port: REDIS_CONFIG.port
        }
    });

    client.on('error', err => console.error('Redis Error:', err));

    try {
        await client.connect();
        console.log('✅ Conectado ao Redis');

        // Salvar configurações gerais
        await client.set('enside:config', JSON.stringify(SISTEMA_ENSIDE.config));
        console.log('✅ Config salva');

        // Salvar APIs
        await client.set('enside:apis', JSON.stringify(SISTEMA_ENSIDE.apis));
        console.log('✅ APIs salvas');

        // Salvar estatísticas
        await client.set('enside:estatisticas', JSON.stringify(SISTEMA_ENSIDE.estatisticas));
        console.log('✅ Estatísticas salvas');

        // Salvar aprendizados
        await client.set('enside:aprendizados', JSON.stringify(SISTEMA_ENSIDE.aprendizados));
        console.log('✅ Aprendizados salvos');

        // Salvar URLs
        await client.set('enside:urls', JSON.stringify(SISTEMA_ENSIDE.urls));
        console.log('✅ URLs salvas');

        // Salvar sistema completo
        await client.set('enside:sistema_completo', JSON.stringify(SISTEMA_ENSIDE));
        console.log('✅ Sistema completo salvo');

        // Definir TTL de 30 dias (2592000 segundos)
        const keys = ['enside:config', 'enside:apis', 'enside:estatisticas', 'enside:aprendizados', 'enside:urls', 'enside:sistema_completo'];
        for (const key of keys) {
            await client.expire(key, 2592000);
        }
        console.log('✅ TTL de 30 dias definido para todas as chaves');

        // Verificar dados salvos
        const sistema = await client.get('enside:sistema_completo');
        console.log('\n📊 Dados salvos no Redis:');
        console.log(JSON.parse(sistema));

        console.log('\n🎉 SISTEMA ENSIDE SALVO COM SUCESSO NO REDIS!');

    } catch (error) {
        console.error('❌ Erro:', error);
    } finally {
        await client.quit();
    }
}

salvarNoRedis();
