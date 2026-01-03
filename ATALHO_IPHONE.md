# 📱 ATALHO PARA iPHONE - Lista de Transmissão ENSIDE

## Como Criar o Atalho no iPhone:

### Passo 1: Abra o app "Atalhos" no iPhone

### Passo 2: Crie um novo atalho com estas ações:

1. **Obter Conteúdo de URL**
   - URL: `http://SEU_IP_LOCAL:8080/message/sendText/enside`
   - Método: POST
   - Headers:
     - `Content-Type`: `application/json`
     - `apikey`: `919AA333-AE59-4B06-B1EF-C9A9F9C8C0F6`
   - Body (JSON):
   ```json
   {
     "number": "NUMERO@s.whatsapp.net",
     "textMessage": {
       "text": "Sua mensagem aqui"
     }
   }
   ```

### Passo 3: Para descobrir seu IP local no Mac:
```bash
ifconfig | grep "inet " | grep -v 127.0.0.1
```
Resultado exemplo: `192.168.15.10`

---

## 🚀 OPÇÃO MAIS FÁCIL - Via ngrok (acesso externo):

### No Mac, execute:
```bash
ngrok http 8080
```

### Use a URL pública gerada (exemplo):
```
https://abc123.ngrok.io/message/sendText/enside
```

---

## 📋 Exemplo de Atalho Completo:

**Nome:** Enviar Lista ENSIDE

**Ações:**
1. Pedir Entrada (Texto) → "Digite a mensagem"
2. Obter Conteúdo de URL:
   - URL: https://SUA_URL_NGROK/message/sendText/enside
   - Método: POST
   - Headers: apikey, Content-Type
   - Body: {"number": "5518996540492@s.whatsapp.net", "textMessage": {"text": "[Entrada]"}}
3. Mostrar Resultado

---

## 🔗 Links Úteis:

- **Sistema ENSIDE:** file:///Users/andersonenside/Desktop/ENSIDE_SISTEMA_UNIFICADO/ENSIDE_MASTER_v19.0_INTEGRADO.html
- **Evolution Manager:** http://localhost:8080/manager
- **GitHub:** https://github.com/ensideanderson-nova/ENSIDE-MASTER-v16

---

## ⚡ Comando Rápido no Mac:

```bash
cd ~/Desktop/ENSIDE_SISTEMA_UNIFICADO
./ENVIAR_LISTA.sh
```

Para adicionar mais números, edite o arquivo ENVIAR_LISTA.sh:
```bash
NUMEROS=("5518996540492" "5511999999999" "5521888888888")
```
