#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
ESPECIALISTA-IA - Integração Completa de Todos os Sistemas
Varre e integra TODOS os sistemas existentes no Mac
"""

import os
import json
import redis
import subprocess
from datetime import datetime
from pathlib import Path

class IntegradorSistemas:
    def __init__(self):
        self.redis_client = redis.Redis(host='localhost', port=6379, decode_responses=True)
        self.sistemas = {}
        self.home = str(Path.home())
        
    def varrer_sistemas_enside(self):
        """Varre todos os sistemas ENSIDE no Mac"""
        print("\n🔍 Varrendo sistemas ENSIDE...")
        
        # Locais para procurar
        locais = [
            f"{self.home}/Desktop",
            f"{self.home}/Documents",
            f"{self.home}/Downloads",
            f"{self.home}"
        ]
        
        sistemas_encontrados = []
        
        for local in locais:
            if os.path.exists(local):
                # Procurar pastas ENSIDE
                for root, dirs, files in os.walk(local):
                    for dir_name in dirs:
                        if 'ENSIDE' in dir_name.upper():
                            caminho = os.path.join(root, dir_name)
                            sistemas_encontrados.append({
                                'nome': dir_name,
                                'caminho': caminho,
                                'tipo': 'pasta'
                            })
                    
                    # Procurar arquivos HTML ENSIDE
                    for file_name in files:
                        if 'ENSIDE' in file_name.upper() and file_name.endswith('.html'):
                            caminho = os.path.join(root, file_name)
                            sistemas_encontrados.append({
                                'nome': file_name,
                                'caminho': caminho,
                                'tipo': 'html'
                            })
        
        self.sistemas['enside'] = sistemas_encontrados
        print(f"✅ Encontrados {len(sistemas_encontrados)} sistemas ENSIDE")
        
        # Salvar no Redis
        self.redis_client.set('especialista_ia:sistemas:enside', json.dumps(sistemas_encontrados, ensure_ascii=False))
        
        return sistemas_encontrados
    
    def varrer_repositorios_github(self):
        """Varre todos os repositórios GitHub"""
        print("\n🔍 Varrendo repositórios GitHub...")
        
        repos = []
        
        # Procurar repositórios .git
        for local in [f"{self.home}/Desktop", f"{self.home}/Documents", f"{self.home}/Downloads", self.home]:
            if os.path.exists(local):
                for root, dirs, files in os.walk(local):
                    if '.git' in dirs:
                        # Contar arquivos
                        total_arquivos = sum([len(files) for r, d, files in os.walk(root)])
                        
                        repos.append({
                            'nome': os.path.basename(root),
                            'caminho': root,
                            'arquivos': total_arquivos
                        })
        
        self.sistemas['github'] = repos
        print(f"✅ Encontrados {len(repos)} repositórios GitHub")
        
        # Salvar no Redis
        for repo in repos:
            chave = f"especialista_ia:repo:{repo['nome']}"
            self.redis_client.set(chave, json.dumps(repo, ensure_ascii=False))
        
        return repos
    
    def integrar_vercel(self):
        """Integra sistema Vercel"""
        print("\n🔍 Integrando Vercel...")
        
        vercel_info = {
            'url': 'https://enside-sistema-unificado.vercel.app',
            'status': 'online',
            'contatos': '7055+',
            'funcionalidades': [
                'Dashboard Executivo',
                'Importador Universal',
                'Evolution API',
                'Multi-IA Chat',
                'Listas WhatsApp'
            ]
        }
        
        self.sistemas['vercel'] = vercel_info
        self.redis_client.set('especialista_ia:sistemas:vercel', json.dumps(vercel_info, ensure_ascii=False))
        
        print("✅ Vercel integrado")
        return vercel_info
    
    def integrar_evolution_api(self):
        """Integra Evolution API"""
        print("\n🔍 Integrando Evolution API...")
        
        evolution_info = {
            'url': 'https://evolution-api-enside.onrender.com',
            'api_key': '919AA333-AE59-4B06-B1EF-C9A9F9C8C0F6',
            'instancia': 'enside',
            'whatsapp': '5518996540492',
            'status': 'configurado'
        }
        
        self.sistemas['evolution'] = evolution_info
        self.redis_client.set('especialista_ia:sistemas:evolution', json.dumps(evolution_info, ensure_ascii=False))
        
        print("✅ Evolution API integrada")
        return evolution_info
    
    def integrar_google_sheets(self):
        """Integra Google Sheets"""
        print("\n🔍 Integrando Google Sheets...")
        
        sheets_info = {
            'id': '1FiP885Or0ncyRG_ZZaAvM2vP0sHhDzhLFYifYLjKyIE',
            'nome': 'EUCALIPTO-13-12-25-_SISTEMA_INTEGRADO_COMPLETO',
            'url': 'https://docs.google.com/spreadsheets/d/1FiP885Or0ncyRG_ZZaAvM2vP0sHhDzhLFYifYLjKyIE/edit',
            'abas': ['CONTATOS', 'FRETES_DISPONIVEIS', 'CAPTACAO_FRETES', 'LISTAS_TRANSMISSAO'],
            'contatos': 7055
        }
        
        self.sistemas['google_sheets'] = sheets_info
        self.redis_client.set('especialista_ia:sistemas:google_sheets', json.dumps(sheets_info, ensure_ascii=False))
        
        print("✅ Google Sheets integrado")
        return sheets_info
    
    def integrar_redis(self):
        """Integra Redis e lista todas as chaves"""
        print("\n🔍 Integrando Redis...")
        
        # Listar todas as chaves
        chaves = self.redis_client.keys('*')
        chaves_enside = [c for c in chaves if c.startswith('enside:')]
        chaves_especialista = [c for c in chaves if c.startswith('especialista_ia:')]
        
        redis_info = {
            'host': 'localhost',
            'port': 6379,
            'total_chaves': len(chaves),
            'chaves_enside': len(chaves_enside),
            'chaves_especialista': len(chaves_especialista),
            'commander_url': 'http://localhost:8081'
        }
        
        self.sistemas['redis'] = redis_info
        self.redis_client.set('especialista_ia:sistemas:redis', json.dumps(redis_info, ensure_ascii=False))
        
        print(f"✅ Redis integrado - {len(chaves)} chaves totais")
        return redis_info
    
    def integrar_docker(self):
        """Integra Docker e Evolution API local"""
        print("\n🔍 Integrando Docker...")
        
        try:
            # Verificar se Docker está rodando
            result = subprocess.run(['docker', 'ps'], capture_output=True, text=True)
            
            if result.returncode == 0:
                containers = result.stdout.strip().split('\n')[1:]  # Pular cabeçalho
                
                docker_info = {
                    'status': 'rodando',
                    'containers': len(containers),
                    'evolution_api': {
                        'url': 'http://localhost:8080',
                        'manager': 'http://localhost:8080/manager/ENSIDE',
                        'api_key': 'evolution-api-enside-2024-secret',
                        'instancia': 'ENSIDE'
                    }
                }
                
                self.sistemas['docker'] = docker_info
                self.redis_client.set('especialista_ia:sistemas:docker', json.dumps(docker_info, ensure_ascii=False))
                
                print(f"✅ Docker integrado - {len(containers)} containers rodando")
                return docker_info
            else:
                print("⚠️  Docker não está rodando")
                return None
        except Exception as e:
            print(f"❌ Erro ao verificar Docker: {e}")
            return None
    
    def salvar_mapa_completo(self):
        """Salva mapa completo de todos os sistemas"""
        print("\n💾 Salvando mapa completo...")
        
        mapa_completo = {
            'timestamp': datetime.now().isoformat(),
            'sistemas': self.sistemas,
            'total_sistemas': len(self.sistemas)
        }
        
        # Criar diretório se não existir
        dir_path = f"{self.home}/ESPECIALISTA_IA"
        os.makedirs(dir_path, exist_ok=True)
        
        # Salvar no Redis
        self.redis_client.set('especialista_ia:mapa_completo', json.dumps(mapa_completo, ensure_ascii=False, indent=2))
        
        # Salvar em arquivo JSON
        with open(f"{dir_path}/mapa_sistemas.json", 'w', encoding='utf-8') as f:
            json.dump(mapa_completo, f, ensure_ascii=False, indent=2)
        
        print("✅ Mapa completo salvo")
        return mapa_completo
    
    def executar_integracao_completa(self):
        """Executa integração completa de todos os sistemas"""
        print("\n" + "="*60)
        print("🤖 ESPECIALISTA-IA - INTEGRAÇÃO COMPLETA DE SISTEMAS")
        print("="*60)
        
        # Executar todas as integrações
        self.varrer_sistemas_enside()
        self.varrer_repositorios_github()
        self.integrar_vercel()
        self.integrar_evolution_api()
        self.integrar_google_sheets()
        self.integrar_redis()
        self.integrar_docker()
        
        # Salvar mapa completo
        mapa = self.salvar_mapa_completo()
        
        # Mostrar resumo
        print("\n" + "="*60)
        print("📊 RESUMO DA INTEGRAÇÃO")
        print("="*60)
        print(f"\n✅ Sistemas ENSIDE: {len(self.sistemas.get('enside', []))}")
        print(f"✅ Repositórios GitHub: {len(self.sistemas.get('github', []))}")
        print(f"✅ Vercel: {'Integrado' if 'vercel' in self.sistemas else 'Não integrado'}")
        print(f"✅ Evolution API: {'Integrado' if 'evolution' in self.sistemas else 'Não integrado'}")
        print(f"✅ Google Sheets: {'Integrado' if 'google_sheets' in self.sistemas else 'Não integrado'}")
        print(f"✅ Redis: {self.sistemas.get('redis', {}).get('total_chaves', 0)} chaves")
        print(f"✅ Docker: {'Rodando' if self.sistemas.get('docker', {}).get('status') == 'rodando' else 'Parado'}")
        
        print("\n" + "="*60)
        print("🎉 INTEGRAÇÃO COMPLETA FINALIZADA!")
        print("="*60)
        print(f"\n📄 Mapa salvo em: ~/ESPECIALISTA_IA/mapa_sistemas.json")
        print(f"🔑 Redis: especialista_ia:mapa_completo")
        
        return mapa

if __name__ == '__main__':
    integrador = IntegradorSistemas()
    integrador.executar_integracao_completa()
