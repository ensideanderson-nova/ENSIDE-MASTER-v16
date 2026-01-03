/**
 * PADRÃO DE IMPORTAÇÃO GOOGLE SHEETS - ENSIDE SISTEMA
 * 
 * Este arquivo define o padrão de importação para sincronizar
 * corretamente todos os 7.055+ contatos da planilha com o sistema.
 * 
 * Planilha: EUCALIPTO-13-12-25-_SISTEMA_INTEGRADO_COMPLETO
 * ID: 1FiP885Or0ncyRG_ZZaAvM2vP0sHhDzhLFYifYLjKyIE
 */

const PADRAO_IMPORTACAO = {
    // Configuração da Planilha
    spreadsheetId: '1FiP885Or0ncyRG_ZZaAvM2vP0sHhDzhLFYifYLjKyIE',
    spreadsheetName: 'EUCALIPTO-13-12-25-_SISTEMA_INTEGRADO_COMPLETO',
    
    // Abas da Planilha e seus GIDs
    abas: {
        CONTATOS: {
            gid: '1689968688',
            nome: 'CONTATOS',
            colunas: {
                A: 'checkbox',      // Checkbox de seleção
                B: 'NOME',          // Nome do contato
                C: 'TELEFONE',      // Telefone/WhatsApp
                D: 'CATEGORIA',     // FORNECEDOR, CLIENTE, TRANSPORTADOR
                E: 'PRODUTO',       // Tipo de produto
                F: 'CIDADE',        // Cidade
                G: 'UF'             // Estado
            },
            totalEsperado: 7055     // Total de contatos esperados
        },
        FRETES_DISPONIVEIS: {
            gid: '0',
            nome: 'FRETES_DISPONIVEIS',
            colunas: {
                A: 'ID',
                B: 'ORIGEM_UF',
                C: 'ORIGEM_CIDADE',
                D: 'DESTINO_UF',
                E: 'DESTINO_CIDADE',
                F: 'KM',
                G: 'VALOR_KM',
                H: 'TOTAL',
                I: 'STATUS'
            }
        },
        CAPTACAO_FRETES: {
            gid: '1707733664',
            nome: 'CAPTACAO_FRETES',
            colunas: {
                A: 'Timestamp',
                B: 'Nome Completo',
                C: 'WhatsApp',
                D: 'Interesse Seguro',
                // ... mais colunas conforme FASE 2-5
            }
        },
        LISTAS_TRANSMISSAO: {
            gid: '1114979046',
            nome: 'LISTAS_TRANSMISSAO',
            colunas: {
                A: 'NOME_LISTA',
                B: 'CONTATOS',
                C: 'DATA_CRIACAO'
            }
        }
    },
    
    // Função para construir URL de importação
    buildImportUrl: function(aba, limite = null) {
        const baseUrl = `https://docs.google.com/spreadsheets/d/${this.spreadsheetId}/gviz/tq`;
        let url = `${baseUrl}?tqx=out:json&sheet=${aba}`;
        
        // NÃO limitar registros - importar TODOS
        // Se precisar de limite, usar: &tq=limit%20${limite}
        
        return url;
    },
    
    // Função para importar todos os contatos
    importarTodosContatos: async function() {
        const url = this.buildImportUrl('CONTATOS');
        
        try {
            const response = await fetch(url);
            const text = await response.text();
            
            // Remover prefixo do Google Visualization
            const jsonStr = text.replace(/^.*google.visualization.Query.setResponse\(/, '').replace(/\);?$/, '');
            const data = JSON.parse(jsonStr);
            
            const rows = data.table.rows;
            const contatos = [];
            
            // Processar TODAS as linhas (sem limite)
            for (let i = 0; i < rows.length; i++) {
                const row = rows[i];
                if (row.c && row.c[1] && row.c[1].v) { // Se tem nome
                    contatos.push({
                        nome: row.c[1]?.v || '',
                        telefone: row.c[2]?.v || '',
                        categoria: row.c[3]?.v || '',
                        produto: row.c[4]?.v || '',
                        cidade: row.c[5]?.v || '',
                        uf: row.c[6]?.v || ''
                    });
                }
            }
            
            console.log(`✅ Importados ${contatos.length} contatos de ${this.abas.CONTATOS.totalEsperado} esperados`);
            
            // Verificar se importou todos
            if (contatos.length < this.abas.CONTATOS.totalEsperado * 0.9) {
                console.warn(`⚠️ Atenção: Importados apenas ${contatos.length} de ${this.abas.CONTATOS.totalEsperado} contatos`);
            }
            
            return contatos;
            
        } catch (error) {
            console.error('❌ Erro ao importar contatos:', error);
            return [];
        }
    },
    
    // Função para sincronizar com o sistema
    sincronizarComSistema: async function() {
        const contatos = await this.importarTodosContatos();
        
        if (contatos.length > 0) {
            // Atualizar localStorage
            localStorage.setItem('enside_contatos', JSON.stringify(contatos));
            localStorage.setItem('enside_contatos_total', contatos.length);
            localStorage.setItem('enside_ultima_sincronizacao', new Date().toISOString());
            
            // Atualizar contadores na interface
            this.atualizarContadores(contatos);
            
            return {
                sucesso: true,
                total: contatos.length,
                mensagem: `Sincronizados ${contatos.length} contatos com sucesso!`
            };
        }
        
        return {
            sucesso: false,
            total: 0,
            mensagem: 'Erro ao sincronizar contatos'
        };
    },
    
    // Atualizar contadores na interface
    atualizarContadores: function(contatos) {
        const fornecedores = contatos.filter(c => c.categoria === 'FORNECEDOR').length;
        const clientes = contatos.filter(c => c.categoria === 'CLIENTE').length;
        const transportadores = contatos.filter(c => c.categoria === 'TRANSPORTADOR').length;
        
        // Atualizar elementos na página
        const elementos = {
            'total-contatos': contatos.length,
            'total-fornecedores': fornecedores,
            'total-clientes': clientes,
            'total-transportadores': transportadores
        };
        
        for (const [id, valor] of Object.entries(elementos)) {
            const el = document.getElementById(id);
            if (el) el.textContent = valor.toLocaleString('pt-BR') + '+';
        }
        
        console.log(`📊 Contadores atualizados:
            - Total: ${contatos.length}
            - Fornecedores: ${fornecedores}
            - Clientes: ${clientes}
            - Transportadores: ${transportadores}`);
    }
};

// Exportar para uso global
if (typeof window !== 'undefined') {
    window.PADRAO_IMPORTACAO = PADRAO_IMPORTACAO;
}

console.log('✅ Padrão de Importação carregado - Planilha:', PADRAO_IMPORTACAO.spreadsheetName);
