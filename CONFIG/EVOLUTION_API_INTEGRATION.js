let evolutionConfig = {
  url: localStorage.getItem("evolution_url") || "https://isa-unawed-marquetta.ngrok-free.dev",
  apiKey: localStorage.getItem("evolution_apikey") || "B6D711FCDE4D4FD5936544120E713976",
  instance: localStorage.getItem("evolution_instance") || "ENSIDE2"
};
async function testarConexaoEvolution() {
  const url = document.getElementById("evolutionUrl").value;
  const apiKey = document.getElementById("evolutionApiKey").value;
  const instance = document.getElementById("evolutionInstance").value;
  if (!url || !apiKey || !instance) { alert("Preencha todos os campos"); return; }
  try {
    const response = await fetch(url + "/instance/connectionState/" + instance, { headers: { "apikey": apiKey } });
    const data = await response.json();
    if (data.state === "open") { alert("Conexão OK"); document.getElementById("evolutionStatus").textContent = "OK"; }
    else { alert("WhatsApp desconectado"); document.getElementById("evolutionStatus").textContent = "OFF"; }
  } catch (error) { alert("Erro: " + error.message); }
}
function salvarConfigEvolution() {
  const url = document.getElementById("evolutionUrl").value;
  const apiKey = document.getElementById("evolutionApiKey").value;
  const instance = document.getElementById("evolutionInstance").value;
  localStorage.setItem("evolution_url", url);
  localStorage.setItem("evolution_apikey", apiKey);
  localStorage.setItem("evolution_instance", instance);
  evolutionConfig = { url, apiKey, instance };
  alert("Salvo");
}
async function gerarQRCode() {
  const url = evolutionConfig.url;
  const apiKey = evolutionConfig.apiKey;
  const instance = evolutionConfig.instance;
  try {
    const response = await fetch(url + "/instance/connect/" + instance, { headers: { "apikey": apiKey } });
    const data = await response.json();
    const qrBase64 = data.base64 || (data.qrcode && data.qrcode.base64);
    if (qrBase64) document.getElementById("qrCodeContainer").innerHTML = '<img src="' + qrBase64 + '" style="max-width:300px">';
  } catch (error) { alert("Erro: " + error.message); }
}
async function verificarConexao() { await testarConexaoEvolution(); }
async function enviarMensagemEvolution() {
  const numero = document.getElementById("evolutionNumero").value;
  const mensagem = document.getElementById("evolutionMensagem").value;
  const url = evolutionConfig.url;
  const apiKey = evolutionConfig.apiKey;
  const instance = evolutionConfig.instance;
  if (!numero || !mensagem) { alert("Preencha campos"); return; }
  try {
    const response = await fetch(url + "/message/sendText/" + instance, {
      method: "POST",
      headers: { "Content-Type": "application/json", "apikey": apiKey },
      body: JSON.stringify({ number: numero, text: mensagem })
    });
    const data = await response.json();
    if (data.key) alert("Enviado");
  } catch (error) { alert("Erro: " + error.message); }
}
window.addEventListener("DOMContentLoaded", function() {
  if (document.getElementById("evolutionUrl")) {
    document.getElementById("evolutionUrl").value = evolutionConfig.url;
    document.getElementById("evolutionApiKey").value = evolutionConfig.apiKey;
    document.getElementById("evolutionInstance").value = evolutionConfig.instance;
  }
});
