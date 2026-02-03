# 🚀 Como Executar o Sistema Completo ENSIDE MASTER

## 📖 Visão Geral

O **EXECUTAR_SISTEMA_COMPLETO.sh** é um script shell interativo que automatiza todas as operações do sistema ENSIDE MASTER, integrando:
- 📱 **Evolution API** (WhatsApp via Render)
- 🌐 **Sistema Web** (Vercel)
- 📊 **Google Sheets** (7.055+ contatos)

## ⚡ Instalação Rápida

### Passo 1: Clone o Repositório (se ainda não fez)
```bash
git clone https://github.com/ensideanderson-nova/ENSIDE-MASTER-v16.git
cd ENSIDE-MASTER-v16
```

### Passo 2: Dê Permissão de Execução
```bash
chmod +x EXECUTAR_SISTEMA_COMPLETO.sh
```

### Passo 3: Execute!
```bash
./EXECUTAR_SISTEMA_COMPLETO.sh
```

## 💻 Requisitos do Sistema

### Obrigatórios
- **Sistema Operacional**: macOS ou Linux
- **curl**: Instalado por padrão na maioria dos sistemas
- **jq**: Para processar JSON (o script instala automaticamente se não encontrado)

### Opcionais
- **Node.js**: Para funcionalidades avançadas
- **git**: Para atualizações do repositório

### Instalação Manual do jq (se necessário)

**macOS (com Homebrew):**
```bash
brew install jq
```

**Ubuntu/Debian:**
```bash
sudo apt-get install jq
```

**CentOS/RHEL:**
```bash
sudo yum install jq
```

## 🎯 Primeira Execução

Quando você executar o script pela primeira vez, ele irá:

```
🚀 Bem-vindo ao ENSIDE MASTER!

🔍 Verificando dependências...
  ✅ curl instalado
  ✅ jq instalado
  ✅ git instalado
  ✅ node instalado (v18.17.0)

🌐 Conectando à Evolution API...
   URL: https://evolution-api-latest-poc1.onrender.com
   ⏳ Aguardando Render acordar (cold start)...
   ✅ Evolution API: ONLINE

✅ Sistema pronto para uso!
```

> **Nota sobre Cold Start**: O servidor Render pode levar 30-60 segundos para acordar na primeira conexão do dia. O script aguarda automaticamente.

## 📋 Menu Principal

Após a inicialização, você verá o menu interativo:

```
╔═══════════════════════════════════════════╗
║   🚀 ENSIDE MASTER - SISTEMA COMPLETO    ║
╚═══════════════════════════════════════════╝

STATUS DO SISTEMA:
  🟢 Evolution API: ONLINE
  🟢 WhatsApp: CONECTADO  
  🟢 Google Sheets: 7.055 contatos
  🟢 Vercel: ONLINE

MENU PRINCIPAL:
  1) 📊 Verificar Status Completo
  2) 📱 Conectar WhatsApp (QR Code)
  3) 📨 Enviar Mensagem Individual
  4) 📢 Envio em Massa
  5) ✅ Validar Contatos (Sheets)
  6) 🔄 Sincronizar Contatos
  7) 🌐 Abrir Evolution Manager
  8) 🎨 Abrir Sistema Web (Vercel)
  9) 📊 Abrir Google Sheets
  0) ❌ Sair

Digite sua escolha:
```

## 🔧 Funcionalidades Detalhadas

### 1️⃣ Verificar Status Completo

Exibe informações detalhadas de todos os sistemas:
- Status da Evolution API e versão
- Status da conexão WhatsApp
- Quantidade de contatos no Google Sheets
- Status do deployment Vercel

**Uso:**
```bash
# No menu, digite: 1
```

### 2️⃣ Conectar WhatsApp (QR Code)

Gera um QR Code para conectar o WhatsApp Business API.

**Como funciona:**
1. Script gera QR Code via API
2. Abre automaticamente o Evolution Manager no navegador
3. Você escaneia o QR Code com WhatsApp (Configurações > Aparelhos Conectados)
4. Script aguarda confirmação de conexão (até 2 minutos)

**Uso:**
```bash
# No menu, digite: 2
```

**Dica**: Mantenha o WhatsApp aberto durante o processo.

### 3️⃣ Enviar Mensagem Individual

Envia uma mensagem para um contato específico.

**Interface:**
```
Digite o número (com DDD, ex: 18996540492):
→ 18996540492

Digite a mensagem:
→ Olá! Esta é uma mensagem de teste.

Confirmação:
  Número: 5518996540492
  Mensagem: Olá! Esta é uma mensagem de teste.

Confirma envio? (s/n): s

📤 Enviando...
✅ Mensagem enviada com sucesso!
```

**Formato de número aceito:**
- `18996540492` (com DDD)
- `(18) 99654-0492`
- `5518996540492` (com código do país)

### 4️⃣ Envio em Massa

Envia mensagens personalizadas para múltiplos contatos do Google Sheets.

**Listas disponíveis:**
- 🧪 **Teste**: 5 contatos (para testar antes)
- 🏭 **Fornecedores**: Primeiros 50
- 👥 **Clientes**: Primeiros 50
- 📦 **Todos**: Primeiros 100

**Personalização:**
Use `{nome}` na mensagem para personalizar com o nome do contato.

**Exemplo de uso:**
```
Selecione a lista:
  1) 🧪 Teste (5 contatos)
→ 1

Digite a mensagem (use {nome} para personalizar):
→ Olá {nome}, tudo bem? Esta é uma mensagem de teste!

Delay entre mensagens (segundos) [padrão: 20]:
→ 5

CONFIRMAÇÃO:
  Lista: Teste
  Total: 5 contatos
  Mensagem: "Olá {nome}, tudo bem?..."
  Delay: 5 segundos

Confirma envio? (s/n): s

🚀 Iniciando envio...

[1/5] João Silva (5518996540492)
  ✅ Enviado
  ⏳ Aguardando 5s...

[2/5] Maria Santos (5518987654321)
  ✅ Enviado
  ⏳ Aguardando 5s...

...

╔═══════════════════════════════════════╗
║   ✅ ENVIO CONCLUÍDO                 ║
╠═══════════════════════════════════════╣
║  Total enviados: 5                    ║
║  Falhas: 0                            ║
║  Taxa de sucesso: 100%                ║
║  Tempo total: 25s                     ║
╚═══════════════════════════════════════╝
```

**⚠️ Importante:**
- Sempre teste com a lista "Teste" primeiro
- Use delay de pelo menos 20 segundos para evitar bloqueios
- O WhatsApp tem limites de envio - use com responsabilidade

### 5️⃣ Validar Contatos (Sheets)

Baixa e analisa os contatos do Google Sheets.

**Informações exibidas:**
- Total de contatos
- Quantidade por categoria (Fornecedores, Clientes, Transportadores)
- Números com formato inválido

**Exemplo:**
```
╔═══════════════════════════════════════╗
║   ESTATÍSTICAS DE CONTATOS           ║
╠═══════════════════════════════════════╣
║  ✅ Total: 7055 contatos             ║
║  ✅ Fornecedores: 1200               ║
║  ✅ Clientes: 2500                   ║
║  ✅ Transportadores: 377             ║
║  ⚠️  Números inválidos: 12           ║
╚═══════════════════════════════════════╝
```

### 6️⃣ Sincronizar Contatos

Baixa contatos do Google Sheets e salva localmente em CSV e JSON.

**Arquivos gerados:**
- `dados/contatos_sincronizados_YYYYMMDD_HHMMSS.csv`
- `dados/contatos_sincronizados_YYYYMMDD_HHMMSS.json`

**Formato JSON:**
```json
{
  "updated_at": "2026-02-03T05:30:00Z",
  "total": 7055,
  "contacts": [
    {
      "nome": "João Silva",
      "telefone": "5518996540492",
      "categoria": "Cliente"
    }
  ]
}
```

### 7️⃣ Abrir Evolution Manager

Abre o painel de gerenciamento da Evolution API no navegador.

**URL**: https://evolution-api-latest-poc1.onrender.com/manager

Use para:
- Visualizar QR Code
- Gerenciar instâncias
- Ver logs em tempo real
- Configurar webhooks

### 8️⃣ Abrir Sistema Web (Vercel)

Abre o sistema web completo hospedado no Vercel.

**URL**: https://enside-sistema.vercel.app

### 9️⃣ Abrir Google Sheets

Abre a planilha de contatos no Google Sheets.

**URL**: https://docs.google.com/spreadsheets/d/1FiP885Or0ncyRG_ZZaAvM2vP0sHhDzhLFYifYLjKyIE

## 📊 Logs e Auditoria

### Arquivos de Log

O sistema gera automaticamente logs diários:

**Logs de Envio:**
```
logs/envios_YYYYMMDD.log
```

Exemplo:
```
[2026-02-03 10:30:45] Sistema iniciado
[2026-02-03 10:32:12] WhatsApp conectado via QR Code
[2026-02-03 10:35:20] Mensagem individual enviada para 5518996540492
[2026-02-03 11:15:30] Envio em massa concluído: 50 enviados, 0 falhas
```

**Logs de Erro:**
```
logs/erros_YYYYMMDD.log
```

Exemplo:
```
[2026-02-03 10:40:15] ERROR: Timeout ao aguardar conexão WhatsApp
[2026-02-03 11:20:30] ERROR: Falha ao enviar para 5518999999999: número inválido
```

### Relatórios

Os relatórios são salvos em:
```
relatorios/stats_YYYYMMDD.json
```

## 🔒 Segurança e Boas Práticas

### Proteção de Credenciais

✅ **Faça:**
- Mantenha o arquivo `.env` seguro
- Nunca compartilhe suas API keys
- Use `.gitignore` para não versionar credenciais

❌ **Não faça:**
- Commitar o arquivo `.env` em repositórios públicos
- Compartilhar logs que contenham informações sensíveis

### Limites e Rate Limiting

**WhatsApp Business API:**
- Máximo de mensagens por dia: varia por conta
- Delay recomendado entre mensagens: 20-30 segundos
- Sempre teste com poucos contatos primeiro

**Evolution API (Render):**
- Cold start: 30-60 segundos
- Pode hibernar após 15 minutos de inatividade (plano gratuito)

### Backup

Recomendamos fazer backup regular de:
- Logs (`logs/`)
- Relatórios (`relatorios/`)
- Contatos sincronizados (`dados/`)

## 🐛 Solução de Problemas

### Erro: "jq não encontrado"

**Solução:**
```bash
# macOS
brew install jq

# Linux
sudo apt-get install jq
```

### Erro: "Evolution API: OFFLINE"

**Causas possíveis:**
1. Cold start do Render (aguarde 30-60 segundos)
2. Servidor Render fora do ar
3. API key incorreta

**Solução:**
```bash
# 1. Verifique o .env
cat .env | grep EVOLUTION

# 2. Teste manualmente
curl -s https://evolution-api-latest-poc1.onrender.com \
  -H "apikey: evolution-api-enside-2024-secret"

# 3. Aguarde cold start
# O script já faz isso automaticamente
```

### Erro: "WhatsApp desconectado"

**Solução:**
1. Use a opção 2 do menu (Conectar WhatsApp)
2. Escaneie o QR Code com WhatsApp
3. Aguarde confirmação de conexão

### Erro: "Permission denied"

**Solução:**
```bash
chmod +x EXECUTAR_SISTEMA_COMPLETO.sh
```

### Google Sheets retorna poucos contatos

**Causas possíveis:**
1. Planilha não está pública
2. ID da planilha incorreto
3. Conexão com internet instável

**Solução:**
```bash
# Verifique o ID no .env
cat .env | grep GOOGLE_SHEETS_ID

# Teste download manual
curl -sL "https://docs.google.com/spreadsheets/d/1FiP885Or0ncyRG_ZZaAvM2vP0sHhDzhLFYifYLjKyIE/export?format=csv&gid=0" | head -10
```

## 🔄 Atualizações

Para atualizar o sistema:

```bash
# 1. Salve suas alterações locais
git stash

# 2. Baixe atualizações
git pull origin main

# 3. Restaure alterações (se necessário)
git stash pop

# 4. Execute novamente
./EXECUTAR_SISTEMA_COMPLETO.sh
```

## 📞 Suporte

### Informações do Sistema

**Evolution API:**
- URL: https://evolution-api-latest-poc1.onrender.com
- Manager: https://evolution-api-latest-poc1.onrender.com/manager
- Instância: ENSIDE

**Google Sheets:**
- ID: 1FiP885Or0ncyRG_ZZaAvM2vP0sHhDzhLFYifYLjKyIE
- URL: https://docs.google.com/spreadsheets/d/1FiP885Or0ncyRG_ZZaAvM2vP0sHhDzhLFYifYLjKyIE

**Vercel:**
- URL: https://enside-sistema.vercel.app

### Comandos Úteis

**Verificar logs recentes:**
```bash
tail -20 logs/envios_$(date +%Y%m%d).log
```

**Contar mensagens enviadas hoje:**
```bash
grep "Mensagem individual" logs/envios_$(date +%Y%m%d).log | wc -l
```

**Ver erros do dia:**
```bash
cat logs/erros_$(date +%Y%m%d).log
```

**Limpar logs antigos:**
```bash
find logs/ -name "*.log" -mtime +30 -delete
```

## 🎓 Exemplos de Uso

### Cenário 1: Envio de Promoção

```bash
# 1. Execute o script
./EXECUTAR_SISTEMA_COMPLETO.sh

# 2. Verifique status (opção 1)
# 3. Se WhatsApp desconectado, conecte (opção 2)
# 4. Teste com 5 contatos (opção 4 → lista 1)
# 5. Se OK, envie para todos (opção 4 → lista 4)
```

### Cenário 2: Atualização de Contatos

```bash
# 1. Execute o script
./EXECUTAR_SISTEMA_COMPLETO.sh

# 2. Valide contatos (opção 5)
# 3. Sincronize localmente (opção 6)
# 4. Use os arquivos em dados/ para processamento
```

### Cenário 3: Verificação Diária

```bash
# Criar um alias no ~/.bashrc ou ~/.zshrc
alias enside="cd ~/ENSIDE-MASTER-v16 && ./EXECUTAR_SISTEMA_COMPLETO.sh"

# Agora basta digitar:
enside
```

## 📚 Recursos Adicionais

### Documentação

- [Evolution API Docs](https://doc.evolution-api.com/)
- [Google Sheets API](https://developers.google.com/sheets/api)
- [WhatsApp Business API](https://developers.facebook.com/docs/whatsapp)

### Scripts Relacionados

- `GERAR_QR_CODE_RENDER.sh` - Gera QR Code standalone
- `ENVIO_MASSA_V2.sh` - Versão alternativa de envio em massa
- `VALIDAR_CONTATOS_CSV.sh` - Validação de CSV

## 🎉 Pronto!

Agora você está pronto para usar o sistema completo ENSIDE MASTER!

**Uso diário:**
```bash
./EXECUTAR_SISTEMA_COMPLETO.sh
```

---

**Versão**: 1.0.0
**Última atualização**: 03/02/2026
**Repositório**: https://github.com/ensideanderson-nova/ENSIDE-MASTER-v16
