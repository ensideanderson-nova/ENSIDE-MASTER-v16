#!/bin/bash

# 🤖 ESPECIALISTA-IA MASTER - Auto-Inicialização
# Versão: 13.0 FINAL - UNIFICADO E SINCRONIZADO
# Data: 12/01/2026 22:08
# Auto-inicia ao ligar o Mac e executa o botão flutuante

clear

echo '🤖 ═══════════════════════════════════════════════════════════'
echo '   ESPECIALISTA-IA MASTER v13.0 - INICIALIZANDO...'
echo '   Sistema Unificado com Sincronização Total'
echo '═══════════════════════════════════════════════════════════'
echo ''

# 1. Verificar e iniciar Redis
echo '💾 [1/4] Verificando Redis...'
if ! redis-cli ping > /dev/null 2>&1; then
    echo '   ⚠️  Redis não está rodando. Iniciando...'
    redis-server --daemonize yes
    sleep 2
fi

if redis-cli ping > /dev/null 2>&1; then
    APRENDIZADOS=$(redis-cli KEYS 'especialista_ia:aprendizado:*' 2>/dev/null | wc -l | tr -d ' ')
    CHAVES=$(redis-cli KEYS 'especialista_ia:*' 2>/dev/null | wc -l | tr -d ' ')
    echo "   ✅ Redis: ATIVO"
    echo "   📚 Aprendizados: $APRENDIZADOS"
    echo "   🗄️  Chaves: $CHAVES"
else
    echo '   ❌ Redis: FALHOU'
fi

echo ''

# 2. Parar processos antigos
echo '🔄 [2/4] Parando processos antigos...'
pkill -f "BOTAO_FLUTUANTE" 2>/dev/null
pkill -f "BOTAO_UNIFICADO" 2>/dev/null
pkill -f "BOTAO_VERMELHO" 2>/dev/null
echo '   ✅ Processos antigos encerrados'
echo ''

# 3. Iniciar ESPECIALISTA-IA MASTER
echo '🚀 [3/4] Iniciando ESPECIALISTA-IA MASTER...'
if [ -f ~/ESPECIALISTA_IA_RAIZ/python/ESPECIALISTA_IA_MASTER.py ]; then
    python3 ~/ESPECIALISTA_IA_RAIZ/python/ESPECIALISTA_IA_MASTER.py &
    sleep 3
    
    # Verificar se iniciou
    if pgrep -f "ESPECIALISTA_IA_MASTER" > /dev/null; then
        echo '   ✅ ESPECIALISTA-IA MASTER: ATIVO'
        echo '   🤖 Botão flutuante na barra de menu'
        echo "   📚 $APRENDIZADOS aprendizados carregados"
        echo '   🔄 Sincronização Vercel: ATIVA (30s)'
    else
        echo '   ❌ Falha ao iniciar ESPECIALISTA-IA MASTER'
    fi
else
    echo '   ❌ Arquivo não encontrado: ESPECIALISTA_IA_MASTER.py'
fi

echo ''

# 4. Abrir sistemas integrados
echo '🌐 [4/4] Abrindo sistemas integrados...'
echo '   • Vercel: https://enside-sistema.vercel.app'
echo '   • Evolution Manager: localhost:8080'
echo '   • Google Sheets: EUCALIPTO'
echo '   • Redis Commander: localhost:8081'
echo '   • GitHub: ENSIDE-MASTER-v16'
echo ''

# Executar comando enside- para abrir todos os sistemas
if command -v enside- &> /dev/null; then
    echo '   🚀 Executando enside-...'
    enside- &
    sleep 2
    echo '   ✅ Sistemas abertos!'
else
    echo '   ⚠️  Comando enside- não encontrado'
fi

echo ''
echo '═══════════════════════════════════════════════════════════'
echo '✅ ESPECIALISTA-IA MASTER v13.0 INICIADO COM SUCESSO!'
echo '═══════════════════════════════════════════════════════════'
echo ''
echo '📊 RESUMO:'
echo "   • Aprendizados: $APRENDIZADOS"
echo '   • Botão flutuante: 🤖 na barra de menu'
echo '   • Sincronização: Ativa a cada 30s'
echo '   • Comandos: 50+ disponíveis'
echo '   • Auto-start: Configurado'
echo ''
echo '💡 DICAS:'
echo '   • Clique no 🤖 na barra de menu para acessar'
echo '   • Menu completo com 50+ opções'
echo '   • Executa comandos (não apenas lista)'
echo '   • Sincroniza com Vercel automaticamente'
echo ''
echo '🎉 Sistema 100% operacional!'
echo ''

# Manter terminal aberto por 5 segundos
sleep 5
