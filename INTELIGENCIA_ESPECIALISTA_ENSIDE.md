# 🤖 Inteligência Extraída do Agente "O Especialista"

## Documento para Configuração do Novo Agente - Enside Group/Enside Madeiras

---

## 📊 Resumo da Análise

O agente anterior foi desenvolvido na plataforma **Microsoft Power Virtual Agents** (Copilot Studio) e tinha as seguintes capacidades identificadas pela estrutura de arquivos:

---

## 1️⃣ FLUXOS DE CONVERSAÇÃO (Tópicos)

### Tópicos Identificados:

| Tópico                    | Função                                  |
| ------------------------- | --------------------------------------- |
| **ConversationStart**     | Inicia conversa, boas-vindas ao cliente |
| **Greeting**              | Saudações (Olá, Bom dia, Oi)            |
| **Goodbye**               | Despedidas (Tchau, Até logo)            |
| **ThankYou**              | Agradecimentos (Obrigado, Valeu)        |
| **Escalate**              | Transferir para atendente humano        |
| **Fallback**              | Resposta quando não entende a pergunta  |
| **Search**                | Busca de informações                    |
| **Signin**                | Autenticação/Login de usuário           |
| **ResetConversation**     | Reiniciar conversa do zero              |
| **StartOver**             | Recomeçar atendimento                   |
| **MultipleTopicsMatched** | Quando há várias opções possíveis       |
| **EndofConversation**     | Encerramento da conversa                |
| **OnError**               | Tratamento de erros                     |

---

## 2️⃣ INTEGRAÇÕES COM FERRAMENTAS

### Excel Online Business (Principal):

- **Listar linhas de tabela** - Consulta dados em planilhas
- **Obter planilhas** - Lista planilhas disponíveis
- **Atualizar linha** - Modifica registros existentes
- **Executar scripts** - Automações personalizadas
- **Scripts SharePoint** - Integração com arquivos corporativos

### Comunicação:

- **Email** - Enviar notificações por e-mail (V3)
- **DocuSign** - Criar lista de envio em massa (contratos)
- **Google Contatos** - Obter contatos (V4)

### Conversão de Documentos:

- **Cloudmersive** - Converter CSV para Excel
- **Cloudmersive** - Mesclar múltiplos arquivos Excel

### Gestão de Processos:

- **WayWeDo** - Criar instâncias de checklists

### Infraestrutura:

- **Azure Resource Manager** - Criar/atualizar implantações de modelo

---

## 3️⃣ CAPACIDADES DE IA

### Componentes de IA Configurados:

- **AIGenerateSuggestions** - Gerar sugestões automáticas
- **AIGenerativeAnswerMatch** - Respostas generativas baseadas em contexto
- **AIRedact** - Redação/edição automática de textos
- **AISynonyms** - Encontrar sinônimos para melhorar busca
- **AITranslate** - Tradução automática
- **GPT Default** - Modelo GPT para respostas

---

## 4️⃣ BASE DE CONHECIMENTO

### Fontes de Pesquisa Pública Identificadas:

1. **PublicSiteSearchSource.0** - Fonte de conhecimento 1
2. **PublicSiteSearchSource.1** - Fonte de conhecimento 2
3. **PublicSiteSearchSource.2** - Fonte de conhecimento 3
4. **PublicSiteSearchSource.3** - Fonte de conhecimento 4

_(Os URLs/conteúdos específicos não foram preservados no arquivo exportado)_

---

## 5️⃣ INTERFACE ADAPTATIVA

- **AdaptiveCardAccountSummary** - Cards visuais para resumo de conta
- Componentes de interface adaptativa para exibição de informações

---

# 🚀 RECOMENDAÇÕES PARA NOVO AGENTE CLAUDE

## Perfil do Agente Enside Madeiras

```
NOME: Assistente Enside Madeiras
EMPRESA: Enside Group (institucional) / Enside Madeiras (operacional)
SETOR: Distribuição B2B de madeira serrada
MODELO: Dropshipping - conectando fornecedores (serrarias) a distribuidores/clientes finais
COBERTURA: Todo Brasil + Exportação
```

## Conhecimento Especializado do Setor

### Cálculos de Peso de Madeira:

```
Madeira Seca: 500 kg/m³
Madeira Verde: 1.000 kg/m³
Madeira Murcha: 750 kg/m³
```

### Lógica de Cotação de Frete:

- Calcular em quilômetros (simplificado)
- Contratar em tonelagem
- Manter histórico de preços por trajeto
- Base de dados com médias de transações anteriores

### Filosofia de Sistema:

> "Resolver a complexidade no início (cadastro robusto de fornecedores com todos os cálculos possíveis) para que o resultado final seja simples e prático."

---

## Fluxos Recomendados para o Novo Agente

### 1. Atendimento ao Cliente

```
- Saudação personalizada
- Identificação da necessidade (cotação, pedido, acompanhamento)
- Coleta de informações (produto, quantidade, cidade destino)
- Consulta automática de fornecedores
- Apresentação de opções com preços
- Encaminhamento para fechamento
```

### 2. Cotação de Frete

```
- Origem (cidade/estado do fornecedor)
- Destino (cidade/estado do cliente)
- Tipo de madeira (seca/verde/murcha)
- Volume em m³
- Cálculo automático de peso
- Consulta de preços por km
- Cálculo final em tonelagem
```

### 3. Gestão de Fornecedores

```
- Cadastro com dados completos
- Produtos oferecidos
- Capacidade de produção
- Localização (cidade/estado)
- Preços por produto
- Pré-cálculo de cargas (verde/seca/murcha)
```

### 4. Captação de Leads (Motoristas)

```
- Página de captação de oportunidades
- Registro de interesse
- Qualificação em 3 etapas (funil)
- Automação de contato
```

---

## Integrações Sugeridas para Claude

### Já Disponíveis:

- ✅ Google Drive - Gestão de documentos
- ✅ Google Sheets - Base de dados de fornecedores/clientes
- ✅ Gmail - Comunicação com clientes
- ✅ Calendário - Agendamentos

### A Configurar:

- 📋 WhatsApp Business (via n8n ou Make)
- 📊 Planilhas de controle de pedidos
- 📧 Automação de e-mails de confirmação
- 📱 Formulários de captação

---

## Prompts Base para Configuração

### Persona do Agente:

```
Você é o assistente virtual da Enside Madeiras, especialista em distribuição
de madeira serrada no modelo B2B dropshipping. Você tem conhecimento profundo
sobre:
- Tipos de madeira e suas especificações técnicas
- Cálculos de peso (seca 500kg/m³, verde 1000kg/m³, murcha 750kg/m³)
- Logística de frete em todo Brasil
- Conexão entre serrarias e distribuidores
- Processo completo da tora ao consumidor final

Seu objetivo é atender clientes, fazer cotações rápidas e conectar
fornecedores aos compradores de forma eficiente.
```

### Tom de Comunicação:

```
- Profissional mas acessível
- Direto ao ponto (sem enrolação)
- Conhecedor técnico do setor
- Orientado à solução
- Linguagem em português brasileiro
```

---

## Dados Importantes a Migrar

### Do Sistema Anterior:

1. Base de fornecedores (63+ empresas identificadas anteriormente)
2. Histórico de preços de frete
3. Cadastro de clientes
4. Fluxos de atendimento
5. FAQs do setor

### Fontes de Conhecimento a Indexar:

1. Site Enside Madeiras (ensideanderson.com)
2. Planilhas de fornecedores
3. Tabelas de preços
4. Documentos de processos

---

## Próximos Passos Recomendados

1. **Configurar memória do Claude** com informações base do negócio
2. **Conectar Google Sheets** com base de fornecedores
3. **Criar fluxos de cotação** automatizados
4. **Implementar sistema de leads** para motoristas
5. **Integrar WhatsApp** para atendimento direto

---

**Documento gerado em:** 14 de fevereiro de 2026  
**Fonte:** Extração do agente "O Especialista" (Power Virtual Agents)  
**Destino:** Novo agente Claude para Enside Group/Enside Madeiras  
**Status:** ✅ Integrado ao ESPECIALISTA-IA
