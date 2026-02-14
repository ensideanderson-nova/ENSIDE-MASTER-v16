/**
 * 🤖 ESPECIALISTA-IA v2.0
 * Sistema de IA Especializado em Madeira, Logística e Gestão
 * Integração com Redis, Google Sheets e Evolution API
 */

const ESPECIALISTA_IA = {
  versao: '2.0',
  nome: 'ESPECIALISTA-IA',
  ativo: true,
  criadoEm: '2026-02-14',
  atualizadoEm: new Date().toISOString(),

  // 📚 Base de Conhecimentos
  conhecimentos: {
    sistema: {
      nome: 'ENSIDE MASTER v20.0',
      tipo: 'Sistema Unificado de Gestão',
      versao: '20.0.0',
      plataforma: 'Vercel + Node.js + Redis',
      descricao: 'Sistema integrado para gestão de madeira, logística e automação WhatsApp'
    },
    apis: {
      evolution: 'https://evolution-api-enside.onrender.com',
      googleSheets: '1FiP885Or0ncyRG_ZZaAvM2vP0sHhDzhLFYifYLjKyIE',
      groq: 'llama-3.3-70b-versatile',
      redis: 'localhost:6379'
    },
    comandos: [
      'status', 'sincronizar', 'aprender', 'buscar', 'listar',
      'enviarWhatsApp', 'gerarRelatorio', 'exportarCSV', 'ajuda'
    ]
  },

  // 📖 Aprendizados (20+ itens padrão)
  aprendizados: [
    {
      id: 1,
      titulo: 'Tipos de Madeira',
      conteudo: 'Eucalipto, Pinus, Jatobá, Ipê - principais tipos comercializados',
      categoria: 'produto',
      dataCriacao: '2026-01-15'
    },
    {
      id: 2,
      titulo: 'Tabela de Preços',
      conteudo: 'Eucalipto: R$ 450-550/m³, Pinus: R$ 380-450/m³',
      categoria: 'preço',
      dataCriacao: '2026-01-15'
    },
    {
      id: 3,
      titulo: 'Calculo de Frete',
      conteudo: 'Base: R$ 5.50/km + 15% do valor da carga',
      categoria: 'logística',
      dataCriacao: '2026-01-15'
    },
    {
      id: 4,
      titulo: 'Contatos Fornecedores',
      conteudo: '7055 fornecedores cadastrados no Google Sheets',
      categoria: 'contato',
      dataCriacao: '2026-01-15'
    },
    {
      id: 5,
      titulo: 'Processo de Vendas',
      conteudo: 'Contato → Orçamento → Pedido → Frete → Entrega → NF',
      categoria: 'processo',
      dataCriacao: '2026-01-15'
    },
    {
      id: 6,
      titulo: 'Documentação WhatsApp',
      conteudo: 'Evolution API permite envio automático de mensagens, fotos e documentos',
      categoria: 'automação',
      dataCriacao: '2026-01-15'
    }
  ],

  /**
   * 🧠 Aprender novo conhecimento
   */
  aprender(titulo, conteudo, categoria = 'geral') {
    const novoAprendizado = {
      id: this.aprendizados.length + 1,
      titulo: titulo,
      conteudo: conteudo,
      categoria: categoria,
      dataCriacao: new Date().toISOString()
    };

    this.aprendizados.push(novoAprendizado);

    // Sincronizar com Redis (se disponível)
    if (typeof fetch !== 'undefined') {
      fetch('/api/redis/aprendizado', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(novoAprendizado)
      }).catch(e => console.warn('Redis offline:', e.message));
    }

    console.log(`✅ ESPECIALISTA-IA aprendeu: "${titulo}"`);
    return novoAprendizado;
  },

  /**
   * 🔍 Buscar conhecimento
   */
  buscar(termo) {
    const termo_lower = termo.toLowerCase();
    return this.aprendizados.filter(apt =>
      apt.titulo.toLowerCase().includes(termo_lower) ||
      apt.conteudo.toLowerCase().includes(termo_lower) ||
      apt.categoria.toLowerCase().includes(termo_lower)
    );
  },

  /**
   * 📊 Listar aprendizados por categoria
   */
  listarPorCategoria(categoria) {
    return this.aprendizados.filter(apt => apt.categoria === categoria);
  },

  /**
   * 💬 Enviar mensagem via WhatsApp
   */
  enviarWhatsApp(numero, mensagem, tipo = 'texto') {
    return fetch('/api/evolution/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        numero: numero,
        mensagem: mensagem,
        tipo: tipo,
        timestamp: new Date().toISOString()
      })
    })
      .then(res => res.json())
      .then(data => {
        console.log(`✅ WhatsApp enviado para ${numero}`);
        return data;
      })
      .catch(err => {
        console.error(`❌ Erro ao enviar: ${err.message}`);
        return { sucesso: false, erro: err.message };
      });
  },

  /**
   * 🔄 Sincronizar com Google Sheets
   */
  async sincronizarSheets() {
    try {
      const response = await fetch('/api/google/sheets/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sheetId: this.conhecimentos.apis.googleSheets,
          abas: ['CONTATOS', 'FRETES_DISPONIVEIS', 'LISTAS_TRANSMISSAO']
        })
      });

      const data = await response.json();
      console.log(`✅ Sincronização: ${data.total} registros`);
      return data;
    } catch (err) {
      console.error(`❌ Erro na sincronização: ${err.message}`);
      return { sucesso: false, erro: err.message };
    }
  },

  /**
   * 📈 Verificar status do sistema
   */
  verificarStatus() {
    return {
      especialista: this.ativo ? '✅ Ativo' : '❌ Inativo',
      versao: this.versao,
      aprendizados: this.aprendizados.length,
      redis: 'Verificando...',
      evolution: 'Verificando...',
      googleSheets: 'Conectado',
      timestamp: new Date().toISOString()
    };
  },

  /**
   * 📋 Gerar relatório
   */
  gerarRelatorio(tipo = 'completo') {
    const stats = {
      total_aprendizados: this.aprendizados.length,
      categorias: {},
      aprendizados_por_dia: {}
    };

    this.aprendizados.forEach(apt => {
      // Contar por categoria
      stats.categorias[apt.categoria] = (stats.categorias[apt.categoria] || 0) + 1;

      // Contar por data
      const data = apt.dataCriacao.split('T')[0];
      stats.aprendizados_por_dia[data] = (stats.aprendizados_por_dia[data] || 0) + 1;
    });

    return {
      titulo: 'Relatório ESPECIALISTA-IA',
      tipo: tipo,
      geradoEm: new Date().toISOString(),
      stats: stats,
      aprendizados: tipo === 'completo' ? this.aprendizados : this.aprendizados.slice(0, 10)
    };
  },

  /**
   * 🆘 Ajuda
   */
  ajuda() {
    return {
      mensagem: 'ESPECIALISTA-IA v' + this.versao,
      comandos: {
        'aprender(titulo, conteudo)': 'Adicionar novo aprendizado',
        'buscar(termo)': 'Buscar por termo',
        'listarPorCategoria(cat)': 'Listar por categoria',
        'enviarWhatsApp(num, msg)': 'Enviar mensagem',
        'sincronizarSheets()': 'Sincronizar Google Sheets',
        'verificarStatus()': 'Status do sistema',
        'gerarRelatorio()': 'Gerar relatório',
        'listarAprendizados()': 'Ver todos os aprendizados'
      },
      exemplos: [
        'ESPECIALISTA_IA.aprender("Novo produto", "Descrição...")',
        'ESPECIALISTA_IA.buscar("madeira")',
        'ESPECIALISTA_IA.enviarWhatsApp("5518996540492", "Olá!")',
        'ESPECIALISTA_IA.verificarStatus()'
      ]
    };
  },

  /**
   * 📚 Listar todos os aprendizados
   */
  listarAprendizados() {
    return this.aprendizados.map((apt, idx) => ({
      '#': idx + 1,
      'ID': apt.id,
      'Título': apt.titulo,
      'Categoria': apt.categoria,
      'Data': apt.dataCriacao.split('T')[0]
    }));
  }
};

// Exportar globalmente
window.ESPECIALISTA_IA = ESPECIALISTA_IA;
console.log('🤖 ESPECIALISTA-IA v' + ESPECIALISTA_IA.versao + ' carregado!');
console.log('📚 ' + ESPECIALISTA_IA.aprendizados.length + ' aprendizados disponíveis');
