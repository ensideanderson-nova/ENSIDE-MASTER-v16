#!/bin/bash

# 📨 SCRIPT DE ENVIO EM MASSA V2 - EVOLUTION API
# Envia mensagens para contatos que já conversaram (garantido ter WhatsApp)

# Configurações
API_URL="http://localhost:8080"
API_KEY="919AA333-AE59-4B06-B1EF-C9A9F9C8C0F6"
INSTANCE="enside"
MENSAGEM="🌲 Pinus entregue em todo Brasil 18 99654-0492"
DELAY=3  # segundos entre cada envio (evitar bloqueio)

# Cores
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${YELLOW}══════════════════════════════════════════════════${NC}"
echo -e "${YELLOW}📨 ENVIO EM MASSA V2 - EVOLUTION API${NC}"
echo -e "${YELLOW}══════════════════════════════════════════════════${NC}"
echo ""

# Verificar conexão
echo -e "${YELLOW}✔ Verificando conexão com Evolution API...${NC}"
STATUS=$(curl -s "$API_URL/instance/connectionState/$INSTANCE" -H "apikey: $API_KEY" | grep -o '"state":"[^"]*"' | cut -d'"' -f4)

if [ "$STATUS" != "open" ]; then
    echo -e "${RED}✘ WhatsApp não conectado! Status: $STATUS${NC}"
    exit 1
fi
echo -e "${GREEN}✔ WhatsApp conectado!${NC}"
echo ""

# Buscar conversas existentes (contatos que já conversaram = têm WhatsApp)
echo -e "${YELLOW}✔ Buscando conversas existentes...${NC}"

# Salvar números em arquivo temporário
curl -s "$API_URL/chat/findChats/$INSTANCE" -H "apikey: $API_KEY" | python3 -c "
import json,sys
data=json.load(sys.stdin)
for c in data:
    cid = c.get('id','')
    if '@s.whatsapp.net' in cid:
        numero = cid.replace('@s.whatsapp.net','')
        print(numero)
" > /tmp/numeros_whatsapp.txt

TOTAL=$(wc -l < /tmp/numeros_whatsapp.txt | tr -d ' ')
echo -e "${GREEN}✔ Total de contatos com WhatsApp: $TOTAL${NC}"
echo ""

# Perguntar quantos enviar
echo -e "${YELLOW}Quantos contatos deseja enviar? (max $TOTAL, ou 'todos'):${NC}"
read -p "→ " QUANTIDADE

if [ "$QUANTIDADE" == "todos" ]; then
    QUANTIDADE=$TOTAL
fi

echo ""
echo -e "${YELLOW}Mensagem a enviar:${NC}"
echo -e "${GREEN}$MENSAGEM${NC}"
echo ""
echo -e "${YELLOW}Confirma envio para $QUANTIDADE contatos? (s/n):${NC}"
read -p "→ " CONFIRMA

if [ "$CONFIRMA" != "s" ] && [ "$CONFIRMA" != "S" ]; then
    echo -e "${RED}Envio cancelado.${NC}"
    exit 0
fi

echo ""
echo -e "${GREEN}══════════════════════════════════════════════════${NC}"
echo -e "${GREEN}🚀 INICIANDO ENVIO EM MASSA...${NC}"
echo -e "${GREEN}══════════════════════════════════════════════════${NC}"
echo ""

ENVIADOS=0
SUCESSO=0
ERROS=0

while IFS= read -r NUMERO && [ $ENVIADOS -lt $QUANTIDADE ]; do
    ENVIADOS=$((ENVIADOS + 1))
    
    # Enviar mensagem
    RESULT=$(curl -s -X POST "$API_URL/message/sendText/$INSTANCE" \
        -H "Content-Type: application/json" \
        -H "apikey: $API_KEY" \
        -d "{\"number\": \"$NUMERO\", \"textMessage\": {\"text\": \"$MENSAGEM\"}}" 2>/dev/null)
    
    if echo "$RESULT" | grep -q "remoteJid"; then
        SUCESSO=$((SUCESSO + 1))
        echo -e "${GREEN}✔ [$ENVIADOS/$QUANTIDADE] $NUMERO - ENVIADO${NC}"
    else
        ERROS=$((ERROS + 1))
        echo -e "${RED}✘ [$ENVIADOS/$QUANTIDADE] $NUMERO - ERRO${NC}"
    fi
    
    # Delay para evitar bloqueio
    sleep $DELAY
    
done < /tmp/numeros_whatsapp.txt

echo ""
echo -e "${GREEN}══════════════════════════════════════════════════${NC}"
echo -e "${GREEN}✔ ENVIO CONCLUÍDO!${NC}"
echo -e "${GREEN}══════════════════════════════════════════════════${NC}"
echo ""
echo -e "📊 Resumo:"
echo -e "   ✔ Enviados com sucesso: $SUCESSO"
echo -e "   ✘ Erros: $ERROS"
echo -e "   📱 Total processado: $ENVIADOS"
echo ""

# Limpar arquivo temporário
rm -f /tmp/numeros_whatsapp.txt
