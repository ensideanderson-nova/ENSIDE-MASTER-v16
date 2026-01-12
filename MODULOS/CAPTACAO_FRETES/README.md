# Sistema de Captação e Gerenciamento de Fretes
**ENSIDE Anderson Logística**

## 📋 Visão Geral

Sistema completo para captação e gerenciamento de fretes com integração total ao Google Sheets, notificações WhatsApp e análise de propostas com IA.

### Planilha Google Sheets
- **ID**: 1FiP885Or0ncyRG_ZZaAvM2vP0sHhDzhLFYifYLjKyIE
- **URL**: https://docs.google.com/spreadsheets/d/1FiP885Or0ncyRG_ZZaAvM2vP0sHhDzhLFYifYLjKyIE/edit

## 🏗️ Estrutura de Arquivos

```
MODULOS/CAPTACAO_FRETES/
├── config.js                          # Configurações do sistema
├── api-integration.js                 # Funções de integração API
├── README.md                          # Este arquivo
├── ADMIN/                             # Painel Administrativo
│   ├── admin_cadastro_fretes.html    # Cadastrar novos fretes
│   ├── admin_propostas_recebidas.html # Visualizar propostas
│   └── admin_rotas_preferidas.html   # Visualizar rotas preferidas
└── MOTORISTAS/                        # Portal do Motorista
    ├── landing_captacao.html         # Página inicial (landing)
    ├── fretes_disponiveis.html       # Fretes disponíveis
    ├── minhas_propostas.html         # Propostas enviadas
    └── minhas_rotas_preferidas.html  # Cadastro de rotas preferidas
```

## 🎯 Funcionalidades Principais

### 👨‍💼 Painel Administrativo
1. **Cadastro de Fretes**
   - Cadastrar novos fretes com valores sugeridos
   - Origem e destino (UF e cidade)
   - Tipo de veículo e capacidade
   - Cálculo automático de valor total

2. **Gestão de Propostas**
   - Visualizar todas as propostas recebidas
   - Análise automática de IA com score
   - Aprovação/recusa de propostas
   - Notificações automáticas aos motoristas

3. **Rotas Preferidas**
   - Visualizar rotas cadastradas pelos motoristas
   - Sistema de matching automático
   - Notificação automática quando surge frete compatível

### 🚚 Portal do Motorista
1. **Landing Page**
   - Apresentação do sistema
   - Cadastro rápido de motoristas
   - Informações sobre o serviço

2. **Fretes Disponíveis**
   - Listagem de fretes abertos
   - Filtros por origem/destino/veículo
   - Fazer propostas com valores

3. **Minhas Propostas**
   - Acompanhar propostas enviadas
   - Status em tempo real
   - Histórico de propostas

4. **Rotas Preferidas**
   - Cadastrar rotas mais frequentes
   - Receber notificações automáticas
   - Gerenciar rotas ativas

## 🔌 Integrações

### Google Sheets
- Leitura e escrita de dados em tempo real
- Sincronização automática
- Abas utilizadas:
  - `FRETES_DISPONIVEIS` (gid: 1716433489)
  - `PROPOSTAS_MOTORISTAS`
  - `ROTAS_PREFERIDAS`
  - `CAPTACAO_FRETES` (gid: 1707733664)

### Evolution API (WhatsApp)
- **URL**: https://evolution-api-latest-poc1.onrender.com
- **Instance**: ENSIDE
- **Número**: 5518996540492
- Notificações automáticas:
  - Nova proposta para admin
  - Novo frete para motoristas compatíveis
  - Status de proposta para motoristas

### Análise de IA
- Score automático de propostas (0-100)
- Fatores considerados:
  - Diferença percentual do valor sugerido
  - Rapidez de resposta
  - Histórico do motorista (futuro)
- Recomendações: APROVAR / NEGOCIAR / RECUSAR

## 🎨 Design

### Tema Dark
- **Gradiente de fundo**: #0a0a0a → #1a1a2e
- **Cor primária**: #FFD700 (Dourado)
- **Cor secundária**: #10b981 (Verde)
- **Fonte**: Inter (Google Fonts)
- **Framework**: Tailwind CSS

### Responsividade
- Mobile-first design
- Breakpoints otimizados
- Interface adaptável

## 🚀 Como Usar

### Para Administradores
1. Acesse `ADMIN/admin_cadastro_fretes.html`
2. Cadastre novos fretes com informações completas
3. Aguarde propostas dos motoristas
4. Visualize propostas em `ADMIN/admin_propostas_recebidas.html`
5. Aprove/recuse com base na análise de IA

### Para Motoristas
1. Acesse `MOTORISTAS/landing_captacao.html`
2. Faça seu cadastro inicial
3. Configure suas rotas preferidas
4. Veja fretes disponíveis em `MOTORISTAS/fretes_disponiveis.html`
5. Envie propostas com seus valores
6. Acompanhe o status em `MOTORISTAS/minhas_propostas.html`

## 🔧 Configuração

### config.js
Arquivo principal de configuração. Contém:
- IDs e URLs do Google Sheets
- Credenciais Evolution API
- Tema e cores
- Funções utilitárias

### api-integration.js
Funções de integração. Inclui:
- Buscar dados do Google Sheets
- Enviar mensagens WhatsApp
- Matching automático de rotas
- Análise de IA
- Storage local (temporário)

## 📊 Estrutura de Dados

### Frete
```javascript
{
  id: 'FRETE123456789',
  origemUF: 'PR',
  origemCidade: 'Curitiba',
  destinoUF: 'SP',
  destinoCidade: 'São Paulo',
  km: 400,
  tipoVeiculo: 'Carreta',
  capacidade: '27 toneladas',
  valorSugerido: 1800.00,
  dataCadastro: '07/01/2026 10:30',
  status: 'DISPONIVEL',
  adminResponsavel: 'Anderson'
}
```

### Proposta
```javascript
{
  idProposta: 'PROP123456789',
  idFrete: 'FRETE123456789',
  nomeMotorista: 'João Silva',
  whatsapp: '5511999999999',
  valorProposto: 1750.00,
  dataProposta: '07/01/2026 11:00',
  status: 'PENDENTE',
  observacoes: 'Disponível imediatamente',
  analiseIA: '⭐⭐⭐ EXCELENTE',
  scoreIA: 85
}
```

### Rota Preferida
```javascript
{
  idRota: 'ROTA123456789',
  nomeMotorista: 'João Silva',
  whatsapp: '5511999999999',
  origemUF: 'PR',
  origemCidade: 'Curitiba',
  destinoUF: 'SP',
  destinoCidade: 'São Paulo',
  frequencia: 'Semanal',
  dataCadastro: '07/01/2026',
  ativo: 'SIM'
}
```

## 🔐 Segurança

- Validação de dados no frontend
- Formatação automática de números de telefone
- Sanitização de inputs
- Storage local para dados temporários

## 📱 Notificações WhatsApp

### Templates de Mensagens

#### Nova Proposta (para Admin)
```
🆕 NOVA PROPOSTA RECEBIDA

📦 Frete: FRETE123
👤 Motorista: João Silva
📱 WhatsApp: 5511999999999
💰 Valor Proposto: R$ 1.750,00
📅 Data: 07/01/2026

🔗 Acesse o painel para visualizar e responder.
```

#### Novo Frete (para Motorista)
```
🚚 NOVO FRETE DISPONÍVEL NA SUA ROTA

📍 Origem: Curitiba/PR
📍 Destino: São Paulo/SP
📏 Distância: 400 km
🚛 Veículo: Carreta
💰 Valor Sugerido: R$ 1.800,00

🔗 Acesse o sistema para fazer sua proposta

Anderson Enside Logística
```

#### Status da Proposta (para Motorista)
```
✅ ATUALIZAÇÃO DA SUA PROPOSTA

📦 Frete: FRETE123
📊 Status: APROVADA
💰 Valor Proposto: R$ 1.750,00

🎉 Parabéns! Sua proposta foi aprovada!

Anderson Enside Logística
```

## 🎯 Matching Automático

O sistema identifica automaticamente motoristas com rotas preferidas compatíveis:

1. Novo frete é cadastrado
2. Sistema busca rotas preferidas ativas
3. Compara origem e destino
4. Notifica motoristas compatíveis via WhatsApp
5. Motoristas recebem notificação imediata

## 📈 Análise de IA

### Score (0-100)
- **80-100**: ⭐⭐⭐ EXCELENTE
- **60-79**: ⭐⭐ BOA
- **40-59**: ⭐ REGULAR
- **0-39**: ❌ BAIXA

### Fatores
1. **Comparação com valor sugerido** (60%)
   - Igual ou menor: +30 pontos
   - 5% acima: +20 pontos
   - 10% acima: +10 pontos
   - >10% acima: -10 pontos

2. **Rapidez de resposta** (20%)
   - < 2 horas: +10 pontos

3. **Histórico do motorista** (20%)
   - A ser implementado

## 🔄 Fluxo de Trabalho

```
1. Admin cadastra frete
   ↓
2. Sistema busca motoristas compatíveis
   ↓
3. Notificações WhatsApp automáticas
   ↓
4. Motoristas fazem propostas
   ↓
5. IA analisa propostas automaticamente
   ↓
6. Admin visualiza com scores
   ↓
7. Admin aprova/recusa
   ↓
8. Motorista é notificado do resultado
```

## 🆘 Suporte

Para suporte, entre em contato:
- **WhatsApp**: 5518996540492
- **Sistema**: Anderson Enside Logística

## 📝 Notas de Versão

### v1.0.0 (07/01/2026)
- Sistema completo de captação de fretes
- Integração Google Sheets
- Notificações WhatsApp
- Análise de IA
- Matching automático
- Painel Admin e Portal Motorista

---

**Desenvolvido para Anderson Enside Logística**  
© 2026 - Todos os direitos reservados
