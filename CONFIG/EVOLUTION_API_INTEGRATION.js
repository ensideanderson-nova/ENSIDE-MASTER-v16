// ============================================================================
// 🔒 EVOLUTION API INTEGRATION - VERSÃO SEGURA
// ============================================================================
// ⚠️ NUNCA coloque credenciais hardcoded neste arquivo!
// Use localStorage ou variáveis de ambiente.
// ============================================================================

let evolutionConfig = {
  url: localStorage.getItem("evolution_url") || "",
  apiKey: localStorage.getItem("evolution_apikey") || "",
  instance: localStorage.getItem("evolution_instance") || ""
};

// Verificar se as configurações estão presentes
function verificarConfiguracao() {
  if (!evolutionConfig.url || !evolutionConfig.apiKey || !evolutionConfig.instance) {
    console.warn("⚠️ Configuração Evolution API incompleta!");
    console.log("Configure usando:");
    console.log('localStorage.setItem("evolution_url", "SUA_URL");');
    console.log('localStorage.setItem("evolution_apikey", "SUA_CHAVE");');
    console.log('localStorage.setItem("evolution_instance", "SUA_INSTANCIA");');
    return false;
  }
  return true;
}

async function testarConexaoEvolution() {
  const url = document.getElementById("evolutionUrl")?.value || evolutionConfig.url;
  const apiKey = document.getElementById("evolutionApiKey")?.value || evolutionConfig.apiKey;
  const instance = document.getElementById("evolutionInstance")?.value || evolutionConfig.instance;
  
  if (!url || !apiKey || !instance) {
    alert("❌ Preencha todos os campos de configuração!");
    return;
  }
  
  try {
    const response = await fetch(`${url}/instance/connectionState/${instance}`, {
      headers: { "apikey": apiKey }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    if (data.state === "open") {
      alert("✅ Conexão OK!");
      if (document.getElementById("evolutionStatus")) {
        document.getElementById("evolutionStatus").textContent = "✅ CONECTADO";
        document.getElementById("evolutionStatus").style.color = "#10b981";
      }
    } else {
      alert("⚠️ WhatsApp desconectado");
      if (document.getElementById("evolutionStatus")) {
        document.getElementById("evolutionStatus").textContent = "⚠️ DESCONECTADO";
        document.getElementById("evolutionStatus").style.color = "#f59e0b";
      }
    }
  } catch (error) {
    alert(`❌ Erro: ${error.message}`);
    console.error("Erro detalhado:", error);
  }
}

function salvarConfigEvolution() {
  const url = document.getElementById("evolutionUrl")?.value;
  const apiKey = document.getElementById("evolutionApiKey")?.value;
  const instance = document.getElementById("evolutionInstance")?.value;
  
  if (!url || !apiKey || !instance) {
    alert("❌ Preencha todos os campos!");
    return;
  }
  
  // Validações de segurança
  if (!url.startsWith("https://") && !url.startsWith("http://localhost")) {
    alert("⚠️ A URL deve usar HTTPS!");
    return;
  }
  
  if (apiKey.length < 16) {
    alert("⚠️ API Key deve ter no mínimo 16 caracteres!");
    return;
  }
  
  localStorage.setItem("evolution_url", url);
  localStorage.setItem("evolution_apikey", apiKey);
  localStorage.setItem("evolution_instance", instance);
  
  evolutionConfig = { url, apiKey, instance };
  alert("✅ Configuração salva com sucesso!");
}

async function gerarQRCode() {
  if (!verificarConfiguracao()) {
    alert("❌ Configure a Evolution API primeiro!");
    return;
  }
  
  const { url, apiKey, instance } = evolutionConfig;
  
  try {
    const response = await fetch(`${url}/instance/connect/${instance}`, {
      headers: { "apikey": apiKey }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    const qrBase64 = data.base64 || data.qrcode?.base64;
    
    if (qrBase64 && document.getElementById("qrCodeContainer")) {
      document.getElementById("qrCodeContainer").innerHTML = `
        <div style="text-align: center; padding: 20px;">
          <img src="${qrBase64}" style="max-width: 300px; border: 2px solid #10b981; border-radius: 8px;">
          <p style="margin-top: 10px; color: #10b981;">📱 Escaneie com o WhatsApp</p>
        </div>
      `;
    } else {
      alert("⚠️ QR Code não disponível");
    }
  } catch (error) {
    alert(`❌ Erro ao gerar QR Code: ${error.message}`);
    console.error("Erro detalhado:", error);
  }
}

async function verificarConexao() {
  await testarConexaoEvolution();
}

async function enviarMensagemEvolution() {
  if (!verificarConfiguracao()) {
    alert("❌ Configure a Evolution API primeiro!");
    return;
  }
  
  const numero = document.getElementById("evolutionNumero")?.value;
  const mensagem = document.getElementById("evolutionMensagem")?.value;
  const { url, apiKey, instance } = evolutionConfig;
  
  if (!numero || !mensagem) {
    alert("❌ Preencha número e mensagem!");
    return;
  }
  
  try {
    const response = await fetch(`${url}/message/sendText/${instance}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "apikey": apiKey
      },
      body: JSON.stringify({
        number: numero,
        text: mensagem
      })
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    if (data.key) {
      alert("✅ Mensagem enviada com sucesso!");
      if (document.getElementById("evolutionMensagem")) {
        document.getElementById("evolutionMensagem").value = "";
      }
    } else {
      alert("⚠️ Mensagem enviada mas sem confirmação");
    }
  } catch (error) {
    alert(`❌ Erro ao enviar: ${error.message}`);
    console.error("Erro detalhado:", error);
  }
}

// Inicialização segura
window.addEventListener("DOMContentLoaded", function() {
  console.log("🔒 Evolution API Integration carregada (versão segura)");
  
  // Preencher campos se existirem
  if (document.getElementById("evolutionUrl")) {
    document.getElementById("evolutionUrl").value = evolutionConfig.url;
  }
  if (document.getElementById("evolutionApiKey")) {
    document.getElementById("evolutionApiKey").value = evolutionConfig.apiKey;
  }
  if (document.getElementById("evolutionInstance")) {
    document.getElementById("evolutionInstance").value = evolutionConfig.instance;
  }
  
  // Verificar configuração
  if (!verificarConfiguracao()) {
    console.warn("⚠️ Evolution API não configurada. Configure em Configurações → Evolution API");
  }
});
