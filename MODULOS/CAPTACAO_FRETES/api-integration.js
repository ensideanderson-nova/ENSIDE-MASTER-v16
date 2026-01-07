// ========================================
// API INTEGRATION - SISTEMA DE CAPTAÇÃO DE FRETES
// ========================================

/**
 * Função para enviar captação inicial de motorista
 * @param {Object} dados - Dados do motorista {nome, whatsapp, interesseSeguro}
 * @returns {Promise<Object>} - Resultado da operação
 */
async function enviarCaptacao(dados) {
    try {
        // Validar dados
        if (!dados.nome || dados.nome.length < CAPTACAO_CONFIG.validacao.nomeMinLength) {
            throw new Error('Nome deve ter pelo menos 3 caracteres');
        }
        
        const whatsappLimpo = dados.whatsapp.replace(/\D/g, '');
        if (!CAPTACAO_CONFIG.validacao.whatsappRegex.test(whatsappLimpo)) {
            throw new Error('WhatsApp inválido');
        }
        
        // Preparar dados para envio
        const dadosEnvio = {
            tipo: 'CAPTACAO_INICIAL',
            nome: dados.nome,
            whatsapp: whatsappLimpo,
            interesseSeguro: dados.interesseSeguro || false,
            timestamp: new Date().toISOString(),
            dataHora: new Date().toLocaleString('pt-BR')
        };
        
        console.log('📤 Enviando captação:', dadosEnvio);
        
        // Enviar para Google Sheets
        const response = await fetch(CAPTACAO_CONFIG.googleScript.url, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dadosEnvio)
        });
        
        console.log('✅ Captação enviada com sucesso');
        return { success: true, dados: dadosEnvio };
        
    } catch (error) {
        console.error('❌ Erro ao enviar captação:', error);
        throw error;
    }
}

/**
 * Função para enviar proposta de frete
 * @param {Object} dados - Dados da proposta
 * @returns {Promise<Object>} - Resultado da operação
 */
async function enviarProposta(dados) {
    try {
        // Validar dados
        if (!dados.nome || dados.nome.length < CAPTACAO_CONFIG.validacao.nomeMinLength) {
            throw new Error('Nome inválido');
        }
        
        const whatsappLimpo = dados.whatsapp.replace(/\D/g, '');
        if (!CAPTACAO_CONFIG.validacao.whatsappRegex.test(whatsappLimpo)) {
            throw new Error('WhatsApp inválido');
        }
        
        if (!dados.valorProposta || dados.valorProposta < CAPTACAO_CONFIG.validacao.valorMinimo) {
            throw new Error('Valor da proposta inválido');
        }
        
        // Preparar dados para envio
        const dadosEnvio = {
            tipo: 'PROPOSTA_FRETE',
            freteId: dados.freteId,
            rota: dados.rota,
            nome: dados.nome,
            whatsapp: whatsappLimpo,
            valorProposta: parseFloat(dados.valorProposta),
            tipoVeiculo: dados.tipoVeiculo,
            disponibilidade: dados.disponibilidade,
            observacoes: dados.observacoes || '',
            timestamp: new Date().toISOString(),
            dataHora: new Date().toLocaleString('pt-BR')
        };
        
        console.log('📤 Enviando proposta:', dadosEnvio);
        
        // Enviar para Google Sheets
        const response = await fetch(CAPTACAO_CONFIG.googleScript.url, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dadosEnvio)
        });
        
        console.log('✅ Proposta enviada com sucesso');
        
        // Notificar via WhatsApp (se habilitado)
        if (CAPTACAO_CONFIG.evolution.notificacoes) {
            try {
                await notificarNovaPropostaWhatsApp(dadosEnvio);
            } catch (error) {
                console.warn('⚠️ Erro ao notificar WhatsApp:', error);
                // Não falha a operação se a notificação falhar
            }
        }
        
        return { success: true, dados: dadosEnvio };
        
    } catch (error) {
        console.error('❌ Erro ao enviar proposta:', error);
        throw error;
    }
}

/**
 * Função para notificar nova proposta via WhatsApp
 * @param {Object} proposta - Dados da proposta
 */
async function notificarNovaPropostaWhatsApp(proposta) {
    const mensagem = `🚛 *NOVA PROPOSTA DE FRETE*\n\n` +
                    `📋 ID: ${proposta.freteId}\n` +
                    `📍 Rota: ${proposta.rota}\n` +
                    `👤 Motorista: ${proposta.nome}\n` +
                    `📱 WhatsApp: ${proposta.whatsapp}\n` +
                    `💰 Valor: R$ ${proposta.valorProposta.toLocaleString('pt-BR', {minimumFractionDigits: 2})}\n` +
                    `🚚 Veículo: ${proposta.tipoVeiculo}\n` +
                    `⏰ Disponibilidade: ${proposta.disponibilidade}\n` +
                    `📝 Obs: ${proposta.observacoes || 'Nenhuma'}\n\n` +
                    `⏱️ ${proposta.dataHora}`;
    
    try {
        const numeroFormatado = CAPTACAO_CONFIG.evolution.numeroGestor + '@s.whatsapp.net';
        
        const response = await fetch(
            `${CAPTACAO_CONFIG.evolution.url}/message/sendText/${CAPTACAO_CONFIG.evolution.instance}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'apikey': CAPTACAO_CONFIG.evolution.apiKey
                },
                body: JSON.stringify({
                    number: numeroFormatado,
                    textMessage: { text: mensagem }
                })
            }
        );
        
        console.log('✅ Notificação WhatsApp enviada');
        return response;
        
    } catch (error) {
        console.error('❌ Erro ao notificar WhatsApp:', error);
        throw error;
    }
}

/**
 * Salvar dados no localStorage
 * @param {string} chave - Chave para armazenamento
 * @param {*} valor - Valor a ser armazenado
 */
function salvarLocal(chave, valor) {
    try {
        localStorage.setItem(chave, JSON.stringify(valor));
        console.log(`💾 Dados salvos: ${chave}`);
    } catch (error) {
        console.error('❌ Erro ao salvar no localStorage:', error);
    }
}

/**
 * Recuperar dados do localStorage
 * @param {string} chave - Chave para recuperação
 * @returns {*} - Valor armazenado ou null
 */
function recuperarLocal(chave) {
    try {
        const valor = localStorage.getItem(chave);
        return valor ? JSON.parse(valor) : null;
    } catch (error) {
        console.error('❌ Erro ao recuperar do localStorage:', error);
        return null;
    }
}

/**
 * Formatar número de WhatsApp
 * @param {string} numero - Número para formatar
 * @returns {string} - Número formatado
 */
function formatarWhatsApp(numero) {
    const limpo = numero.replace(/\D/g, '');
    if (limpo.length === 11) {
        return `(${limpo.substr(0, 2)}) ${limpo.substr(2, 5)}-${limpo.substr(7)}`;
    } else if (limpo.length === 10) {
        return `(${limpo.substr(0, 2)}) ${limpo.substr(2, 4)}-${limpo.substr(6)}`;
    }
    return numero;
}

/**
 * Validar WhatsApp
 * @param {string} numero - Número para validar
 * @returns {boolean} - True se válido
 */
function validarWhatsApp(numero) {
    const limpo = numero.replace(/\D/g, '');
    return CAPTACAO_CONFIG.validacao.whatsappRegex.test(limpo);
}

// Exportar funções globalmente
if (typeof window !== 'undefined') {
    window.enviarCaptacao = enviarCaptacao;
    window.enviarProposta = enviarProposta;
    window.notificarNovaPropostaWhatsApp = notificarNovaPropostaWhatsApp;
    window.salvarLocal = salvarLocal;
    window.recuperarLocal = recuperarLocal;
    window.formatarWhatsApp = formatarWhatsApp;
    window.validarWhatsApp = validarWhatsApp;
    console.log('✅ API Integration carregada!');
}
