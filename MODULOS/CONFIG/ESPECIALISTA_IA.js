/**
 * 🤖 ESPECIALISTA-IA - Assistente Central do Sistema ENSIDE v19.0
 * 
 * Este módulo é o CÉREBRO do sistema. Ele:
 * 1. Conhece TODAS as funcionalidades do sistema
 * 2. Sabe como usar cada API (Evolution, GitHub, Sheets)
 * 3. Pode ser ENSINADO com novos conhecimentos
 * 4. Está disponível em TODOS os lugares (HTML, Terminal, Claude)
 * 
 * Criado em: 03/01/2026
 * Autor: Anderson Enside + Claude (Vy)
 */

const ESPECIALISTA_IA = {
    // ==================== IDENTIDADE ====================
    nome: "ESPECIALISTA-IA",
    versao: "2.0",
    criador: "Anderson Enside",
    assistente: "Claude (Vy)",
    dataAtualizacao: new Date().toISOString(),

    // ==================== CONHECIMENTOS ====================
    conhecimentos: {
        sistema: {
            nome: "ENSIDE MASTER v19.0",
            pasta: "/Users/andersonenside/Desktop/ENSIDE_SISTEMA_UNIFICADO",
            arquivoPrincipal: "ENSIDE_MASTER_v19.0_INTEGRADO.html",
            modulos: [
                "FASE1_FRETES_DISPONIVEIS.html",
                "FASE2_MARKETING.html", 
                "FASE3_ROTAS_MOTORISTA.html",
                "FASE4_PROPOSTAS.html",
                "FASE5_DADOS_PROFISSIONAIS.html",
                "CONTATOS_CRM.html",
                "LISTA_TRANSMISSAO.html"
            ]
        },
        
        apis: {
            evolution: {
                nome: "Evolution API",
                url: "https://isa-unawed-marquetta.ngrok-free.dev",
                urlExterna: "https://evolution-api-poc1.onrender.com",
                apiKey: "919AA333-AE59-4B06-B1EF-C9A9F9C8C0F6",
                instancia: "enside",
                whatsapp: "5518996540492",
                endpoints: {
                    enviarTexto: "/message/sendText/enside",
                    enviarImagem: "/message/sendImage/enside",
                    enviarDocumento: "/message/sendDocument/enside",
                    status: "/instance/connectionState/enside",
                    qrcode: "/instance/qrcode/enside"
                }
            },
            
            github: {
                nome: "GitHub",
                usuario: "ensideanderson-nova",
                repositorio: "ENSIDE-MASTER-v16",
                url: "https://github.com/ensideanderson-nova/ENSIDE-MASTER-v16",
                token: "Github_pat_11B2HPWRQ0jAY7HwKQQBR9_XBQOZWISGDOf45h8a0ByyrbMlfw2r3peS4J2IGNQax3HOF6FYPXFVRng6A8",
                appId: 2302130,
                appName: "ESPECIALISTA-IA",
                clientId: "Iv23liLTN3V5XvOzhjW7",
                installationId: "95179240",
                privateKeys: [
                    "SHA256:cQv7FZLT0besQ3tyQSJztlJdaUY5n7Sc32yNV6CWsmg=",
                    "SHA256:3HFk/UX9mA4nFWILmDsYps1eVLhXQcI2gT4QkUPP+Wc="
                ]
            },
            
            googleSheets: {
                nome: "Google Sheets",
                planilhaId: "1FiP885Or0ncyRG_ZZaAvM2vP0sHhDzhLFYifYLjKyIE",
                url: "https://docs.google.com/spreadsheets/d/1FiP885Or0ncyRG_ZZaAvM2vP0sHhDzhLFYifYLjKyIE",
                abas: {
                    contatos: "CONTATOS",
                    fretes: "FRETES_DISPONIVEIS",
                    captacao: "CAPTACAO_FRETES"
                }
            },
            
            vercel: {
                nome: "Vercel",
                projeto: "enside-sistema",
                url: "https://enside-sistema.vercel.app",
                installationId: "101400509"
            },
            
            render: {
                nome: "Render",
                servico: "evolution-api-poc1",
                url: "https://evolution-api-poc1.onrender.com",
                installationId: "102114573"
            },
            
            googleAI: {
                nome: "Google AI Studio",
                modelo: "gemini-pro",
                installationId: "101218432"
            }
        },
        
        comandos: {
            terminal: {
                abrirSistema: "open ~/Desktop/ENSIDE_SISTEMA_UNIFICADO/ENSIDE_MASTER_v19.0_INTEGRADO.html",
                abrirEvolution: "open https://evolution-api-latest-poc1.onrender.com/manager",
                abrirSheets: "open 'https://docs.google.com/spreadsheets/d/1FiP885Or0ncyRG_ZZaAvM2vP0sHhDzhLFYifYLjKyIE'",
                abrirGitHub: "open https://github.com/ensideanderson-nova/ENSIDE-MASTER-v16",
                enviarWhatsApp: "./ENVIAR_LISTA.sh",
                comandarSistema: "./COMANDAR_MAC_IPHONE.command",
                sincronizarGit: "git add -A && git commit -m 'update' && git push origin main"
            }
        }
    },

    // ==================== APRENDIZADOS ====================
    aprendizados: [
        {
            id: 1,
            titulo: "Formato correto do número WhatsApp",
            conteudo: "Sempre usar formato: numero@s.whatsapp.net (ex: 5518996540492@s.whatsapp.net)",
            data: "2026-01-03",
            categoria: "whatsapp"
        },
        {
            id: 2,
            titulo: "Token GitHub não expira",
            conteudo: "O token foi configurado para nunca expirar. Usar em headers: Authorization: Bearer TOKEN",
            data: "2026-01-03",
            categoria: "github"
        },
        {
            id: 3,
            titulo: "Evolution API local vs externa",
            conteudo: "Local: localhost:8080 (quando Docker rodando). Externa: evolution-api-poc1.onrender.com",
            data: "2026-01-03",
            categoria: "evolution"
        },
        {
            id: 4,
            titulo: "Sincronização Google Sheets",
            conteudo: "Usar API gviz para leitura. ID da planilha: 1FiP885Or0ncyRG_ZZaAvM2vP0sHhDzhLFYifYLjKyIE",
            data: "2026-01-03",
            categoria: "sheets"
        },
        {
            id: 5,
            titulo: "Preços de Mourões Tratados",
            conteudo: "Mourão 2,20m: R$18-25 | Mourão 2,50m: R$22-30 | Mourão 3,00m: R$28-38. Tratamento CCA aumenta 15-20% no valor.",
            data: "2026-01-03",
            categoria: "precos"
        },
        {
            id: 6,
            titulo: "Preços de Postes de Eucalipto",
            conteudo: "Poste 7m: R$95-120 | Poste 9m: R$150-180 | Poste 11m: R$220-280 | Poste 12m: R$280-350. Todos tratados CCA.",
            data: "2026-01-03",
            categoria: "precos"
        },
        {
            id: 7,
            titulo: "Preços de Estacas",
            conteudo: "Estaca 1,50m: R$8-12 | Estaca 2,00m: R$12-18 | Estaca 2,50m: R$15-22. Preço varia conforme diâmetro.",
            data: "2026-01-03",
            categoria: "precos"
        },
        {
            id: 8,
            titulo: "Custo Tratamento CCA",
            conteudo: "Tratamento CCA: R$300/m³ ou R$195/st. Fator de conversão: 1 st = 0,65 m³. Autoclave industrial.",
            data: "2026-01-03",
            categoria: "tratamento"
        },
        {
            id: 9,
            titulo: "Cálculo de Frete por KM",
            conteudo: "Frete médio: R$4-6/km para caminhão truck. Carreta: R$3-5/km. Bitrem: R$2,50-4/km. Considerar peso e volume.",
            data: "2026-01-03",
            categoria: "frete"
        },
        {
            id: 10,
            titulo: "Peso da Madeira por M³",
            conteudo: "Eucalipto seco: 500-600 kg/m³ | Eucalipto verde: 900-1100 kg/m³ | Pinus: 400-500 kg/m³. Importante para cálculo de frete.",
            data: "2026-01-03",
            categoria: "madeira"
        },
        {
            id: 11,
            titulo: "Tipos de Eucalipto",
            conteudo: "Citriodora: mais resistente, ideal para postes. Grandis: crescimento rápido, bom para mourões. Urograndis: híbrido versátil.",
            data: "2026-01-03",
            categoria: "madeira"
        },
        {
            id: 12,
            titulo: "Documentação Florestal",
            conteudo: "DOF (Documento de Origem Florestal) obrigatório para transporte. GF (Guia Florestal) para SP. Validade: 5 dias.",
            data: "2026-01-03",
            categoria: "documentacao"
        },
        {
            id: 13,
            titulo: "Regiões Fornecedoras",
            conteudo: "Principais regiões: Assis/SP, Botucatu/SP, Itapeva/SP, Norte do PR, MS. Eucalipto concentrado no interior de SP.",
            data: "2026-01-03",
            categoria: "fornecedores"
        },
        {
            id: 14,
            titulo: "Capacidade de Carga",
            conteudo: "Truck: 12-14 toneladas | Carreta: 25-28 toneladas | Bitrem: 35-40 toneladas. Verificar limites de peso por eixo.",
            data: "2026-01-03",
            categoria: "frete"
        },
        {
            id: 15,
            titulo: "Margem de Lucro Sugerida",
            conteudo: "Margem mínima: 15-20% para revenda. Margem ideal: 25-35%. Considerar custos de estoque e inadimplência.",
            data: "2026-01-03",
            categoria: "vendas"
        },
        {
            id: 16,
            titulo: "Formato Envio Evolution API",
            conteudo: "POST /message/sendText/enside. Body: {number: '5518...', textMessage: {text: 'mensagem'}}. Header: apikey obrigatório.",
            data: "2026-01-03",
            categoria: "evolution"
        },
        {
            id: 17,
            titulo: "Contatos do Sistema",
            conteudo: "Total: 7.055+ contatos | Fornecedores: 1.200 | Clientes: 2.500 | Transportadores: 377. Sincronizado com Google Sheets.",
            data: "2026-01-03",
            categoria: "sistema"
        },
        {
            id: 18,
            titulo: "Prazo de Entrega",
            conteudo: "Pronta entrega: 1-3 dias. Sob encomenda: 7-15 dias. Tratamento CCA: +3-5 dias. Frete longo: +2-5 dias.",
            data: "2026-01-03",
            categoria: "vendas"
        },
        {
            id: 19,
            titulo: "Condições de Pagamento",
            conteudo: "À vista: 5-10% desconto. 30 dias: preço cheio. 30/60: +3%. Boleto ou PIX preferencial. Cheque com consulta.",
            data: "2026-01-03",
            categoria: "vendas"
        },
        {
            id: 20,
            titulo: "Durabilidade Madeira Tratada",
            conteudo: "Eucalipto tratado CCA: 15-25 anos em contato com solo. Sem tratamento: 2-5 anos. Pinus tratado: 10-15 anos.",
            data: "2026-01-03",
            categoria: "madeira"
        }
    ],

    // ==================== MÉTODOS ====================
    
    // Adicionar novo aprendizado
    aprender: function(titulo, conteudo) {
        const novoAprendizado = {
            id: this.aprendizados.length + 1,
            titulo: titulo,
            conteudo: conteudo,
            data: new Date().toISOString().split('T')[0]
        };
        this.aprendizados.push(novoAprendizado);
        console.log(`✅ Aprendizado adicionado: ${titulo}`);
        return novoAprendizado;
    },

    // Buscar conhecimento
    buscar: function(termo) {
        const resultados = [];
        
        // Buscar em aprendizados
        this.aprendizados.forEach(a => {
            if (a.titulo.toLowerCase().includes(termo.toLowerCase()) || 
                a.conteudo.toLowerCase().includes(termo.toLowerCase())) {
                resultados.push({tipo: 'aprendizado', ...a});
            }
        });
        
        return resultados;
    },

    // Enviar WhatsApp
    enviarWhatsApp: async function(numero, mensagem) {
        const url = `${this.conhecimentos.apis.evolution.url}/message/sendText/enside`;
        const body = {
            number: numero.includes('@') ? numero : `${numero}@s.whatsapp.net`,
            textMessage: { text: mensagem }
        };
        
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'apikey': this.conhecimentos.apis.evolution.apiKey
                },
                body: JSON.stringify(body)
            });
            const data = await response.json();
            console.log('✅ Mensagem enviada:', data);
            return data;
        } catch (error) {
            console.error('❌ Erro ao enviar:', error);
            return { error: error.message };
        }
    },

    // Verificar status do sistema
    verificarStatus: async function() {
        const status = {
            timestamp: new Date().toISOString(),
            evolution: 'verificando...',
            docker: 'verificando...'
        };
        
        try {
            const response = await fetch(`${this.conhecimentos.apis.evolution.url}/instance/connectionState/enside`, {
                headers: { 'apikey': this.conhecimentos.apis.evolution.apiKey }
            });
            const data = await response.json();
            status.evolution = data.state || data.instance?.state || 'desconhecido';
        } catch (e) {
            status.evolution = 'offline';
        }
        
        return status;
    },

    // Gerar relatório
    gerarRelatorio: function() {
        return `
╔══════════════════════════════════════════════════════════════╗
║           🤖 ESPECIALISTA-IA - RELATÓRIO DO SISTEMA          ║
╠══════════════════════════════════════════════════════════════╣
║ Sistema: ${this.conhecimentos.sistema.nome}
║ Versão IA: ${this.versao}
║ Atualizado: ${this.dataAtualizacao}
╠══════════════════════════════════════════════════════════════╣
║ 📱 WhatsApp: ${this.conhecimentos.apis.evolution.whatsapp}
║ 🐙 GitHub: ${this.conhecimentos.apis.github.repositorio}
║ 📊 Sheets: ${this.conhecimentos.apis.googleSheets.planilhaId.substring(0,20)}...
║ 🚀 Vercel: ${this.conhecimentos.apis.vercel.url}
╠══════════════════════════════════════════════════════════════╣
║ 📚 Aprendizados: ${this.aprendizados.length}
║ 📁 Módulos: ${this.conhecimentos.sistema.modulos.length}
╚══════════════════════════════════════════════════════════════╝
        `;
    },

    // Ajuda
    ajuda: function() {
        return `
🤖 ESPECIALISTA-IA - Comandos Disponíveis:

📚 APRENDER:
   ESPECIALISTA_IA.aprender("titulo", "conteudo")
   
🔍 BUSCAR:
   ESPECIALISTA_IA.buscar("termo")
   
📱 WHATSAPP:
   ESPECIALISTA_IA.enviarWhatsApp("5518996540492", "Olá!")
   
📊 STATUS:
   ESPECIALISTA_IA.verificarStatus()
   
📋 RELATÓRIO:
   ESPECIALISTA_IA.gerarRelatorio()
   
💡 CONHECIMENTOS:
   ESPECIALISTA_IA.conhecimentos.apis.evolution
   ESPECIALISTA_IA.conhecimentos.apis.github
   ESPECIALISTA_IA.conhecimentos.sistema
        `;
    }
};

// Exportar para uso global
if (typeof window !== 'undefined') {
    window.ESPECIALISTA_IA = ESPECIALISTA_IA;
}
if (typeof module !== 'undefined') {
    module.exports = ESPECIALISTA_IA;
}

// Log de inicialização
console.log('🤖 ESPECIALISTA-IA v' + ESPECIALISTA_IA.versao + ' carregado!');
console.log('   Digite ESPECIALISTA_IA.ajuda() para ver comandos disponíveis');
