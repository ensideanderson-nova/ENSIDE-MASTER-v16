/**
 * INTEGRAÇÃO REDIS - SISTEMA DE CAPTAÇÃO DE FRETES
 * Backup automático de dados no Redis
 */

const REDIS_CONFIG = {
    // Configuração do Redis (use suas credenciais)
    host: 'localhost',
    port: 6379,
    password: '', // Deixe vazio se não tiver senha
    db: 0,
    
    // Prefixos para organizar as chaves
    prefixes: {
        fretes: 'captacao:fretes:',
        propostas: 'captacao:propostas:',
        rotas: 'captacao:rotas:',
        motoristas: 'captacao:motoristas:'
    }
};

const REDIS_BACKUP = {
    
    /**
     * Salvar frete no Redis
     */
    async salvarFrete(frete) {
        try {
            const key = `${REDIS_CONFIG.prefixes.fretes}${frete.id}`;
            
            // Se estiver no navegador, simular com localStorage
            if (typeof window !== 'undefined') {
                localStorage.setItem(key, JSON.stringify(frete));
                console.log(`✅ Frete ${frete.id} salvo no localStorage (Redis simulado)`);
                return true;
            }
            
            // No servidor Node.js com Redis real
            if (typeof require !== 'undefined') {
                const redis = require('redis');
                const client = redis.createClient({
                    host: REDIS_CONFIG.host,
                    port: REDIS_CONFIG.port,
                    password: REDIS_CONFIG.password,
                    db: REDIS_CONFIG.db
                });
                
                await client.connect();
                await client.set(key, JSON.stringify(frete));
                await client.expire(key, 86400 * 30); // 30 dias
                await client.disconnect();
                
                console.log(`✅ Frete ${frete.id} salvo no Redis`);
                return true;
            }
            
        } catch (error) {
            console.error('❌ Erro ao salvar frete no Redis:', error);
            return false;
        }
    },
    
    /**
     * Salvar proposta no Redis
     */
    async salvarProposta(proposta) {
        try {
            const key = `${REDIS_CONFIG.prefixes.propostas}${proposta.idProposta}`;
            
            if (typeof window !== 'undefined') {
                localStorage.setItem(key, JSON.stringify(proposta));
                console.log(`✅ Proposta ${proposta.idProposta} salva no localStorage`);
                return true;
            }
            
            if (typeof require !== 'undefined') {
                const redis = require('redis');
                const client = redis.createClient({
                    host: REDIS_CONFIG.host,
                    port: REDIS_CONFIG.port,
                    password: REDIS_CONFIG.password,
                    db: REDIS_CONFIG.db
                });
                
                await client.connect();
                await client.set(key, JSON.stringify(proposta));
                await client.expire(key, 86400 * 30); // 30 dias
                await client.disconnect();
                
                console.log(`✅ Proposta ${proposta.idProposta} salva no Redis`);
                return true;
            }
            
        } catch (error) {
            console.error('❌ Erro ao salvar proposta no Redis:', error);
            return false;
        }
    },
    
    /**
     * Salvar rota no Redis
     */
    async salvarRota(rota) {
        try {
            const key = `${REDIS_CONFIG.prefixes.rotas}${rota.idRota}`;
            
            if (typeof window !== 'undefined') {
                localStorage.setItem(key, JSON.stringify(rota));
                console.log(`✅ Rota ${rota.idRota} salva no localStorage`);
                return true;
            }
            
            if (typeof require !== 'undefined') {
                const redis = require('redis');
                const client = redis.createClient({
                    host: REDIS_CONFIG.host,
                    port: REDIS_CONFIG.port,
                    password: REDIS_CONFIG.password,
                    db: REDIS_CONFIG.db
                });
                
                await client.connect();
                await client.set(key, JSON.stringify(rota));
                await client.expire(key, 86400 * 90); // 90 dias
                await client.disconnect();
                
                console.log(`✅ Rota ${rota.idRota} salva no Redis`);
                return true;
            }
            
        } catch (error) {
            console.error('❌ Erro ao salvar rota no Redis:', error);
            return false;
        }
    },
    
    /**
     * Buscar todos os fretes do Redis
     */
    async buscarTodosFretes() {
        try {
            const prefix = REDIS_CONFIG.prefixes.fretes;
            const fretes = [];
            
            if (typeof window !== 'undefined') {
                // Buscar do localStorage
                for (let i = 0; i < localStorage.length; i++) {
                    const key = localStorage.key(i);
                    if (key && key.startsWith(prefix)) {
                        const frete = JSON.parse(localStorage.getItem(key));
                        fretes.push(frete);
                    }
                }
                return fretes;
            }
            
            if (typeof require !== 'undefined') {
                const redis = require('redis');
                const client = redis.createClient({
                    host: REDIS_CONFIG.host,
                    port: REDIS_CONFIG.port,
                    password: REDIS_CONFIG.password,
                    db: REDIS_CONFIG.db
                });
                
                await client.connect();
                const keys = await client.keys(`${prefix}*`);
                
                for (const key of keys) {
                    const data = await client.get(key);
                    if (data) {
                        fretes.push(JSON.parse(data));
                    }
                }
                
                await client.disconnect();
                return fretes;
            }
            
        } catch (error) {
            console.error('❌ Erro ao buscar fretes do Redis:', error);
            return [];
        }
    },
    
    /**
     * Fazer backup completo de todos os dados
     */
    async backupCompleto() {
        try {
            console.log('🔄 Iniciando backup completo...');
            
            // Buscar dados do localStorage
            const fretes = window.CAPTACAO_API.carregarFretes();
            const propostas = window.CAPTACAO_API.carregarPropostas();
            const rotas = window.CAPTACAO_API.carregarRotasPreferidas();
            
            // Salvar cada item no Redis
            for (const frete of fretes) {
                await this.salvarFrete(frete);
            }
            
            for (const proposta of propostas) {
                await this.salvarProposta(proposta);
            }
            
            for (const rota of rotas) {
                await this.salvarRota(rota);
            }
            
            // Salvar resumo do backup
            const backup = {
                timestamp: new Date().toISOString(),
                totalFretes: fretes.length,
                totalPropostas: propostas.length,
                totalRotas: rotas.length
            };
            
            localStorage.setItem('captacao:ultimo_backup', JSON.stringify(backup));
            
            console.log('✅ Backup completo realizado com sucesso!');
            console.log(`   • ${fretes.length} fretes`);
            console.log(`   • ${propostas.length} propostas`);
            console.log(`   • ${rotas.length} rotas`);
            
            return backup;
            
        } catch (error) {
            console.error('❌ Erro ao fazer backup completo:', error);
            return null;
        }
    },
    
    /**
     * Restaurar dados do backup
     */
    async restaurarBackup() {
        try {
            console.log('🔄 Restaurando dados do backup...');
            
            const fretes = await this.buscarTodosFretes();
            
            if (fretes.length > 0) {
                localStorage.setItem('captacao_fretes_fretes', JSON.stringify(fretes));
                console.log(`✅ ${fretes.length} fretes restaurados`);
            }
            
            return true;
            
        } catch (error) {
            console.error('❌ Erro ao restaurar backup:', error);
            return false;
        }
    },
    
    /**
     * Sincronizar automaticamente a cada mudança
     */
    configurarSincronizacaoAutomatica() {
        if (typeof window === 'undefined') return;
        
        // Interceptar salvamentos e fazer backup automático
        const apiOriginal = window.CAPTACAO_API;
        
        if (apiOriginal) {
            const salvarFreteOriginal = apiOriginal.salvarFrete.bind(apiOriginal);
            apiOriginal.salvarFrete = async (frete) => {
                const resultado = salvarFreteOriginal(frete);
                await this.salvarFrete(frete);
                return resultado;
            };
            
            const salvarPropostaOriginal = apiOriginal.salvarProposta.bind(apiOriginal);
            apiOriginal.salvarProposta = async (proposta) => {
                const resultado = salvarPropostaOriginal(proposta);
                await this.salvarProposta(proposta);
                return resultado;
            };
            
            const salvarRotaOriginal = apiOriginal.salvarRotaPreferida.bind(apiOriginal);
            apiOriginal.salvarRotaPreferida = async (rota) => {
                const resultado = salvarRotaOriginal(rota);
                await this.salvarRota(rota);
                return resultado;
            };
            
            console.log('✅ Sincronização automática com Redis configurada');
        }
    },
    
    /**
     * Fazer backup periódico automático
     */
    iniciarBackupAutomatico(intervaloMinutos = 30) {
        if (typeof window === 'undefined') return;
        
        // Fazer backup inicial
        this.backupCompleto();
        
        // Configurar backup periódico
        setInterval(() => {
            this.backupCompleto();
        }, intervaloMinutos * 60 * 1000);
        
        console.log(`✅ Backup automático configurado (a cada ${intervaloMinutos} minutos)`);
    }
};

// Exportar para uso global
if (typeof window !== 'undefined') {
    window.REDIS_BACKUP = REDIS_BACKUP;
    
    // Configurar sincronização automática ao carregar
    document.addEventListener('DOMContentLoaded', () => {
        REDIS_BACKUP.configurarSincronizacaoAutomatica();
        REDIS_BACKUP.iniciarBackupAutomatico(30); // Backup a cada 30 minutos
    });
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = REDIS_BACKUP;
}

console.log('✅ Redis Backup System carregado');
