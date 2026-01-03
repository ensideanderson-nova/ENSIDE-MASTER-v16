#!/bin/bash
# 📱 Enviar WhatsApp via Evolution API

source ~/.enside_env 2>/dev/null

NUMERO=$1
MENSAGEM=$2

if [ -z "$NUMERO" ] || [ -z "$MENSAGEM" ]; then
    echo "Uso: ./enviar-whatsapp.sh NUMERO MENSAGEM"
    echo "Exemplo: ./enviar-whatsapp.sh 5518999999999 'Olá!'"
    exit 1
fi

echo "📱 Enviando WhatsApp para $NUMERO..."

curl -s -X POST "http://localhost:8080/message/sendText/enside" \
    -H "Content-Type: application/json" \
    -H "apikey: $EVOLUTION_API_KEY" \
    -d "{\"number\": \"$NUMERO\", \"textMessage\": {\"text\": \"$MENSAGEM\"}}"

echo ""
echo "✅ Mensagem enviada!"
