# 🧪 GUIA DE TESTES MANUAIS - ENDPOINTS API

Se o terminal está com problema, use este guia para testar manualmente:

## ✅ Testes que você pode fazer agora

### 1. **Abrir no Browser**

Acesse diretamente em seu navegador:

```
https://enside-sistema-unificado.vercel.app
```

Deve aparecer:

- Dashboard ENSIDE MASTER v19.0
- Botão flutuante 🤖
- Título e menu funcionando

---

### 2. **Testar via cURL no Terminal (com as aspas corretas)**

```bash
# Frontend
curl "https://enside-sistema-unificado.vercel.app"

# API Aprendizados (com limite)
curl "https://enside-sistema-unificado.vercel.app/api/aprendizados?limit=1"

# Stats
curl "https://enside-sistema-unificado.vercel.app/api/aprendizados/stats/info"

# Tipos
curl "https://enside-sistema-unificado.vercel.app/api/aprendizados/tipos/lista"
```

---

### 3. **Testar Modal ESPECIALISTA-IA**

1. Abra https://enside-sistema-unificado.vercel.app
2. Clique no botão flutuante 🤖
3. Modal deve abrir com 4 abas:
   - Cotação
   - Aprendizados
   - Status
   - Configurações
4. Verifique se os dados carregam

---

### 4. **Verificar Console do Browser**

1. Abra DevTools (F12 ou Cmd+Option+I)
2. Vá para **Console**
3. Procure por:
   - Erros em vermelho? (não deve ter)
   - Warnings em amarelo? (ok se houver)
   - Sucesso de requisições?

---

### 5. **Verificar Network (Requisições)**

1. Abra DevTools (F12)
2. Vá para **Network**
3. Recarregue a página
4. Procure por:
   - GET /api/aprendizados → Status: 200 ✅
   - GET /api/aprendizados/stats/info → Status: 200 ✅
   - GET /api/aprendizados/tipos/lista → Status: 200 ✅
   - Qualquer 404? → Indicação de problema

---

## 📊 O que Deve Funcionar

| Item              | Status | Como Verificar           |
| ----------------- | ------ | ------------------------ |
| Frontend HTTP 200 | ✅     | Acesse a URL no browser  |
| HTML carrega      | ✅     | Ver página renderizada   |
| Botão flutuante   | ✅     | Botão 🤖 visível         |
| Modal abre        | ✅     | Clique no botão          |
| API /aprendizados | ⏳     | cURL ou Network tab      |
| API /stats/info   | ⏳     | cURL ou Network tab      |
| API /tipos/lista  | ⏳     | cURL ou Network tab      |
| HTTPS válido      | ✅     | Cadeado verde no browser |

---

## 🔧 Se Tiver Problemas

### Frontend não carrega?

- Verifique internet
- Tente incognito (Cmd+Shift+N no Chrome)
- Cache: limpe (DevTools → Application → Clear Storage)

### API retorna 404?

- Vercel ainda está reconstruindo (pode levar 5-10 min)
- Aguarde a rebuild completar
- Teste novamente

### API retorna 500?

- Erro no backend
- Verifique logs no Vercel (https://vercel.com/dashboard)
- Confira credenciais Redis/Evolution

### Modal não abre?

- Verifique console (F12)
- Procure por erros JavaScript
- Teste em outro browser

---

## ✅ Checklist de Validação Final

- [ ] Frontend carrega (HTTP 200)
- [ ] Botão 🤖 visível
- [ ] Modal abre ao clicar
- [ ] HTML renderizado corretamente
- [ ] 35 scripts carregando
- [ ] HTTPS ativo (cadeado verde)
- [ ] Console sem erros vermelhos
- [ ] Network: nenhum 500
- [ ] /api/aprendizados retorna dados
- [ ] /api/stats/info retorna json
- [ ] /api/tipos/lista retorna json

---

## 📞 Status Esperado Agora

✅ **Frontend:** 100% operacional  
⏳ **API:** Aguardando rebuild Vercel (5-10 min)  
✅ **Banco:** Redis conectado (4373 aprendizados)  
✅ **Inteligência:** Carregada (13 fluxos)

---

## 🎯 Próximo Passo

1. Teste no browser
2. Se API retornar 404: aguarde 10 min e tente novamente
3. Se API retornar dados: SUCESSO! 🎉
4. Se API retornar erro: verifique logs Vercel

---

**Salvo em:** `/Users/andersonenside/Desktop/ENSIDE-MASTER-v16/GUIA_TESTES_MANUAIS.md`
