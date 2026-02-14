# 🔧 PLANO DE AÇÃO - API HTTP 404

**Problema:** API endpoints retornando HTTP 404 no Vercel  
**Causa Provável:** Routes não foram integradas no Vercel ainda  
**Solução:** Forçar rebuild com novo deploy

---

## 🎯 Opção 1: Verificar via Browser (Mais Fácil)

1. Abra https://enside-sistema-unificado.vercel.app
2. Abra DevTools (F12)
3. Vá para aba **Network**
4. Recarregue página (Cmd+R)
5. Procure por requisições para `/api/aprendizados`

Se ver **404**, significa que o servidor está respondendo mas a rota não existe.

---

## 🔨 Opção 2: Forçar Novo Deploy (Definitivo)

### Passo 1: Sincronizar repositórios

```bash
cd /Users/andersonenside/ENSIDE_SISTEMA_UNIFICADO
git pull origin main --rebase
git status
```

### Passo 2: Forçar rebuild no Vercel

```bash
cd /Users/andersonenside/ENSIDE_SISTEMA_UNIFICADO
vercel deploy --prod --force
```

### Passo 3: Aguardar build e testar

```bash
# Após 2-3 minutos
bash /Users/andersonenside/Desktop/ENSIDE-MASTER-v16/sistema-terminal
```

---

## 🔍 Opção 3: Verificar index.js

### O arquivo DEVE conter estas linhas:

**Procurar por:**

```javascript
import aprendizadosRoutes from "./routes/aprendizados.js";
```

**E perto do final (antes de export):**

```javascript
aprendizadosRoutes(app, redis);
```

### Para verificar:

```bash
grep -n "aprendizadosRoutes" /Users/andersonenside/ENSIDE_SISTEMA_UNIFICADO/index.js
```

Se não encontrar, o arquivo precisa ser editado.

---

## 🚀 Opção 4: Deploy via Vercel CLI (Mais Rápido)

```bash
cd /Users/andersonenside/ENSIDE_SISTEMA_UNIFICADO

# Fazer login (se necessário)
vercel login

# Deploy de produção
vercel deploy --prod --force

# Aguardar ~3 minutos

# Testar
bash /Users/andersonenside/Desktop/ENSIDE-MASTER-v16/sistema-terminal
```

---

## 📋 Checklist de Resolução

- [ ] Acessar https://enside-sistema-unificado.vercel.app
- [ ] Abrir DevTools (F12)
- [ ] Verificar Network requests
- [ ] Se 404: Executar `vercel deploy --prod --force`
- [ ] Aguardar 3-5 minutos
- [ ] Executar `bash sistema-terminal` novamente
- [ ] Verificar se API retorna HTTP 200

---

## 🎯 Resultado Esperado (Após Deploy)

```
✅ GET /api/aprendizados              HTTP 200 (não mais 404)
✅ GET /api/aprendizados/stats/info   HTTP 200 (não mais 404)
✅ GET /api/aprendizados/tipos/lista  HTTP 200 (não mais 404)
```

---

## 💡 Dicas

- **Se ainda der 404:** Vercel pode estar com cache. Tente `vercel deploy --prod --force` novamente
- **Se der 500:** Erro no backend. Verifique Vercel logs: https://vercel.com/dashboard
- **Se der timeout:** Espere mais tempo ou tente em 5 minutos

---

## 🎉 Quando Funcionar

Você verá:

```
✅ GET /api/aprendizados
   ➜ HTTP 200
   ├─ Dados: [{"id":"...","aprendizado":"..."}...]
```

E o modal do 🤖 carregará dados automaticamente!

---

**Recomendação:** Execute a **Opção 4** (Deploy via CLI)  
**Tempo esperado:** 5-10 minutos até ficar 100% pronto
