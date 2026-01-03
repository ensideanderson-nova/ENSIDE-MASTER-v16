// ========================================
// FUNÇÕES PARA FORMATAR NÚMEROS COM 55
// Cole este código no Apps Script da planilha
// ========================================

// Adiciona opção no menu
function onOpen() {
  SpreadsheetApp.getUi().createMenu('ENSIDE WhatsApp')
    .addItem('Formatar Números (adicionar 55)', 'formatarNumeros')
    .addItem('Criar Lista dos Selecionados', 'criarLista')
    .addItem('Exportar para JSON', 'exportarJSON')
    .addToUi();
}

// Formata todos os números da coluna C adicionando 55
function formatarNumeros() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('CONTATOS');
  var lastRow = sheet.getLastRow();
  var range = sheet.getRange('C2:C' + lastRow);
  var valores = range.getValues();
  var alterados = 0;
  
  for (var i = 0; i < valores.length; i++) {
    var telefone = valores[i][0].toString();
    var formatado = formatarTelefone(telefone);
    if (formatado !== telefone) {
      valores[i][0] = formatado;
      alterados++;
    }
  }
  
  range.setValues(valores);
  SpreadsheetApp.getUi().alert('Formatação concluída!\n\nNúmeros alterados: ' + alterados + '\nTotal de contatos: ' + valores.length);
}

// Formata um telefone individual
function formatarTelefone(telefone) {
  // Remove tudo que não é número
  var numero = telefone.toString().replace(/\D/g, '');
  
  // Se estiver vazio, retorna vazio
  if (!numero) return '';
  
  // Se já começa com 55 e tem 12-13 dígitos, está ok
  if (numero.startsWith('55') && numero.length >= 12) {
    return numero;
  }
  
  // Se tem 10-11 dígitos (DDD + número), adiciona 55
  if (numero.length >= 10 && numero.length <= 11) {
    return '55' + numero;
  }
  
  // Se tem 8-9 dígitos (só número sem DDD), retorna como está
  // (precisa adicionar DDD manualmente)
  return numero;
}

// Exporta contatos formatados para JSON
function exportarJSON() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('CONTATOS');
  var dados = sheet.getDataRange().getValues();
  var contatos = [];
  
  for (var i = 1; i < dados.length; i++) {
    var telefone = formatarTelefone(dados[i][2]);
    if (telefone && telefone.length >= 12) {
      contatos.push({
        nome: dados[i][1],
        telefone: telefone,
        categoria: dados[i][3]
      });
    }
  }
  
  var json = JSON.stringify(contatos, null, 2);
  var html = HtmlService.createHtmlOutput('<pre>' + json + '</pre>')
    .setWidth(600)
    .setHeight(400);
  SpreadsheetApp.getUi().showModalDialog(html, 'Contatos JSON (' + contatos.length + ' válidos)');
}
