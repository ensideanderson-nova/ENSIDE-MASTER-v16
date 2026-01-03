/**
 * CONFIGURAÇÃO EVOLUTION API - ENSIDE SISTEMA
 * Servidor hospedado no Render
 */

const EVOLUTION_CONFIG = {
    // URL da API via ngrok (expõe localhost:8080)
    apiUrl: 'https://isa-unawed-marquetta.ngrok-free.dev',
    
    // Chave de autenticação
    apiKey: '919AA333-AE59-4B06-B1EF-C9A9F9C8C0F6',
    
    // Nome da instância
    instanceName: 'enside',
    
    // WhatsApp conectado
    whatsappNumber: '5518996540492',
    
    // Webhook URL (Vercel)
    webhookUrl: 'https://enside-sistema.vercel.app/api/webhook',
    
    // Database (PostgreSQL no Render)
    database: {
        provider: 'postgresql',
        url: 'postgresql://enside_evolution_db_user:8zdmCeHn1qj3moiCCb4r6rJl5ygFuXzP@dpg-d58npdn5r7bs738r1ft0-a.internal/enside_evolution_db'
    },
    
    // Função para testar conexão
    async testarConexao() {
        try {
            const response = await fetch(`${this.apiUrl}/instance/connectionState/${this.instanceName}`, {
                headers: {
                    'apikey': this.apiKey
                }
            });
            const data = await response.json();
            console.log('✅ Evolution API conectada:', data);
            return { sucesso: true, data };
        } catch (error) {
            console.error('❌ Erro ao conectar Evolution API:', error);
            return { sucesso: false, erro: error.message };
        }
    },
    
    // Função para enviar mensagem
    async enviarMensagem(numero, mensagem) {
        try {
            const response = await fetch(`${this.apiUrl}/message/sendText/${this.instanceName}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'apikey': this.apiKey
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
    async gerarQRCode() {
        try {
            const response = await fetch(`${this.apiUrl}/instance/connect/${this.instanceName}`, {
                headers: {
                    'apikey': this.apiKey
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
    }
};

// Exportar para uso global
if (typeof window !== 'undefined') {
    window.EVOLUTION_CONFIG = EVOLUTION_CONFIG;
}

console.log('✅ Evolution API Config carregado - URL:', EVOLUTION_CONFIG.apiUrl);
