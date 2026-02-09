/**
 * CONFIGURAÇÃO EVOLUTION API - ENSIDE SISTEMA
 * 3 Ambientes disponíveis
 * Atualizado: 03/01/2026
 */

const EVOLUTION_CONFIG = {
    
    // ==================== AMBIENTE 1: RENDER (PRODUÇÃO) ====================
    render: {
        apiUrl: 'https://evolution-api-enside.onrender.com',
        apiKey: 'evolution-api-enside-2024-secret',
        instanceName: 'ENSIDE',
        managerUrl: 'https://evolution-api-enside.onrender.com/manager'
    },
    
    // ==================== AMBIENTE 2: LOCAL (DOCKER) ====================
    local: {
        apiUrl: 'http://localhost:8080',
        apiKey: 'B6D711FCDE4D4FD5936544120E713976',
        instanceName: 'enside-whatsapp',
        managerUrl: 'http://localhost:8080/manager/enside-whatsapp'
    },
    
    // ==================== AMBIENTE 3: VERCEL (FRONTEND) ====================
    vercel: {
        url: 'https://enside-sistema.vercel.app',
        webhookUrl: 'https://enside-sistema.vercel.app/api/webhook'
    },
    
    // ==================== CONFIGURAÇÃO ATIVA ====================
    ambienteAtivo: 'local',
    
    // WhatsApp conectado
    whatsappNumber: '5518996540492',
    
    // Retorna config do ambiente ativo
    getConfig() {
        return this[this.ambienteAtivo];
    },
    
    // Função para testar conexão
    async testarConexao(ambiente = null) {
        const config = ambiente ? this[ambiente] : this.getConfig();
        try {
            const response = await fetch(`${config.apiUrl}/instance/connectionState/${config.instanceName}`, {
                headers: {
                    'apikey': config.apiKey
                }
            });
            const data = await response.json();
            console.log(`✅ Evolution API (${ambiente || this.ambienteAtivo}) conectada:`, data);
            return { sucesso: true, data, ambiente: ambiente || this.ambienteAtivo };
        } catch (error) {
            console.error(`❌ Erro ao conectar Evolution API (${ambiente || this.ambienteAtivo}):`, error);
            return { sucesso: false, erro: error.message };
        }
    },
    
    // Função para enviar mensagem
    async enviarMensagem(numero, mensagem, ambiente = null) {
        const config = ambiente ? this[ambiente] : this.getConfig();
        try {
            const response = await fetch(`${config.apiUrl}/message/sendText/${config.instanceName}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'apikey': config.apiKey
                },
                body: JSON.stringify({
                    number: numero,
                    textMessage: { text: mensagem }
                })
            });
            const data = await response.json();
            console.log('✅ Mensagem enviada:', data);
            return { sucesso: true, data };
        } catch (error) {
            console.error('❌ Erro ao enviar mensagem:', error);
            return { sucesso: false, erro: error.message };
        }
    },
    
    // Função para gerar QR Code
    async gerarQRCode(ambiente = null) {
        const config = ambiente ? this[ambiente] : this.getConfig();
        try {
            const response = await fetch(`${config.apiUrl}/instance/connect/${config.instanceName}`, {
                headers: {
                    'apikey': config.apiKey
                }
            });
            const data = await response.json();
            if (data.qrcode) {
                console.log('✅ QR Code gerado');
                return { sucesso: true, qrcode: data.qrcode.base64 };
            }
            return { sucesso: false, erro: 'QR Code não disponível' };
        } catch (error) {
            console.error('❌ Erro ao gerar QR Code:', error);
            return { sucesso: false, erro: error.message };
        }
    },
    
    // Testar todos os ambientes
    async testarTodos() {
        console.log('🔍 Testando todos os ambientes...');
        const resultados = {
            local: await this.testarConexao('local'),
            render: await this.testarConexao('render')
        };
        console.log('📊 Resultados:', resultados);
        return resultados;
    }
};

// Exportar para uso global
if (typeof window !== 'undefined') {
    window.EVOLUTION_CONFIG = EVOLUTION_CONFIG;
}

if (typeof module !== 'undefined') {
    module.exports = EVOLUTION_CONFIG;
}

console.log('✅ Evolution API Config carregado');
console.log('   Ambiente ativo:', EVOLUTION_CONFIG.ambienteAtivo);
console.log('   URL:', EVOLUTION_CONFIG.getConfig().apiUrl);
