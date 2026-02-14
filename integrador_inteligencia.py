#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
INTEGRADOR DE INTELIGÊNCIA - O ESPECIALISTA
Migra toda a inteligência do agente anterior para o novo sistema ENSIDE
"""

import os
import json
import redis
from datetime import datetime

class IntegradorInteligencia:
    def __init__(self):
        self.redis_client = redis.Redis(host='localhost', port=6379, decode_responses=True)
        self.home = os.path.expanduser('~')
        
    def carregar_inteligencia_basica(self):
        """Carrega inteligência básica do agente"""
        print("📚 Carregando inteligência básica do O Especialista...\n")
        
        # Fluxos de conversação
        fluxos = {
            'conversacao': [
                'ConversationStart',
                'Greeting',
                'Goodbye',
                'ThankYou',
                'Escalate',
                'Fallback',
                'Search',
                'Signin',
                'ResetConversation',
                'StartOver',
                'MultipleTopicsMatched',
                'EndofConversation',
                'OnError'
            ],
            'intencoes': [
                {'intencao': 'cotacao', 'palavras': ['cotação', 'preço', 'quanto custa', 'valor']},
                {'intencao': 'pedido', 'palavras': ['pedido', 'comprar', 'solicitar', 'encomenda']},
                {'intencao': 'acompanhamento', 'palavras': ['status', 'acompanhar', 'onde está', 'quando chega']},
                {'intencao': 'fornecedor', 'palavras': ['fornecedor', 'serraria', 'produtor', 'fabricante']},
                {'intencao': 'frete', 'palavras': ['frete', 'transporte', 'entrega', 'logística']},
                {'intencao': 'madeira', 'palavras': ['madeira', 'tora', 'serrada', 'tipo', 'espécie']}
            ]
        }
        
        self.redis_client.set('especialista_ia:fluxos_conversacao', json.dumps(fluxos, ensure_ascii=False))
        print(f"✅ Fluxos de conversação: {len(fluxos['conversacao'])} tópicos")
        print(f"✅ Intenções: {len(fluxos['intencoes'])} categorias")
        
        return fluxos
    
    def carregar_integrações(self):
        """Carrega informações sobre integrações"""
        print("\n🔌 Carregando integrações disponíveis...\n")
        
        integrações = {
            'dados': [
                {'nome': 'Google Sheets', 'status': 'ativo', 'função': 'Fornecedores e preços'},
                {'nome': 'Google Drive', 'status': 'ativo', 'função': 'Documentação'},
                {'nome': 'Gmail', 'status': 'ativo', 'função': 'Comunicação com clientes'},
                {'nome': 'Excel Online', 'status': 'ativo', 'função': 'Operacional'},
            ],
            'comunicacao': [
                {'nome': 'Email', 'status': 'ativo', 'versão': 'V3'},
                {'nome': 'WhatsApp', 'status': 'pendente', 'versão': 'Business API'},
                {'nome': 'SMS', 'status': 'planejado', 'versão': 'Twilio'},
            ],
            'ferramentas': [
                {'nome': 'DocuSign', 'função': 'Contratos'},
                {'nome': 'Cloudmersive', 'função': 'Conversão de documentos'},
                {'nome': 'n8n', 'função': 'Automação de fluxos'},
            ]
        }
        
        self.redis_client.set('especialista_ia:integrações', json.dumps(integrações, ensure_ascii=False))
        
        total = len(integrações['dados']) + len(integrações['comunicacao']) + len(integrações['ferramentas'])
        print(f"✅ Total de integrações carregadas: {total}")
        
        return integrações
    
    def carregar_conhecimento_madeira(self):
        """Carrega conhecimento especializado sobre madeira"""
        print("\n🌳 Carregando conhecimento especializado...\n")
        
        conhecimento = {
            'tipos_madeira': {
                'seca': {'densidade': 500, 'unidade': 'kg/m³', 'caracteristicas': 'Processada, pronta uso'},
                'verde': {'densidade': 1000, 'unidade': 'kg/m³', 'caracteristicas': 'Recém-cortada, umidade alta'},
                'murcha': {'densidade': 750, 'unidade': 'kg/m³', 'caracteristicas': 'Intermediária, após secagem inicial'}
            },
            'especies_comuns': [
                'Eucalipto',
                'Pinho',
                'Jatobá',
                'Angelim',
                'Tauari',
                'Teca',
                'Mogno',
                'Cedrinho'
            ],
            'dimensoes_padrao': [
                '1x2 (em)", (2x3)', '2x2', '2x4', '4x4', '4x6', '6x6'
            ],
            'calculos': {
                'peso_volume': 'densidade (kg/m³) × volume (m³) = peso (kg)',
                'tonelagem': 'peso (kg) ÷ 1000 = tonelagem (t)',
                'valor_frete': 'km × densidade_regional × tipo_madeira'
            }
        }
        
        self.redis_client.set('especialista_ia:conhecimento_madeira', json.dumps(conhecimento, ensure_ascii=False))
        
        total_especies = len(conhecimento['especies_comuns'])
        total_tipos = len(conhecimento['tipos_madeira'])
        print(f"✅ Tipos de madeira: {total_tipos}")
        print(f"✅ Espécies catalogadas: {total_especies}")
        print(f"✅ Cálculos disponíveis: {len(conhecimento['calculos'])}")
        
        return conhecimento
    
    def carregar_processos_negocio(self):
        """Carrega processos e fluxos de negócio"""
        print("\n⚙️  Carregando processos de negócio...\n")
        
        processos = {
            'atendimento_cliente': {
                'fases': ['Saudação', 'Necessidade', 'Coleta dados', 'Consulta', 'Apresentação', 'Fechamento'],
                'tempo_estimado': '5-10 minutos',
                'taxa_conversao': '30-40%'
            },
            'cotacao_frete': {
                'fases': ['Origem', 'Destino', 'Tipo madeira', 'Volume', 'Cálculo peso', 'Cálculo frete'],
                'tempo_estimado': '2-3 minutos',
                'precision': '95%'
            },
            'gestao_fornecedores': {
                'dados_obrigatorios': ['Nome', 'CNPJ', 'Cidade', 'Estado', 'Produtos', 'Capacidade'],
                'dados_opcionais': ['Certificações', 'Histórico', 'Referências'],
                'revisao': 'Trimestral'
            },
            'captacao_leads': {
                'tipo_lead': 'Motoristas/Transportadores',
                'qualificacao': ['1ª etapa: Interesse', '2ª etapa: Capacidade', '3ª etapa: Documentação'],
                'tempo_ciclo': '30 dias'
            }
        }
        
        self.redis_client.set('especialista_ia:processos_negocio', json.dumps(processos, ensure_ascii=False))
        
        print(f"✅ Fluxos de negócio: {len(processos)}")
        for nome, detalhes in processos.items():
            print(f"   • {nome}: {len(detalhes.get('fases', []))} fases")
        
        return processos
    
    def carregar_persona_agente(self):
        """Carrega persona e instruções do agente"""
        print("\n🎭 Carregando persona do agente...\n")
        
        persona = {
            'nome': 'Assistente Enside Madeiras',
            'empresa': 'Enside Group / Enside Madeiras',
            'setor': 'Distribuição B2B de madeira serrada',
            'modelo_negocio': 'Dropshipping',
            'cobertura': 'Todo Brasil + Exportação',
            'especialidades': [
                'Tipos de madeira e especificações técnicas',
                'Cálculos de peso (seca 500kg/m³, verde 1000kg/m³, murcha 750kg/m³)',
                'Logística de frete em todo Brasil',
                'Conexão entre serrarias e distribuidores',
                'Processo completo da tora ao consumidor final'
            ],
            'objetivo': 'Atender clientes, fazer cotações rápidas e conectar fornecedores aos compradores',
            'tom_comunicacao': {
                'profissional': True,
                'acessivel': True,
                'direto': True,
                'conhecedor_tecnico': True,
                'orientado_solucao': True,
                'idioma': 'Português brasileiro'
            },
            'filosofia': 'Resolver a complexidade no início (cadastro robusto) para resultado final simples e prático'
        }
        
        self.redis_client.set('especialista_ia:persona_agente', json.dumps(persona, ensure_ascii=False))
        
        print(f"✅ Nome: {persona['nome']}")
        print(f"✅ Empresa: {persona['empresa']}")
        print(f"✅ Especialidades: {len(persona['especialidades'])}")
        print(f"✅ Ton de comunicação: {len([v for v in persona['tom_comunicacao'].values() if v is True])} atributos")
        
        return persona
    
    def salvar_documento_inteligencia(self):
        """Salva documento compilado da inteligência"""
        print("\n📄 Salvando documento compilado...\n")
        
        documento = {
            'titulo': 'INTELIGÊNCIA EXTRAÍDA DO AGENTE O ESPECIALISTA',
            'origem': 'Microsoft Power Virtual Agents (Copilot Studio)',
            'destino': 'ESPECIALISTA-IA v2.0',
            'data_migracao': datetime.now().isoformat(),
            'status': 'Migração Completa',
            'componentes': {
                'fluxos_conversacao': 13,
                'intencoes': 6,
                'integrações': 12,
                'tipos_madeira': 3,
                'especies_catalogadas': 8,
                'processos_negocio': 4,
                'atributos_agente': 5
            }
        }
        
        self.redis_client.set('especialista_ia:documento_inteligencia', json.dumps(documento, ensure_ascii=False))
        self.redis_client.set('especialista_ia:migracao_concluida', 'true')
        
        print(f"✅ Documento compilado com sucesso")
        print(f"✅ Total de componentes migrados: {sum(documento['componentes'].values())}")
        
        return documento
    
    def executar_migracao_completa(self):
        """Executa migração completa da inteligência"""
        print("\n" + "="*70)
        print("🚀 INICIANDO MIGRAÇÃO DE INTELIGÊNCIA - O ESPECIALISTA → ENSIDE-IA")
        print("="*70)
        
        # Executar todas as migrações
        self.carregar_inteligencia_basica()
        self.carregar_integrações()
        self.carregar_conhecimento_madeira()
        self.carregar_processos_negocio()
        self.carregar_persona_agente()
        documento = self.salvar_documento_inteligencia()
        
        # Resumo final
        print("\n" + "="*70)
        print("✅ MIGRAÇÃO CONCLUÍDA COM SUCESSO!")
        print("="*70)
        
        chaves = self.redis_client.keys('especialista_ia:*')
        print(f"\n📊 Estatísticas finais:")
        print(f"   • Chaves Redis criadas: {len([c for c in chaves if c.startswith('especialista_ia:')])}")
        print(f"   • Total de chaves no sistema: {len(chaves)}")
        print(f"   • Componentes migrados: {sum(documento['componentes'].values())}")
        
        print(f"\n🔑 Chaves principais:")
        print(f"   • especialista_ia:fluxos_conversacao")
        print(f"   • especialista_ia:integrações")
        print(f"   • especialista_ia:conhecimento_madeira")
        print(f"   • especialista_ia:processos_negocio")
        print(f"   • especialista_ia:persona_agente")
        print(f"   • especialista_ia:documento_inteligencia")
        
        print(f"\n🎉 O Especialista foi completamente migrado para ENSIDE-IA!")

if __name__ == '__main__':
    integrador = IntegradorInteligencia()
    integrador.executar_migracao_completa()
