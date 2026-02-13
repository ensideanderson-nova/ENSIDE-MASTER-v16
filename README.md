# 🚀 ENSIDE MASTER v19.0

Sistema integrado com 8 abas de gerenciamento para WhatsApp, Evolution API e serviços relacionados.

## 📋 Estrutura do Projeto

```
/Users/andersonenside/evolution/
├── start                          # Script principal de inicialização
├── docker-compose.yaml            # Orquestração de containers
├── public/
│   └── index-v19-funcional.html   # Interface web principal (8 abas)
├── Docker/                        # Configurações de containers
├── prisma/                        # Schemas de banco de dados
├── src/                           # Código-fonte TypeScript
└── api/                           # APIs
```

## 🎯 Como Usar

### 1. Iniciar o Sistema Completo

```bash
enside
```

Este comando:
- ✅ Verifica Docker
- ✅ Inicia docker-compose (API, Manager, Redis, PostgreSQL)
- ✅ Inicia servidor web local
- ✅ Abre a interface no navegador

### 2. Acessar a Interface Web

**Localmente:**
```
http://localhost:9999/public/index-v19-funcional.html
```

**Via Vercel (produção):**
```
https://enside-sistema.vercel.app/public/index-v19-funcional.html
```

## 📱 Abas da Interface (8 Módulos)

1. **Dashboard** - Visão geral do sistema
2. **WhatsApp v21** - Gerenciador de mensagens
3. **Control v21** - Centro de controle
4. **Evolution API** - API Manager
5. **Manager** - Portal administrativo
6. **QR Code** - Scanner QR
7. **Google Sheets** - Integração de planilha
8. **Status Monitor** - Monitoramento de serviços

## 🐳 Serviços Docker

- **API** (porta 8080) - Evolution API
- **Manager** (porta 3000) - Interface manager
- **Redis** (porta 6379) - Cache
- **PostgreSQL** (porta 5432) - Banco de dados

## ✅ Tudo Limpo e Pronto!

- Removidos 60+ arquivos desnecessários
- Mantidos apenas arquivos essenciais
- Sistema minimalista e funcional
- Comando `enside` configurado globalmente

## 🔧 Troubleshooting

**Se `enside` não funcionar:**
```bash
# Recarregar shell
source ~/.zshrc

# Testar novamente
enside
```

**Se porta estiver ocupada:**
```bash
# Matar processo antigo
pkill -f "http.server" || pkill -f "python3"
```

---

**Desenvolvido com ❤️ - Sistema ENSIDE Integrado v19.0**
