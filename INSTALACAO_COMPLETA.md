# 🚀 ENSIDE SISTEMA v19.0 - GUIA DE INSTALAÇÃO COMPLETA

## 📋 PRÉ-REQUISITOS

```bash
# 1. Instalar Homebrew (se não tiver)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# 2. Instalar Docker Desktop
brew install --cask docker

# 3. Instalar Firefox (para Evolution Manager)
brew install --cask firefox

# 4. Instalar Git
brew install git
```

---

## 📁 PASSO 1: CRIAR ESTRUTURA DE PASTAS

```bash
# Criar pasta principal
mkdir -p ~/Desktop/ENSIDE_SISTEMA_UNIFICADO
mkdir -p ~/Desktop/ENSIDE_SISTEMA_UNIFICADO/CONFIG
mkdir -p ~/Desktop/ENSIDE_SISTEMA_UNIFICADO/MODULOS

cd ~/Desktop/ENSIDE_SISTEMA_UNIFICADO
```

---

## 🐳 PASSO 2: INSTALAR EVOLUTION API (Docker)

```bash
# Criar e iniciar container da Evolution API
docker run -d \
  --name evolution-api \
  -p 8080:8080 \
  -e AUTHENTICATION_API_KEY=enside123 \
  -e AUTHENTICATION_EXPOSE_IN_FETCH_INSTANCES=true \
  atendai/evolution-api:latest

# Verificar se está rodando
docker ps

# Ver logs
docker logs evolution-api
```

---

## 📱 PASSO 3: CONFIGURAR INSTÂNCIA WHATSAPP

```bash
# Criar instância "enside"
curl -X POST "http://localhost:8080/instance/create" \
  -H "Content-Type: application/json" \
  -H "apikey: enside123" \
  -d '{
    "instanceName": "enside",
    "token": "enside123",
    "qrcode": true
  }'

# Configurar Webhook
curl -X POST "http://localhost:8080/webhook/set/enside" \
  -H "Content-Type: application/json" \
  -H "apikey: enside123" \
  -d '{
    "enabled": true,
    "url": "https://enside-sistema.vercel.app/api/webhook",
    "webhookByEvents": true,
    "events": ["MESSAGES_UPSERT", "CONNECTION_UPDATE"]
  }'

# Gerar QR Code para conectar WhatsApp
curl -X GET "http://localhost:8080/instance/connect/enside" \
  -H "apikey: enside123"
```

---

## 📄 PASSO 4: CRIAR SCRIPT DE INICIALIZAÇÃO

```bash
cat > ~/Desktop/ENSIDE_SISTEMA_UNIFICADO/INICIAR_ENSIDE.command << 'EOF'
#!/bin/bash
clear
echo "╔════════════════════════════════════════════════════════════════╗"
echo "║     🚀 ENSIDE SISTEMA UNIFICADO v19.0 - INICIANDO...          ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

echo "🐳 [1/4] Verificando Docker..."
if ! docker info > /dev/null 2>&1; then
    echo "   ⚠️  Iniciando Docker Desktop..."
    open -a Docker
    sleep 10
fi
echo "   ✅ Docker OK"

echo "🔌 [2/4] Iniciando Evolution API..."
if docker ps -a | grep -q evolution-api; then
    docker start evolution-api > /dev/null 2>&1
fi
sleep 3
echo "   ✅ Evolution API em http://localhost:8080"

echo "🌐 [3/4] Abrindo Sistema Principal..."
open "$SCRIPT_DIR/ENSIDE_MASTER_v19.0_INTEGRADO.html"
echo "   ✅ Sistema aberto"

echo "📱 [4/4] Abrindo Evolution Manager..."
sleep 2
open -a Firefox "http://localhost:8080/manager"
echo "   ✅ Evolution Manager aberto"

echo ""
echo "╔════════════════════════════════════════════════════════════════╗"
echo "║              🎉 SISTEMA INICIADO COM SUCESSO!                 ║"
echo "╠════════════════════════════════════════════════════════════════╣"
echo "║  🔑 API Key: SUA_API_KEY_AQUI                                 ║"
echo "║  📞 WhatsApp: SEU_NUMERO_AQUI                                 ║"
echo "║  🌐 Evolution: http://localhost:8080                          ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""
read -p "Pressione ENTER para fechar..."
EOF

# Dar permissão de execução
chmod +x ~/Desktop/ENSIDE_SISTEMA_UNIFICADO/INICIAR_ENSIDE.command
```

---

## 📊 PASSO 5: CONFIGURAR GOOGLE SHEETS

### 5.1 Criar Planilha com as Abas:
- **CONTATOS** (colunas: NOME, TELEFONE, CATEGORIA)
- **FRETES_DISPONIVEIS** (colunas: ID, VAI_HTML, ORIGEM_UF, ORIGEM_CIDADE, DESTINO_UF, DESTINO_CIDADE, KM, VALOR_KM, TOTAL)
- **LISTAS_TRANSMISSAO** (colunas: NOME_LISTA, CONTATOS, DATA_CRIACAO)

### 5.2 Publicar Planilha:
1. Arquivo > Compartilhar > Publicar na Web
2. Selecionar "Documento inteiro" e "CSV"
3. Copiar o ID da planilha (está na URL)

### 5.3 Salvar Configuração:

```bash
cat > ~/Desktop/ENSIDE_SISTEMA_UNIFICADO/CONFIG/GOOGLE_SHEETS_INFO.md << 'EOF'
# Configuração Google Sheets

## Planilha Principal
- **Nome:** EUCALIPTO-SISTEMA_INTEGRADO_COMPLETO
- **ID:** 1FiP885Or0ncyRG_ZZaAvM2vP0sHhDzhLFYifYLjKyIE
- **URL:** https://docs.google.com/spreadsheets/d/1FiP885Or0ncyRG_ZZaAvM2vP0sHhDzhLFYifYLjKyIE

## Abas Disponíveis
- CONTATOS
- FRETES_DISPONIVEIS
- LISTAS_TRANSMISSAO
- RESUMO_EXECUTIVO

## Como Sincronizar
No sistema HTML, use o botão "Sincronizar Google Sheets"
EOF
```

---

## 🌐 PASSO 6: BAIXAR SISTEMA HTML PRINCIPAL

```bash
# Opção 1: Clonar do GitHub (se disponível)
git clone https://github.com/ensideanderson-nova/ENSIDE-MASTER-v16.git temp_repo
cp temp_repo/*.html ~/Desktop/ENSIDE_SISTEMA_UNIFICADO/
rm -rf temp_repo

# Opção 2: Criar arquivo HTML manualmente (ver seção abaixo)
```

---

## 📝 PASSO 7: CRIAR ARQUIVO DE CONFIGURAÇÃO

```bash
cat > ~/Desktop/ENSIDE_SISTEMA_UNIFICADO/CONFIG/CONFIGURACAO_UNICA.md << 'EOF'
# ⚙️ CONFIGURAÇÃO DO SISTEMA ENSIDE v19.0

## 🔑 Credenciais Evolution API
- **URL:** http://localhost:8080
- **API Key:** 919AA333-AE59-4B06-B1EF-C9A9F9C8C0F6
- **Instância:** enside
- **WhatsApp:** 5518996540492

## 📊 Google Sheets
- **ID Planilha:** 1FiP885Or0ncyRG_ZZaAvM2vP0sHhDzhLFYifYLjKyIE

## 🔗 Webhook
- **URL:** https://enside-sistema.vercel.app/api/webhook
- **Eventos:** MESSAGES_UPSERT, CONNECTION_UPDATE

## 📁 Estrutura de Pastas
```
ENSIDE_SISTEMA_UNIFICADO/
├── ENSIDE_MASTER_v19.0_INTEGRADO.html  (Sistema Principal)
├── FRETES_DISPONIVEIS.html
├── INICIAR_ENSIDE.command              (Executável)
├── LEIA-ME.md
├── CONFIG/
│   ├── CONFIGURACAO_UNICA.md
│   └── GOOGLE_SHEETS_INFO.md
└── MODULOS/
    ├── CAPTACAO_FRETES.html
    ├── CONTATOS_CRM.html
    ├── FRETES_DISPONIVEIS.html
    ├── INDEX.html
    └── LISTA_TRANSMISSAO.html
```
EOF
```

---

## 📤 PASSO 8: ENVIAR LISTA DE TRANSMISSÃO VIA TERMINAL

```bash
# Definir variáveis
API_KEY="SUA_API_KEY_AQUI"
INSTANCIA="enside"

# Mensagem
MSG="🚛 *ENSIDE LOGÍSTICA* 🚛

Olá! Temos novos fretes disponíveis!

📍 Confira as rotas:
• SP → MG
• PR → SC  
• GO → MT

💰 Valores competitivos!
📞 Entre em contato para mais informações.

_Mensagem automática - Lista de Transmissão_"

# Lista de contatos (adicione os números)
CONTATOS=("5514918265659" "5515933075260" "5518916797240" "5517971676888" "5517937521501")

# Enviar para cada contato
echo "📤 Enviando lista de transmissão para ${#CONTATOS[@]} contatos..."

for numero in "${CONTATOS[@]}"; do
  echo "➡️ Enviando para $numero..."
  curl -s -X POST "http://localhost:8080/message/sendText/$INSTANCIA" \
    -H "Content-Type: application/json" \
    -H "apikey: $API_KEY" \
    -d "{\"number\": \"$numero\", \"textMessage\": {\"text\": \"$MSG\"}}"
  echo " ✅ Enviado!"
  sleep 2  # Aguardar 2 segundos entre envios
done

echo "🎉 Lista de transmissão enviada com sucesso!"
```

---

## 🔧 COMANDOS ÚTEIS

### Docker
```bash
# Ver containers rodando
docker ps

# Parar Evolution API
docker stop evolution-api

# Iniciar Evolution API
docker start evolution-api

# Ver logs
docker logs -f evolution-api

# Reiniciar
docker restart evolution-api
```

### Evolution API
```bash
# Verificar status da instância
curl -X GET "http://localhost:8080/instance/connectionState/enside" \
  -H "apikey: SUA_API_KEY"

# Listar todas instâncias
curl -X GET "http://localhost:8080/instance/fetchInstances" \
  -H "apikey: SUA_API_KEY"

# Enviar mensagem única
curl -X POST "http://localhost:8080/message/sendText/enside" \
  -H "Content-Type: application/json" \
  -H "apikey: SUA_API_KEY" \
  -d '{
    "number": "5518999999999",
    "textMessage": {
      "text": "Olá! Mensagem de teste."
    }
  }'

# Desconectar WhatsApp
curl -X DELETE "http://localhost:8080/instance/logout/enside" \
  -H "apikey: SUA_API_KEY"
```

---

## 🚀 COMO USAR

1. **Iniciar Sistema:**
   - Duplo clique em `INICIAR_ENSIDE.command`
   - Ou execute no terminal: `./INICIAR_ENSIDE.command`

2. **Conectar WhatsApp:**
   - Acesse http://localhost:8080/manager
   - Escaneie o QR Code com seu WhatsApp

3. **Sincronizar Contatos:**
   - No sistema HTML, clique em "Sincronizar Google Sheets"

4. **Enviar Lista de Transmissão:**
   - Use o script bash acima ou
   - Use a interface do sistema HTML

---

## 📞 SUPORTE

- **WhatsApp:** 5518996540492
- **GitHub:** https://github.com/ensideanderson-nova/ENSIDE-MASTER-v16

---

*Documento gerado em: 02/01/2026*
*Versão: ENSIDE MASTER v19.0*
