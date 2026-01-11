# 🚚 Sistema Completo de Captação de Fretes

**Anderson Enside Logística** - Sistema de Gestão de Fretes e Motoristas

---

## 📋 Visão Geral

Sistema completo para captação de motoristas, gerenciamento de fretes disponíveis, propostas e rotas preferidas. Totalmente integrado com **Google Sheets** e **Evolution API (WhatsApp)**.

### Principais Recursos

✅ **Landing Page de Captação** - Cadastro de motoristas com estatísticas reais  
✅ **Visualização de Fretes** - Fretes disponíveis com filtros avançados  
✅ **Sistema de Propostas** - Motoristas fazem propostas, admins avaliam  
✅ **Rotas Preferidas** - Cadastro de rotas com matching automático  
✅ **Notificações WhatsApp** - Via Evolution API  
✅ **Análise Inteligente** - Insights baseados em padrões dos motoristas  
✅ **Integração Google Sheets** - Dados em tempo real  

---

## 📊 Google Sheets - Estrutura

### Planilha Principal
- **Nome**: `EUCALIPTO-13-12-25-_SISTEMA_INTEGRADO_COMPLETO`
- **ID**: `1FiP885Or0ncyRG_ZZaAvM2vP0sHhDzhLFYifYLjKyIE`
- **URL**: [Acessar Planilha](https://docs.google.com/spreadsheets/d/1FiP885Or0ncyRG_ZZaAvM2vP0sHhDzhLFYifYLjKyIE)

### Abas Existentes

#### 1. **CONTATOS** (gid: 1689968688)
Mais de 7.055 contatos cadastrados.

**Colunas**:
- `TIMESTAMP` - Data/hora do cadastro
- `NOME` - Nome do contato
- `WHATSAPP` - Número WhatsApp
- `ORIGEM` - Origem do cadastro
- `TIPO_CONTATO` - Tipo (Motorista, Cliente, etc)
- `STATUS` - Status (Ativo, Inativo)

#### 2. **FRETES_DISPONIVEIS** (gid: 1716433489)
Fretes disponíveis para captação.

**Colunas**:
- `ID` - Identificador único do frete
- `STATUS` - ATIVO, INATIVO, FECHADO, CANCELADO
- `URGENTE` - SIM ou NÃO
- `ORIGEM_UF` - Estado de origem
- `ORIGEM_CIDADE` - Cidade de origem
- `DESTINO_UF` - Estado de destino
- `DESTINO_CIDADE` - Cidade de destino
- `DISTANCIA_KM` - Distância em quilômetros
- `VALOR_SUGERIDO` - Valor sugerido (R$)
- `VALOR_POR_KM` - Valor por quilômetro (R$/km)
- `TIPO_VEICULO` - Tipo do veículo necessário
- `TIPO_CARGA` - Tipo de carga
- `PESO_TON` - Peso em toneladas
- `DATA_EMBARQUE` - Data de embarque
- `OBSERVACOES` - Observações adicionais
- `VAGAS` - Número de vagas disponíveis
- `VISUALIZACOES` - Contador de visualizações
- `PROPOSTAS` - Contador de propostas recebidas
- `CRIADO_EM` - Data/hora de criação
- `ATUALIZADO_EM` - Data/hora última atualização

#### 3. **CAPTACAO_FRETES** (gid: 1707733664)
Motoristas cadastrados no sistema.

**Colunas**:
- `TIMESTAMP` - Data/hora do cadastro
- `NOME_COMPLETO` - Nome completo do motorista
- `WHATSAPP` - WhatsApp do motorista
- `INTERESSE_SEGURO` - Sim/Não para seguro de carga
- `ORIGEM` - Origem do cadastro (Landing Page, Web, etc)
- `STATUS` - Status do cadastro

#### 4. **LISTAS_TRANSMISSAO** (gid: 1114979046)
Listas de transmissão para WhatsApp.

**Colunas**:
- `NOME_LISTA` - Nome da lista
- `NUMEROS_WHATSAPP` - Números separados por vírgula
- `TOTAL` - Total de números
- `CRIADO_EM` - Data de criação

### Novas Abas a Criar

#### 5. **ROTAS_PREFERIDAS_MOTORISTAS**
Rotas preferidas cadastradas pelos motoristas.

**Colunas**:
- `ID` - Identificador único
- `MOTORISTA_NOME` - Nome do motorista
- `MOTORISTA_WHATSAPP` - WhatsApp do motorista
- `ORIGEM_CIDADE` - Cidade de origem (ou QUALQUER)
- `ORIGEM_UF` - Estado de origem
- `ORIGEM_FLEXIVEL` - SIM ou NÃO (aceita qualquer cidade do estado)
- `DESTINO_CIDADE` - Cidade de destino (ou QUALQUER)
- `DESTINO_UF` - Estado de destino
- `DESTINO_FLEXIVEL` - SIM ou NÃO (aceita qualquer cidade do estado)
- `RAIO_KM` - Raio de aceitação em km
- `TIPO_VEICULO` - Tipos de veículo (separados por vírgula)
- `TIPOS_CARGA` - Tipos de carga aceitos (separados por vírgula)
- `CAPACIDADE_TON` - Capacidade máxima em toneladas
- `VALOR_MINIMO` - Valor mínimo aceitável (R$)
- `DIAS_SEMANA` - Dias disponíveis (separados por vírgula)
- `DISPONIBILIDADE` - Disponibilidade atual
- `NOTIFICAR_WHATSAPP` - SIM ou NÃO
- `STATUS` - ATIVA, PAUSADA, INATIVA
- `CRIADO_EM` - Data/hora de criação
- `ATUALIZADO_EM` - Data/hora última atualização

#### 6. **PROPOSTAS_FRETES**
Propostas enviadas pelos motoristas.

**Colunas**:
- `ID` - Identificador único
- `FRETE_ID` - ID do frete relacionado
- `MOTORISTA_NOME` - Nome do motorista
- `MOTORISTA_WHATSAPP` - WhatsApp do motorista
- `ROTA` - Rota (Origem → Destino)
- `VALOR_SUGERIDO` - Valor sugerido original (R$)
- `VALOR_PROPOSTA` - Valor proposto pelo motorista (R$)
- `DESCONTO_PCT` - Desconto percentual
- `VEICULO_PLACA` - Placa do veículo
- `VEICULO_TIPO` - Tipo do veículo
- `DISPONIBILIDADE` - Disponibilidade do motorista
- `OBSERVACOES` - Observações da proposta
- `STATUS` - AGUARDANDO, ACEITA, RECUSADA, CANCELADA
- `MOTIVO_RECUSA` - Motivo se recusada
- `DATA_PROPOSTA` - Data/hora da proposta
- `DATA_RESPOSTA` - Data/hora da resposta
- `TEMPO_RESPOSTA_H` - Tempo de resposta em horas

---

## 🔧 Google Apps Script - Configuração

### Passo 1: Criar Projeto Apps Script

1. Abra a planilha do Google Sheets
2. Clique em **Extensões** → **Apps Script**
3. Crie um novo projeto: `Sistema_Captacao_Fretes`

### Passo 2: Código Apps Script

Crie um arquivo `Code.gs` com o seguinte código:

```javascript
// Configuração
const SPREADSHEET_ID = '1FiP885Or0ncyRG_ZZaAvM2vP0sHhDzhLFYifYLjKyIE';

/**
 * Função principal - recebe requisições POST
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
        resultado = { erro: 'Tipo inválido' };
    }
    
    return ContentService
      .createTextOutput(JSON.stringify(resultado))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (erro) {
    return ContentService
      .createTextOutput(JSON.stringify({ erro: erro.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Salvar captação inicial
 */
function salvarCaptacao(ss, dados) {
  const aba = ss.getSheetByName('CAPTACAO_FRETES');
  
  aba.appendRow([
    dados.TIMESTAMP,
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
    dados.VISUALIZACOES,
    dados.PROPOSTAS,
    dados.CRIADO_EM,
    dados.ATUALIZADO_EM
  ]);
  
  return { sucesso: true, tipo: 'FRETE_ADMIN', id: dados.ID };
}

/**
 * Salvar proposta
 */
function salvarProposta(ss, dados) {
  const aba = ss.getSheetByName('PROPOSTAS_FRETES');
  
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
    dados.MOTIVO_RECUSA,
    dados.DATA_PROPOSTA,
    dados.DATA_RESPOSTA,
    dados.TEMPO_RESPOSTA_H
  ]);
  
  // Atualizar contador de propostas do frete
  atualizarContadorPropostas(ss, dados.FRETE_ID);
  
  return { sucesso: true, tipo: 'PROPOSTA_FRETE', id: dados.ID };
}

/**
 * Salvar rota preferida
 */
function salvarRotaPreferida(ss, dados) {
  const aba = ss.getSheetByName('ROTAS_PREFERIDAS_MOTORISTAS');
  
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
 * Atualizar contador de propostas
 */
function atualizarContadorPropostas(ss, freteId) {
  const aba = ss.getSheetByName('FRETES_DISPONIVEIS');
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
 * Teste de conexão
 */
function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ status: 'online', timestamp: new Date() }))
    .setMimeType(ContentService.MimeType.JSON);
}
```

### Passo 3: Deploy

1. Clique em **Implantar** → **Nova implantação**
2. Selecione **Aplicativo da Web**
3. Configurações:
   - **Executar como**: Eu (seu email)
   - **Quem tem acesso**: Qualquer pessoa
4. Clique em **Implantar**
5. **Copie a URL do Web App** (será algo como: `https://script.google.com/macros/s/...../exec`)

### Passo 4: Atualizar config.js

Atualize o arquivo `config.js` com a URL do Apps Script:

```javascript
googleAppsScript: {
    url: 'SUA_URL_AQUI',  // ← Cole a URL copiada
    timeout: 30000,
    retries: 3
}
```

### Passo 5: Criar Abas Novas

Execute manualmente na planilha ou via script:

```javascript
function criarAbasNovas() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  
  // Criar ROTAS_PREFERIDAS_MOTORISTAS
  let aba = ss.getSheetByName('ROTAS_PREFERIDAS_MOTORISTAS');
  if (!aba) {
    aba = ss.insertSheet('ROTAS_PREFERIDAS_MOTORISTAS');
    aba.appendRow(['ID', 'MOTORISTA_NOME', 'MOTORISTA_WHATSAPP', 'ORIGEM_CIDADE', 
                   'ORIGEM_UF', 'ORIGEM_FLEXIVEL', 'DESTINO_CIDADE', 'DESTINO_UF', 
                   'DESTINO_FLEXIVEL', 'RAIO_KM', 'TIPO_VEICULO', 'TIPOS_CARGA', 
                   'CAPACIDADE_TON', 'VALOR_MINIMO', 'DIAS_SEMANA', 'DISPONIBILIDADE', 
                   'NOTIFICAR_WHATSAPP', 'STATUS', 'CRIADO_EM', 'ATUALIZADO_EM']);
  }
  
  // Criar PROPOSTAS_FRETES
  aba = ss.getSheetByName('PROPOSTAS_FRETES');
  if (!aba) {
    aba = ss.insertSheet('PROPOSTAS_FRETES');
    aba.appendRow(['ID', 'FRETE_ID', 'MOTORISTA_NOME', 'MOTORISTA_WHATSAPP', 'ROTA', 
                   'VALOR_SUGERIDO', 'VALOR_PROPOSTA', 'DESCONTO_PCT', 'VEICULO_PLACA', 
                   'VEICULO_TIPO', 'DISPONIBILIDADE', 'OBSERVACOES', 'STATUS', 
                   'MOTIVO_RECUSA', 'DATA_PROPOSTA', 'DATA_RESPOSTA', 'TEMPO_RESPOSTA_H']);
  }
  
  Logger.log('Abas criadas com sucesso!');
}
```

---

## 📱 Evolution API - Configuração

### Credenciais

- **URL**: `https://evolution-api-latest-poc1.onrender.com`
- **API Key**: `evolution-api-enside-2024-secret`
- **Instance**: `enside`
- **WhatsApp**: `5518996540492`

### Notificações Automáticas

O sistema envia notificações via WhatsApp nos seguintes eventos:

1. **Cadastro de Motorista** → Mensagem de boas-vindas
2. **Nova Proposta** → Notifica admin
3. **Proposta Aceita** → Notifica motorista
4. **Proposta Recusada** → Notifica motorista
5. **Frete Compatível** → Notifica motorista com rota cadastrada

### Configurar no config.js

```javascript
evolution: {
    url: 'https://evolution-api-latest-poc1.onrender.com',
    apiKey: 'evolution-api-enside-2024-secret',
    instance: 'enside',
    whatsapp: '5518996540492',
    notificacoes: true  // ← true para ativar, false para desativar
}
```

---

## 🗂️ Estrutura de Arquivos

```
MODULOS/CAPTACAO_FRETES/
│
├── config.js                               ← Configurações centralizadas
├── api-integration.js                      ← Funções de integração
├── README.md                               ← Este arquivo
│
├── ADMIN/ (Painel Administrativo)
│   ├── admin_cadastro_fretes.html          ← Cadastrar/Editar fretes
│   ├── admin_propostas_recebidas.html      ← Ver e gerenciar propostas
│   └── admin_rotas_preferidas.html         ← Ver rotas dos motoristas
│
├── MOTORISTAS/ (Interface Motoristas)
│   ├── landing_captacao.html               ← Landing page de cadastro
│   ├── fretes_disponiveis.html             ← Ver fretes + fazer propostas
│   ├── minhas_propostas.html               ← Ver status das propostas
│   └── minhas_rotas_preferidas.html        ← Cadastrar rotas preferidas
│
└── ASSETS/
    └── logo.svg                            ← Logo Anderson Enside
```

---

## 🚀 Como Usar

### Para Motoristas

1. **Acesse a Landing Page**: `MOTORISTAS/landing_captacao.html`
2. **Preencha o cadastro**: Nome, WhatsApp, interesse em seguro
3. **Visualize os fretes**: Navegue pelos fretes disponíveis
4. **Faça propostas**: Clique em "Fazer Proposta" nos fretes de interesse
5. **Acompanhe**: Veja suas propostas em "Minhas Propostas"
6. **Cadastre rotas**: Defina suas rotas preferidas para receber notificações

### Para Administradores

1. **Cadastre fretes**: Use `ADMIN/admin_cadastro_fretes.html`
2. **Gerencie propostas**: Veja e responda propostas em `ADMIN/admin_propostas_recebidas.html`
3. **Busque motoristas**: Encontre motoristas por rota em `ADMIN/admin_rotas_preferidas.html`
4. **Divulgue**: Use o sistema de listas de transmissão para divulgar fretes

---

## 🔧 Troubleshooting

### Problema: Dados não salvam no Google Sheets

**Solução**:
1. Verifique se a URL do Apps Script está correta em `config.js`
2. Verifique se o Apps Script está publicado corretamente
3. Verifique as permissões do Apps Script
4. Veja o console do navegador para erros

### Problema: Notificações WhatsApp não funcionam

**Solução**:
1. Verifique se `notificacoes: true` em `config.js`
2. Verifique credenciais da Evolution API
3. Verifique se a instância está conectada
4. Teste a conexão usando `EVOLUTION_CONFIG.testarConexao()`

### Problema: Filtros não funcionam

**Solução**:
1. Verifique se os dados estão sendo carregados corretamente
2. Limpe o cache do navegador
3. Veja o console para erros JavaScript

---

## 📈 Estatísticas e Analytics

O sistema coleta as seguintes métricas:

- Total de fretes cadastrados
- Total de propostas recebidas
- Taxa de conversão (propostas → fechamentos)
- Motoristas ativos
- Rotas mais procuradas
- Valores médios por rota

---

## 🔒 Segurança

- ✅ Validação de inputs no frontend
- ✅ Sanitização de dados antes de enviar
- ✅ Tratamento de erros robusto
- ✅ Confirmações para ações críticas
- ✅ API Keys não expostas no frontend
- ✅ CORS configurado no Apps Script

---

## 🎨 Design System

### Cores

- **Primária**: #FFD700 (Dourado)
- **Secundária**: #10b981 (Verde)
- **Background**: #0a0a0a → #1a1a2e (Gradiente)
- **Texto**: #ffffff / #94a3b8
- **Urgente**: #dc2626 → #f59e0b (Gradiente)

### Breakpoints

- Mobile: 640px
- Tablet: 768px
- Laptop: 1024px
- Desktop: 1280px

---

## 📞 Suporte

**Anderson Enside Logística**  
WhatsApp: (18) 99654-0492  
Email: contato@andersonenside.com.br

---

## 📝 Changelog

### v1.0.0 (07/01/2026)
- ✅ Sistema inicial completo
- ✅ Integração Google Sheets
- ✅ Integração Evolution API
- ✅ Interface motoristas completa
- ✅ Interface admin completa
- ✅ Sistema de matching automático
- ✅ Análise inteligente de propostas

---

## 🔜 Próximas Funcionalidades

- [ ] Dashboard com gráficos e estatísticas
- [ ] Sistema de avaliação de motoristas
- [ ] Histórico de fretes realizados
- [ ] Integração com GPS/rastreamento
- [ ] App mobile (PWA)
- [ ] Sistema de pagamentos
- [ ] Emissão de documentos (CTE, NF)

---

**© 2026 Anderson Enside Logística - Todos os direitos reservados**
