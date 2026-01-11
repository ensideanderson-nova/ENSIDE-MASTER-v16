/**
 * GOOGLE APPS SCRIPT - Sistema de Captação de Fretes
 * Anderson Enside Logística
 * Deploy este código como Web App
 */

// ID da planilha
const SPREADSHEET_ID = '1FiP885Or0ncyRG_ZZaAvM2vP0sHhDzhLFYifYLjKyIE';

/**
 * Função principal - recebe POST requests
 */
function doPost(e) {
  try {
    const dados = JSON.parse(e.postData.contents);
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    
    let resultado;
    
    switch(dados.tipo) {
      case 'CAPTACAO_INICIAL':
        resultado = salvarCaptacao(ss, dados.dados);
        break;
      case 'FRETE_ADMIN':
        resultado = salvarFrete(ss, dados.dados);
        break;
      case 'PROPOSTA_FRETE':
        resultado = salvarProposta(ss, dados.dados);
        break;
      case 'ROTA_PREFERIDA':
        resultado = salvarRotaPreferida(ss, dados.dados);
        break;
      case 'ATUALIZAR_FRETE':
        resultado = atualizarFrete(ss, dados.dados);
        break;
      case 'ATUALIZAR_PROPOSTA':
        resultado = atualizarProposta(ss, dados.dados);
        break;
      case 'ATUALIZAR_ROTA':
        resultado = atualizarRota(ss, dados.dados);
        break;
      default:
        resultado = { erro: 'Tipo inválido: ' + dados.tipo };
    }
    
    return ContentService
      .createTextOutput(JSON.stringify(resultado))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (erro) {
    return ContentService
      .createTextOutput(JSON.stringify({ 
        erro: erro.toString(),
        stack: erro.stack
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Teste GET - verifica se está online
 */
function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ 
      status: 'online',
      timestamp: new Date().toISOString(),
      spreadsheet: SPREADSHEET_ID
    }))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Salvar captação inicial de motorista
 */
function salvarCaptacao(ss, dados) {
  const aba = ss.getSheetByName('CAPTACAO_FRETES');
  
  if (!aba) {
    throw new Error('Aba CAPTACAO_FRETES não encontrada');
  }
  
  aba.appendRow([
    dados.TIMESTAMP || new Date().toISOString(),
    dados.NOME_COMPLETO,
    dados.WHATSAPP,
    dados.INTERESSE_SEGURO,
    dados.ORIGEM,
    dados.STATUS
  ]);
  
  return { sucesso: true, tipo: 'CAPTACAO_INICIAL' };
}

/**
 * Salvar frete
 */
function salvarFrete(ss, dados) {
  const aba = ss.getSheetByName('FRETES_DISPONIVEIS');
  
  if (!aba) {
    throw new Error('Aba FRETES_DISPONIVEIS não encontrada');
  }
  
  aba.appendRow([
    dados.ID,
    dados.STATUS,
    dados.URGENTE,
    dados.ORIGEM_UF,
    dados.ORIGEM_CIDADE,
    dados.DESTINO_UF,
    dados.DESTINO_CIDADE,
    dados.DISTANCIA_KM,
    dados.VALOR_SUGERIDO,
    dados.VALOR_POR_KM,
    dados.TIPO_VEICULO,
    dados.TIPO_CARGA,
    dados.PESO_TON,
    dados.DATA_EMBARQUE,
    dados.OBSERVACOES,
    dados.VAGAS,
    dados.VISUALIZACOES || 0,
    dados.PROPOSTAS || 0,
    dados.CRIADO_EM,
    dados.ATUALIZADO_EM
  ]);
  
  return { sucesso: true, tipo: 'FRETE_ADMIN', id: dados.ID };
}

/**
 * Salvar proposta de frete
 */
function salvarProposta(ss, dados) {
  let aba = ss.getSheetByName('PROPOSTAS_FRETES');
  
  // Criar aba se não existir
  if (!aba) {
    aba = ss.insertSheet('PROPOSTAS_FRETES');
    aba.appendRow(['ID', 'FRETE_ID', 'MOTORISTA_NOME', 'MOTORISTA_WHATSAPP', 'ROTA', 
                   'VALOR_SUGERIDO', 'VALOR_PROPOSTA', 'DESCONTO_PCT', 'VEICULO_PLACA', 
                   'VEICULO_TIPO', 'DISPONIBILIDADE', 'OBSERVACOES', 'STATUS', 
                   'MOTIVO_RECUSA', 'DATA_PROPOSTA', 'DATA_RESPOSTA', 'TEMPO_RESPOSTA_H']);
  }
  
  aba.appendRow([
    dados.ID,
    dados.FRETE_ID,
    dados.MOTORISTA_NOME,
    dados.MOTORISTA_WHATSAPP,
    dados.ROTA,
    dados.VALOR_SUGERIDO,
    dados.VALOR_PROPOSTA,
    dados.DESCONTO_PCT,
    dados.VEICULO_PLACA,
    dados.VEICULO_TIPO,
    dados.DISPONIBILIDADE,
    dados.OBSERVACOES,
    dados.STATUS,
    dados.MOTIVO_RECUSA || '',
    dados.DATA_PROPOSTA,
    dados.DATA_RESPOSTA || '',
    dados.TEMPO_RESPOSTA_H || 0
  ]);
  
  // Atualizar contador de propostas do frete
  atualizarContadorPropostas(ss, dados.FRETE_ID);
  
  return { sucesso: true, tipo: 'PROPOSTA_FRETE', id: dados.ID };
}

/**
 * Salvar rota preferida
 */
function salvarRotaPreferida(ss, dados) {
  let aba = ss.getSheetByName('ROTAS_PREFERIDAS_MOTORISTAS');
  
  // Criar aba se não existir
  if (!aba) {
    aba = ss.insertSheet('ROTAS_PREFERIDAS_MOTORISTAS');
    aba.appendRow(['ID', 'MOTORISTA_NOME', 'MOTORISTA_WHATSAPP', 'ORIGEM_CIDADE', 
                   'ORIGEM_UF', 'ORIGEM_FLEXIVEL', 'DESTINO_CIDADE', 'DESTINO_UF', 
                   'DESTINO_FLEXIVEL', 'RAIO_KM', 'TIPO_VEICULO', 'TIPOS_CARGA', 
                   'CAPACIDADE_TON', 'VALOR_MINIMO', 'DIAS_SEMANA', 'DISPONIBILIDADE', 
                   'NOTIFICAR_WHATSAPP', 'STATUS', 'CRIADO_EM', 'ATUALIZADO_EM']);
  }
  
  aba.appendRow([
    dados.ID,
    dados.MOTORISTA_NOME,
    dados.MOTORISTA_WHATSAPP,
    dados.ORIGEM_CIDADE,
    dados.ORIGEM_UF,
    dados.ORIGEM_FLEXIVEL,
    dados.DESTINO_CIDADE,
    dados.DESTINO_UF,
    dados.DESTINO_FLEXIVEL,
    dados.RAIO_KM,
    dados.TIPO_VEICULO,
    dados.TIPOS_CARGA,
    dados.CAPACIDADE_TON,
    dados.VALOR_MINIMO,
    dados.DIAS_SEMANA,
    dados.DISPONIBILIDADE,
    dados.NOTIFICAR_WHATSAPP,
    dados.STATUS,
    dados.CRIADO_EM,
    dados.ATUALIZADO_EM
  ]);
  
  return { sucesso: true, tipo: 'ROTA_PREFERIDA', id: dados.ID };
}

/**
 * Atualizar frete
 */
function atualizarFrete(ss, dados) {
  const aba = ss.getSheetByName('FRETES_DISPONIVEIS');
  const allDados = aba.getDataRange().getValues();
  
  for (let i = 1; i < allDados.length; i++) {
    if (allDados[i][0] === dados.ID) {
      // Atualizar campos fornecidos
      if (dados.STATUS) aba.getRange(i + 1, 2).setValue(dados.STATUS);
      if (dados.ATUALIZADO_EM) aba.getRange(i + 1, 20).setValue(dados.ATUALIZADO_EM);
      
      return { sucesso: true, tipo: 'ATUALIZAR_FRETE', id: dados.ID };
    }
  }
  
  return { erro: 'Frete não encontrado' };
}

/**
 * Atualizar proposta
 */
function atualizarProposta(ss, dados) {
  const aba = ss.getSheetByName('PROPOSTAS_FRETES');
  
  if (!aba) {
    return { erro: 'Aba PROPOSTAS_FRETES não encontrada' };
  }
  
  const allDados = aba.getDataRange().getValues();
  
  for (let i = 1; i < allDados.length; i++) {
    if (allDados[i][0] === dados.ID) {
      if (dados.STATUS) aba.getRange(i + 1, 13).setValue(dados.STATUS);
      if (dados.MOTIVO_RECUSA) aba.getRange(i + 1, 14).setValue(dados.MOTIVO_RECUSA);
      if (dados.DATA_RESPOSTA) aba.getRange(i + 1, 16).setValue(dados.DATA_RESPOSTA);
      
      return { sucesso: true, tipo: 'ATUALIZAR_PROPOSTA', id: dados.ID };
    }
  }
  
  return { erro: 'Proposta não encontrada' };
}

/**
 * Atualizar rota preferida
 */
function atualizarRota(ss, dados) {
  const aba = ss.getSheetByName('ROTAS_PREFERIDAS_MOTORISTAS');
  
  if (!aba) {
    return { erro: 'Aba ROTAS_PREFERIDAS_MOTORISTAS não encontrada' };
  }
  
  const allDados = aba.getDataRange().getValues();
  
  for (let i = 1; i < allDados.length; i++) {
    if (allDados[i][0] === dados.ID) {
      if (dados.STATUS) aba.getRange(i + 1, 18).setValue(dados.STATUS);
      if (dados.ATUALIZADO_EM) aba.getRange(i + 1, 20).setValue(dados.ATUALIZADO_EM);
      
      return { sucesso: true, tipo: 'ATUALIZAR_ROTA', id: dados.ID };
    }
  }
  
  return { erro: 'Rota não encontrada' };
}

/**
 * Atualizar contador de propostas do frete
 */
function atualizarContadorPropostas(ss, freteId) {
  const aba = ss.getSheetByName('FRETES_DISPONIVEIS');
  
  if (!aba) return;
  
  const dados = aba.getDataRange().getValues();
  
  for (let i = 1; i < dados.length; i++) {
    if (dados[i][0] === freteId) {
      const propostasAtual = dados[i][17] || 0;
      aba.getRange(i + 1, 18).setValue(parseInt(propostasAtual) + 1);
      break;
    }
  }
}

/**
 * Criar abas necessárias (executar uma vez)
 */
function criarAbasNovas() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  
  // ROTAS_PREFERIDAS_MOTORISTAS
  let aba = ss.getSheetByName('ROTAS_PREFERIDAS_MOTORISTAS');
  if (!aba) {
    aba = ss.insertSheet('ROTAS_PREFERIDAS_MOTORISTAS');
    aba.appendRow(['ID', 'MOTORISTA_NOME', 'MOTORISTA_WHATSAPP', 'ORIGEM_CIDADE', 
                   'ORIGEM_UF', 'ORIGEM_FLEXIVEL', 'DESTINO_CIDADE', 'DESTINO_UF', 
                   'DESTINO_FLEXIVEL', 'RAIO_KM', 'TIPO_VEICULO', 'TIPOS_CARGA', 
                   'CAPACIDADE_TON', 'VALOR_MINIMO', 'DIAS_SEMANA', 'DISPONIBILIDADE', 
                   'NOTIFICAR_WHATSAPP', 'STATUS', 'CRIADO_EM', 'ATUALIZADO_EM']);
    Logger.log('✅ Aba ROTAS_PREFERIDAS_MOTORISTAS criada');
  }
  
  // PROPOSTAS_FRETES
  aba = ss.getSheetByName('PROPOSTAS_FRETES');
  if (!aba) {
    aba = ss.insertSheet('PROPOSTAS_FRETES');
    aba.appendRow(['ID', 'FRETE_ID', 'MOTORISTA_NOME', 'MOTORISTA_WHATSAPP', 'ROTA', 
                   'VALOR_SUGERIDO', 'VALOR_PROPOSTA', 'DESCONTO_PCT', 'VEICULO_PLACA', 
                   'VEICULO_TIPO', 'DISPONIBILIDADE', 'OBSERVACOES', 'STATUS', 
                   'MOTIVO_RECUSA', 'DATA_PROPOSTA', 'DATA_RESPOSTA', 'TEMPO_RESPOSTA_H']);
    Logger.log('✅ Aba PROPOSTAS_FRETES criada');
  }
  
  Logger.log('✅ Todas as abas estão prontas!');
  return 'Abas criadas com sucesso!';
}
