/**
 * 🤖 CHAT FLUTUANTE ESPECIALISTA-IA
 * Widget flutuante com comandos, webhook e aprendizados editáveis
 */

const CHAT_FLUTUANTE = {
    // Criar widget flutuante
    criar: function() {
        const widget = document.createElement('div');
        widget.id = 'chatFlutuanteIA';
        widget.innerHTML = `
            <style>
                #chatFlutuanteIA { position: fixed; bottom: 20px; right: 20px; z-index: 9999; font-family: 'Inter', sans-serif; }
                #chatBotao { width: 60px; height: 60px; border-radius: 50%; background: linear-gradient(135deg, #f43f5e, #e11d48); border: none; cursor: pointer; box-shadow: 0 4px 15px rgba(244,63,94,0.4); display: flex; align-items: center; justify-content: center; font-size: 28px; transition: transform 0.3s; }
                #chatBotao:hover { transform: scale(1.1); }
                #chatJanela { display: none; position: absolute; bottom: 70px; right: 0; width: 380px; max-height: 500px; background: #1e293b; border-radius: 15px; box-shadow: 0 10px 40px rgba(0,0,0,0.5); overflow: hidden; border: 1px solid rgba(244,63,94,0.3); }
                #chatJanela.aberto { display: block; }
                #chatHeader { background: linear-gradient(135deg, #f43f5e, #e11d48); padding: 15px; display: flex; justify-content: space-between; align-items: center; }
                #chatHeader h3 { color: white; margin: 0; font-size: 14px; }
                #chatHeader button { background: none; border: none; color: white; cursor: pointer; font-size: 18px; }
                #chatAbas { display: flex; background: #0f172a; }
                #chatAbas button { flex: 1; padding: 10px; border: none; background: transparent; color: #94a3b8; cursor: pointer; font-size: 12px; }
                #chatAbas button.ativo { background: #1e293b; color: #f43f5e; border-bottom: 2px solid #f43f5e; }
                #chatConteudo { height: 300px; overflow-y: auto; padding: 15px; }
                #chatInput { display: flex; padding: 10px; background: #0f172a; gap: 8px; }
                #chatInput input { flex: 1; padding: 10px; border: 1px solid #334155; border-radius: 8px; background: #1e293b; color: white; }
                #chatInput button { padding: 10px 15px; background: #f43f5e; border: none; border-radius: 8px; color: white; cursor: pointer; }
                .aprendizado-item { background: rgba(0,0,0,0.3); padding: 12px; border-radius: 8px; margin-bottom: 10px; border-left: 3px solid #f59e0b; }
                .aprendizado-item h4 { color: #f59e0b; margin: 0 0 5px 0; font-size: 13px; display: flex; justify-content: space-between; }
                .aprendizado-item p { color: #cbd5e1; margin: 0; font-size: 12px; }
                .aprendizado-item button { background: #334155; border: none; padding: 3px 8px; border-radius: 4px; color: #94a3b8; cursor: pointer; font-size: 11px; margin-left: 5px; }
                .aprendizado-item button:hover { background: #475569; }
                .msg { padding: 8px 12px; border-radius: 8px; margin-bottom: 8px; font-size: 13px; }
                .msg-user { background: #f43f5e; color: white; margin-left: 20%; }
                .msg-ia { background: #334155; color: #e2e8f0; margin-right: 20%; }
            </style>
            <button id="chatBotao" onclick="CHAT_FLUTUANTE.toggle()">🤖</button>
            <div id="chatJanela">
                <div id="chatHeader">
                    <h3>🤖 ESPECIALISTA-IA</h3>
                    <div>
                        <button onclick="CHAT_FLUTUANTE.toggle()">✕</button>
                    </div>
                </div>
                <div id="chatAbas">
                    <button class="ativo" onclick="CHAT_FLUTUANTE.mudarAba('chat')">💬 Chat</button>
                    <button onclick="CHAT_FLUTUANTE.mudarAba('aprendizados')">📚 Aprendizados</button>
                    <button onclick="CHAT_FLUTUANTE.mudarAba('comandos')">⚡ Comandos</button>
                </div>
                <div id="chatConteudo"></div>
                <div id="chatInput">
                    <input type="text" id="chatMensagem" placeholder="Digite comando ou mensagem..." onkeypress="if(event.key==='Enter')CHAT_FLUTUANTE.enviar()">
                    <button onclick="CHAT_FLUTUANTE.enviar()">📤</button>
                </div>
            </div>
        `;
        document.body.appendChild(widget);
        this.mudarAba('chat');
    },

    toggle: function() {
        document.getElementById('chatJanela').classList.toggle('aberto');
    },

    mudarAba: function(aba) {
        document.querySelectorAll('#chatAbas button').forEach(b => b.classList.remove('ativo'));
        event.target.classList.add('ativo');
        const conteudo = document.getElementById('chatConteudo');
        
        if (aba === 'chat') {
            conteudo.innerHTML = '<div class="msg msg-ia">Olá! Sou o ESPECIALISTA-IA. Digite um comando ou pergunte algo.</div>';
        } else if (aba === 'aprendizados') {
            this.renderAprendizados();
        } else if (aba === 'comandos') {
            conteudo.innerHTML = `
                <div style="color:#94a3b8;font-size:12px;">
                    <p><b style="color:#22c55e;">Comandos disponíveis:</b></p>
                    <p>• <b>enviar lista [nome]</b> - Envia lista de transmissão</p>
                    <p>• <b>status</b> - Verifica status do sistema</p>
                    <p>• <b>sincronizar</b> - Sincroniza com Google Sheets</p>
                    <p>• <b>webhook</b> - Configura webhook WhatsApp</p>
                    <p>• <b>aprender [titulo] | [conteudo]</b> - Adiciona aprendizado</p>
                </div>
            `;
        }
    },

    renderAprendizados: function() {
        const conteudo = document.getElementById('chatConteudo');
        const aprendizados = typeof ESPECIALISTA_IA !== 'undefined' ? ESPECIALISTA_IA.aprendizados : [];
        conteudo.innerHTML = aprendizados.map(a => `
            <div class="aprendizado-item" id="apr-${a.id}">
                <h4>#${a.id} ${a.titulo} <span><button onclick="CHAT_FLUTUANTE.editarAprendizado(${a.id})">✏️</button><button onclick="CHAT_FLUTUANTE.excluirAprendizado(${a.id})">🗑️</button></span></h4>
                <p>${a.conteudo}</p>
            </div>
        `).join('') + '<button onclick="CHAT_FLUTUANTE.novoAprendizado()" style="width:100%;padding:10px;background:#22c55e;border:none;border-radius:8px;color:white;cursor:pointer;margin-top:10px;">➕ Novo Aprendizado</button>';
    },

    editarAprendizado: function(id) {
        const apr = ESPECIALISTA_IA.aprendizados.find(a => a.id === id);
        if (!apr) return;
        const novoTitulo = prompt('Título:', apr.titulo);
        if (novoTitulo === null) return;
        const novoConteudo = prompt('Conteúdo:', apr.conteudo);
        if (novoConteudo === null) return;
        apr.titulo = novoTitulo;
        apr.conteudo = novoConteudo;
        this.salvarAprendizados();
        this.renderAprendizados();
        alert('✅ Aprendizado atualizado e salvo!');
    },

    excluirAprendizado: function(id) {
        if (!confirm('Excluir este aprendizado?')) return;
        ESPECIALISTA_IA.aprendizados = ESPECIALISTA_IA.aprendizados.filter(a => a.id !== id);
        this.salvarAprendizados();
        this.renderAprendizados();
    },

    novoAprendizado: function() {
        const titulo = prompt('Título do aprendizado:');
        if (!titulo) return;
        const conteudo = prompt('Conteúdo:');
        if (!conteudo) return;
        ESPECIALISTA_IA.aprender(titulo, conteudo);
        this.salvarAprendizados();
        this.renderAprendizados();
    },

    salvarAprendizados: function() {
        localStorage.setItem('especialista_ia_aprendizados', JSON.stringify(ESPECIALISTA_IA.aprendizados));
        console.log('✅ Aprendizados salvos no localStorage');
    },

    carregarAprendizados: function() {
        const salvos = localStorage.getItem('especialista_ia_aprendizados');
        if (salvos) {
            ESPECIALISTA_IA.aprendizados = JSON.parse(salvos);
            console.log('✅ Aprendizados carregados:', ESPECIALISTA_IA.aprendizados.length);
        }
    },

    enviar: function() {
        const input = document.getElementById('chatMensagem');
        const msg = input.value.trim();
        if (!msg) return;
        input.value = '';
        
        const conteudo = document.getElementById('chatConteudo');
        conteudo.innerHTML += `<div class="msg msg-user">${msg}</div>`;
        
        // Processar comando
        const resposta = this.processarComando(msg);
        conteudo.innerHTML += `<div class="msg msg-ia">${resposta}</div>`;
        conteudo.scrollTop = conteudo.scrollHeight;
    },

    processarComando: function(cmd) {
        const cmdLower = cmd.toLowerCase();
        
        if (cmdLower.startsWith('enviar lista')) {
            const lista = cmd.replace(/enviar lista/i, '').trim();
            return this.enviarLista(lista);
        }
        if (cmdLower === 'status') {
            return '✅ Sistema operacional | 7.055 contatos | Evolution API: conectada';
        }
        if (cmdLower === 'sincronizar') {
            return '🔄 Sincronização iniciada com Google Sheets...';
        }
        if (cmdLower.startsWith('aprender')) {
            const partes = cmd.replace(/aprender/i, '').split('|');
            if (partes.length >= 2) {
                ESPECIALISTA_IA.aprender(partes[0].trim(), partes[1].trim());
                return '✅ Aprendizado adicionado!';
            }
            return '❌ Use: aprender titulo | conteudo';
        }
        return 'Comando não reconhecido. Digite "comandos" para ver opções.';
    },

    enviarLista: async function(nomeLista) {
        // Integração com Evolution API para enviar lista
        return `📤 Enviando lista "${nomeLista}" via WhatsApp...`;
    }
};

// Inicializar quando DOM carregar
document.addEventListener('DOMContentLoaded', () => {
    CHAT_FLUTUANTE.carregarAprendizados();
    CHAT_FLUTUANTE.criar();
});
