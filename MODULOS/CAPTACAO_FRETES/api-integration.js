/**
 * API INTEGRATION - SISTEMA DE CAPTAÇÃO DE FRETES
 * Anderson Enside Logística
 * Funções de integração com Google Sheets + Evolution API
 * Atualizado: 07/01/2026
 */

// ==================== CLASSE PRINCIPAL ====================
class CaptacaoAPI {
    constructor() {
        this.config = window.CAPTACAO_CONFIG;
        this.cache = new Map();
        this.loading = false;
    }
    
    // ==================== GOOGLE SHEETS ====================
    
    /**
     * Função genérica para enviar dados ao Google Apps Script
     */
    async enviarParaSheets(tipo, dados) {
        try {
            this.loading = true;
            
            const payload = {
                tipo: tipo,
                dados: dados,
                timestamp: new Date().toISOString()
            };
            
            const response = await fetch(this.config.googleAppsScript.url, {
                method: 'POST',
                mode: 'no-cors',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });
            
            // No-cors mode não retorna resposta legível
            console.log('✅ Dados enviados para Google Sheets:', tipo);
            return { sucesso: true, tipo, dados };
            
        } catch (erro) {
            console.error('❌ Erro ao enviar para Google Sheets:', erro);
            throw erro;
        } finally {
            this.loading = false;
        }
    }
    
    /**
     * Buscar dados do Google Sheets via query
     */
    async buscarDoSheets(aba) {
        try {
            const cacheKey = `sheets_${aba}`;
            const cached = this.getCacheValido(cacheKey);
            if (cached) return cached;
            
            const url = `https://docs.google.com/spreadsheets/d/${this.config.googleSheets.spreadsheetId}/gviz/tq?tqx=out:json&sheet=${aba}`;
            
            const response = await fetch(url);
            const text = await response.text();
            const json = JSON.parse(text.substr(47).slice(0, -2));
            
            const dados = this.parseSheetData(json);
            this.setCache(cacheKey, dados);
            
            return dados;
            
        } catch (erro) {
            console.error(`❌ Erro ao buscar aba ${aba}:`, erro);
            return [];
        }
    }
    
    /**
     * Parse dos dados do Google Sheets
     */
    parseSheetData(json) {
        try {
            const rows = json.table.rows;
            const cols = json.table.cols;
            
            return rows.map(row => {
                const obj = {};
                row.c.forEach((cell, index) => {
                    const colLabel = cols[index].label || `col_${index}`;
                    obj[colLabel] = cell ? cell.v : null;
                });
                return obj;
            });
        } catch (erro) {
            console.error('❌ Erro ao fazer parse dos dados:', erro);
            return [];
        }
    }
    
    // ==================== CAPTAÇÃO INICIAL ====================
    
    /**
     * Salvar motorista na aba CAPTACAO_FRETES
     */
    async salvarCaptacao(dados) {
        const dadosFormatados = {
            TIMESTAMP: new Date().toISOString(),
            NOME_COMPLETO: this.config.utils.sanitizarTexto(dados.nome),
            WHATSAPP: this.config.utils.formatarWhatsApp(dados.whatsapp),
            INTERESSE_SEGURO: dados.interesseSeguro || 'Não',
            ORIGEM: dados.origem || 'Web',
            STATUS: 'ATIVO'
        };
        
        // Salvar no localStorage
        this.salvarMotoristaLocal(dadosFormatados);
        
        // Enviar para Google Sheets
        const resultado = await this.enviarParaSheets('CAPTACAO_INICIAL', dadosFormatados);
        
        // Enviar boas-vindas via WhatsApp
        if (this.config.evolution.notificacoes) {
            await this.notificarWhatsApp({
                numero: dadosFormatados.WHATSAPP,
                mensagem: this.config.mensagensWhatsApp.boasVindas(dadosFormatados.NOME_COMPLETO)
            });
        }
        
        return resultado;
    }
    
    // ==================== FRETES ====================
    
    /**
     * Salvar frete na aba FRETES_DISPONIVEIS
     */
    async salvarFrete(dados) {
        const id = this.config.utils.gerarId();
        
        const dadosFormatados = {
            ID: id,
            STATUS: dados.status || 'ATIVO',
            URGENTE: dados.urgente ? 'SIM' : 'NÃO',
            ORIGEM_UF: dados.origemUF,
            ORIGEM_CIDADE: dados.origemCidade,
            DESTINO_UF: dados.destinoUF,
            DESTINO_CIDADE: dados.destinoCidade,
            DISTANCIA_KM: dados.distanciaKm,
            VALOR_SUGERIDO: dados.valorSugerido,
            VALOR_POR_KM: (dados.valorSugerido / dados.distanciaKm).toFixed(2),
            TIPO_VEICULO: dados.tipoVeiculo,
            TIPO_CARGA: dados.tipoCarga,
            PESO_TON: dados.pesoTon,
            DATA_EMBARQUE: dados.dataEmbarque,
            OBSERVACOES: this.config.utils.sanitizarTexto(dados.observacoes || ''),
            VAGAS: dados.vagas || 1,
            VISUALIZACOES: 0,
            PROPOSTAS: 0,
            CRIADO_EM: new Date().toISOString(),
            ATUALIZADO_EM: new Date().toISOString()
        };
        
        const resultado = await this.enviarParaSheets('FRETE_ADMIN', dadosFormatados);
        
        // Verificar motoristas com rotas compatíveis
        await this.verificarFretesCompativeis(dadosFormatados);
        
        return resultado;
    }
    
    /**
     * Buscar fretes disponíveis com filtros
     */
    async buscarFretesDisponiveis(filtros = {}) {
        try {
            const todosFretes = await this.buscarDoSheets('FRETES_DISPONIVEIS');
            
            let fretesFiltrados = todosFretes.filter(frete => 
                frete.STATUS === 'ATIVO'
            );
            
            // Aplicar filtros
            if (filtros.origemUF) {
                fretesFiltrados = fretesFiltrados.filter(f => 
                    f.ORIGEM_UF === filtros.origemUF
                );
            }
            
            if (filtros.destinoUF) {
                fretesFiltrados = fretesFiltrados.filter(f => 
                    f.DESTINO_UF === filtros.destinoUF
                );
            }
            
            if (filtros.tipoVeiculo) {
                fretesFiltrados = fretesFiltrados.filter(f => 
                    f.TIPO_VEICULO === filtros.tipoVeiculo
                );
            }
            
            if (filtros.valorMinimo) {
                fretesFiltrados = fretesFiltrados.filter(f => 
                    parseFloat(f.VALOR_SUGERIDO) >= parseFloat(filtros.valorMinimo)
                );
            }
            
            // Ordenar por urgente e data
            fretesFiltrados.sort((a, b) => {
                if (a.URGENTE === 'SIM' && b.URGENTE !== 'SIM') return -1;
                if (a.URGENTE !== 'SIM' && b.URGENTE === 'SIM') return 1;
                return new Date(b.CRIADO_EM) - new Date(a.CRIADO_EM);
            });
            
            return fretesFiltrados;
            
        } catch (erro) {
            console.error('❌ Erro ao buscar fretes:', erro);
            return [];
        }
    }
    
    /**
     * Atualizar frete
     */
    async atualizarFrete(id, dados) {
        dados.ID = id;
        dados.ATUALIZADO_EM = new Date().toISOString();
        return await this.enviarParaSheets('ATUALIZAR_FRETE', dados);
    }
    
    // ==================== PROPOSTAS ====================
    
    /**
     * Salvar proposta na aba PROPOSTAS_FRETES
     */
    async salvarProposta(dados) {
        const id = this.config.utils.gerarId();
        
        const valorSugerido = parseFloat(dados.valorSugerido);
        const valorProposta = parseFloat(dados.valorProposta);
        const descontoPct = this.config.utils.calcularDesconto(valorSugerido, valorProposta);
        
        const dadosFormatados = {
            ID: id,
            FRETE_ID: dados.freteId,
            MOTORISTA_NOME: this.config.utils.sanitizarTexto(dados.motoristaNome),
            MOTORISTA_WHATSAPP: this.config.utils.formatarWhatsApp(dados.motoristaWhatsApp),
            ROTA: `${dados.origem} → ${dados.destino}`,
            VALOR_SUGERIDO: valorSugerido,
            VALOR_PROPOSTA: valorProposta,
            DESCONTO_PCT: descontoPct,
            VEICULO_PLACA: dados.veiculoPlaca,
            VEICULO_TIPO: dados.veiculoTipo,
            DISPONIBILIDADE: dados.disponibilidade,
            OBSERVACOES: this.config.utils.sanitizarTexto(dados.observacoes || ''),
            STATUS: 'AGUARDANDO',
            MOTIVO_RECUSA: '',
            DATA_PROPOSTA: new Date().toISOString(),
            DATA_RESPOSTA: '',
            TEMPO_RESPOSTA_H: 0
        };
        
        const resultado = await this.enviarParaSheets('PROPOSTA_FRETE', dadosFormatados);
        
        // Notificar admin
        if (this.config.evolution.notificacoes) {
            await this.notificarWhatsApp({
                numero: this.config.evolution.whatsapp,
                mensagem: this.config.mensagensWhatsApp.novaProposta(
                    dadosFormatados.MOTORISTA_NOME,
                    dadosFormatados.ROTA,
                    this.config.utils.formatarMoeda(valorProposta)
                )
            });
        }
        
        return resultado;
    }
    
    /**
     * Buscar propostas de um motorista
     */
    async buscarPropostasMotorista(whatsapp) {
        try {
            const todasPropostas = await this.buscarDoSheets('PROPOSTAS_FRETES');
            
            const whatsappFormatado = this.config.utils.formatarWhatsApp(whatsapp);
            
            return todasPropostas.filter(proposta => 
                proposta.MOTORISTA_WHATSAPP === whatsappFormatado
            ).sort((a, b) => 
                new Date(b.DATA_PROPOSTA) - new Date(a.DATA_PROPOSTA)
            );
            
        } catch (erro) {
            console.error('❌ Erro ao buscar propostas:', erro);
            return [];
        }
    }
    
    /**
     * Buscar todas as propostas (admin)
     */
    async buscarTodasPropostas(filtros = {}) {
        try {
            let propostas = await this.buscarDoSheets('PROPOSTAS_FRETES');
            
            if (filtros.status) {
                propostas = propostas.filter(p => p.STATUS === filtros.status);
            }
            
            if (filtros.freteId) {
                propostas = propostas.filter(p => p.FRETE_ID === filtros.freteId);
            }
            
            if (filtros.motorista) {
                propostas = propostas.filter(p => 
                    p.MOTORISTA_NOME.toLowerCase().includes(filtros.motorista.toLowerCase())
                );
            }
            
            return propostas.sort((a, b) => 
                new Date(b.DATA_PROPOSTA) - new Date(a.DATA_PROPOSTA)
            );
            
        } catch (erro) {
            console.error('❌ Erro ao buscar propostas:', erro);
            return [];
        }
    }
    
    /**
     * Atualizar status da proposta
     */
    async atualizarProposta(id, status, motivo = '') {
        const dados = {
            ID: id,
            STATUS: status,
            MOTIVO_RECUSA: motivo,
            DATA_RESPOSTA: new Date().toISOString()
        };
        
        return await this.enviarParaSheets('ATUALIZAR_PROPOSTA', dados);
    }
    
    // ==================== ROTAS PREFERIDAS ====================
    
    /**
     * Salvar rota preferida na aba ROTAS_PREFERIDAS_MOTORISTAS
     */
    async salvarRotaPreferida(dados) {
        const id = this.config.utils.gerarId();
        
        const dadosFormatados = {
            ID: id,
            MOTORISTA_NOME: this.config.utils.sanitizarTexto(dados.motoristaNome),
            MOTORISTA_WHATSAPP: this.config.utils.formatarWhatsApp(dados.motoristaWhatsApp),
            ORIGEM_CIDADE: dados.origemCidade || 'QUALQUER',
            ORIGEM_UF: dados.origemUF,
            ORIGEM_FLEXIVEL: dados.origemFlexivel ? 'SIM' : 'NÃO',
            DESTINO_CIDADE: dados.destinoCidade || 'QUALQUER',
            DESTINO_UF: dados.destinoUF,
            DESTINO_FLEXIVEL: dados.destinoFlexivel ? 'SIM' : 'NÃO',
            RAIO_KM: dados.raioKm || 100,
            TIPO_VEICULO: Array.isArray(dados.tipoVeiculo) ? dados.tipoVeiculo.join(',') : dados.tipoVeiculo,
            TIPOS_CARGA: Array.isArray(dados.tiposCarga) ? dados.tiposCarga.join(',') : dados.tiposCarga,
            CAPACIDADE_TON: dados.capacidadeTon,
            VALOR_MINIMO: dados.valorMinimo || 0,
            DIAS_SEMANA: Array.isArray(dados.diasSemana) ? dados.diasSemana.join(',') : dados.diasSemana,
            DISPONIBILIDADE: dados.disponibilidade,
            NOTIFICAR_WHATSAPP: dados.notificarWhatsApp ? 'SIM' : 'NÃO',
            STATUS: 'ATIVA',
            CRIADO_EM: new Date().toISOString(),
            ATUALIZADO_EM: new Date().toISOString()
        };
        
        const resultado = await this.enviarParaSheets('ROTA_PREFERIDA', dadosFormatados);
        
        // Verificar fretes compatíveis imediatamente
        await this.verificarFretesCompativeis(dadosFormatados, true);
        
        return resultado;
    }
    
    /**
     * Buscar rotas preferidas de um motorista
     */
    async buscarRotasMotorista(whatsapp) {
        try {
            const todasRotas = await this.buscarDoSheets('ROTAS_PREFERIDAS_MOTORISTAS');
            
            const whatsappFormatado = this.config.utils.formatarWhatsApp(whatsapp);
            
            return todasRotas.filter(rota => 
                rota.MOTORISTA_WHATSAPP === whatsappFormatado
            ).sort((a, b) => 
                new Date(b.CRIADO_EM) - new Date(a.CRIADO_EM)
            );
            
        } catch (erro) {
            console.error('❌ Erro ao buscar rotas:', erro);
            return [];
        }
    }
    
    /**
     * Buscar todas as rotas (admin)
     */
    async buscarTodasRotas(filtros = {}) {
        try {
            let rotas = await this.buscarDoSheets('ROTAS_PREFERIDAS_MOTORISTAS');
            
            if (filtros.origemUF) {
                rotas = rotas.filter(r => r.ORIGEM_UF === filtros.origemUF);
            }
            
            if (filtros.destinoUF) {
                rotas = rotas.filter(r => r.DESTINO_UF === filtros.destinoUF);
            }
            
            if (filtros.tipoVeiculo) {
                rotas = rotas.filter(r => r.TIPO_VEICULO.includes(filtros.tipoVeiculo));
            }
            
            if (filtros.status) {
                rotas = rotas.filter(r => r.STATUS === filtros.status);
            }
            
            return rotas;
            
        } catch (erro) {
            console.error('❌ Erro ao buscar rotas:', erro);
            return [];
        }
    }
    
    /**
     * Atualizar rota preferida
     */
    async atualizarRota(id, dados) {
        dados.ID = id;
        dados.ATUALIZADO_EM = new Date().toISOString();
        return await this.enviarParaSheets('ATUALIZAR_ROTA', dados);
    }
    
    // ==================== MATCHING AUTOMÁTICO ====================
    
    /**
     * Verificar fretes compatíveis com rota cadastrada
     */
    async verificarFretesCompativeis(rota, isRota = false) {
        try {
            if (isRota) {
                // Buscar fretes compatíveis com a rota
                const fretes = await this.buscarFretesDisponiveis();
                
                const fretesCompativeis = fretes.filter(frete => {
                    // Verificar origem
                    if (rota.ORIGEM_UF !== frete.ORIGEM_UF && rota.ORIGEM_FLEXIVEL !== 'SIM') {
                        return false;
                    }
                    
                    // Verificar destino
                    if (rota.DESTINO_UF !== frete.DESTINO_UF && rota.DESTINO_FLEXIVEL !== 'SIM') {
                        return false;
                    }
                    
                    // Verificar tipo de veículo
                    if (!rota.TIPO_VEICULO.includes(frete.TIPO_VEICULO)) {
                        return false;
                    }
                    
                    // Verificar valor mínimo
                    if (rota.VALOR_MINIMO && parseFloat(frete.VALOR_SUGERIDO) < parseFloat(rota.VALOR_MINIMO)) {
                        return false;
                    }
                    
                    return true;
                });
                
                // Notificar motorista sobre fretes compatíveis
                if (fretesCompativeis.length > 0 && rota.NOTIFICAR_WHATSAPP === 'SIM') {
                    for (const frete of fretesCompativeis.slice(0, 3)) { // Limitar a 3 notificações
                        await this.notificarWhatsApp({
                            numero: rota.MOTORISTA_WHATSAPP,
                            mensagem: this.config.mensagensWhatsApp.freteCompativel(
                                rota.MOTORISTA_NOME,
                                `${frete.ORIGEM_CIDADE}-${frete.ORIGEM_UF} → ${frete.DESTINO_CIDADE}-${frete.DESTINO_UF}`,
                                this.config.utils.formatarMoeda(frete.VALOR_SUGERIDO)
                            )
                        });
                    }
                }
                
                return fretesCompativeis;
                
            } else {
                // Buscar motoristas com rotas compatíveis para o frete
                const rotas = await this.buscarTodasRotas({ status: 'ATIVA' });
                
                const motoristasCompativeis = rotas.filter(rota => {
                    // Verificar origem
                    if (rota.ORIGEM_UF !== frete.ORIGEM_UF && rota.ORIGEM_FLEXIVEL !== 'SIM') {
                        return false;
                    }
                    
                    // Verificar destino
                    if (rota.DESTINO_UF !== frete.DESTINO_UF && rota.DESTINO_FLEXIVEL !== 'SIM') {
                        return false;
                    }
                    
                    // Verificar tipo de veículo
                    if (!rota.TIPO_VEICULO.includes(frete.TIPO_VEICULO)) {
                        return false;
                    }
                    
                    return true;
                });
                
                // Notificar motoristas compatíveis
                if (motoristasCompativeis.length > 0) {
                    for (const motorista of motoristasCompativeis) {
                        if (motorista.NOTIFICAR_WHATSAPP === 'SIM') {
                            await this.notificarWhatsApp({
                                numero: motorista.MOTORISTA_WHATSAPP,
                                mensagem: this.config.mensagensWhatsApp.freteCompativel(
                                    motorista.MOTORISTA_NOME,
                                    `${frete.ORIGEM_CIDADE}-${frete.ORIGEM_UF} → ${frete.DESTINO_CIDADE}-${frete.DESTINO_UF}`,
                                    this.config.utils.formatarMoeda(frete.VALOR_SUGERIDO)
                                )
                            });
                        }
                    }
                }
                
                return motoristasCompativeis;
            }
            
        } catch (erro) {
            console.error('❌ Erro ao verificar compatibilidade:', erro);
            return [];
        }
    }
    
    // ==================== ANÁLISE INTELIGENTE ====================
    
    /**
     * Analisar propostas e padrões do motorista
     */
    async analisarPropostasMotorista(whatsapp) {
        try {
            const propostas = await this.buscarPropostasMotorista(whatsapp);
            
            if (propostas.length === 0) {
                return {
                    totalPropostas: 0,
                    insights: []
                };
            }
            
            // Calcular estatísticas
            const total = propostas.length;
            const aceitas = propostas.filter(p => p.STATUS === 'ACEITA').length;
            const recusadas = propostas.filter(p => p.STATUS === 'RECUSADA').length;
            const aguardando = propostas.filter(p => p.STATUS === 'AGUARDANDO').length;
            const taxaAceitacao = ((aceitas / total) * 100).toFixed(1);
            
            // Análise de valores
            const valores = propostas.map(p => parseFloat(p.VALOR_PROPOSTA));
            const mediaValores = valores.reduce((a, b) => a + b, 0) / valores.length;
            
            // Análise de descontos
            const descontos = propostas.map(p => parseFloat(p.DESCONTO_PCT));
            const mediaDescontos = descontos.reduce((a, b) => a + b, 0) / descontos.length;
            
            // Rotas mais frequentes
            const rotasFrequentes = {};
            propostas.forEach(p => {
                rotasFrequentes[p.ROTA] = (rotasFrequentes[p.ROTA] || 0) + 1;
            });
            const topRotas = Object.entries(rotasFrequentes)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 3)
                .map(([rota, count]) => ({ rota, count }));
            
            // Gerar insights
            const insights = [];
            
            // Insight 1: Taxa de aceitação
            if (taxaAceitacao < 30) {
                insights.push({
                    tipo: 'aviso',
                    titulo: '⚠️ Taxa de aceitação baixa',
                    mensagem: `Sua taxa de aceitação é ${taxaAceitacao}%. Considere ajustar seus valores ou ser mais flexível nas propostas.`
                });
            } else if (taxaAceitacao > 70) {
                insights.push({
                    tipo: 'sucesso',
                    titulo: '✅ Excelente taxa de aceitação',
                    mensagem: `Parabéns! Sua taxa de aceitação é ${taxaAceitacao}%. Continue assim!`
                });
            }
            
            // Insight 2: Descontos
            if (mediaDescontos > 15) {
                insights.push({
                    tipo: 'info',
                    titulo: '💡 Seus descontos estão altos',
                    mensagem: `Em média, você propõe ${mediaDescontos.toFixed(1)}% abaixo do valor sugerido. Considere aumentar seus valores.`
                });
            }
            
            // Insight 3: Rotas preferidas
            if (topRotas.length > 0) {
                insights.push({
                    tipo: 'info',
                    titulo: '🗺️ Suas rotas preferidas',
                    mensagem: `Você mais propõe para: ${topRotas.map(r => r.rota).join(', ')}. Considere cadastrá-las como rotas preferidas!`
                });
            }
            
            // Insight 4: Tempo de resposta
            const temposResposta = propostas
                .filter(p => p.TEMPO_RESPOSTA_H > 0)
                .map(p => parseFloat(p.TEMPO_RESPOSTA_H));
            
            if (temposResposta.length > 0) {
                const mediaTempoResposta = temposResposta.reduce((a, b) => a + b, 0) / temposResposta.length;
                if (mediaTempoResposta > 24) {
                    insights.push({
                        tipo: 'aviso',
                        titulo: '⏰ Tempo de resposta lento',
                        mensagem: `Em média, você recebe resposta em ${mediaTempoResposta.toFixed(1)}h. Propostas mais competitivas podem ter respostas mais rápidas.`
                    });
                }
            }
            
            // Insight 5: Sugestão de rotas
            const rotasSugeridas = topRotas.map(r => ({
                rota: r.rota,
                valorMedio: this.config.utils.formatarMoeda(mediaValores),
                quantidade: r.count
            }));
            
            return {
                totalPropostas: total,
                aceitas,
                recusadas,
                aguardando,
                taxaAceitacao: parseFloat(taxaAceitacao),
                mediaValores: this.config.utils.formatarMoeda(mediaValores),
                mediaDescontos: mediaDescontos.toFixed(1),
                topRotas: rotasSugeridas,
                insights
            };
            
        } catch (erro) {
            console.error('❌ Erro ao analisar propostas:', erro);
            return {
                totalPropostas: 0,
                insights: []
            };
        }
    }
    
    // ==================== WHATSAPP ====================
    
    /**
     * Enviar notificação via WhatsApp usando Evolution API
     */
    async notificarWhatsApp(dados) {
        try {
            if (!this.config.evolution.notificacoes) {
                console.log('ℹ️ Notificações WhatsApp desabilitadas');
                return { sucesso: false, motivo: 'Notificações desabilitadas' };
            }
            
            const numero = this.config.utils.formatarWhatsApp(dados.numero);
            
            const response = await fetch(
                `${this.config.evolution.url}/message/sendText/${this.config.evolution.instance}`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'apikey': this.config.evolution.apiKey
                    },
                    body: JSON.stringify({
                        number: numero,
                        textMessage: {
                            text: dados.mensagem
                        }
                    })
                }
            );
            
            if (response.ok) {
                console.log('✅ Notificação WhatsApp enviada:', numero);
                return { sucesso: true };
            } else {
                console.error('❌ Erro ao enviar WhatsApp:', response.statusText);
                return { sucesso: false, erro: response.statusText };
            }
            
        } catch (erro) {
            console.error('❌ Erro ao notificar WhatsApp:', erro);
            return { sucesso: false, erro: erro.message };
        }
    }
    
    // ==================== LOCALSTORAGE ====================
    
    /**
     * Salvar motorista no localStorage
     */
    salvarMotoristaLocal(dados) {
        try {
            localStorage.setItem(
                this.config.localStorageKeys.motorista,
                JSON.stringify(dados)
            );
            localStorage.setItem(
                this.config.localStorageKeys.ultimoAcesso,
                new Date().toISOString()
            );
        } catch (erro) {
            console.error('❌ Erro ao salvar no localStorage:', erro);
        }
    }
    
    /**
     * Recuperar motorista do localStorage
     */
    recuperarMotoristaLocal() {
        try {
            const dados = localStorage.getItem(this.config.localStorageKeys.motorista);
            return dados ? JSON.parse(dados) : null;
        } catch (erro) {
            console.error('❌ Erro ao recuperar do localStorage:', erro);
            return null;
        }
    }
    
    /**
     * Limpar motorista do localStorage
     */
    limparMotoristaLocal() {
        try {
            localStorage.removeItem(this.config.localStorageKeys.motorista);
            localStorage.removeItem(this.config.localStorageKeys.ultimoAcesso);
        } catch (erro) {
            console.error('❌ Erro ao limpar localStorage:', erro);
        }
    }
    
    // ==================== CACHE ====================
    
    /**
     * Obter cache válido
     */
    getCacheValido(chave) {
        const cached = this.cache.get(chave);
        if (!cached) return null;
        
        const agora = Date.now();
        if (agora - cached.timestamp > this.config.cache.tempoExpiracao) {
            this.cache.delete(chave);
            return null;
        }
        
        return cached.dados;
    }
    
    /**
     * Salvar no cache
     */
    setCache(chave, dados) {
        // Limitar tamanho do cache
        if (this.cache.size >= this.config.cache.maxItems) {
            const primeiraChave = this.cache.keys().next().value;
            this.cache.delete(primeiraChave);
        }
        
        this.cache.set(chave, {
            dados,
            timestamp: Date.now()
        });
    }
    
    /**
     * Limpar cache
     */
    limparCache() {
        this.cache.clear();
    }
}

// ==================== EXPORTAR ====================
if (typeof window !== 'undefined') {
    window.CaptacaoAPI = CaptacaoAPI;
    window.captacaoAPI = new CaptacaoAPI();
    console.log('✅ API Integration carregado');
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = CaptacaoAPI;
}
