/**
 * SINCRONIZAR_LISTAS_TRANSMISSAO.js
 * Sincroniza listas de transmissão com Google Sheets
 * 
 * Lógica:
 * 1. Lê definições de listas da aba LISTAS_TRANSMISSAO
 * 2. Busca contatos da aba CONTATOS
 * 3. Filtra contatos por CATEGORIA/SUBCATEGORIA
 * 4. Popula cada lista com os contatos correspondentes
 */

const SHEETS_CONFIG = {
    spreadsheetId: '1FiP885Or0ncyRG_ZZaAvM2vP0sHhDzhLFYifYLjKyIE',
    abas: {
        LISTAS_TRANSMISSAO: {
            gid: 1114979046,
            colunas: {
                ID: 'A',
                NOME_LISTA: 'B',
                CATEGORIA: 'C',
                SUBCATEGORIA: 'D'
            }
        },
        CONTATOS: {
            gid: 1689968688,
            colunas: {
                CHECKBOX: 'A',
                NOME: 'B',
                TELEFONE: 'C',
                CATEGORIA: 'D',
                PRODUTO: 'E',
                CIDADE: 'F',
                UF: 'G'
            }
        }
    }
};

/**
 * Constrói URL para buscar dados do Google Sheets via API pública
 */
function buildSheetsUrl(aba, range = '') {
    const baseUrl = `https://docs.google.com/spreadsheets/d/${SHEETS_CONFIG.spreadsheetId}/gviz/tq`;
    const gid = SHEETS_CONFIG.abas[aba].gid;
    let url = `${baseUrl}?gid=${gid}&tqx=out:json`;
    if (range) {
        url += `&range=${encodeURIComponent(range)}`;
    }
    return url;
}

/**
 * Busca dados de uma aba do Google Sheets
 */
async function fetchSheetData(aba) {
    try {
        const url = buildSheetsUrl(aba);
        const response = await fetch(url);
        const text = await response.text();
        
        // Remove o wrapper do Google Visualization
        const jsonStr = text.replace(/^.*google.visualization.Query.setResponse\(/, '').replace(/\);?$/, '');
        const data = JSON.parse(jsonStr);
        
        if (!data.table || !data.table.rows) {
            console.error(`Nenhum dado encontrado na aba ${aba}`);
            return [];
        }
        
        // Converte para array de objetos
        const headers = data.table.cols.map(col => col.label || col.id);
        const rows = data.table.rows.map(row => {
            const obj = {};
            row.c.forEach((cell, index) => {
                obj[headers[index]] = cell ? (cell.v || cell.f || '') : '';
            });
            return obj;
        });
        
        return rows;
    } catch (error) {
        console.error(`Erro ao buscar dados da aba ${aba}:`, error);
        return [];
    }
}

/**
 * Sincroniza listas de transmissão
 */
async function sincronizarListasTransmissao() {
    console.log('🔄 Iniciando sincronização de Listas de Transmissão...');
    
    try {
        // 1. Buscar definições de listas
        console.log('📋 Buscando definições de listas...');
        const definicoes = await fetchSheetData('LISTAS_TRANSMISSAO');
        console.log(`   Encontradas ${definicoes.length} definições de listas`);
        
        // 2. Buscar todos os contatos
        console.log('📞 Buscando contatos...');
        const contatos = await fetchSheetData('CONTATOS');
        console.log(`   Encontrados ${contatos.length} contatos`);
        
        // 3. Criar listas com contatos filtrados
        const listas = [];
        
        for (const def of definicoes) {
            const nomeLista = def.aNOME_LISTA || def.NOME_LISTA || def.B || '';
            const categoria = def.aCATEGORIA || def.CATEGORIA || def.C || '';
            const subcategoria = def.aSUBCATEGORIA || def.SUBCATEGORIA || def.D || '';
            
            if (!nomeLista) continue;
            
            // Filtrar contatos por categoria/subcategoria
            let contatosFiltrados = contatos.filter(c => {
                const catContato = (c.CATEGORIA || c.D || '').toUpperCase();
                const prodContato = (c.PRODUTO || c.E || '').toUpperCase();
                
                // Se subcategoria é "TODOS", pega todos da categoria
                if (subcategoria.toUpperCase() === 'TODOS') {
                    return catContato === categoria.toUpperCase();
                }
                
                // Senão, filtra por categoria E subcategoria (no campo PRODUTO)
                return catContato === categoria.toUpperCase() && 
                       prodContato.includes(subcategoria.toUpperCase());
            });
            
            // Extrair apenas nome e telefone
            const contatosLista = contatosFiltrados.map(c => ({
                nome: c.NOME || c.B || '',
                telefone: c.TELEFONE || c.C || '',
                categoria: c.CATEGORIA || c.D || '',
                cidade: c.CIDADE || c.F || '',
                uf: c.UF || c.G || ''
            })).filter(c => c.telefone); // Apenas contatos com telefone
            
            listas.push({
                id: `lista_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                nome: nomeLista,
                categoria: categoria,
                subcategoria: subcategoria,
                contatos: contatosLista,
                totalContatos: contatosLista.length,
                sincronizada: true,
                ultimaSincronizacao: new Date().toISOString()
            });
            
            console.log(`   ✅ ${nomeLista}: ${contatosLista.length} contatos`);
        }
        
        // 4. Salvar no localStorage
        localStorage.setItem('listasTransmissao', JSON.stringify(listas));
        localStorage.setItem('listasTransmissao_ultimaSync', new Date().toISOString());
        
        console.log(`
🎉 Sincronização concluída!`);
        console.log(`   Total de listas: ${listas.length}`);
        console.log(`   Total de contatos: ${listas.reduce((sum, l) => sum + l.totalContatos, 0)}`);
        
        return {
            success: true,
            listas: listas,
            totalListas: listas.length,
            totalContatos: listas.reduce((sum, l) => sum + l.totalContatos, 0)
        };
        
    } catch (error) {
        console.error('❌ Erro na sincronização:', error);
        return {
            success: false,
            error: error.message
        };
    }
}

/**
 * Atualiza a interface com as listas sincronizadas
 */
function atualizarInterfaceListas() {
    const listas = JSON.parse(localStorage.getItem('listasTransmissao') || '[]');
    const container = document.getElementById('listasContainer') || document.querySelector('.listas-container');
    
    if (!container) {
        console.warn('Container de listas não encontrado');
        return;
    }
    
    container.innerHTML = '';
    
    listas.forEach(lista => {
        const card = document.createElement('div');
        card.className = 'lista-card';
        card.innerHTML = `
            <div class="lista-header">
                <h3>${lista.nome}</h3>
                <span class="badge ${lista.sincronizada ? 'sincronizada' : ''}">
                    ${lista.sincronizada ? 'sincronizada' : 'pendente'}
                </span>
            </div>
            <div class="lista-stats">
                <span class="total">${lista.totalContatos}</span>
                <span class="label">contatos</span>
            </div>
            <div class="lista-info">
                <span>Categoria: ${lista.categoria}</span>
                <span>Subcategoria: ${lista.subcategoria}</span>
            </div>
            <div class="lista-actions">
                <button onclick="enviarLista('${lista.id}')" class="btn-enviar">
                    <span>📤</span> Enviar
                </button>
                <button onclick="exportarListaCSV('${lista.id}')" class="btn-csv">
                    <span>📄</span> CSV
                </button>
                <button onclick="verContatos('${lista.id}')" class="btn-ver">
                    <span>👁</span> Ver
                </button>
            </div>
        `;
        container.appendChild(card);
    });
}

/**
 * Exporta lista para CSV
 */
function exportarListaCSV(listaId) {
    const listas = JSON.parse(localStorage.getItem('listasTransmissao') || '[]');
    const lista = listas.find(l => l.id === listaId);
    
    if (!lista) {
        alert('Lista não encontrada');
        return;
    }
    
    const csv = [
        'Nome,Telefone,Categoria,Cidade,UF',
        ...lista.contatos.map(c => `"${c.nome}","${c.telefone}","${c.categoria}","${c.cidade}","${c.uf}"`)
    ].join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${lista.nome.replace(/\s+/g, '_')}.csv`;
    link.click();
}

/**
 * Ver contatos de uma lista
 */
function verContatos(listaId) {
    const listas = JSON.parse(localStorage.getItem('listasTransmissao') || '[]');
    const lista = listas.find(l => l.id === listaId);
    
    if (!lista) {
        alert('Lista não encontrada');
        return;
    }
    
    const contatosHtml = lista.contatos.slice(0, 50).map(c => 
        `<tr><td>${c.nome}</td><td>${c.telefone}</td><td>${c.cidade}/${c.uf}</td></tr>`
    ).join('');
    
    const modal = document.createElement('div');
    modal.className = 'modal-contatos';
    modal.innerHTML = `
        <div class="modal-content">
            <h2>${lista.nome} (${lista.totalContatos} contatos)</h2>
            <table>
                <thead><tr><th>Nome</th><th>Telefone</th><th>Local</th></tr></thead>
                <tbody>${contatosHtml}</tbody>
            </table>
            ${lista.totalContatos > 50 ? `<p>Mostrando 50 de ${lista.totalContatos} contatos</p>` : ''}
            <button onclick="this.parentElement.parentElement.remove()">Fechar</button>
        </div>
    `;
    document.body.appendChild(modal);
}

// Exportar funções globalmente
window.sincronizarListasTransmissao = sincronizarListasTransmissao;
window.atualizarInterfaceListas = atualizarInterfaceListas;
window.exportarListaCSV = exportarListaCSV;
window.verContatos = verContatos;

console.log('✅ SINCRONIZAR_LISTAS_TRANSMISSAO.js carregado');
console.log('   Use: sincronizarListasTransmissao() para sincronizar');
