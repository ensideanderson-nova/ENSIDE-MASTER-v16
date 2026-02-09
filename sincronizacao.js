// SINCRONIZAÇÃO CENTRALIZADA - TODOS OS CONTATOS DA PLANILHA EUCALIPTO
const GOOGLE_SHEETS_CONFIG = {
  sheetId: '1FiP885Or0ncyRG_ZZaAvM2vP0sHhDzhLFYifYLjKyIE',
  abas: {
    CONTATOS: '1689968688',
    LISTAS_TRANSMISSAO: '1114979046',
    FRETES_DISPONIVEIS: '1716433489',
    CAPTACAO_FRETES: '1335082895'
  }
};

let CONTATOS_SINCRONIZADOS = [];
let LISTAS_SINCRONIZADAS = [];

async function sincronizarTudo() {
  console.log('🔄 SINCRONIZAÇÃO CENTRALIZADA INICIADA...');
  
  // 1. Carregar TODOS os contatos
  const urlContatos = `https://docs.google.com/spreadsheets/d/${GOOGLE_SHEETS_CONFIG.sheetId}/export?format=csv&gid=${GOOGLE_SHEETS_CONFIG.abas.CONTATOS}`;
  const resp = await fetch(urlContatos);
  const csv = await resp.text();
  const linhas = csv.split('\n');
  
  CONTATOS_SINCRONIZADOS = [];
  for (let i = 1; i < linhas.length; i++) {
    const cols = linhas[i].split(',');
    if (cols[2]) {
      CONTATOS_SINCRONIZADOS.push({
        nome: cols[1] || '',
        telefone: cols[2],
        categoria: cols[3] || 'OUTROS',
        subcategoria: cols[4] || '',
        cidade: cols[5] || '',
        uf: cols[6] || ''
      });
    }
  }
  
  console.log(`✅ ${CONTATOS_SINCRONIZADOS.length} contatos carregados!`);
  localStorage.setItem('enside_contatos', JSON.stringify(CONTATOS_SINCRONIZADOS));
  
  // Atualizar contadores na página
  document.querySelectorAll('[data-contador-contatos]').forEach(el => {
    el.textContent = CONTATOS_SINCRONIZADOS.length.toLocaleString();
  });
  
  return CONTATOS_SINCRONIZADOS;
}

window.sincronizarTudo = sincronizarTudo;
window.CONTATOS_SINCRONIZADOS = CONTATOS_SINCRONIZADOS;
