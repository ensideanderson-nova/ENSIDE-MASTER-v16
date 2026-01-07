/**
 * CONFIGURAÇÃO CENTRAL - SISTEMA DE CAPTAÇÃO DE FRETES
 * Anderson Enside Logística
 * Integração completa: Google Sheets + Evolution API + WhatsApp
 * Atualizado: 07/01/2026
 */

const CAPTACAO_CONFIG = {
    // ==================== GOOGLE SHEETS ====================
    googleSheets: {
        spreadsheetId: '1FiP885Or0ncyRG_ZZaAvM2vP0sHhDzhLFYifYLjKyIE',
        nome: 'EUCALIPTO-13-12-25-_SISTEMA_INTEGRADO_COMPLETO',
        url: 'https://docs.google.com/spreadsheets/d/1FiP885Or0ncyRG_ZZaAvM2vP0sHhDzhLFYifYLjKyIE',
        
        abas: {
            // Abas existentes
            contatos: { 
                nome: 'CONTATOS', 
                gid: '1689968688',
                colunas: ['TIMESTAMP', 'NOME', 'WHATSAPP', 'ORIGEM', 'TIPO_CONTATO', 'STATUS']
            },
            fretesDisponiveis: { 
                nome: 'FRETES_DISPONIVEIS', 
                gid: '1716433489',
                colunas: ['ID', 'STATUS', 'URGENTE', 'ORIGEM_UF', 'ORIGEM_CIDADE', 'DESTINO_UF', 
                         'DESTINO_CIDADE', 'DISTANCIA_KM', 'VALOR_SUGERIDO', 'VALOR_POR_KM', 
                         'TIPO_VEICULO', 'TIPO_CARGA', 'PESO_TON', 'DATA_EMBARQUE', 'OBSERVACOES', 
                         'VAGAS', 'VISUALIZACOES', 'PROPOSTAS', 'CRIADO_EM', 'ATUALIZADO_EM']
            },
            captacaoFretes: { 
                nome: 'CAPTACAO_FRETES', 
                gid: '1707733664',
                colunas: ['TIMESTAMP', 'NOME_COMPLETO', 'WHATSAPP', 'INTERESSE_SEGURO', 'ORIGEM', 'STATUS']
            },
            listasTransmissao: { 
                nome: 'LISTAS_TRANSMISSAO', 
                gid: '1114979046',
                colunas: ['NOME_LISTA', 'NUMEROS_WHATSAPP', 'TOTAL', 'CRIADO_EM']
            },
            
            // Novas abas a criar
            rotasPreferidas: { 
                nome: 'ROTAS_PREFERIDAS_MOTORISTAS',
                colunas: ['ID', 'MOTORISTA_NOME', 'MOTORISTA_WHATSAPP', 'ORIGEM_CIDADE', 'ORIGEM_UF', 
                         'ORIGEM_FLEXIVEL', 'DESTINO_CIDADE', 'DESTINO_UF', 'DESTINO_FLEXIVEL', 
                         'RAIO_KM', 'TIPO_VEICULO', 'TIPOS_CARGA', 'CAPACIDADE_TON', 'VALOR_MINIMO', 
                         'DIAS_SEMANA', 'DISPONIBILIDADE', 'NOTIFICAR_WHATSAPP', 'STATUS', 
                         'CRIADO_EM', 'ATUALIZADO_EM']
            },
            propostasFretes: { 
                nome: 'PROPOSTAS_FRETES',
                colunas: ['ID', 'FRETE_ID', 'MOTORISTA_NOME', 'MOTORISTA_WHATSAPP', 'ROTA', 
                         'VALOR_SUGERIDO', 'VALOR_PROPOSTA', 'DESCONTO_PCT', 'VEICULO_PLACA', 
                         'VEICULO_TIPO', 'DISPONIBILIDADE', 'OBSERVACOES', 'STATUS', 
                         'MOTIVO_RECUSA', 'DATA_PROPOSTA', 'DATA_RESPOSTA', 'TEMPO_RESPOSTA_H']
            }
        }
    },
    
    // ==================== GOOGLE APPS SCRIPT ====================
    googleAppsScript: {
        // URL será atualizada após deploy do Apps Script
        url: 'https://script.google.com/macros/s/SEU_SCRIPT_ID/exec',
        timeout: 30000, // 30 segundos
        retries: 3
    },
    
    // ==================== EVOLUTION API ====================
    evolution: {
        url: 'https://evolution-api-latest-poc1.onrender.com',
        apiKey: 'evolution-api-enside-2024-secret',
        instance: 'enside',
        whatsapp: '5518996540492',
        notificacoes: true,
        timeout: 10000
    },
    
    // ==================== URLs DO SISTEMA ====================
    urls: {
        sistemaPrincipal: '../../ENSIDE_MASTER_v19.0_INTEGRADO.html',
        
        // Admin
        adminCadastroFretes: 'ADMIN/admin_cadastro_fretes.html',
        adminPropostas: 'ADMIN/admin_propostas_recebidas.html',
        adminRotas: 'ADMIN/admin_rotas_preferidas.html',
        
        // Motoristas
        landing: 'MOTORISTAS/landing_captacao.html',
        fretes: 'MOTORISTAS/fretes_disponiveis.html',
        propostas: 'MOTORISTAS/minhas_propostas.html',
        rotas: 'MOTORISTAS/minhas_rotas_preferidas.html'
    },
    
    // ==================== VALIDAÇÕES ====================
    validacao: {
        whatsappRegex: /^[0-9]{10,11}$/,
        nomeMinLength: 3,
        nomeMaxLength: 100,
        valorMinimo: 100,
        valorMaximo: 999999,
        distanciaMinima: 1,
        distanciaMaxima: 5000,
        pesoMinimo: 0.1,
        pesoMaximo: 100
    },
    
    // ==================== TIPOS DE VEÍCULOS ====================
    tiposVeiculo: [
        'Carreta',
        'Truck',
        'Bitrem',
        'Rodotrem',
        'Toco',
        'VUC',
        'Outro'
    ],
    
    // ==================== TIPOS DE CARGA ====================
    tiposCarga: [
        'Carga Seca',
        'Granel',
        'Refrigerada',
        'Perecível',
        'Perigosa',
        'Frágil',
        'Líquida',
        'Madeira',
        'Eucalipto',
        'Outra'
    ],
    
    // ==================== STATUS ====================
    status: {
        fretes: ['ATIVO', 'INATIVO', 'FECHADO', 'CANCELADO'],
        propostas: ['AGUARDANDO', 'ACEITA', 'RECUSADA', 'CANCELADA'],
        rotas: ['ATIVA', 'PAUSADA', 'INATIVA']
    },
    
    // ==================== DISPONIBILIDADES ====================
    disponibilidades: [
        'Imediata',
        'Hoje',
        'Amanhã',
        'Esta Semana',
        'Próxima Semana',
        'A Combinar'
    ],
    
    // ==================== DIAS DA SEMANA ====================
    diasSemana: [
        'Segunda',
        'Terça',
        'Quarta',
        'Quinta',
        'Sexta',
        'Sábado',
        'Domingo'
    ],
    
    // ==================== ESTADOS BRASILEIROS ====================
    estados: {
        'AC': 'Acre',
        'AL': 'Alagoas',
        'AP': 'Amapá',
        'AM': 'Amazonas',
        'BA': 'Bahia',
        'CE': 'Ceará',
        'DF': 'Distrito Federal',
        'ES': 'Espírito Santo',
        'GO': 'Goiás',
        'MA': 'Maranhão',
        'MT': 'Mato Grosso',
        'MS': 'Mato Grosso do Sul',
        'MG': 'Minas Gerais',
        'PA': 'Pará',
        'PB': 'Paraíba',
        'PR': 'Paraná',
        'PE': 'Pernambuco',
        'PI': 'Piauí',
        'RJ': 'Rio de Janeiro',
        'RN': 'Rio Grande do Norte',
        'RS': 'Rio Grande do Sul',
        'RO': 'Rondônia',
        'RR': 'Roraima',
        'SC': 'Santa Catarina',
        'SP': 'São Paulo',
        'SE': 'Sergipe',
        'TO': 'Tocantins'
    },
    
    // ==================== DESIGN SYSTEM ====================
    design: {
        cores: {
            primaria: '#FFD700',        // Dourado
            secundaria: '#10b981',      // Verde
            background: '#0a0a0a',
            backgroundSecundario: '#1a1a2e',
            texto: '#ffffff',
            textoSecundario: '#94a3b8',
            urgente: '#dc2626',
            urgenteGradiente: 'linear-gradient(135deg, #dc2626 0%, #f59e0b 100%)',
            sucesso: '#10b981',
            erro: '#ef4444',
            aviso: '#f59e0b',
            info: '#3b82f6'
        },
        
        breakpoints: {
            mobile: '640px',
            tablet: '768px',
            laptop: '1024px',
            desktop: '1280px'
        },
        
        animacoes: {
            transicao: '0.3s ease',
            hover: 'transform 0.2s ease, box-shadow 0.2s ease'
        }
    },
    
    // ==================== MENSAGENS WHATSAPP ====================
    mensagensWhatsApp: {
        boasVindas: (nome) => `🎉 *Bem-vindo(a), ${nome}!*\n\n` +
            `Você acaba de se cadastrar no *Sistema de Captação de Fretes* da *Anderson Enside Logística*! 🚚\n\n` +
            `Agora você tem acesso a:\n` +
            `✅ Fretes disponíveis em tempo real\n` +
            `✅ Sistema de propostas inteligente\n` +
            `✅ Cadastro de rotas preferidas\n` +
            `✅ Notificações de fretes compatíveis\n\n` +
            `👉 Acesse agora e comece a faturar mais!`,
        
        novaProposta: (motorista, rota, valor) => `🚚 *NOVA PROPOSTA RECEBIDA!*\n\n` +
            `*Motorista:* ${motorista}\n` +
            `*Rota:* ${rota}\n` +
            `*Valor Proposto:* R$ ${valor}\n\n` +
            `👉 Acesse o painel administrativo para avaliar!`,
        
        propostaAceita: (motorista, rota, valor) => `✅ *PROPOSTA ACEITA!*\n\n` +
            `Parabéns, ${motorista}! 🎉\n\n` +
            `Sua proposta para a rota *${rota}* foi aceita!\n` +
            `*Valor:* R$ ${valor}\n\n` +
            `Em breve entraremos em contato com os detalhes do embarque.`,
        
        propostaRecusada: (motorista, rota, motivo) => `❌ *Proposta não aceita*\n\n` +
            `Olá ${motorista},\n\n` +
            `Infelizmente sua proposta para a rota *${rota}* não foi aceita.\n` +
            `*Motivo:* ${motivo}\n\n` +
            `Não desanime! Continue acompanhando nossos fretes disponíveis.`,
        
        freteCompativel: (motorista, rota, valor) => `🔥 *FRETE COMPATÍVEL ENCONTRADO!*\n\n` +
            `Olá ${motorista}!\n\n` +
            `Encontramos um frete que combina com suas rotas preferidas:\n` +
            `*Rota:* ${rota}\n` +
            `*Valor Sugerido:* R$ ${valor}\n\n` +
            `👉 Acesse o sistema e faça sua proposta agora!`
    },
    
    // ==================== LOCALSTORAGE KEYS ====================
    localStorageKeys: {
        motorista: 'captacao_motorista_dados',
        ultimoAcesso: 'captacao_ultimo_acesso',
        filtros: 'captacao_filtros',
        cache: 'captacao_cache'
    },
    
    // ==================== CACHE CONFIG ====================
    cache: {
        tempoExpiracao: 300000, // 5 minutos
        maxItems: 100
    },
    
    // ==================== UTILIDADES ====================
    utils: {
        // Formatar número WhatsApp
        formatarWhatsApp(numero) {
            return numero.replace(/\D/g, '');
        },
        
        // Formatar moeda
        formatarMoeda(valor) {
            return new Intl.NumberFormat('pt-BR', { 
                style: 'currency', 
                currency: 'BRL' 
            }).format(valor);
        },
        
        // Formatar data
        formatarData(data) {
            return new Date(data).toLocaleDateString('pt-BR');
        },
        
        // Formatar data/hora
        formatarDataHora(data) {
            return new Date(data).toLocaleString('pt-BR');
        },
        
        // Calcular diferença de tempo
        calcularTempoDecorrido(dataInicio) {
            const diff = Date.now() - new Date(dataInicio).getTime();
            const horas = Math.floor(diff / 3600000);
            const dias = Math.floor(horas / 24);
            
            if (dias > 0) return `${dias}d`;
            if (horas > 0) return `${horas}h`;
            return 'agora';
        },
        
        // Calcular desconto percentual
        calcularDesconto(valorOriginal, valorProposto) {
            return ((valorOriginal - valorProposto) / valorOriginal * 100).toFixed(1);
        },
        
        // Gerar ID único
        gerarId() {
            return Date.now().toString(36) + Math.random().toString(36).substr(2);
        },
        
        // Validar WhatsApp
        validarWhatsApp(numero) {
            const limpo = numero.replace(/\D/g, '');
            return /^[0-9]{10,11}$/.test(limpo);
        },
        
        // Validar valor
        validarValor(valor) {
            const num = parseFloat(valor);
            return !isNaN(num) && num >= CAPTACAO_CONFIG.validacao.valorMinimo;
        },
        
        // Sanitizar texto
        sanitizarTexto(texto) {
            return texto.trim().replace(/[<>]/g, '');
        }
    }
};

// ==================== EXPORTAR ====================
if (typeof window !== 'undefined') {
    window.CAPTACAO_CONFIG = CAPTACAO_CONFIG;
    console.log('✅ CAPTAÇÃO CONFIG carregado');
    console.log('📊 Planilha:', CAPTACAO_CONFIG.googleSheets.nome);
    console.log('📱 WhatsApp:', CAPTACAO_CONFIG.evolution.whatsapp);
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = CAPTACAO_CONFIG;
}
