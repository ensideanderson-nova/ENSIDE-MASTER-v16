#!/bin/bash

# Script para Deploy do Novo Projeto enside-master-v21
# Aguarda reset do limite Vercel e faz deployment automático

echo "================================"
echo "🚀 DEPLOY enside-master-v21"
echo "================================"
echo ""

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Ir para diretório do projeto
cd /Users/andersonenside/evolution

echo -e "${BLUE}📍 Diretório: $(pwd)${NC}"
echo ""

# Verificar se .vercel existe
if [ ! -d ".vercel" ]; then
    echo -e "${RED}❌ Erro: Arquivo .vercel não encontrado!${NC}"
    echo "Execute primeiro: vercel --prod --name=enside-master-v21"
    exit 1
fi

# Mostrar configuração atual
echo -e "${BLUE}📋 Configuração do Projeto:${NC}"
cat .vercel/project.json
echo ""

# Confirmar deployment
echo -e "${YELLOW}⚠️  Este script fará deploy para produção${NC}"
echo -e "📦 Projeto: enside-master-v21"
echo -e "🌐 URL esperada: https://enside-master-v21.vercel.app"
echo ""
read -p "Deseja continuar com o deployment? (s/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Ss]$ ]]; then
    echo -e "${RED}❌ Deployment cancelado${NC}"
    exit 1
fi

echo ""
echo -e "${BLUE}🚀 Iniciando deployment...${NC}"
echo ""

# Fazer deploy
vercel --prod

# Capturar resultado
if [ $? -eq 0 ]; then
    echo ""
    echo -e "${GREEN}✅ Deployment concluído com sucesso!${NC}"
    echo ""
    echo -e "${BLUE}📍 Verificando nova URL...${NC}"
    vercel projects inspect enside-master-v21
    echo ""
    
    # Aguardar um pouco para o servidor ficar pronto
    echo -e "${YELLOW}⏳ Aguardando 5 segundos para servidor ficar pronto...${NC}"
    sleep 5
    
    # Testar endpoints
    echo ""
    echo -e "${BLUE}🧪 Testando endpoints...${NC}"
    echo ""
    
    echo "1. Health Check:"
    curl -s https://enside-master-v21.vercel.app/api/health | jq . || echo "❌ Falhou"
    echo ""
    
    echo "2. Status API:"
    curl -s https://enside-master-v21.vercel.app/api/status | jq . || echo "❌ Falhou"
    echo ""
    
    echo "3. Instances:"
    curl -s https://enside-master-v21.vercel.app/api/instances | jq . || echo "❌ Falhou"
    echo ""
    
    echo -e "${GREEN}✅ Deployment finalizado!${NC}"
    echo -e "🌐 Acesse: https://enside-master-v21.vercel.app"
    echo -e "📊 Dashboard: https://enside-master-v21.vercel.app/control-center-v21.html"
else
    echo ""
    echo -e "${RED}❌ Erro durante deployment!${NC}"
    exit 1
fi
