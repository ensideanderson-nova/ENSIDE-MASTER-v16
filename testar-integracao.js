// 🧪 TESTE DE INTEGRAÇÃO - Evolution API + Vercel

import { checkInstanceStatus, CONFIG } from './evolution-integration.js';

console.log('🚀 TESTANDO INTEGRAÇÃO EVOLUTION API\n');
console.log('⚙️  Configuração Atual:');
console.log(`   URL: ${CONFIG.url}`);
console.log(`   Instância: ${CONFIG.instance}`);
console.log(`   Ambiente: ${process.env.NODE_ENV || 'development'}\n`);

console.log('🔍 Verificando status da instância...\n');

checkInstanceStatus()
  .then(result => {
    if (result.success) {
      console.log('✅ CONEXÃO BEM-SUCEDIDA!');
      console.log('\n📊 Status:', JSON.stringify(result.data, null, 2));
    } else {
      console.error('❌ ERRO NA CONEXÃO:', result.error);
    }
  })
  .catch(error => {
    console.error('❌ ERRO:', error.message);
  });
