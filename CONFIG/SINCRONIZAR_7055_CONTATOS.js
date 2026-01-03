/**
 * SINCRONIZAR 7.055 CONTATOS - ENSIDE SISTEMA
 * 
 * Script para forçar sincronização de TODOS os contatos da planilha
 * Planilha: EUCALIPTO-13-12-25-_SISTEMA_INTEGRADO_COMPLETO
 * Aba: CONTATOS (gid=1689968688)
 * Total esperado: 7.055 contatos
 */

const SINCRONIZAR_CONTATOS = {
    // Configuração
    spreadsheetId: '1FiP885Or0ncyRG_ZZaAvM2vP0sHhDzhLFYifYLjKyIE',
    abaContatos: 'CONTATOS',
    gidContatos: '1689968688',
    totalEsperado: 7055,
    
    // Estrutura das colunas (baseado na planilha real)
    colunas: {
        0: 'checkbox',    // A - Checkbox
        1: 'NOME',        // B - Nome do contato
        2: 'TELEFONE',    // C - Telefone/WhatsApp
        3: 'CATEGORIA'    // D - FORNECEDOR, CLIENTE, TRANSPORTADOR
    },
    
    // Buscar TODOS os contatos sem limite
    async buscarTodosContatos() {
        console.log('🔄 Iniciando busca de TODOS os contatos...');
        
        const url = `https://docs.google.com/spreadsheets/d/${this.spreadsheetId}/gviz/tq?tqx=out:json&sheet=${this.abaContatos}&gid=${this.gidContatos}`;
        
        try {
            const response = await fetch(url);
            const text = await response.text();
            
            // Remover prefixo do Google Visualization
            const jsonStr = text.replace(/^.*google.visualization.Query.setResponse\(/, '').replace(/\);?$/, '');
            const data = JSON.parse(jsonStr);
            
            if (!data.table || !data.table.rows) {
                console.error('❌ Dados inválidos recebidos');
                return [];
            }
            
            const rows = data.table.rows;
            console.log(`📊 Total de linhas recebidas: ${rows.length}`);
            
            const contatos = [];
            
            // Processar TODAS as linhas
            for (let i = 0; i < rows.length; i++) {
                const row = rows[i];
                if (row.c) {
                    const nome = row.c[1]?.v || '';
                    const telefone = row.c[2]?.v || '';
                    const categoria = row.c[3]?.v || '';
                    
                    // Só adicionar se tiver nome ou telefone
                    if (nome || telefone) {
                        contatos.push({
                            id: i + 1,
                            nome: String(nome).trim(),
                            telefone: String(telefone).trim(),
                            categoria: String(categoria).trim().toUpperCase()
                        });
                    }
                }
            }
            
            console.log(`✅ Contatos processados: ${contatos.length}`);
            
            // Verificar se importou todos
            if (contatos.length < this.totalEsperado * 0.9) {
                console.warn(`⚠️ ATENÇÃO: Importados ${contatos.length} de ${this.totalEsperado} esperados!`);
            } else {
                console.log(`🎉 Sucesso! ${contatos.length} contatos importados (esperado: ${this.totalEsperado})`);
            }
            
            return contatos;
            
        } catch (error) {
            console.error('❌ Erro ao buscar contatos:', error);
            return [];
        }
    },
    
    // Sincronizar com localStorage e interface
    async sincronizar() {
        console.log('🚀 Iniciando sincronização completa...');
        
        const contatos = await this.buscarTodosContatos();
        
        if (contatos.length === 0) {
            console.error('❌ Nenhum contato encontrado!');
            return { sucesso: false, total: 0 };
        }
        
        // Salvar no localStorage
        localStorage.setItem('enside_contatos', JSON.stringify(contatos));
        localStorage.setItem('enside_contatos_total', contatos.length);
        localStorage.setItem('enside_ultima_sincronizacao', new Date().toISOString());
        
        // Calcular estatísticas
        const stats = {
            total: contatos.length,
            fornecedores: contatos.filter(c => c.categoria === 'FORNECEDOR').length,
            clientes: contatos.filter(c => c.categoria === 'CLIENTE').length,
            transportadores: contatos.filter(c => c.categoria === 'TRANSPORTADOR').length,
            outros: contatos.filter(c => !['FORNECEDOR', 'CLIENTE', 'TRANSPORTADOR'].includes(c.categoria)).length
        };
        
        console.log('📊 Estatísticas:');
        console.log(`   Total: ${stats.total}`);
        console.log(`   Fornecedores: ${stats.fornecedores}`);
        console.log(`   Clientes: ${stats.clientes}`);
        console.log(`   Transportadores: ${stats.transportadores}`);
        console.log(`   Outros: ${stats.outros}`);
        
        // Atualizar interface
        this.atualizarInterface(stats);
        
        return { sucesso: true, total: contatos.length, stats };
    },
    
    // Atualizar elementos na interface
    atualizarInterface(stats) {
        // Tentar atualizar vários seletores possíveis
        const seletores = [
            { id: 'total-contatos', valor: stats.total },
            { id: 'totalContatos', valor: stats.total },
            { id: 'contatos-total', valor: stats.total },
            { id: 'total-fornecedores', valor: stats.fornecedores },
            { id: 'totalFornecedores', valor: stats.fornecedores },
            { id: 'total-clientes', valor: stats.clientes },
            { id: 'totalClientes', valor: stats.clientes },
            { id: 'total-transportadores', valor: stats.transportadores },
            { id: 'totalTransportadores', valor: stats.transportadores }
        ];
        
        seletores.forEach(({ id, valor }) => {
            const el = document.getElementById(id);
            if (el) {
                el.textContent = valor.toLocaleString('pt-BR') + '+';
                console.log(`✅ Atualizado #${id}: ${valor}`);
            }
        });
        
        // Atualizar cards com classe
        document.querySelectorAll('.stat-number, .stats-number, .card-number').forEach(el => {
            if (el.closest('[data-stat="contatos"]') || el.textContent.includes('Contatos')) {
                el.textContent = stats.total.toLocaleString('pt-BR') + '+';
            }
        });
    },
    
    // Executar sincronização automática
    async init() {
        console.log('🤖 SINCRONIZAR_CONTATOS inicializado');
        
        // Sincronizar ao carregar
        const resultado = await this.sincronizar();
        
        if (resultado.sucesso) {
            console.log(`✅ Sincronização concluída: ${resultado.total} contatos`);
        }
        
        return resultado;
    }
};

// Exportar para uso global
if (typeof window !== 'undefined') {
    window.SINCRONIZAR_CONTATOS = SINCRONIZAR_CONTATOS;
    
    // Auto-executar quando DOM estiver pronto
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => SINCRONIZAR_CONTATOS.init());
    } else {
        SINCRONIZAR_CONTATOS.init();
    }
}

console.log('✅ Script SINCRONIZAR_7055_CONTATOS carregado');
