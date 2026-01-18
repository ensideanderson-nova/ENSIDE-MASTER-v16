// Configuração do Banco de Dados PostgreSQL para Vercel
// ENSIDE Sistema Integrado v19.0

import pg from 'pg';
const { Pool } = pg;

// Pool de conexões PostgreSQL
let pool = null;

export function getPool() {
  if (!pool) {
    // Usar DATABASE_URL do ambiente (Vercel Postgres, Supabase, etc.)
    const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL;
    
    if (connectionString) {
      pool = new Pool({
        connectionString,
        ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
        max: 10,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 10000 // Timeout de 10s para plano gratuito Vercel
      });
      
      pool.on('error', (err) => {
        console.error('Erro inesperado no pool PostgreSQL:', err);
      });
    }
  }
  return pool;
}

// Função helper para queries com timeout
export async function query(text, params, timeoutMs = 9000) {
  const pool = getPool();
  if (!pool) {
    throw new Error('DATABASE_URL não configurada');
  }
  
  const client = await pool.connect();
  try {
    // Definir timeout da query (9s para ficar dentro do limite de 10s do Vercel)
    await client.query(`SET statement_timeout = ${timeoutMs}`);
    const result = await client.query(text, params);
    return result;
  } finally {
    client.release();
  }
}

// Inicializar tabelas se não existirem
export async function initDatabase() {
  const pool = getPool();
  if (!pool) {
    console.log('PostgreSQL não configurado - usando modo sem banco');
    return false;
  }
  
  try {
    await query(`
      CREATE TABLE IF NOT EXISTS aprendizados (
        id SERIAL PRIMARY KEY,
        titulo VARCHAR(500) NOT NULL,
        conteudo TEXT NOT NULL,
        categoria VARCHAR(100) DEFAULT 'geral',
        fonte VARCHAR(200) DEFAULT 'API',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      
      CREATE TABLE IF NOT EXISTS comandos (
        id SERIAL PRIMARY KEY,
        comando VARCHAR(200) NOT NULL,
        parametros JSONB,
        resultado JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      
      CREATE TABLE IF NOT EXISTS sync_log (
        id SERIAL PRIMARY KEY,
        tipo VARCHAR(50) NOT NULL,
        dados JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    console.log('✅ Tabelas PostgreSQL inicializadas');
    return true;
  } catch (error) {
    console.error('Erro ao inicializar banco:', error.message);
    return false;
  }
}

export default { getPool, query, initDatabase };
