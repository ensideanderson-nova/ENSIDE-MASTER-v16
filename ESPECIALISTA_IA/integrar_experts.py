#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
🤖 INTEGRADOR DE EXPERTS - ESPECIALISTA-IA
Integra TODO o conhecimento dos experts no ESPECIALISTA-IA
"""

import json
import redis
from datetime import datetime

# Conectar ao Redis
r = redis.Redis(host='localhost', port=6379, decode_responses=True)

# 📚 CONHECIMENTO DOS 3 EXPERTS
experts_knowledge = {
    "Google Sheets": {
        "descricao": "Expert em Google Sheets - operações, fórmulas, manipulação de dados",
        "conhecimentos": [
            "Atalhos essenciais: Cmd+J (pular para célula), Cmd+Arrow (navegar), F2 (editar)",
            "Fórmulas principais: SUM, AVERAGE, VLOOKUP, IF, QUERY, FILTER, IMPORTRANGE",
            "Sempre limpar título completamente antes de renomear (Cmd+A)",
            "Verificar alinhamento ao adicionar dados em colunas paralelas",
            "Arquivos .xlsx importados não funcionam com API gviz - converter para Google Sheets",
            "Listas de transmissão devem ser criadas na planilha, não no sistema HTML",
            "Marcação de campos para exportação deve ser por coluna, não por linha",
            "Dropdowns dependentes para UF/Cidade e KM via API",
            "Fórmulas com referência circular causam #ERROR!",
            "Sistema ENSIDE MASTER deve estar integrado em tempo real com Google Sheets",
            "Verificar número de linhas para confirmar importação de dados",
            "Sistema de arquivos deve abrir pastas reais do Mac",
            "Verificar existência de arquivos antes de referenciar em iframes",
            "Verificar mapeamento de colunas antes de sincronizar com sistemas externos",
            "Não importar contatos gerados automaticamente para a planilha",
            "Sincronização ENSIDE-Sheets requer mapeamento correto de colunas e abas",
            "Sincronização de Listas de Transmissão requer filtro por categoria",
            "Integração n8n/Redis deve usar base existente do ENSIDE"
        ],
        "planilha_principal": {
            "nome": "EUCALIPTO-13-12-25-_SISTEMA_INTEGRADO_COMPLETO",
            "id": "1FiP885Or0ncyRG_ZZaAvM2vP0sHhDzhLFYifYLjKyIE",
            "abas": ["CONTATOS", "FRETES_DISPONIVEIS", "CAPTACAO_FRETES", "LISTAS_TRANSMISSAO"],
            "total_contatos": 7055
        }
    },
    
    "ENSIDE Sistema Integrado": {
        "descricao": "Sistema ENSIDE MASTER v19.0 - Gerenciamento completo de contatos, WhatsApp, fretes",
        "conhecimentos": [
            "Sistema principal: ~/Desktop/ENSIDE_SISTEMA_UNIFICADO/ENSIDE_MASTER_v19.0_INTEGRADO.html",
            "Comando para abrir: enside- (abre TODOS os sistemas)",
            "7.055+ contatos totais: 1.200 fornecedores, 2.500 clientes, 377 transportadores",
            "Evolution API LOCAL: localhost:8080, instância ENSIDE (MAIÚSCULO), API Key: evolution-api-enside-2024-secret",
            "Evolution API RENDER: https://evolution-api-latest-poc1.onrender.com, API Key: 23D116F5-A4D3-404F-8D38-66EBF544A44A",
            "WhatsApp: 5518996540492",
            "Redis: 35 chaves sincronizadas (enside:*)",
            "GitHub: https://github.com/ensideanderson-nova/ENSIDE-MASTER-v16",
            "Vercel: https://enside-sistema.vercel.app",
            "Importador Universal: CSV, JSON, Excel, TXT, XML, VCF - 14 categorias, 70+ subcategorias",
            "Multi-IA: GPT-4o, Claude, Groq Llama com contexto ENSIDE MADEIRAS",
            "Preços conhecidos: Mourão 2,20m R$18-25, Poste 7m R$95-120, Estaca R$8-15, Tratamento CCA R$300/m³",
            "ESPECIALISTA-IA requer API Keys de IA configuradas",
            "Painel Flutuante e Console ESPECIALISTA-IA não sincronizam automaticamente",
            "Erro 'The quota has been exceeded' no Importador Universal - limpar localStorage",
            "Nomes das abas no HTML não correspondem à planilha Google Sheets",
            "Listas de Envio em Massa não têm contatos carregados por padrão",
            "Sistema precisa de Redis para armazenar contatos das listas",
            "Fluxo completo n8n + Redis + Evolution API para WhatsApp com IA",
            "Sistema unificado em pasta única com Redis e GitHub",
            "Tema do sistema é salvo no localStorage não no HTML",
            "Comando enside executa tudo do Redis",
            "n8n perde workflows e credenciais ao resetar database.sqlite",
            "Workflow n8n para envio em massa WhatsApp com Google Sheets",
            "ESPECIALISTA-IA precisa ser conectado a todas as IAs e dispositivos",
            "Problema de envio em massa: API conectada mas contatos não carregam",
            "Script importar_contatos_redis.js para persistir contatos no Redis",
            "Redis precisa sincronizar 7055+ contatos do Google Sheets",
            "Servidor API Redis para listas de transmissão WhatsApp",
            "Credenciais completas Evolution API Local e Render",
            "Instância Evolution API local é ENSIDE não dentro",
            "API Key correta do Docker Evolution API local",
            "API Key correta do Render Evolution API",
            "Credenciais corretas Evolution API Render - Janeiro 2026",
            "HTML Lista de Transmissão com interface visual para envio WhatsApp",
            "Contatos do Redis precisam ser sincronizados com Evolution API antes de enviar",
            "Envio WhatsApp deve ser pela Evolution API não pelo Desktop",
            "Como gerar QR Code Evolution API via Terminal",
            "WhatsApp pode ficar restrito 24h por tentativas de conexão",
            "Importar contatos do Redis para Evolution API antes de enviar",
            "Contatos do Redis são fictícios - usar findChats para contatos reais",
            "Aumentar intervalo entre mensagens para evitar restrição WhatsApp",
            "Processo QR Code e intervalo de envio WhatsApp",
            "API Key correta Evolution API local Docker Janeiro 2026",
            "Sincronização HTML e Google Sheets não funciona - dados apenas no Redis",
            "Comando enside abre sistema mas Chrome pode mostrar aba errada primeiro",
            "Múltiplos executáveis causam perda de sincronização e trabalho",
            "ESPECIALISTA-IA é o componente central que precisa integração completa",
            "Comando enside não funciona - HTML não está no Redis",
            "ESPECIALISTA-IA precisa sincronização completa entre aba e flutuante",
            "Sistema deve funcionar 100% online com Vercel e Redis Cloud",
            "Múltiplas APIs Evolution consolidadas em chave única no Redis",
            "QR Code Evolution API Render demora 30-60 segundos (cold start)",
            "Painel Flutuante e Aba Principal ESPECIALISTA-IA não sincronizam automaticamente",
            "Credenciais corretas Evolution API Render - Janeiro 2026 ATUALIZADAS",
            "API Key correta Evolution API Render - Janeiro 2026 FINAL",
            "Sistema HTML precisa sincronizar 7.055 contatos com Redis para envio de listas",
            "Comando enside deve abrir apenas URLs online (Vercel, Render, Sheets)",
            "Sistema principal é APENAS https://enside-sistema.vercel.app - não usar localhost",
            "Comando enside- abre todos os sistemas do Redis online",
            "Nome correto da instância Evolution API Render é 'enside' minúsculo",
            "Instância Evolution API Render tem UUID único - nome pode variar",
            "Variáveis de ambiente Render já configuradas corretamente",
            "Credenciais Evolution API Render não funcionam via curl - instância deve ser criada pelo Manager web",
            "API Key Evolution API Docker local é evolution-api-enside-2024-secret",
            "Docker Evolution API configuração completa com docker-compose.yml do GitHub",
            "Sistema HTML Vercel não tem seção de histórico de envios WhatsApp",
            "Nome correto da instância Docker Evolution API local é ENSIDE (maiúsculo)",
            "Sistema HTML Vercel precisa usar credenciais Docker local para envio funcionar",
            "Sincronização em tempo real HTML local ↔ Vercel ↔ Redis configurada",
            "Sistema HTML local não sincroniza contatos do Google Sheets automaticamente",
            "Abas do HTML não correspondem às abas do Google Sheets - sincronização incorreta",
            "Sistema v19 renomeado para v16 para sincronização correta",
            "Comando enside- corrigido para abrir Docker local e sistema HTML local",
            "ESPECIALISTA-IA criado na raiz do Mac com varredura completa",
            "Comando enside- corrigido para abrir TODOS os sistemas incluindo Vercel e GitHub"
        ],
        "credenciais": {
            "evolution_local": {
                "url": "http://localhost:8080",
                "api_key": "evolution-api-enside-2024-secret",
                "instancia": "ENSIDE",
                "whatsapp": "5518996540492"
            },
            "evolution_render": {
                "url": "https://evolution-api-latest-poc1.onrender.com",
                "api_key": "23D116F5-A4D3-404F-8D38-66EBF544A44A",
                "instancia": "ENSIDE",
                "whatsapp": "5518996540492"
            },
            "github": {
                "token": "Github_pat_11B2HPWRQ0jAY7HwKQQBR9_XBQOZWISGDOf45h8a0ByyrbMlfw2r3peS4J2IGNQax3HOF6FYPXFVRng6A8",
                "owner": "ensideanderson-nova",
                "repo": "ENSIDE-MASTER-v16"
            },
            "groq": {
                "api_key": "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",
                "modelo": "llama-3.3-70b-versatile"
            }
        }
    },
    
    "Integrar todos sistemS": {
        "descricao": "Integração de IA no sistema ENSIDE - MCPs, Claude AI, Evolution API",
        "conhecimentos": [
            "Instalador de IA e MCPs para sistema de fretes",
            "MCPs configurados: SQLite, Filesystem, Fetch, Everything",
            "Claude Desktop: ~/Library/Application Support/Claude",
            "Módulos de IA: claude-ai-assistant.js, route-analyzer.js, price-recommender.js",
            "Configuração de API Keys: Claude, OpenAI, Google Maps, Evolution API",
            "Scripts de teste: testar-ia.js, testar-mcps.sh",
            "GitHub App ESPECIALISTA-IA: App ID 2302130, Client ID Iv23liLTN3V5XvOzhjW7",
            "Estrutura final do sistema ENSIDE Unificado e credenciais Evolution API",
            "Verificar sincronização de contatos - quantidade deve corresponder à planilha",
            "Comando Central de IAs - Claude comandando Mac/iPhone",
            "Formato correto para enviar mensagens via Evolution API",
            "Configuração correta da Evolution API no sistema ENSIDE",
            "Evolution API LOCAL é a correta para envio de mensagens",
            "Configurações corretas dos 3 ambientes Evolution API",
            "Contatos Google Sheets vs Evolution API - Validação WhatsApp",
            "Contatos Google Sheets TÊM WhatsApp - Precisam formatação correta",
            "Números do Google Sheets faltam código 55 do Brasil",
            "Sequência correta de captação de fretes - HTML e planilha"
        ],
        "github_app": {
            "app_id": "2302130",
            "client_id": "Iv23liLTN3V5XvOzhjW7",
            "installation_id": "95179240",
            "webhook_url": "https://enside-sistema.vercel.app/api/webhook"
        }
    }
}

# 🔄 Integrar conhecimento no Redis
print("🤖 INTEGRANDO CONHECIMENTO DOS EXPERTS NO ESPECIALISTA-IA...")
print()

# Salvar conhecimento completo
r.set('especialista_ia:experts:completo', json.dumps(experts_knowledge, ensure_ascii=False, indent=2))
print("✅ Conhecimento completo salvo em: especialista_ia:experts:completo")

# Salvar cada expert separadamente
for expert_name, expert_data in experts_knowledge.items():
    key = f"especialista_ia:expert:{expert_name.lower().replace(' ', '_')}"
    r.set(key, json.dumps(expert_data, ensure_ascii=False, indent=2))
    print(f"✅ Expert '{expert_name}' salvo em: {key}")

# Contar total de conhecimentos
total_conhecimentos = sum(len(expert['conhecimentos']) for expert in experts_knowledge.values())
print()
print(f"📊 TOTAL DE CONHECIMENTOS INTEGRADOS: {total_conhecimentos}")

# Atualizar estatísticas
stats = {
    "experts_integrados": len(experts_knowledge),
    "total_conhecimentos": total_conhecimentos,
    "ultima_integracao": datetime.now().isoformat(),
    "status": "integrado"
}
r.set('especialista_ia:stats', json.dumps(stats, ensure_ascii=False, indent=2))
print(f"✅ Estatísticas atualizadas: {len(experts_knowledge)} experts, {total_conhecimentos} conhecimentos")

# Criar índice de busca
print()
print("🔍 Criando índice de busca...")
search_index = {}
for expert_name, expert_data in experts_knowledge.items():
    for i, conhecimento in enumerate(expert_data['conhecimentos']):
        # Extrair palavras-chave
        palavras = conhecimento.lower().split()
        for palavra in palavras:
            if len(palavra) > 3:  # Ignorar palavras muito curtas
                if palavra not in search_index:
                    search_index[palavra] = []
                search_index[palavra].append({
                    "expert": expert_name,
                    "conhecimento": conhecimento,
                    "indice": i
                })

r.set('especialista_ia:search_index', json.dumps(search_index, ensure_ascii=False))
print(f"✅ Índice de busca criado com {len(search_index)} palavras-chave")

print()
print("=" * 80)
print("🎉 INTEGRAÇÃO COMPLETA!")
print("=" * 80)
print()
print("📚 Experts integrados:")
for expert_name in experts_knowledge.keys():
    print(f"   ✅ {expert_name}")
print()
print("🔍 Para buscar conhecimento:")
print("   python3 especialista_ia.py buscar 'termo'")
print()
print("📊 Para ver status:")
print("   python3 especialista_ia.py status")
print()
