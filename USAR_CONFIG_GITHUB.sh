#!/bin/bash

echo "🚀 USANDO CONFIGURAÇÕES DO GITHUB"
echo "=================================="
echo ""

# Copiar docker-compose.yml do GitHub
echo "📋 Copiando docker-compose.yml do GitHub..."
cp ~/ENSIDE-MASTER-v16/CONFIG/docker-compose.yml ~/evolution-api/docker-compose.yml

# Ir para pasta evolution-api
cd ~/evolution-api

# Parar containers antigos
echo "🛑 Parando containers antigos..."
docker-compose down

# Subir containers com nova configuração
echo "🚀 Subindo containers com configuração do GitHub..."
docker-compose up -d

# Aguardar containers iniciarem
echo "⏳ Aguardando containers iniciarem (30 segundos)..."
sleep 30

# Verificar containers
echo ""
echo "✅ Containers rodando:"
docker ps

echo ""
echo "🌐 Abrindo Evolution Manager..."
open http://localhost:8080/manager

echo ""
echo "✅ PRONTO!"
echo "Agora crie a instância 'enside-master' no Manager"
