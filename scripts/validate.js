#!/usr/bin/env node

/**
 * Script de Validação do Sistema ENSIDE MASTER
 * Verifica credenciais, integrações e arquivos necessários
 */

const fs = require('fs');
const path = require('path');

const CHECKS = {
  credenciais: {
    name: '🔐 Credenciais',
    check: () => checkFile('config/CONFIG/credenciais.json')
  },
  env: {
    name: '🌍 Variáveis de Ambiente',
    check: () => checkFile('.env.local')
  },
  backend: {
    name: '⚙️ Backend Server',
    check: () => checkFile('backend/server.js')
  },
  vercel: {
    name: '🚀 Vercel Config',
    check: () => checkFile('vercel.json')
  }
};

function checkFile(filePath) {
  const fullPath = path.join(__dirname, '..', filePath);
  return fs.existsSync(fullPath);
}

function validate() {
  console.log('\n╔════════════════════════════════════════╗');
  console.log('║   VALIDAÇÃO DO SISTEMA ENSIDE MASTER   ║');
  console.log('╚════════════════════════════════════════╝\n');

  let allPassed = true;
  let passed = 0;
  let failed = 0;

  Object.entries(CHECKS).forEach(([key, check]) => {
    const result = check.check();
    const symbol = result ? '✅' : '❌';
    console.log(`${symbol} ${check.name}`);
    
    if (result) {
      passed++;
    } else {
      failed++;
      allPassed = false;
    }
  });

  console.log('\n────────────────────────────────────────');
  console.log(`✅ Passou: ${passed} | ❌ Falhou: ${failed}`);
  console.log('────────────────────────────────────────\n');

  if (allPassed) {
    console.log('🎉 Sistema validado com sucesso!\n');
    process.exit(0);
  } else {
    console.log('⚠️ Alguns componentes faltam!\n');
    process.exit(1);
  }
}

validate();
