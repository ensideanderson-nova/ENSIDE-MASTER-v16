// ========================================
// ENSIDE SISTEMA - INTEGRAÇÃO COMPLETA
// Token GitHub + Evolution API + Google Sheets
// ========================================

const ENSIDE_CONFIG = {
    // GitHub
    github: {
        token: 'Github_pat_11B2HPWRQ0jAY7HwKQQBR9_XBQOZWISGDOf45h8a0ByyrbMlfw2r3peS4J2IGNQax3HOF6FYPXFVRng6A8',
        owner: 'ensideanderson-nova',
        repo: 'ENSIDE-MASTER-v16',
        branch: 'main'
    },
    // Evolution API
    evolution: {
        url: 'https://evolution-api-latest-poc1.onrender.com',
        apiKey: 'evolution-api-enside-2024-secret',
        instance: 'enside',
        webhook: 'https://enside-sistema.vercel.app/api/webhook'
    },
    // Google Sheets
    sheets: {
        id: '1FiP885Or0ncyRG_ZZaAvM2vP0sHhDzhLFYifYLjKyIE',
        abas: ['FRETES_DISPONIVEIS', 'CAPTACAO_FRETES', 'CONTATOS']
    },
    // WhatsApp
    whatsapp: {
        numero: '5518996540492'
    }
};

// Funções de API
const ENSIDE_API = {
    // GitHub API
    async github(endpoint, method = 'GET', body = null) {
        const options = {
            method,
            headers: {
                'Authorization': 'Bearer ' + ENSIDE_CONFIG.github.token,
                'Accept': 'application/vnd.github.v3+json',
                'Content-Type': 'application/json'
            }
        };
        if (body) options.body = JSON.stringify(body);
        return fetch('https://api.github.com' + endpoint, options).then(r => r.json());
    },
    
    // Evolution API
    async evolution(endpoint, method = 'GET', body = null) {
        const options = {
            method,
            headers: {
                'apikey': ENSIDE_CONFIG.evolution.apiKey,
                'Content-Type': 'application/json'
            }
        };
        if (body) options.body = JSON.stringify(body);
        return fetch(ENSIDE_CONFIG.evolution.url + endpoint, options).then(r => r.json());
    },
    
    // Enviar WhatsApp
    async enviarWhatsApp(numero, mensagem) {
        return this.evolution('/message/sendText/' + ENSIDE_CONFIG.evolution.instance, 'POST', {
            number: numero,
            textMessage: { text: mensagem }
        });
    },
    
    // Google Sheets
    async sheets(aba) {
        const url = 'https://docs.google.com/spreadsheets/d/' + ENSIDE_CONFIG.sheets.id + '/gviz/tq?tqx=out:json&sheet=' + aba;
        return fetch(url).then(r => r.text()).then(t => JSON.parse(t.substr(47).slice(0,-2)));
    }
};

// Exportar globalmente
window.ENSIDE_CONFIG = ENSIDE_CONFIG;
window.ENSIDE_API = ENSIDE_API;
console.log('✅ ENSIDE Sistema Integrado - Todas as APIs configuradas!');
console.log('📦 GitHub:', ENSIDE_CONFIG.github.repo);
console.log('📱 WhatsApp:', ENSIDE_CONFIG.whatsapp.numero);
console.log('📊 Sheets:', ENSIDE_CONFIG.sheets.id);
