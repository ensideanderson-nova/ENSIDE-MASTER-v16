#!/bin/bash
# Sincronização automática a cada 30 segundos

while true; do
    # Salvar HTML no Redis
    cat ~/ENSIDE-MASTER-v16/ENSIDE_MASTER_v19.0_INTEGRADO.html | \
        redis-cli -x SET enside:html:local > /dev/null 2>&1
    
    # Atualizar timestamp
    redis-cli SET enside:sync:timestamp "$(date '+%Y-%m-%d %H:%M:%S')" > /dev/null 2>&1
    
    # Aguardar 30 segundos
    sleep 30
done
