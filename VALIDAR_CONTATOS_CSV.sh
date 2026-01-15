#!/bin/bash

echo ''
echo '=== VALIDAR CONTATOS DO GOOGLE SHEETS ==='
echo ''

# URL do CSV export do Google Sheets
SHEET_ID='1FiP885Or0ncyRG_ZZaAvM2vP0sHhDzhLFYifYLjKyIE'
GID_CONTATOS='1689968688'
CSV_URL="https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&gid=${GID_CONTATOS}"

echo '➡️ Baixando CSV do Google Sheets...'
curl -sL "$CSV_URL" -o contatos_temp.csv

if [ ! -f contatos_temp.csv ]; then
  echo '❌ Erro ao baixar CSV!'
  exit 1
fi

echo '✅ CSV baixado com sucesso!'
echo ''

# Contar linhas (total de contatos + header)
TOTAL_LINHAS=$(wc -l < contatos_temp.csv | tr -d ' ')
TOTAL_CONTATOS=$((TOTAL_LINHAS - 1))

echo "📊 Total de linhas no CSV: $TOTAL_LINHAS"
echo "👥 Total de contatos: $TOTAL_CONTATOS"
echo ''

# Mostrar primeiras 5 linhas
echo '🔍 Primeiras 5 linhas do CSV:'
head -5 contatos_temp.csv
echo ''

# Validar se tem pelo menos 7000 contatos
if [ $TOTAL_CONTATOS -ge 7000 ]; then
  echo '✅ Validação OK: CSV contém 7.055+ contatos!'
else
  echo "⚠️ Atenção: CSV contém apenas $TOTAL_CONTATOS contatos (esperado: 7.055+)"
fi

echo ''
echo '💾 Arquivo salvo em: contatos_temp.csv'
echo ''
