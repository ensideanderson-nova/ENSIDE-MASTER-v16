#!/bin/bash
# Lista de Transmissao ENSIDE - Corrigido
API="http://localhost:8080/message/sendText/enside"
KEY="919AA333-AE59-4B06-B1EF-C9A9F9C8C0F6"

NUMEROS=("5518996540492")
MSG="ENSIDE LOGISTICS - Fretes disponiveis! Rotas SP, PR, SC, RS. Responda para mais info."

echo "📱 Enviando para ${#NUMEROS[@]} numeros..."
for N in "${NUMEROS[@]}"; do
  echo "📤 $N..."
  curl -s -X POST "$API" -H "Content-Type: application/json" -H "apikey: $KEY" \
    -d "{\"number\": \"${N}@s.whatsapp.net\", \"textMessage\": {\"text\": \"$MSG\"}}" | grep -q remoteJid && echo "✅ OK" || echo "❌ Falha"
  sleep 2
done
echo "🎉 Concluido!"
