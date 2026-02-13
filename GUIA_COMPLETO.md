# 🚀 ENSIDE MASTER v19.0 - GUIA COMPLETO

## ⚡ INÍCIO RÁPIDO

Execute um único comando para iniciar tudo:

```bash
enside
```

Este comando inicia **automaticamente**:

- ✅ Docker Desktop
- ✅ PostgreSQL (banco de dados)
- ✅ Redis (cache)
- ✅ RabbitMQ (fila de mensagens)
- ✅ Evolution API (servidor principal)
- ✅ Servidor Web local
- ✅ Interface web no navegador

---

## 📊 O Que o Sistema Inclui

### 🐳 Serviços Docker Integrados

| Serviço           | Porta | Função                     |
| ----------------- | ----- | -------------------------- |
| **PostgreSQL**    | 5432  | Banco de dados principal   |
| **Redis**         | 6379  | Cache e sessões            |
| **RabbitMQ**      | 5672  | Fila de mensagens          |
| **Evolution API** | 8080  | API WhatsApp/Gerenciamento |
| **Servidor Web**  | 9999  | Interface HTML local       |

### 🌐 Interface Web - 8 Abas

1. **📊 Dashboard** - Visão geral + Status dos serviços
2. **💬 WhatsApp v21** - Gerenciador WhatsApp
3. **⚙️ Control v21** - Centro de controle
4. **🔄 Evolution** - Gerenciador API Evolution
5. **📱 Manager** - Portal administrativo
6. **🔲 QR Code** - Scanner QR
7. **📊 Sheets** - Google Sheets integrado
8. **📈 Status** - Monitoramento de serviços

---

## 🎯 Como Acessar

### Via Local (Recomendado)

```
http://localhost:9999/public/index-v19-funcional.html
```

### Via Vercel (Produção)

```
https://enside-sistema.vercel.app/public/index-v19-funcional.html
```

---

## 🔧 Configurações de Acesso

### PostgreSQL

```
Host: localhost
Porta: 5432
Usuário: evolution
Senha: evolution_password
Banco: evolution_db
```

### Redis

```
Host: localhost
Porta: 6379
Sem autenticação
```

### RabbitMQ

```
URL: amqp://localhost:5672
Usuário: guest
Senha: guest
Admin: http://localhost:15672
```

### Evolution API

```
URL: http://localhost:8080
Health Check: http://localhost:8080/health
Documentação: http://localhost:8080/docs
```

---

## 📝 Comandos Úteis

### Iniciar o Sistema

```bash
enside
```

### Parar o Sistema

```bash
docker-compose down
```

### Ver Logs do Docker

```bash
docker-compose logs -f
```

### Verificar Status

```bash
docker-compose ps
```

### Limpar Tudo

```bash
docker-compose down -v
```

---

## ⚠️ Troubleshooting

### 1. Docker não está iniciando

```bash
# Verificar se Docker está rodando
docker info

# Se não estiver, abra Docker Desktop manualmente
open -a Docker
```

### 2. Porta 8080 já está em uso

```bash
# Encontrar processo na porta 8080
lsof -i :8080

# Matar processo
kill -9 <PID>
```

### 3. PostgreSQL não inicia

```bash
# Verificar logs
docker-compose logs postgres

# Limpar volume e recomeçar
docker-compose down -v
docker-compose up -d
```

### 4. API Evolution lenta

```bash
# Reiniciar container
docker-compose restart evolution_api

# Ou reconstruir
docker-compose up -d --force-recreate evolution_api
```

### 5. Interface não carrega no navegador

```bash
# Verificar se servidor web está rodando
ps aux | grep http.server

# Parar e recomeçar
pkill -f "http.server"
cd /Users/andersonenside/evolution/public
python3 -m http.server 9999 &
```

---

## 📱 Integração Evolution API

A interface está **totalmente integrada** com a API Evolution:

1. **Dashboard** monitora status em tempo real
2. **Instâncias** sincronizam automaticamente
3. **Webhooks** processam eventos WhatsApp
4. **Banco de dados** armazena todos os dados

### Endpoints Principais da API

```
GET  /instances              → Lista todas as instâncias
GET  /instances/:id          → Detalhes da instância
POST /instances              → Criar nova instância
GET  /messages               → Histórico de mensagens
POST /messages/send          → Enviar mensagem
GET  /contacts               → Lista de contatos
GET  /health                 → Status da API
```

---

## 🚀 Primeira Execução

1. **Execute o comando:**

   ```bash
   enside
   ```

2. **Aguarde 2-3 minutos** enquanto Docker inicia todos os serviços

3. **O navegador abrirá automaticamente** com a interface

4. **Veja o Dashboard** para confirmar todos os serviços online

5. **Use as abas** para gerenciar WhatsApp, API e dados

---

## 🔐 Segurança

⚠️ **Importante para Produção:**

1. Altere as senhas padrão em `docker-compose.yaml`
2. Configure variáveis de ambiente em `.env`
3. Use HTTPS em produção (Vercel)
4. Mantenha a API Evolution atualizada
5. Revise logs regularmente

---

## 📞 Suporte

Se encontrar problemas:

1. Verifique logs: `docker-compose logs`
2. Reinicie tudo: `enside`
3. Verifique GitHub: [ENSIDE-MASTER-v16](https://github.com/ensideanderson-nova/ENSIDE-MASTER-v16)

---

## ✨ Sistema v19.0 Pronto para Uso!

- ✅ Totalmente integrado
- ✅ Produção-ready
- ✅ Todas as dependências incluídas
- ✅ Interface responsiva
- ✅ API Evolution configurada

**Bom uso! 🎉**
