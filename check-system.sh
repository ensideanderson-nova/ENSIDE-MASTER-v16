#!/bin/bash

#################################
# VERIFICAÇÃO PÓS-INICIALIZAÇÃO
# Validar se todos os serviços estão rodando
#################################

echo "🔍 VERIFICANDO SISTEMA ENSIDE v19.0"
echo "════════════════════════════════════════"
echo ""

# Cores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# 1. Docker
echo -e "${YELLOW}1. Verificando Docker...${NC}"
if docker info > /dev/null 2>&1; then
  echo -e "${GREEN}✅ Docker está rodando${NC}"
else
  echo -e "${RED}❌ Docker não está rodando${NC}"
  exit 1
fi

# 2. PostgreSQL
echo -e "\n${YELLOW}2. Verificando PostgreSQL...${NC}"
if docker exec evolution_postgres pg_isready -U evolution > /dev/null 2>&1; then
  echo -e "${GREEN}✅ PostgreSQL está online${NC}"
  echo "   Host: localhost:5432"
  echo "   User: evolution"
else
  echo -e "${RED}❌ PostgreSQL offline ou não encontrado${NC}"
fi

# 3. Redis
echo -e "\n${YELLOW}3. Verificando Redis...${NC}"
if docker exec evolution_redis redis-cli ping > /dev/null 2>&1; then
  echo -e "${GREEN}✅ Redis está online${NC}"
  echo "   Host: localhost:6379"
else
  echo -e "${RED}❌ Redis offline ou não encontrado${NC}"
fi

# 4. RabbitMQ
echo -e "\n${YELLOW}4. Verificando RabbitMQ...${NC}"
if docker exec evolution_rabbitmq rabbitmq-diagnostics -q ping > /dev/null 2>&1; then
  echo -e "${GREEN}✅ RabbitMQ está online${NC}"
  echo "   Admin: http://localhost:15672"
  echo "   User: guest / Password: guest"
else
  echo -e "${RED}❌ RabbitMQ offline ou não encontrado${NC}"
fi

# 5. Evolution API
echo -e "\n${YELLOW}5. Verificando Evolution API...${NC}"
if curl -s http://localhost:8080/health > /dev/null 2>&1; then
  echo -e "${GREEN}✅ Evolution API está online${NC}"
  echo "   URL: http://localhost:8080"
  echo "   Health: http://localhost:8080/health"
  
  # Tentar obter informações adicionais
  if command -v jq &> /dev/null; then
    HEALTH=$(curl -s http://localhost:8080/health | jq '.status' 2>/dev/null)
    echo "   Status: $HEALTH"
  fi
else
  echo -e "${RED}❌ Evolution API offline ou não encontrado${NC}"
fi

# 6. Servidor Web
echo -e "\n${YELLOW}6. Verificando Servidor Web...${NC}"
if curl -s http://localhost:9999/public/index-v19-funcional.html > /dev/null 2>&1; then
  echo -e "${GREEN}✅ Servidor Web está online${NC}"
  echo "   URL: http://localhost:9999/public/index-v19-funcional.html"
else
  echo -e "${RED}❌ Servidor Web offline ou não encontrado${NC}"
fi

# 7. Status dos Containers
echo -e "\n${YELLOW}7. Status dos Containers Docker:${NC}"
docker-compose ps 2>/dev/null || echo "   Erro ao verificar containers"

# 8. Ports
echo -e "\n${YELLOW}8. Portas Abertas:${NC}"
for port in 5432 6379 5672 15672 8080 9999; do
  if netstat -an 2>/dev/null | grep ":$port " > /dev/null; then
    echo -e "${GREEN}✅ Porta $port está aberta${NC}"
  else
    echo -e "${RED}❌ Porta $port está fechada${NC}"
  fi
done

echo ""
echo "════════════════════════════════════════"
echo -e "${GREEN}✨ Verificação concluída!${NC}"
echo ""
echo "Se todos os serviços estão online, acesse:"
echo "  http://localhost:9999/public/index-v19-funcional.html"
echo ""
