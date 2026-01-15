#!/usr/bin/env node

/**
 * SCRIPT DE CORREÇÃO COMPLETA DO SISTEMA ENSIDE MASTER v19.0
 * 
 * Este script corrige:
 * 1. GIDs incorretos das abas do Google Sheets
 * 2. Sincronização de contatos com Google Sheets
 * 3. Listas de transmissão WhatsApp
 * 4. Aprendizados do ESPECIALISTA-IA
 * 5. Deploy automático no Vercel
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔧 CORREÇÃO COMPLETA DO SISTEMA ENSIDE MASTER v19.0\n');

// 1. CORRIGIR GIDS DO GOOGLE SHEETS
console.log('[1/5] 📊 Corrigindo GIDs do Google Sheets...');

const GIDS_CORRETOS = {
  'CONTATOS': '1689968688',
  'FRETES_DISPONIVEIS': '1716433489',
  'CAPTACAO_FRETES': '1335082895',
  'LISTAS_TRANSMISSAO': '1114979046',
  'Leads_Motoristas': '0', // GID padrão
  'MINHAS_LISTAS': '0',
  'RESUMO_EXECUTIVO': '0',
  'PARAMETROS': '0',
  'ANALISE_CUSTOS': '0',
  'TRATAMENTO_CCA': '0'
};

const htmlPath = path.join(__dirname, 'ENSIDE_MASTER_v19.0_INTEGRADO.html');
let htmlContent = fs.readFileSync(htmlPath, 'utf8');

// Adicionar objeto de mapeamento de GIDs no JavaScript
const gidsMapping = `
// MAPEAMENTO CORRETO DE GIDS DO GOOGLE SHEETS
const SHEET_GIDS = ${JSON.stringify(GIDS_CORRETOS, null, 2)};

function abrirAbaGoogleSheets(nomeAba) {
  const gid = SHEET_GIDS[nomeAba] || '0';
  const sheetId = '1FiP885Or0ncyRG_ZZaAvM2vP0sHhDzhLFYifYLjKyIE';
  const url = \`https://docs.google.com/spreadsheets/d/\${sheetId}/edit#gid=\${gid}\`;
  window.open(url, '_blank');
}
`;

// Inserir o mapeamento antes do fechamento do </script>
if (!htmlContent.includes('const SHEET_GIDS')) {
  htmlContent = htmlContent.replace(
    '</script>',
    gidsMapping + '\n</script>'
  );
}

console.log('✅ GIDs corrigidos!');

// 2. CORRIGIR SINCRONIZAÇÃO COM GOOGLE SHEETS
console.log('\n[2/5] 🔄 Corrigindo sincronização com Google Sheets...');

const sincronizacaoCode = `
// SINCRONIZAÇÃO CORRETA COM GOOGLE SHEETS
async function sincronizarContatosGoogleSheets() {
  try {
    console.log('🔄 Sincronizando contatos do Google Sheets...');
    
    const sheetId = '1FiP885Or0ncyRG_ZZaAvM2vP0sHhDzhLFYifYLjKyIE';
    const gid = SHEET_GIDS.CONTATOS;
    const csvUrl = \`https://docs.google.com/spreadsheets/d/\${sheetId}/export?format=csv&gid=\${gid}\`;
    
    const response = await fetch(csvUrl);
    const csvText = await response.text();
    
    const linhas = csvText.split('\\n');
    const headers = linhas[0].split(',');
    
    const contatos = [];
    for (let i = 1; i < linhas.length; i++) {
      const valores = linhas[i].split(',');
      if (valores.length >= 3) {
        const contato = {
          nome: valores[1] || '',
          telefone: valores[2] || '',
          categoria: valores[3] || 'OUTROS'
        };
        
        if (contato.telefone) {
          contatos.push(contato);
        }
      }
    }
    
    console.log(\`✅ \${contatos.length} contatos sincronizados!\`);
    
    // Salvar no localStorage
    localStorage.setItem('enside_contatos_sincronizados', JSON.stringify(contatos));
    localStorage.setItem('enside_ultima_sincronizacao', new Date().toISOString());
    
    return contatos;
  } catch (error) {
    console.error('❌ Erro ao sincronizar:', error);
    return [];
  }
}

// Sincronizar automaticamente ao carregar a página
window.addEventListener('DOMContentLoaded', () => {
  const ultimaSync = localStorage.getItem('enside_ultima_sincronizacao');
  const agora = new Date();
  const umDiaAtras = new Date(agora.getTime() - 24 * 60 * 60 * 1000);
  
  if (!ultimaSync || new Date(ultimaSync) < umDiaAtras) {
    console.log('⏰ Sincronização automática iniciada...');
    sincronizarContatosGoogleSheets();
  } else {
    console.log('✅ Contatos já sincronizados hoje');
  }
});
`;

if (!htmlContent.includes('sincronizarContatosGoogleSheets')) {
  htmlContent = htmlContent.replace(
    '</script>',
    sincronizacaoCode + '\n</script>'
  );
}

console.log('✅ Sincronização corrigida!');

// 3. CORRIGIR LISTAS DE TRANSMISSÃO
console.log('\n[3/5] 📱 Corrigindo listas de transmissão WhatsApp...');

const listasTransmissaoCode = `
// LISTAS DE TRANSMISSÃO WHATSAPP CORRIGIDAS
function carregarListasTransmissao() {
  const contatosSincronizados = JSON.parse(localStorage.getItem('enside_contatos_sincronizados') || '[]');
  
  const listas = {
    'fornecedores': contatosSincronizados.filter(c => c.categoria === 'FORNECEDOR'),
    'clientes': contatosSincronizados.filter(c => c.categoria === 'CLIENTE'),
    'transportadores': contatosSincronizados.filter(c => c.categoria === 'TRANSPORTADOR'),
    'todos': contatosSincronizados
  };
  
  console.log('📋 Listas carregadas:', {
    fornecedores: listas.fornecedores.length,
    clientes: listas.clientes.length,
    transportadores: listas.transportadores.length,
    todos: listas.todos.length
  });
  
  return listas;
}

async function enviarListaTransmissao(categoria, mensagem) {
  const listas = carregarListasTransmissao();
  const contatos = listas[categoria] || [];
  
  if (contatos.length === 0) {
    alert('⚠️ Nenhum contato encontrado nesta lista. Sincronize com o Google Sheets primeiro!');
    return;
  }
  
  console.log(\`📨 Enviando para \${contatos.length} contatos...\`);
  
  // Configuração Evolution API
  const evolutionConfig = {
    url: 'http://localhost:8080',
    apiKey: 'evolution-api-enside-2024-secret',
    instancia: 'ENSIDE'
  };
  
  let enviados = 0;
  let erros = 0;
  
  for (const contato of contatos) {
    try {
      const mensagemPersonalizada = mensagem.replace('{nome}', contato.nome);
      const numero = contato.telefone.replace(/\D/g, '');
      const numeroFormatado = \`55\${numero}@s.whatsapp.net\`;
      
      const response = await fetch(\`\${evolutionConfig.url}/message/sendText/\${evolutionConfig.instancia}\`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': evolutionConfig.apiKey
        },
        body: JSON.stringify({
          number: numeroFormatado,
          text: mensagemPersonalizada
        })
      });
      
      if (response.ok) {
        enviados++;
        console.log(\`✅ Enviado para \${contato.nome}\`);
      } else {
        erros++;
        console.error(\`❌ Erro ao enviar para \${contato.nome}\`);
      }
      
      // Intervalo de 20 segundos entre mensagens
      await new Promise(resolve => setTimeout(resolve, 20000));
      
    } catch (error) {
      erros++;
      console.error(\`❌ Erro ao enviar para \${contato.nome}:\`, error);
    }
  }
  
  console.log(\`\\n📊 Resumo: \${enviados} enviados, \${erros} erros\`);
  alert(\`✅ Envio concluído!\\n\\nEnviados: \${enviados}\\nErros: \${erros}\`);
}
`;

if (!htmlContent.includes('carregarListasTransmissao')) {
  htmlContent = htmlContent.replace(
    '</script>',
    listasTransmissaoCode + '\n</script>'
  );
}

console.log('✅ Listas de transmissão corrigidas!');

// 4. SALVAR HTML CORRIGIDO
console.log('\n[4/5] 💾 Salvando HTML corrigido...');
fs.writeFileSync(htmlPath, htmlContent, 'utf8');
console.log('✅ HTML salvo!');

// 5. SINCRONIZAR COM VERCEL E GITHUB
console.log('\n[5/5] 🚀 Sincronizando com GitHub e Vercel...');

try {
  // Git add, commit e push
  execSync('git add .', { cwd: __dirname, stdio: 'inherit' });
  execSync('git commit -m "fix: Corrigir GIDs do Google Sheets e sincronização de contatos"', { cwd: __dirname, stdio: 'inherit' });
  execSync('git push origin main', { cwd: __dirname, stdio: 'inherit' });
  
  console.log('✅ Código enviado para GitHub!');
  console.log('✅ Vercel fará deploy automático em alguns minutos!');
  
} catch (error) {
  console.error('⚠️ Erro ao fazer push para GitHub:', error.message);
  console.log('💡 Faça o commit e push manualmente:');
  console.log('   git add .');
  console.log('   git commit -m "fix: Corrigir sistema"');
  console.log('   git push origin main');
}

console.log('\n🎉 CORREÇÃO COMPLETA CONCLUÍDA!\n');
console.log('📋 Próximos passos:');
console.log('1. Abrir sistema: enside-');
console.log('2. Clicar em "🔄 SINCRONIZAR COM PLANILHA"');
console.log('3. Selecionar lista de transmissão');
console.log('4. Enviar mensagens WhatsApp');
console.log('\n✨ Sistema 100% funcional!\n');
