# 🚀 ENSIDE MASTER - GUIA RÁPIDO

## ⚡ Execução em 3 Passos

```bash
# 1. Navegue até o diretório
cd ENSIDE-MASTER-v16

# 2. Execute o script
./EXECUTAR_SISTEMA_COMPLETO.sh

# 3. Escolha a opção no menu!
```

## 📋 Menu Principal

| Opção | Descrição | Quando Usar |
|-------|-----------|-------------|
| **1** | 📊 Status Completo | Ver status de todos os sistemas |
| **2** | 📱 Conectar WhatsApp | Primeira vez ou reconectar |
| **3** | 📨 Mensagem Individual | Enviar para 1 contato |
| **4** | 📢 Envio em Massa | Enviar para múltiplos contatos |
| **5** | ✅ Validar Contatos | Verificar qualidade dos dados |
| **6** | 🔄 Sincronizar Contatos | Baixar contatos localmente |
| **7** | 🌐 Evolution Manager | Gerenciar WhatsApp API |
| **8** | 🎨 Sistema Web | Abrir interface Vercel |
| **9** | 📊 Google Sheets | Abrir planilha de contatos |
| **0** | ❌ Sair | Fechar o sistema |

## 🎯 Fluxos Comuns

### Primeira Vez
```
1. Execute o script
2. Aguarde verificação de dependências
3. Conecte WhatsApp (opção 2)
4. Teste com mensagem individual (opção 3)
```

### Envio de Campanha
```
1. Verifique status (opção 1)
2. Valide contatos (opção 5)
3. Teste com lista pequena (opção 4 → lista 1)
4. Envie para lista completa (opção 4 → lista desejada)
```

### Sincronização Diária
```
1. Execute o script
2. Sincronize contatos (opção 6)
3. Valide contatos (opção 5)
```

## 🔧 Comandos Úteis

### Ver Logs
```bash
# Logs de hoje
tail -f logs/envios_$(date +%Y%m%d).log

# Erros de hoje
tail -f logs/erros_$(date +%Y%m%d).log

# Últimos 50 envios
tail -50 logs/envios_$(date +%Y%m%d).log
```

### Estatísticas
```bash
# Contar mensagens enviadas hoje
grep "Mensagem individual" logs/envios_$(date +%Y%m%d).log | wc -l

# Contar erros
wc -l logs/erros_$(date +%Y%m%d).log
```

### Manutenção
```bash
# Limpar logs antigos (>30 dias)
find logs/ -name "*.log" -mtime +30 -delete

# Ver espaço usado
du -sh logs/ relatorios/ dados/

# Backup de contatos
cp -r dados/ backup_$(date +%Y%m%d)/
```

## 🔒 Segurança

### ✅ Faça
- Mantenha `.env` privado
- Use delays adequados (20s+)
- Teste antes de envios em massa
- Faça backup regular dos logs

### ❌ Não Faça
- Compartilhar API keys
- Enviar spam
- Commitar `.env` em repositórios públicos
- Ignorar limites do WhatsApp

## 🐛 Problemas Comuns

| Problema | Solução |
|----------|---------|
| `jq não encontrado` | `brew install jq` (Mac) ou `sudo apt install jq` (Linux) |
| `Permission denied` | `chmod +x EXECUTAR_SISTEMA_COMPLETO.sh` |
| `Evolution API offline` | Aguarde 30-60s (cold start do Render) |
| `WhatsApp desconectado` | Use opção 2 para reconectar |
| `Google Sheets erro` | Verifique conexão internet e permissões |

## 📞 Configurações

### Evolution API
```
URL: https://evolution-api-latest-poc1.onrender.com
Manager: /manager
Instância: ENSIDE
```

### Google Sheets
```
ID: 1FiP885Or0ncyRG_ZZaAvM2vP0sHhDzhLFYifYLjKyIE
Contatos: 7.055+
```

### Vercel
```
URL: https://enside-sistema.vercel.app
```

## 📊 KPIs Padrão

| Métrica | Valor Esperado |
|---------|----------------|
| Taxa de sucesso | >95% |
| Delay entre mensagens | 20-30 segundos |
| Cold start Render | 30-60 segundos |
| Contatos totais | 7.055+ |

## 🚀 Dicas Pro

1. **Alias no Terminal**: Adicione ao `~/.bashrc`:
   ```bash
   alias enside="cd ~/ENSIDE-MASTER-v16 && ./EXECUTAR_SISTEMA_COMPLETO.sh"
   ```

2. **Cron Job para Sincronização**: Sincronize diariamente às 8h:
   ```bash
   0 8 * * * cd ~/ENSIDE-MASTER-v16 && ./EXECUTAR_SISTEMA_COMPLETO.sh <<< "6"
   ```

3. **Monitor de Status**: Crie script de monitoramento:
   ```bash
   #!/bin/bash
   cd ~/ENSIDE-MASTER-v16
   ./EXECUTAR_SISTEMA_COMPLETO.sh <<< "1" | grep "🟢"
   ```

4. **Backup Automático**: Backup semanal:
   ```bash
   0 0 * * 0 tar -czf backup_$(date +%Y%m%d).tar.gz ~/ENSIDE-MASTER-v16/logs ~/ENSIDE-MASTER-v16/dados
   ```

## 📚 Documentação Completa

Para mais detalhes, consulte: **README_EXECUTAR.md**

---

**Versão**: 1.0.0  
**Última Atualização**: 03/02/2026  
**Suporte**: Via repositório GitHub
