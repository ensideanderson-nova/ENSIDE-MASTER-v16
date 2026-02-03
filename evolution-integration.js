// 📱 EVOLUTION API - INTEGRAÇÃO COMPLETA
// Integração entre Evolution API, Google Sheets e Vercel

const EVOLUTION_CONFIG = {
  // Render (Online - Produção)
  render: {
    url: process.env.EVOLUTION_API_URL || 'https://evolution-api-latest-poc1.onrender.com',
    apiKey: process.env.EVOLUTION_API_KEY || 'evolution-api-enside-2024-secret',
    instance: process.env.EVOLUTION_INSTANCE || 'enside'
  },
  // Docker (Local - Desenvolvimento)
  local: {
    url: process.env.EVOLUTION_API_URL_LOCAL || 'http://localhost:8080',
    apiKey: process.env.EVOLUTION_API_KEY_LOCAL || '919AA333-AE59-4B06-B1EF-C9A9F9C8C0F6',
    instance: process.env.EVOLUTION_INSTANCE_LOCAL || 'enside'
  }
};

// Usar ambiente baseado em variável de ambiente
const ENV = process.env.NODE_ENV === 'production' ? 'render' : 'local';
const CONFIG = EVOLUTION_CONFIG[ENV];

/**
 * Envia mensagem WhatsApp via Evolution API
 * @param {string} number - Número com DDD (ex: 5518996540492)
 * @param {string} message - Mensagem a ser enviada
 * @returns {Promise<Object>} Resposta da API
 */
async function sendWhatsAppMessage(number, message) {
  try {
    const response = await fetch(
      `${CONFIG.url}/message/sendText/${CONFIG.instance}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': CONFIG.apiKey
        },
        body: JSON.stringify({
          number: number,
          textMessage: { text: message }
        })
      }
    );
    
    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error('Erro ao enviar mensagem:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Envia mensagens em massa para lista de contatos
 * @param {Array} contacts - Array de objetos {number, name}
 * @param {string} messageTemplate - Template com {nome} para substituição
 * @param {number} delay - Delay entre mensagens em ms (padrão: 20000)
 * @returns {Promise<Object>} Estatísticas de envio
 */
async function sendBulkMessages(contacts, messageTemplate, delay = 20000) {
  const stats = { sent: 0, failed: 0, total: contacts.length };
  
  for (let i = 0; i < contacts.length; i++) {
    const contact = contacts[i];
    const message = messageTemplate.replace('{nome}', contact.name || 'Cliente');
    
    const result = await sendWhatsAppMessage(contact.number, message);
    
    if (result.success) {
      stats.sent++;
      console.log(`✅ [${i+1}/${contacts.length}] Enviado para ${contact.number}`);
    } else {
      stats.failed++;
      console.error(`❌ [${i+1}/${contacts.length}] Falha para ${contact.number}`);
    }
    
    // Delay entre mensagens para evitar ban
    if (i < contacts.length - 1) {
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  return stats;
}

/**
 * Busca contatos do Google Sheets
 * @param {string} category - Categoria (fornecedores, clientes, transportadores)
 * @returns {Promise<Array>} Lista de contatos
 */
async function getContactsFromSheets(category = 'todos') {
  const SHEETS_ID = process.env.GOOGLE_SHEETS_ID || '1FiP885Or0ncyRG_ZZaAvM2vP0sHhDzhLFYifYLjKyIE';
  
  // TODO: Implementar integração com Google Sheets API
  // Por enquanto, retorna array vazio
  console.log(`Buscando contatos da categoria: ${category}`);
  console.log(`Planilha ID: ${SHEETS_ID}`);
  
  return [];
}

/**
 * Verifica status da instância Evolution API
 * @returns {Promise<Object>} Status da instância
 */
async function checkInstanceStatus() {
  try {
    const response = await fetch(
      `${CONFIG.url}/instance/connectionState/${CONFIG.instance}`,
      {
        headers: { 'apikey': CONFIG.apiKey }
      }
    );
    
    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error('Erro ao verificar status:', error);
    return { success: false, error: error.message };
  }
}

export {
  sendWhatsAppMessage,
  sendBulkMessages,
  getContactsFromSheets,
  checkInstanceStatus,
  EVOLUTION_CONFIG,
  CONFIG
};
