/**
 * CONFIGURAÇÃO - SISTEMA DE CAPTAÇÃO DE FRETES
 * ENSIDE Anderson Logística
 * Integração com Google Sheets
 */

const CAPTACAO_FRETES_CONFIG = {
    // Google Sheets
    googleSheets: {
        spreadsheetId: '1FiP885Or0ncyRG_ZZaAvM2vP0sHhDzhLFYifYLjKyIE',
        spreadsheetUrl: 'https://docs.google.com/spreadsheets/d/1FiP885Or0ncyRG_ZZaAvM2vP0sHhDzhLFYifYLjKyIE/edit',
        abas: {
            FRETES_DISPONIVEIS: {
                nome: 'FRETES_DISPONIVEIS',
                gid: '1716433489',
                colunas: {
                    A: 'ID',
                    B: 'ORIGEM_UF',
                    C: 'ORIGEM_CIDADE',
                    D: 'DESTINO_UF',
                    E: 'DESTINO_CIDADE',
                    F: 'KM',
                    G: 'TIPO_VEICULO',
                    H: 'CAPACIDADE',
                    I: 'VALOR_SUGERIDO',
                    J: 'DATA_CADASTRO',
                    K: 'STATUS',
                    L: 'ADMIN_RESPONSAVEL'
                }
            },
            PROPOSTAS_MOTORISTAS: {
                nome: 'PROPOSTAS_MOTORISTAS',
                gid: '0',
                colunas: {
                    A: 'ID_PROPOSTA',
                    B: 'ID_FRETE',
                    C: 'NOME_MOTORISTA',
                    D: 'WHATSAPP',
                    E: 'VALOR_PROPOSTO',
                    F: 'DATA_PROPOSTA',
                    G: 'STATUS',
                    H: 'OBSERVACOES',
                    I: 'ANALISE_IA',
                    J: 'SCORE_IA'
                }
            },
            ROTAS_PREFERIDAS: {
                nome: 'ROTAS_PREFERIDAS',
                gid: '0',
                colunas: {
                    A: 'ID_ROTA',
                    B: 'NOME_MOTORISTA',
                    C: 'WHATSAPP',
                    D: 'ORIGEM_UF',
                    E: 'ORIGEM_CIDADE',
                    F: 'DESTINO_UF',
                    G: 'DESTINO_CIDADE',
                    H: 'FREQUENCIA',
                    I: 'DATA_CADASTRO',
                    J: 'ATIVO'
                }
            },
            CAPTACAO_FRETES: {
                nome: 'CAPTACAO_FRETES',
                gid: '1707733664',
                colunas: {
                    A: 'Timestamp',
                    B: 'Nome Completo',
                    C: 'WhatsApp',
                    D: 'Interesse Seguro',
                    E: 'Rota Preferida 1',
                    F: 'Rota Preferida 2',
                    G: 'Rota Preferida 3'
                }
            }
        }
    },

    // Evolution API Configuration
    evolutionAPI: {
        url: 'https://evolution-api-latest-poc1.onrender.com',
        apiKey: 'evolution-api-enside-2024-secret',
        instance: 'ENSIDE',
        whatsappNumber: '5518996540492'
    },

    // Design Configuration
    theme: {
        colors: {
            primary: '#FFD700',      // Dourado
            secondary: '#10b981',    // Verde
            dark: '#0a0a0a',         // Fundo escuro
            darkAlt: '#1a1a2e',      // Fundo alternativo
            text: '#ffffff',
            textMuted: '#94a3b8'
        },
        gradient: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%)',
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    },

    // Status Options
    status: {
        fretes: {
            DISPONIVEL: 'Disponível',
            EM_NEGOCIACAO: 'Em Negociação',
            FECHADO: 'Fechado',
            CANCELADO: 'Cancelado'
        },
        propostas: {
            PENDENTE: 'Pendente',
            APROVADA: 'Aprovada',
            RECUSADA: 'Recusada',
            NEGOCIANDO: 'Negociando'
        }
    },

    // Vehicle Types
    tiposVeiculo: [
        'Carreta',
        'Bitrem',
        'Rodotrem',
        'Truck',
        'Toco',
        'VUC',
        'Outro'
    ],

    // Brazilian States
    estados: [
        { uf: 'AC', nome: 'Acre' },
        { uf: 'AL', nome: 'Alagoas' },
        { uf: 'AP', nome: 'Amapá' },
        { uf: 'AM', nome: 'Amazonas' },
        { uf: 'BA', nome: 'Bahia' },
        { uf: 'CE', nome: 'Ceará' },
        { uf: 'DF', nome: 'Distrito Federal' },
        { uf: 'ES', nome: 'Espírito Santo' },
        { uf: 'GO', nome: 'Goiás' },
        { uf: 'MA', nome: 'Maranhão' },
        { uf: 'MT', nome: 'Mato Grosso' },
        { uf: 'MS', nome: 'Mato Grosso do Sul' },
        { uf: 'MG', nome: 'Minas Gerais' },
        { uf: 'PA', nome: 'Pará' },
        { uf: 'PB', nome: 'Paraíba' },
        { uf: 'PR', nome: 'Paraná' },
        { uf: 'PE', nome: 'Pernambuco' },
        { uf: 'PI', nome: 'Piauí' },
        { uf: 'RJ', nome: 'Rio de Janeiro' },
        { uf: 'RN', nome: 'Rio Grande do Norte' },
        { uf: 'RS', nome: 'Rio Grande do Sul' },
        { uf: 'RO', nome: 'Rondônia' },
        { uf: 'RR', nome: 'Roraima' },
        { uf: 'SC', nome: 'Santa Catarina' },
        { uf: 'SP', nome: 'São Paulo' },
        { uf: 'SE', nome: 'Sergipe' },
        { uf: 'TO', nome: 'Tocantins' }
    ],

    // Utility Functions
    utils: {
        gerarIdFrete() {
            const timestamp = Date.now();
            const random = Math.floor(Math.random() * 1000);
            return `FRETE${timestamp}${random}`;
        },

        gerarIdProposta() {
            const timestamp = Date.now();
            const random = Math.floor(Math.random() * 1000);
            return `PROP${timestamp}${random}`;
        },

        gerarIdRota() {
            const timestamp = Date.now();
            const random = Math.floor(Math.random() * 1000);
            return `ROTA${timestamp}${random}`;
        },

        formatarData(data = new Date()) {
            return data.toLocaleDateString('pt-BR') + ' ' + data.toLocaleTimeString('pt-BR');
        },

        formatarMoeda(valor) {
            return new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL'
            }).format(valor);
        },

        formatarWhatsApp(numero) {
            // Remove caracteres não numéricos
            numero = numero.replace(/\D/g, '');
            
            // Adiciona código do país se não tiver
            if (!numero.startsWith('55')) {
                numero = '55' + numero;
            }
            
            return numero;
        },

        calcularValorTotal(km, valorPorKm) {
            return km * valorPorKm;
        }
    }
};

// Exportar para uso global
if (typeof window !== 'undefined') {
    window.CAPTACAO_FRETES_CONFIG = CAPTACAO_FRETES_CONFIG;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = CAPTACAO_FRETES_CONFIG;
}

console.log('✅ Configuração de Captação de Fretes carregada');
