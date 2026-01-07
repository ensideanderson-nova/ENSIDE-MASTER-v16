# 🚛 Sistema de Captação de Fretes - ENSIDE

## 📖 Sobre

Sistema completo para captação de motoristas e gerenciamento de propostas de frete, totalmente integrado com o ecossistema ENSIDE.

## 🚀 Como Usar

### 1. Landing Page (Captação)
- Acesse: `MODULOS/CAPTACAO_FRETES/landing_captacao.html`
- Preencha nome e WhatsApp
- Opcionalmente, marque interesse em seguro de carga (R$ 17,99/dia)
- Clique em "VER FRETES DISPONÍVEIS"
- Seus dados são salvos automaticamente

### 2. Página de Fretes
- Após cadastro, você é redirecionado automaticamente
- Use os filtros para encontrar fretes específicos:
  - Filtro por origem
  - Filtro por destino
  - Filtro por tipo de veículo
  - Filtro por faixa de valor
- Clique em "FAZER PROPOSTA" no frete desejado
- Preencha os dados da proposta:
  - Nome (pré-preenchido)
  - WhatsApp (pré-preenchido)
  - Valor da proposta (R$)
  - Tipo de veículo
  - Disponibilidade (Imediata, Hoje, Amanhã, Esta semana)
  - Observações adicionais
- Envie a proposta

## 🔗 Integrações

### Google Sheets
- **Sheet ID**: `1FiP885Or0ncyRG_ZZaAvM2vP0sHhDzhLFYifYLjKyIE`
- **Abas**:
  - `CAPTACAO_FRETES`: Armazena captações iniciais de motoristas
  - `PROPOSTAS_FRETES`: Armazena propostas de frete enviadas

### Evolution API (WhatsApp)
- **URL**: https://evolution-api-latest-poc1.onrender.com
- **Instância**: enside
- **Funcionalidade**: Notificações automáticas de novas propostas
- **Número Gestor**: 5518996540492

### Sistema ENSIDE Principal
- Link para retornar ao sistema principal
- Integração com painel administrativo

## ⚙️ Configuração

### Arquivo: `config.js`
Contém todas as configurações do sistema:
- URLs de API
- Configurações de validação
- Dados de fretes disponíveis
- Integrações ativas

### Arquivo: `api-integration.js`
Funções de integração disponíveis:
- `enviarCaptacao(dados)`: Envia captação inicial
- `enviarProposta(dados)`: Envia proposta de frete
- `notificarNovaPropostaWhatsApp(proposta)`: Notifica via WhatsApp
- `salvarLocal(chave, valor)`: Salva no localStorage
- `recuperarLocal(chave)`: Recupera do localStorage
- `formatarWhatsApp(numero)`: Formata número de telefone
- `validarWhatsApp(numero)`: Valida número de telefone

## 📊 Dados Salvos

### Captação Inicial
Quando um motorista se cadastra, os seguintes dados são salvos:
- Nome completo
- WhatsApp (formato: apenas números)
- Interesse em seguro de carga (sim/não)
- Timestamp (data e hora do cadastro)

### Proposta de Frete
Quando um motorista faz uma proposta, os seguintes dados são salvos:
- ID do frete
- Rota (origem → destino)
- Nome do motorista
- WhatsApp do motorista
- Valor da proposta (R$)
- Tipo de veículo
- Disponibilidade
- Observações adicionais
- Timestamp (data e hora da proposta)

## 🎨 Design & UX

### Paleta de Cores
- **Primária**: `#FFD700` (Dourado) - Botões principais e destaques
- **Secundária**: `#10b981` (Verde) - Ações positivas e confirmações
- **Background**: Gradiente de `#0a0a0a` para `#1a1a2e` (Escuro moderno)
- **Texto Principal**: `#ffffff` (Branco)
- **Texto Secundário**: `#94a3b8` (Cinza claro)

### Componentes
- **Cards de Frete**: Design moderno com hover effects e bordas sutis
- **Botões**: Gradientes animados com transições suaves
- **Modal**: Centralizado com backdrop escuro
- **Filtros**: Campos responsivos com ícones
- **Loading States**: Indicadores visuais durante operações
- **Animações**: Transições suaves em todas as interações

### Responsividade
- **Mobile-First**: Design otimizado para dispositivos móveis
- **Breakpoints**: Adaptação automática para tablets e desktops
- **Touch-Friendly**: Elementos com tamanho adequado para toque

## 📋 Fretes Disponíveis

O sistema inclui 6 fretes pré-cadastrados com dados realistas:

1. **Curitiba/PR → São Paulo/SP**
   - Veículo: Carreta
   - Valor: R$ 2.850
   - Carga: Madeira (25t)
   - Distância: 408 km

2. **Tubarão/SC → Rio de Janeiro/RJ**
   - Veículo: Carreta
   - Valor: R$ 5.200
   - Carga: Compensados (28t)
   - Distância: 920 km

3. **Porto Alegre/RS → São Paulo/SP**
   - Veículo: Bitrem
   - Valor: R$ 4.800
   - Carga: Grãos (40t)
   - Distância: 1.109 km

4. **São Paulo/SP → Belo Horizonte/MG**
   - Veículo: Truck
   - Valor: R$ 1.800
   - Carga: Eletrônicos (12t)
   - Distância: 586 km

5. **Belo Horizonte/MG → Rio de Janeiro/RJ**
   - Veículo: Carreta
   - Valor: R$ 2.200
   - Carga: Bebidas (22t)
   - Distância: 434 km

6. **Curitiba/PR → Porto Alegre/RS**
   - Veículo: Rodotrem
   - Valor: R$ 3.500
   - Carga: Cimento (50t)
   - Distância: 711 km

## 🔒 Segurança

### Validações Frontend
- Nome: mínimo 3 caracteres
- WhatsApp: formato brasileiro (10-11 dígitos)
- Valor: mínimo R$ 100,00
- Campos obrigatórios marcados e validados

### Tratamento de Erros
- Try-catch em todas as operações assíncronas
- Mensagens de erro amigáveis ao usuário
- Logs detalhados no console para debug
- Fallback em caso de falha de integração

### Sanitização
- Remoção de caracteres especiais em números
- Validação de tipos de dados
- Proteção contra XSS em inputs

### APIs
- Mode 'no-cors' para Google Apps Script
- API Keys gerenciadas em arquivo separado
- Headers de autenticação configurados

## 🚀 Deploy

### Requisitos
- Navegador moderno (Chrome, Firefox, Safari, Edge)
- JavaScript habilitado
- Conexão com internet (para integrações)

### Opções de Hospedagem
1. **GitHub Pages**: Gratuito e automático
2. **Vercel**: Deploy instantâneo
3. **Netlify**: CI/CD integrado
4. **Servidor Local**: Qualquer servidor HTTP

### Funcionamento Offline
- Dados de fretes carregados estaticamente
- LocalStorage funciona offline
- Envios para APIs requerem conexão

## 🧪 Testes

### Checklist de Testes
- [x] Validação de formulário de cadastro
- [x] Validação de formulário de proposta
- [x] Salvamento no localStorage
- [x] Recuperação de dados entre páginas
- [x] Filtros de fretes funcionando
- [x] Responsividade mobile
- [x] Integração Google Sheets (requer deploy)
- [x] Notificações WhatsApp (requer Evolution API ativa)

### Como Testar Localmente
```bash
# Opção 1: Python
python -m http.server 8000

# Opção 2: Node.js
npx http-server

# Opção 3: PHP
php -S localhost:8000

# Acesse: http://localhost:8000/MODULOS/CAPTACAO_FRETES/landing_captacao.html
```

## 📞 Suporte

### Contato
- **Nome**: Anderson ENSIDE
- **WhatsApp**: (18) 99654-0492
- **Número**: 5518996540492

### Problemas Comuns

**1. Formulário não envia**
- Verifique se todos os campos obrigatórios estão preenchidos
- Verifique o formato do WhatsApp (apenas números)
- Abra o console do navegador para ver erros

**2. Dados não aparecem na página de fretes**
- Verifique se completou o cadastro na landing page
- Limpe o localStorage e tente novamente
- Use a URL com parâmetros: `?nome=SeuNome&whatsapp=11999999999`

**3. Integração Google Sheets não funciona**
- Verifique se a URL do Google Apps Script está correta
- Teste a URL diretamente no navegador
- Verifique se o script tem permissões adequadas

**4. WhatsApp não notifica**
- Verifique se `notificacoes: true` em config.js
- Verifique se a Evolution API está ativa
- Teste manualmente a API via Postman/Insomnia

## 🔄 Atualizações

### Versão 1.0 (Janeiro 2026)
- ✅ Landing page completa
- ✅ Página de fretes com filtros
- ✅ Integração Google Sheets
- ✅ Notificações WhatsApp
- ✅ Design responsivo
- ✅ 6 fretes pré-cadastrados

### Próximas Funcionalidades
- [ ] Painel administrativo para gestão de fretes
- [ ] Histórico de propostas do motorista
- [ ] Sistema de avaliação de motoristas
- [ ] Chat integrado com WhatsApp
- [ ] Rastreamento de fretes em andamento
- [ ] Dashboard com estatísticas

## 📄 Licença

Este sistema é parte do ecossistema ENSIDE e é de uso interno da empresa.

---

**Desenvolvido com ❤️ para ENSIDE por Anderson**
