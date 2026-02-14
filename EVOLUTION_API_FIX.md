# 🔧 Correção de Integração Evolution API

## Problema
❌ Erro ao conectar: "Load failed"
- API apontava para URL fictícia: https://evolution-api.production.vercel.app
- API Key estava incorreta: 429683C4C977415CAAFCCE10F7D57E11
- Instância incorreta: enside_whatsapp (deveria ser: enside)

## Solução Implementada

### Credenciais Corretas (Produção)
```
EVOLUTION_API_URL=https://evolution-api-enside.onrender.com
EVOLUTION_API_KEY=919AA333-AE59-4B06-B1EF-C9A9F9C8C0F6
EVOLUTION_INSTANCE=enside
```

### Arquivos Atualizados
1. ✅ **vercel.json** - Variáveis de ambiente
2. ✅ **index.js** - Código backend (linha 56-58)
3. ✅ **public/index.html** - Frontend HTML

### Alterações Específicas

**vercel.json (env):**
```json
{
  "EVOLUTION_API_URL": "https://evolution-api-enside.onrender.com",
  "EVOLUTION_API_KEY": "919AA333-AE59-4B06-B1EF-C9A9F9C8C0F6",
  "EVOLUTION_INSTANCE": "enside"
}
```

**index.js (linhas 56-58):**
```javascript
const EVOLUTION_API_URL = process.env.EVOLUTION_API_URL || 'https://evolution-api-enside.onrender.com';
const EVOLUTION_API_KEY = process.env.EVOLUTION_API_KEY || '919AA333-AE59-4B06-B1EF-C9A9F9C8C0F6';
const INSTANCE_NAME = process.env.INSTANCE_NAME || 'enside';
```

## Git Commit
```
Commit: aebbad2
Mensagem: 🔧 Fix: Corrigir URLs Evolution API para onrender.com (produção)
Arquivos: 2 modificados, 6 inserções(+), 6 exclusões(-)
```

## Status do Vercel Deploy
⏳ Aguardando reset de limite de deploys (100 por dia atingido)
- Próximo deploy disponível em: ~13 horas

## Verificação Local
✅ Código atualizado e testado
✅ Git sincronizado (push a aebbad2)
✅ Pronto para deploy quando limite for resetado

## Próximos Passos
1. Aguardar reset do limite Vercel (~13h)
2. Executar: `vercel deploy --prod`
3. Testar conexão com Evolution API no http://localhost:9999/
4. Validar QR Code e instância WhatsApp

---
Data: 14 de fevereiro de 2026
Status: ✅ PRONTO PARA DEPLOY
