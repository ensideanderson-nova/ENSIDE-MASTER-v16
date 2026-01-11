# 🚀 GUIA DE INSTALAÇÃO E USO - SISTEMA DE CAPTAÇÃO DE FRETES
**Anderson Enside Logística**

## 📋 INFORMAÇÕES IMPORTANTES

### 🔑 Credenciais e APIs Configuradas

#### Google Sheets
- **ID da Planilha**: `1FiP885Or0ncyRG_ZZaAvM2vP0sHhDzhLFYifYLjKyIE`
- **URL**: https://docs.google.com/spreadsheets/d/1FiP885Or0ncyRG_ZZaAvM2vP0sHhDzhLFYifYLjKyIE/edit
- **Método de Acesso**: Público (leitura via API Google Visualization)
- **Abas Utilizadas**:
  - `FRETES_DISPONIVEIS` (gid: 1716433489)
  - `PROPOSTAS_MOTORISTAS`
  - `ROTAS_PREFERIDAS`
  - `CAPTACAO_FRETES` (gid: 1707733664)

#### Evolution API (WhatsApp)
- **URL**: `https://evolution-api-latest-poc1.onrender.com`
- **API Key**: `evolution-api-enside-2024-secret`
- **Instance Name**: `ENSIDE`
- **WhatsApp Número**: `5518996540492`
- **Manager URL**: https://evolution-api-latest-poc1.onrender.com/manager

#### GitHub (Backup)
- **Token**: `Github_pat_11B2HPWRQ0jAY7HwKQQBR9_XBQOZWISGDOf45h8a0ByyrbMlfw2r3peS4J2IGNQax3HOF6FYPXFVRng6A8`
- **Owner**: `ensideanderson-nova`
- **Repo**: `ENSIDE-MASTER-v16`

---

## 🏗️ ESTRUTURA DO SISTEMA

```
MODULOS/CAPTACAO_FRETES/
├── config.js                          # ✅ Todas as configurações
├── api-integration.js                 # ✅ Integrações Google Sheets + WhatsApp
├── README.md                          # Documentação completa
├── INSTALACAO.md                      # Este arquivo
├── ADMIN/                             # Painel Administrativo
│   ├── admin_cadastro_fretes.html    # ✅ Cadastrar fretes
│   ├── admin_propostas_recebidas.html # ✅ Ver propostas
│   └── admin_rotas_preferidas.html   # ✅ Ver rotas motoristas
└── MOTORISTAS/                        # Portal do Motorista
    ├── landing_captacao.html         # ✅ Página inicial
    ├── fretes_disponiveis.html       # ✅ Ver fretes
    ├── minhas_propostas.html         # ✅ Acompanhar propostas
    └── minhas_rotas_preferidas.html  # ✅ Gerenciar rotas
```

---

## 🚀 COMO CLONAR E USAR NO SEU MAC

### Passo 1: Clonar o Repositório

```bash
# Abra o Terminal no Mac
cd ~/Desktop

# Clone o repositório
git clone https://github.com/ensideanderson-nova/ENSIDE-MASTER-v16.git

# Entre na pasta
cd ENSIDE-MASTER-v16
```

### Passo 2: Abrir o Sistema

#### Opção A - Usar Servidor HTTP Local (Recomendado)

```bash
# Se tiver Python instalado (vem por padrão no Mac)
cd MODULOS/CAPTACAO_FRETES

# Python 3
python3 -m http.server 8000

# Ou Python 2
python -m SimpleHTTPServer 8000

# Depois abra no navegador:
# http://localhost:8000/ADMIN/admin_cadastro_fretes.html
# http://localhost:8000/MOTORISTAS/landing_captacao.html
```

#### Opção B - Abrir Diretamente no Navegador

```bash
# Navegue até a pasta e abra os arquivos HTML diretamente
cd MODULOS/CAPTACAO_FRETES

# Para Admin
open ADMIN/admin_cadastro_fretes.html

# Para Motoristas
open MOTORISTAS/landing_captacao.html
```

---

## 📱 PÁGINAS DO SISTEMA

### 👨‍💼 PAINEL ADMINISTRATIVO

#### 1. Cadastro de Fretes
- **Arquivo**: `ADMIN/admin_cadastro_fretes.html`
- **Função**: Cadastrar novos fretes com valores sugeridos
- **Recursos**:
  - ✅ Formulário completo com validação
  - ✅ Cálculo automático de valores
  - ✅ Notificação automática via WhatsApp para motoristas compatíveis
  - ✅ Listagem de fretes cadastrados

#### 2. Propostas Recebidas
- **Arquivo**: `ADMIN/admin_propostas_recebidas.html`
- **Função**: Visualizar e gerenciar propostas dos motoristas
- **Recursos**:
  - ✅ Análise de IA com score (0-100)
  - ✅ Filtros por status (Pendente, Aprovada, Recusada)
  - ✅ Aprovar/Recusar propostas com 1 clique
  - ✅ Notificação automática ao motorista

#### 3. Rotas Preferidas
- **Arquivo**: `ADMIN/admin_rotas_preferidas.html`
- **Função**: Visualizar rotas cadastradas pelos motoristas
- **Recursos**:
  - ✅ Listagem completa de rotas
  - ✅ Filtros por origem/destino/status
  - ✅ Estatísticas em tempo real
  - ✅ Botão para notificar motoristas

### 🚚 PORTAL DO MOTORISTA

#### 1. Landing Page
- **Arquivo**: `MOTORISTAS/landing_captacao.html`
- **Função**: Página inicial com apresentação do sistema
- **Recursos**:
  - ✅ Design moderno e responsivo
  - ✅ Cadastro rápido de motoristas
  - ✅ Estatísticas do sistema
  - ✅ Links para todas as funcionalidades

#### 2. Fretes Disponíveis
- **Arquivo**: `MOTORISTAS/fretes_disponiveis.html`
- **Função**: Visualizar fretes e fazer propostas
- **Recursos**:
  - ✅ Listagem de fretes abertos
  - ✅ Filtros por origem/destino/veículo
  - ✅ Modal para fazer proposta
  - ✅ Análise de IA automática da proposta

#### 3. Minhas Propostas
- **Arquivo**: `MOTORISTAS/minhas_propostas.html`
- **Função**: Acompanhar propostas enviadas
- **Recursos**:
  - ✅ Status em tempo real
  - ✅ Score da IA
  - ✅ Estatísticas de aprovação
  - ✅ Histórico completo

#### 4. Minhas Rotas Preferidas
- **Arquivo**: `MOTORISTAS/minhas_rotas_preferidas.html`
- **Função**: Cadastrar e gerenciar rotas
- **Recursos**:
  - ✅ Cadastro de rotas preferidas
  - ✅ Ativar/Desativar rotas
  - ✅ Notificações automáticas
  - ✅ Frequência configurável

---

## ⚙️ CONFIGURAÇÕES

### Alterar Credenciais (se necessário)

Edite o arquivo: `MODULOS/CAPTACAO_FRETES/config.js`

```javascript
// Linha 7-11: Google Sheets
spreadsheetId: 'SUA_PLANILHA_ID',

// Linha 58-63: Evolution API
evolutionAPI: {
    url: 'SUA_URL',
    apiKey: 'SUA_CHAVE',
    instance: 'SUA_INSTANCIA',
    whatsappNumber: 'SEU_NUMERO'
}
```

---

## 🔄 FLUXO DE USO

### Para Administradores

1. Acesse `ADMIN/admin_cadastro_fretes.html`
2. Cadastre um novo frete com:
   - Origem e Destino (UF e Cidade)
   - Distância em KM
   - Tipo de veículo
   - Valor sugerido
3. Sistema notifica automaticamente motoristas com rotas compatíveis
4. Acesse `ADMIN/admin_propostas_recebidas.html` para ver propostas
5. Analise score da IA e aprove/recuse

### Para Motoristas

1. Acesse `MOTORISTAS/landing_captacao.html`
2. Faça cadastro rápido (nome e WhatsApp)
3. Configure rotas preferidas em `minhas_rotas_preferidas.html`
4. Veja fretes compatíveis em `fretes_disponiveis.html`
5. Faça propostas com seus valores
6. Acompanhe status em `minhas_propostas.html`

---

## 📊 RECURSOS PRINCIPAIS

### ✅ Implementados e Funcionais

1. **Google Sheets Integration**
   - ✅ Leitura de dados em tempo real
   - ✅ Estrutura de abas configurada
   - ✅ API pública funcionando

2. **WhatsApp Notifications (Evolution API)**
   - ✅ Notificação para admin (nova proposta)
   - ✅ Notificação para motorista (novo frete)
   - ✅ Notificação de status (aprovado/recusado)

3. **Análise de IA**
   - ✅ Score automático (0-100)
   - ✅ Comparação com valor de mercado
   - ✅ Recomendação (Aprovar/Negociar/Recusar)

4. **Matching Automático**
   - ✅ Busca rotas compatíveis
   - ✅ Notificação automática
   - ✅ Filtros por UF e cidade

5. **Interface Responsiva**
   - ✅ Mobile-first design
   - ✅ Dark theme (gradiente #0a0a0a → #1a1a2e)
   - ✅ Cores: Dourado (#FFD700) e Verde (#10b981)

6. **Storage Local**
   - ✅ Dados salvos no navegador (localStorage)
   - ✅ Sincronização automática
   - ✅ Backup de dados

---

## 🧪 TESTANDO O SISTEMA

### Teste 1: Cadastrar Frete (Admin)

1. Abra `ADMIN/admin_cadastro_fretes.html`
2. Preencha o formulário
3. Clique em "Cadastrar Frete"
4. Verifique se aparece na lista abaixo

### Teste 2: Fazer Proposta (Motorista)

1. Abra `MOTORISTAS/fretes_disponiveis.html`
2. Clique em "Fazer Proposta" em um frete
3. Preencha seus dados
4. Envie a proposta
5. Veja em `MOTORISTAS/minhas_propostas.html`

### Teste 3: Cadastrar Rota (Motorista)

1. Abra `MOTORISTAS/minhas_rotas_preferidas.html`
2. Preencha origem e destino
3. Escolha frequência
4. Clique em "Adicionar Rota"

### Teste 4: Ver Propostas (Admin)

1. Abra `ADMIN/admin_propostas_recebidas.html`
2. Veja as propostas com score da IA
3. Aprove ou recuse uma proposta

---

## 🔐 SEGURANÇA

- ✅ Todas as credenciais estão configuradas
- ✅ API do Google Sheets é pública (somente leitura)
- ✅ Evolution API protegida com API Key
- ✅ Validação de dados no frontend
- ✅ Formatação automática de WhatsApp

---

## 📱 NOTIFICAÇÕES WHATSAPP

### Templates Configurados

#### Nova Proposta (para Admin)
```
🆕 NOVA PROPOSTA RECEBIDA
📦 Frete: FRETE123
👤 Motorista: João Silva
💰 Valor Proposto: R$ 1.750,00
```

#### Novo Frete (para Motorista)
```
🚚 NOVO FRETE DISPONÍVEL NA SUA ROTA
📍 Origem: Curitiba/PR
📍 Destino: São Paulo/SP
💰 Valor Sugerido: R$ 1.800,00
```

---

## 🆘 SOLUÇÃO DE PROBLEMAS

### Problema: Páginas não carregam dados

**Solução**: Use um servidor HTTP local (não abra direto do Finder)
```bash
cd MODULOS/CAPTACAO_FRETES
python3 -m http.server 8000
```

### Problema: WhatsApp não envia

**Solução**: Verifique se a Evolution API está online
```
https://evolution-api-latest-poc1.onrender.com/manager
```

### Problema: Google Sheets não carrega

**Solução**: Verifique se a planilha está pública e o ID está correto

---

## 📞 SUPORTE

- **WhatsApp**: (18) 99654-0492
- **Sistema**: Anderson Enside Logística
- **GitHub**: https://github.com/ensideanderson-nova/ENSIDE-MASTER-v16

---

## ✅ CHECKLIST DE VERIFICAÇÃO

Antes de usar, verifique:

- [ ] Repositório clonado com sucesso
- [ ] Navegou até a pasta MODULOS/CAPTACAO_FRETES
- [ ] Abriu as páginas com servidor HTTP local ou diretamente
- [ ] Testou cadastro de frete (Admin)
- [ ] Testou cadastro de motorista (Motorista)
- [ ] Testou fazer proposta (Motorista)
- [ ] Testou cadastrar rota (Motorista)
- [ ] Verificou notificações WhatsApp (opcional)

---

## 🎉 PRONTO PARA USAR!

O sistema está **100% funcional** e pronto para uso.

**Todas as credenciais estão configuradas:**
- ✅ Google Sheets: ID correto e configurado
- ✅ Evolution API: URL, Key e Instance configurados
- ✅ WhatsApp: Número configurado para notificações
- ✅ GitHub: Token e repo configurados

**Próximos Passos:**
1. Clone o repositório no seu Mac
2. Abra as páginas HTML
3. Comece a usar!

---

**Desenvolvido para Anderson Enside Logística**  
© 2026 - Sistema Completo de Captação de Fretes
