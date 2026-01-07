// ========================================
// CONFIGURAÇÃO - SISTEMA DE CAPTAÇÃO DE FRETES
// ========================================

const CAPTACAO_CONFIG = {
    // Google Apps Script
    googleScript: {
        url: 'https://script.google.com/macros/s/AKfycbzlXB43ZA83ZT98KAypV4EEmsyxslyXB1Ya8_b6TtwH9xSZunZhzS0ZcZiDKqUtEsT3/exec',
        sheetId: '1FiP885Or0ncyRG_ZZaAvM2vP0sHhDzhLFYifYLjKyIE',
        abas: {
            captacao: 'CAPTACAO_FRETES',
            propostas: 'PROPOSTAS_FRETES'
        }
    },
    
    // Evolution API (WhatsApp)
    evolution: {
        url: 'https://evolution-api-latest-poc1.onrender.com',
        apiKey: 'evolution-api-enside-2024-secret',
        instance: 'enside',
        notificacoes: true,
        numeroGestor: '5518996540492'
    },
    
    // URLs do sistema
    urls: {
        sistemaPrincipal: '../ENSIDE_MASTER_v19.0_INTEGRADO.html',
        fretesDisponiveis: 'fretes_disponiveis.html',
        landing: 'landing_captacao.html'
    },
    
    // Validações
    validacao: {
        whatsappRegex: /^[0-9]{10,11}$/,
        nomeMinLength: 3,
        valorMinimo: 100
    },
    
    // Dados de fretes disponíveis
    fretesDisponiveis: [
        {
            id: 'FRT001',
            origem: 'Curitiba/PR',
            destino: 'São Paulo/SP',
            distancia: 408,
            tipoVeiculo: 'Carreta',
            valor: 2850,
            tipoCarga: 'Madeira',
            peso: '25t',
            observacoes: 'Carga de pinus. Descarga em SP Capital.'
        },
        {
            id: 'FRT002',
            origem: 'Tubarão/SC',
            destino: 'Rio de Janeiro/RJ',
            distancia: 920,
            tipoVeiculo: 'Carreta',
            valor: 5200,
            tipoCarga: 'Compensados',
            peso: '28t',
            observacoes: 'Compensados navais. Prioridade alta.'
        },
        {
            id: 'FRT003',
            origem: 'Porto Alegre/RS',
            destino: 'São Paulo/SP',
            distancia: 1109,
            tipoVeiculo: 'Bitrem',
            valor: 4800,
            tipoCarga: 'Grãos',
            peso: '40t',
            observacoes: 'Soja ensacada. Descarga em terminal.'
        },
        {
            id: 'FRT004',
            origem: 'São Paulo/SP',
            destino: 'Belo Horizonte/MG',
            distancia: 586,
            tipoVeiculo: 'Truck',
            valor: 1800,
            tipoCarga: 'Eletrônicos',
            peso: '12t',
            observacoes: 'Carga de alto valor. Rastreamento obrigatório.'
        },
        {
            id: 'FRT005',
            origem: 'Belo Horizonte/MG',
            destino: 'Rio de Janeiro/RJ',
            distancia: 434,
            tipoVeiculo: 'Carreta',
            valor: 2200,
            tipoCarga: 'Bebidas',
            peso: '22t',
            observacoes: 'Cerveja em paletes. Cuidado na descarga.'
        },
        {
            id: 'FRT006',
            origem: 'Curitiba/PR',
            destino: 'Porto Alegre/RS',
            distancia: 711,
            tipoVeiculo: 'Rodotrem',
            valor: 3500,
            tipoCarga: 'Cimento',
            peso: '50t',
            observacoes: 'Cimento ensacado. Descarregamento com empilhadeira.'
        }
    ]
};

// Exportar configuração globalmente
if (typeof window !== 'undefined') {
    window.CAPTACAO_CONFIG = CAPTACAO_CONFIG;
    console.log('✅ Configuração de Captação de Fretes carregada!');
    console.log('📊 Fretes disponíveis:', CAPTACAO_CONFIG.fretesDisponiveis.length);
}
