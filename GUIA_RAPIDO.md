# ⚡ GUIA RÁPIDO - ENSIDE MASTER v19.0

## 🚀 Início Rápido

### 1. **Acessar o Hub**

```
Vercel:    https://enside-sistema.vercel.app/ENSIDE_MASTER_v19.0_INTEGRADO.html
Local:     http://localhost:8080/ENSIDE_MASTER_v19.0_INTEGRADO.html
Índice:    https://enside-sistema.vercel.app/index-sistema.html
```

### 2. **Navegação Principal**

| Aba         | Ícone | Descrição                   |
| ----------- | ----- | --------------------------- |
| Dashboard   | 📊    | Visão geral e status        |
| WhatsApp    | 💬    | Gerenciador de instâncias   |
| Control     | ⚙️    | Centro de controle          |
| Evolution   | 🔄    | API Evolution Manager       |
| Integrações | 🔗    | Google Sheets, Webhooks     |
| Status      | 📈    | Monitoramento em tempo real |

## 💡 Funcionalidades Principais

### Dashboard (📊)

✅ **Ver Status do Sistema**

- Versão: v19.0
- API Evolution: 2.1
- Uptime: 99.9%
- Webhooks: ✅ Ativo

✅ **Atalhos Rápidos**

- Local API (8080)
- Vercel Deploy
- Status em tempo real

✅ **Gerenciamento Rápido**

- Webhooks
- Logs
- Configurações
- Restart

### WhatsApp Manager (💬)

✅ **Instâncias WhatsApp**

- Criar nova instância
- Gerenciar existentes
- Monitorar conexões
- Webhooks por instância

### Control Center (⚙️)

✅ **Monitoramento Completo**

- Status de todos os serviços
- Gráficos em tempo real
- Logs detalhados
- Alertas e notificações

### Evolution Manager (🔄)

✅ **Gerenciar API**

- Instâncias da API
- Chaves de acesso
- Webhooks
- Autenticação OAuth 2.0

### Integrações (🔗)

✅ **Google Sheets**

- Sincronizar dados
- Atualizar automaticamente
- Exportar relatórios

✅ **Webhooks**

- Configurar eventos
- Testar conexões
- Histórico de requisições

✅ **OAuth 2.0**

- Gerenciar aplicações
- Tokens e permissões
- Revogar acessos

### Status (📈)

✅ **Monitoramento em Tempo Real**

- Disponibilidade: 100%
- Latência: <50ms
- Memória: 42%
- Disco: 65%

## 🎯 Tarefas Comuns

### Adicionar Nova Instância WhatsApp

1. Clique em "WhatsApp v21"
2. Clique em "➕ Adicionar"
3. Configure credenciais
4. Salve

### Sincronizar Google Sheets

1. Vá para "Integrações"
2. Clique em "Google Sheets"
3. Clique em "🔄 Sincronizar"
4. Aguarde confirmação

### Verificar Status da API

1. Vá para "Status"
2. Visualize gráficos em tempo real
3. Confira estatísticas
4. Revise alertas

### Gerenciar Webhooks

1. Vá para "Evolution"
2. Selecione "Webhooks"
3. Adicionar/editar/remover
4. Salve configurações

### Visualizar Logs

1. Vá para "Control"
2. Clique em "📋 Logs"
3. Filtre por tipo
4. Exporte se necessário

## 🔌 Exemplos de Integração

### Webhook WhatsApp

```javascript
// Evento de mensagem recebida
POST /webhook/messages
{
  "instance": "enside_whatsapp",
  "message": "Olá!",
  "from": "5511999999999",
  "timestamp": "2026-02-13T10:30:00Z"
}
```

### Google Sheets Sync

```javascript
// Sincronizar contatos
POST /api/sheets/sync
{
  "spreadsheet_id": "xxxxx",
  "sheet": "Contatos",
  "data": [...]
}
```

### OAuth Token

```javascript
// Obter token
POST /oauth/token
{
  "client_id": "xxx",
  "client_secret": "yyy",
  "grant_type": "client_credentials"
}
```

## 📱 Modo Tela Cheia

Cada aba com iframe tem botão "↔️ Tela Cheia":

1. Clique no botão
2. Interface expande
3. Clique novamente para voltar

## ⚙️ Configurações Rápidas

### Habilitar Webhooks

```
Dashboard → Configuração Rápida → 🔗 Webhooks → Ativar
```

### Renovar Token OAuth

```
Integrações → OAuth 2.0 → 🔄 Renovar
```

### Sincronizar Google Sheets

```
Integrações → Google Sheets → 🔄 Sincronizar
```

### Visualizar Logs

```
Dashboard → Configuração Rápida → 📋 Logs
```

## 🐛 Troubleshooting

### Aba não carrega

- **Solução:** Atualize a página (F5)
- Verifique conexão de internet
- Limpe cache do navegador

### iframe não aparece

- **Solução:** Clique em "Tela Cheia"
- Espere alguns segundos para carregar
- Verifique console (F12)

### Dados não atualizam

- **Solução:** Clique "🔄 Atualizar"
- Aguarde 30 segundos (auto-refresh)
- Recarregue a página

### API indisponível

- **Solução:** Verifique status em 📈 Status
- Reinicie o serviço
- Contate suporte técnico

## 🔑 Atalhos do Teclado

| Tecla        | Ação               |
| ------------ | ------------------ |
| F5           | Recarregar         |
| F12          | DevTools           |
| Ctrl+Shift+I | Inspecionar        |
| Ctrl+R       | Cache hard refresh |

## 📞 Suporte Rápido

### Dúvidas Frequentes

**P: Como adicionar webhooks?**
A: Integrações → Webhooks → ➕ Novo

**P: Onde vejo minha API Key?**
A: Dashboard → 🔐 Credenciais

**P: Como sincronizar Google Sheets?**
A: Integrações → Google Sheets → 🔄 Sincronizar

**P: Qual é o uptime?**
A: 99.9% (veja Dashboard)

**P: Posso usar em mobile?**
A: Sim! Interface é responsiva

## 📊 Métricas em Tempo Real

```
Disponibilidade: 🟢 100%
Latência:        ⚡ <50ms
Memória:         💾 42%
Disco:           💿 65%
Taxa Sucesso:    📈 98.5%
Webhooks:        ✅ 5/5
Instâncias:      📱 1+
Uptime:          🕐 99.9%
```

## 🆘 Emergency Restart

Se o sistema não responde:

1. Vá para **Dashboard**
2. Clique em **⚙️ Configuração**
3. Clique em **🔄 Reiniciar**
4. Aguarde ~10 segundos
5. Sistema volta online

## 📚 Documentação Completa

- **README:** ENSIDE_MASTER_v19.0_README.md
- **Arquitetura:** ARQUITETURA_INTEGRACAO.md
- **Este Guia:** GUIA_RAPIDO.md

## ✅ Checklist de Verificação

- [ ] Acessou o hub em `/ENSIDE_MASTER_v19.0_INTEGRADO.html`
- [ ] Navegou pelas 6 abas
- [ ] Viu status da API em tempo real
- [ ] Testou tela cheia em um iframe
- [ ] Clicou em atalhos rápidos
- [ ] Verificou status do sistema
- [ ] Entrou em Integrações
- [ ] Leu esta documentação

---

**🎯 ENSIDE MASTER v19.0 - Pronto para Usar! ✅**

**Última atualização:** 13 de fevereiro de 2026
**Status:** 🟢 100% Operacional
**Versão:** v19.0
