// 🤖 Chat API - Vercel AI Gateway Integration

export default (app) => {
  // POST /api/chat - Enviar mensagem para IA
  app.post('/api/chat', async (req, res) => {
    try {
      const { message, context = 'default' } = req.body;

      if (!message) {
        return res.status(400).json({ error: 'Message is required' });
      }

      const apiKey = process.env.AI_GATEWAY_API_KEY;
      const baseUrl = process.env.AI_GATEWAY_URL || 'https://ai-gateway.vercel.sh/v1';
      const model = process.env.AI_MODEL || 'openai/gpt-5.2';

      if (!apiKey) {
        return res.status(500).json({ 
          error: 'AI_GATEWAY_API_KEY not configured',
          demo: true,
          response: 'Demo: ' + message
        });
      }

      // Contexto do sistema baseado no tipo
      let systemPrompt = 'Você é um assistente especialista em negócios de madeira e fretes. Responda de forma concisa e útil.';
      
      if (context === 'especialista') {
        systemPrompt = 'Você é um especialista em madeira. Conhece densidade, tipos de madeira (Pinheiro, Eucalipto, Ipê, Jatobá, Angelim, Merbau, Teca, Cumaru), preços e negociação. Responda em português.';
      } else if (context === 'frete') {
        systemPrompt = 'Você é um especialista em logística e cálculo de fretes. Responda em português.';
      }

      // Chamar Vercel AI Gateway
      const response = await fetch(`${baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: model,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: message }
          ],
          temperature: 0.7,
          max_tokens: 500
        })
      });

      if (!response.ok) {
        const error = await response.text();
        console.error('AI Gateway error:', error);
        return res.status(500).json({ 
          error: 'Failed to get AI response',
          details: error
        });
      }

      const data = await response.json();
      const aiResponse = data.choices?.[0]?.message?.content || 'No response';

      res.json({
        success: true,
        message: message,
        response: aiResponse,
        model: model,
        context: context
      });

    } catch (err) {
      console.error('Chat API error:', err);
      res.status(500).json({ 
        error: err.message,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
      });
    }
  });

  // GET /api/chat/models - Listar modelos disponíveis
  app.get('/api/chat/models', (req, res) => {
    res.json({
      available_models: [
        { id: 'openai/gpt-5.2', name: 'GPT-5.2 (Recomendado)', provider: 'OpenAI' },
        { id: 'openai/gpt-4-turbo', name: 'GPT-4 Turbo', provider: 'OpenAI' },
        { id: 'anthropic/claude-3-sonnet', name: 'Claude 3 Sonnet', provider: 'Anthropic' }
      ],
      current_model: process.env.AI_MODEL || 'openai/gpt-5.2'
    });
  });

  // GET /api/chat/ping - Verificar disponibilidade
  app.get('/api/chat/ping', (req, res) => {
    res.json({
      status: 'ok',
      ai_gateway: process.env.AI_GATEWAY_URL ? 'configured' : 'not_configured',
      api_key_set: !!process.env.AI_GATEWAY_API_KEY,
      model: process.env.AI_MODEL || 'openai/gpt-5.2'
    });
  });
};
