/**
 * API INTEGRATION - SISTEMA DE CAPTAÇÃO DE FRETES
 * ENSIDE Anderson Logística
 * Integração com Google Sheets e Evolution API
 */

const CAPTACAO_API = {
    
    /**
     * ========================================
     * GOOGLE SHEETS INTEGRATION
     * ========================================
     */
    
    // Buscar dados de uma aba do Google Sheets
    async buscarDadosSheet(nomeAba) {
        try {
            const config = CAPTACAO_FRETES_CONFIG.googleSheets;
            const url = `https://docs.google.com/spreadsheets/d/${config.spreadsheetId}/gviz/tq?tqx=out:json&sheet=${nomeAba}`;
            
            const response = await fetch(url);
            const text = await response.text();
            
            // Remove o prefixo do Google e converte para JSON
            const jsonText = text.substring(47).slice(0, -2);
            const data = JSON.parse(jsonText);
            
            // Processar dados
            const rows = data.table.rows || [];
            const colunas = data.table.cols || [];
            
            const resultado = rows.map(row => {
                const obj = {};
                row.c.forEach((cell, index) => {
                    const colLabel = colunas[index]?.label || `col_${index}`;
                    obj[colLabel] = cell?.v || '';
                });
                return obj;
            });
            
            console.log(`✅ Dados carregados da aba ${nomeAba}:`, resultado.length, 'registros');
            return resultado;
            
        } catch (error) {
            console.error(`❌ Erro ao buscar dados da aba ${nomeAba}:`, error);
            return [];
        }
    },

    // Buscar fretes disponíveis
    async buscarFretesDisponiveis() {
        return await this.buscarDadosSheet('FRETES_DISPONIVEIS');
    },

    // Buscar propostas de motoristas
    async buscarPropostas() {
        return await this.buscarDadosSheet('PROPOSTAS_MOTORISTAS');
    },

    // Buscar rotas preferidas
    async buscarRotasPreferidas() {
        return await this.buscarDadosSheet('ROTAS_PREFERIDAS');
    },

    /**
     * ========================================
     * EVOLUTION API - WHATSAPP
     * ========================================
     */
    
    // Enviar mensagem WhatsApp
    async enviarWhatsApp(numero, mensagem) {
        try {
            const config = CAPTACAO_FRETES_CONFIG.evolutionAPI;
            const numeroFormatado = CAPTACAO_FRETES_CONFIG.utils.formatarWhatsApp(numero);
            
            const response = await fetch(`${config.url}/message/sendText/${config.instance}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'apikey': config.apiKey
                },
                body: JSON.stringify({
                    number: numeroFormatado,
                    textMessage: {
                        text: mensagem
                    }
                })
            });

            const data = await response.json();
            console.log('✅ Mensagem WhatsApp enviada:', numeroFormatado);
            return { sucesso: true, data };
            
        } catch (error) {
            console.error('❌ Erro ao enviar mensagem WhatsApp:', error);
            return { sucesso: false, erro: error.message };
        }
    },

    // Notificar admin sobre nova proposta
    async notificarAdminNovaProposta(proposta) {
        const mensagem = `
🆕 *NOVA PROPOSTA RECEBIDA*

📦 *Frete:* ${proposta.idFrete}
👤 *Motorista:* ${proposta.nome}
📱 *WhatsApp:* ${proposta.whatsapp}
💰 *Valor Proposto:* ${CAPTACAO_FRETES_CONFIG.utils.formatarMoeda(proposta.valorProposto)}
📅 *Data:* ${proposta.dataProposta}

${proposta.observacoes ? `📝 *Observações:* ${proposta.observacoes}` : ''}

🔗 Acesse o painel para visualizar e responder.
        `.trim();

        return await this.enviarWhatsApp(
            CAPTACAO_FRETES_CONFIG.evolutionAPI.whatsappNumber,
            mensagem
        );
    },

    // Notificar motorista sobre novo frete
    async notificarMotoristaNovoFrete(motorista, frete) {
        const mensagem = `
🚚 *NOVO FRETE DISPONÍVEL NA SUA ROTA*

📍 *Origem:* ${frete.origemCidade}/${frete.origemUF}
📍 *Destino:* ${frete.destinoCidade}/${frete.destinoUF}
📏 *Distância:* ${frete.km} km
🚛 *Veículo:* ${frete.tipoVeiculo}
💰 *Valor Sugerido:* ${CAPTACAO_FRETES_CONFIG.utils.formatarMoeda(frete.valorSugerido)}

🔗 Acesse o sistema para fazer sua proposta:
[LINK DO SISTEMA]

_Anderson Enside Logística_
        `.trim();

        return await this.enviarWhatsApp(motorista.whatsapp, mensagem);
    },

    // Notificar motorista sobre status da proposta
    async notificarStatusProposta(motorista, proposta, status) {
        const statusEmoji = {
            'APROVADA': '✅',
            'RECUSADA': '❌',
            'NEGOCIANDO': '💬'
        };

        const mensagem = `
${statusEmoji[status]} *ATUALIZAÇÃO DA SUA PROPOSTA*

📦 *Frete:* ${proposta.idFrete}
📊 *Status:* ${status}
💰 *Valor Proposto:* ${CAPTACAO_FRETES_CONFIG.utils.formatarMoeda(proposta.valorProposto)}

${status === 'APROVADA' ? '🎉 Parabéns! Sua proposta foi aprovada!' : ''}
${status === 'NEGOCIANDO' ? '💬 O admin está interessado! Aguarde contato.' : ''}

_Anderson Enside Logística_
        `.trim();

        return await this.enviarWhatsApp(motorista.whatsapp, mensagem);
    },

    /**
     * ========================================
     * MATCHING AUTOMÁTICO DE ROTAS
     * ========================================
     */
    
    // Buscar motoristas com rota preferida compatível
    async buscarMotoristasCompativeis(frete) {
        try {
            const rotasPreferidas = await this.buscarRotasPreferidas();
            
            const motoristasCompativeis = rotasPreferidas.filter(rota => {
                // Verificar se a rota preferida é compatível com o frete
                const origemMatch = rota.ORIGEM_UF === frete.origemUF || 
                                   rota.ORIGEM_CIDADE?.toLowerCase() === frete.origemCidade?.toLowerCase();
                const destinoMatch = rota.DESTINO_UF === frete.destinoUF || 
                                    rota.DESTINO_CIDADE?.toLowerCase() === frete.destinoCidade?.toLowerCase();
                
                return (origemMatch && destinoMatch) && rota.ATIVO === 'SIM';
            });

            console.log(`🎯 Encontrados ${motoristasCompativeis.length} motoristas compatíveis para o frete`);
            return motoristasCompativeis;
            
        } catch (error) {
            console.error('❌ Erro ao buscar motoristas compatíveis:', error);
            return [];
        }
    },

    // Notificar motoristas compatíveis sobre novo frete
    async notificarMotoristasCompativeis(frete) {
        try {
            const motoristas = await this.buscarMotoristasCompativeis(frete);
            const notificacoes = [];

            for (const motorista of motoristas) {
                const resultado = await this.notificarMotoristaNovoFrete(motorista, frete);
                notificacoes.push({
                    motorista: motorista.NOME_MOTORISTA,
                    whatsapp: motorista.WHATSAPP,
                    sucesso: resultado.sucesso
                });
            }

            console.log(`✅ ${notificacoes.filter(n => n.sucesso).length}/${notificacoes.length} notificações enviadas`);
            return notificacoes;
            
        } catch (error) {
            console.error('❌ Erro ao notificar motoristas:', error);
            return [];
        }
    },

    /**
     * ========================================
     * ANÁLISE DE IA DAS PROPOSTAS
     * ========================================
     */
    
    // Analisar proposta com IA
    async analisarPropostaIA(proposta, frete) {
        try {
            // Calcular score baseado em vários fatores
            let score = 50; // Score base
            
            // Fator 1: Comparação com valor sugerido
            const diferencaPercentual = ((proposta.valorProposto - frete.valorSugerido) / frete.valorSugerido) * 100;
            
            if (diferencaPercentual <= 0) {
                score += 30; // Proposta igual ou menor que sugerido
            } else if (diferencaPercentual <= 5) {
                score += 20; // 5% acima
            } else if (diferencaPercentual <= 10) {
                score += 10; // 10% acima
            } else {
                score -= 10; // Mais de 10% acima
            }

            // Fator 2: Histórico do motorista (simulado por enquanto)
            // TODO: Implementar análise real do histórico quando disponível
            
            // Fator 3: Rapidez da resposta
            // Se a proposta foi feita rápido, é um bom sinal
            const horasDesdePublicacao = Math.random() * 24; // Simular
            if (horasDesdePublicacao < 2) {
                score += 10;
            }

            // Normalizar score (0-100)
            score = Math.max(0, Math.min(100, score));

            // Gerar análise textual
            let analise = '';
            if (score >= 80) {
                analise = '⭐⭐⭐ EXCELENTE - Proposta muito competitiva e motorista responsivo';
            } else if (score >= 60) {
                analise = '⭐⭐ BOA - Proposta dentro do esperado';
            } else if (score >= 40) {
                analise = '⭐ REGULAR - Proposta acima do valor de mercado';
            } else {
                analise = '❌ BAIXA - Proposta não competitiva';
            }

            analise += ` | Diferença: ${diferencaPercentual.toFixed(1)}% do valor sugerido`;

            return {
                score,
                analise,
                recomendacao: score >= 60 ? 'APROVAR' : score >= 40 ? 'NEGOCIAR' : 'RECUSAR'
            };
            
        } catch (error) {
            console.error('❌ Erro na análise de IA:', error);
            return {
                score: 0,
                analise: 'Erro na análise',
                recomendacao: 'REVISAR_MANUAL'
            };
        }
    },

    /**
     * ========================================
     * STORAGE LOCAL (Simulação até integração com backend)
     * ========================================
     */
    
    // Salvar dados no localStorage
    salvarLocal(chave, dados) {
        try {
            localStorage.setItem(`captacao_fretes_${chave}`, JSON.stringify(dados));
            console.log(`✅ Dados salvos localmente: ${chave}`);
            return true;
        } catch (error) {
            console.error('❌ Erro ao salvar dados localmente:', error);
            return false;
        }
    },

    // Carregar dados do localStorage
    carregarLocal(chave) {
        try {
            const dados = localStorage.getItem(`captacao_fretes_${chave}`);
            return dados ? JSON.parse(dados) : null;
        } catch (error) {
            console.error('❌ Erro ao carregar dados localmente:', error);
            return null;
        }
    },

    // Salvar frete
    salvarFrete(frete) {
        const fretes = this.carregarLocal('fretes') || [];
        fretes.push(frete);
        return this.salvarLocal('fretes', fretes);
    },

    // Salvar proposta
    salvarProposta(proposta) {
        const propostas = this.carregarLocal('propostas') || [];
        propostas.push(proposta);
        return this.salvarLocal('propostas', propostas);
    },

    // Salvar rota preferida
    salvarRotaPreferida(rota) {
        const rotas = this.carregarLocal('rotas_preferidas') || [];
        rotas.push(rota);
        return this.salvarLocal('rotas_preferidas', rotas);
    },

    // Carregar fretes
    carregarFretes() {
        return this.carregarLocal('fretes') || [];
    },

    // Carregar propostas
    carregarPropostas() {
        return this.carregarLocal('propostas') || [];
    },

    // Carregar rotas preferidas
    carregarRotasPreferidas() {
        return this.carregarLocal('rotas_preferidas') || [];
    }
};

// Exportar para uso global
if (typeof window !== 'undefined') {
    window.CAPTACAO_API = CAPTACAO_API;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = CAPTACAO_API;
}

console.log('✅ API de Captação de Fretes carregada');
