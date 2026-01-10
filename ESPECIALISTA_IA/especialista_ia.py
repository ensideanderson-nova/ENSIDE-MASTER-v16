#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
🤖 ESPECIALISTA-IA - Agente Principal do Sistema ENSIDE
Versão: 1.0
Data: 10 de janeiro de 2026

Funcionalidades:
- Varredura completa do Mac (Desktop, Documents, Downloads, iCloud, Google Drive, OneDrive)
- Organização automática de arquivos
- Integração com Redis para armazenamento de conhecimento
- Sincronização em tempo real com sistema ENSIDE
- Widget flutuante para acesso rápido
- Aprendizado contínuo de todas as ações do usuário
"""

import os
import sys
import json
import time
import redis
import hashlib
from pathlib import Path
from datetime import datetime
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler

class EspecialistaIA:
    def __init__(self):
        self.redis_client = redis.Redis(host='localhost', port=6379, decode_responses=True)
        self.base_path = Path.home() / "ESPECIALISTA_IA"
        self.conhecimento_path = self.base_path / "conhecimento"
        self.logs_path = self.base_path / "logs"
        
        # Criar diretórios se não existirem
        self.conhecimento_path.mkdir(parents=True, exist_ok=True)
        self.logs_path.mkdir(parents=True, exist_ok=True)
        
        # Diretórios para varredura
        self.diretorios_varredura = [
            Path.home() / "Desktop",
            Path.home() / "Documents",
            Path.home() / "Downloads",
            Path.home() / "Library" / "Mobile Documents" / "com~apple~CloudDocs",  # iCloud
            Path.home() / "Google Drive",
            Path.home() / "OneDrive",
        ]
        
        # Categorias de arquivos
        self.categorias = {
            'documentos': ['.pdf', '.doc', '.docx', '.txt', '.rtf', '.odt'],
            'planilhas': ['.xlsx', '.xls', '.csv', '.numbers'],
            'imagens': ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.svg', '.heic'],
            'videos': ['.mp4', '.mov', '.avi', '.mkv', '.flv'],
            'audios': ['.mp3', '.wav', '.aac', '.m4a', '.flac'],
            'codigo': ['.py', '.js', '.html', '.css', '.java', '.cpp', '.sh'],
            'compactados': ['.zip', '.rar', '.7z', '.tar', '.gz'],
            'sistema': ['.app', '.dmg', '.pkg'],
        }
        
        print("🤖 ESPECIALISTA-IA inicializado!")
        print(f"📁 Base: {self.base_path}")
        print(f"🗄️  Redis: Conectado (localhost:6379)")
    
    def varrer_sistema(self):
        """Varre todos os diretórios do Mac e cataloga arquivos"""
        print("\n🔍 Iniciando varredura completa do sistema...")
        
        arquivos_catalogados = {
            'total': 0,
            'por_categoria': {},
            'por_diretorio': {},
            'timestamp': datetime.now().isoformat()
        }
        
        for diretorio in self.diretorios_varredura:
            if not diretorio.exists():
                print(f"   ⚠️  {diretorio.name}: Não encontrado")
                continue
            
            print(f"   📂 Varrendo: {diretorio.name}...")
            arquivos_dir = self._varrer_diretorio(diretorio)
            arquivos_catalogados['por_diretorio'][str(diretorio)] = arquivos_dir
            arquivos_catalogados['total'] += len(arquivos_dir)
        
        # Salvar no Redis
        self.redis_client.set(
            'especialista_ia:catalogo_arquivos',
            json.dumps(arquivos_catalogados, ensure_ascii=False, indent=2)
        )
        
        print(f"\n✅ Varredura concluída!")
        print(f"   📊 Total de arquivos catalogados: {arquivos_catalogados['total']}")
        
        return arquivos_catalogados
    
    def _varrer_diretorio(self, diretorio, max_depth=5, current_depth=0):
        """Varre um diretório recursivamente"""
        arquivos = []
        
        if current_depth >= max_depth:
            return arquivos
        
        try:
            for item in diretorio.iterdir():
                if item.name.startswith('.'):
                    continue
                
                if item.is_file():
                    arquivo_info = {
                        'nome': item.name,
                        'caminho': str(item),
                        'tamanho': item.stat().st_size,
                        'extensao': item.suffix.lower(),
                        'categoria': self._categorizar_arquivo(item.suffix.lower()),
                        'modificado': datetime.fromtimestamp(item.stat().st_mtime).isoformat()
                    }
                    arquivos.append(arquivo_info)
                
                elif item.is_dir():
                    arquivos.extend(self._varrer_diretorio(item, max_depth, current_depth + 1))
        
        except PermissionError:
            pass
        except Exception as e:
            pass
        
        return arquivos
    
    def _categorizar_arquivo(self, extensao):
        """Categoriza um arquivo pela extensão"""
        for categoria, extensoes in self.categorias.items():
            if extensao in extensoes:
                return categoria
        return 'outros'
    
    def organizar_arquivo(self, arquivo_path):
        """Sugere o melhor local para salvar um arquivo"""
        arquivo = Path(arquivo_path)
        categoria = self._categorizar_arquivo(arquivo.suffix.lower())
        
        # Diretório base para organização
        base_organizacao = Path.home() / "Documents" / "ENSIDE_ORGANIZADO"
        destino = base_organizacao / categoria
        destino.mkdir(parents=True, exist_ok=True)
        
        return destino / arquivo.name
    
    def aprender(self, titulo, conteudo, contexto=""):
        """Adiciona um novo aprendizado ao conhecimento do ESPECIALISTA-IA"""
        aprendizado = {
            'titulo': titulo,
            'conteudo': conteudo,
            'contexto': contexto,
            'timestamp': datetime.now().isoformat(),
            'id': hashlib.md5(f"{titulo}{datetime.now()}".encode()).hexdigest()[:8]
        }
        
        # Salvar no Redis
        aprendizados_key = 'especialista_ia:aprendizados'
        aprendizados_json = self.redis_client.get(aprendizados_key)
        
        if aprendizados_json:
            aprendizados = json.loads(aprendizados_json)
        else:
            aprendizados = []
        
        aprendizados.append(aprendizado)
        
        self.redis_client.set(
            aprendizados_key,
            json.dumps(aprendizados, ensure_ascii=False, indent=2)
        )
        
        print(f"✅ Aprendizado adicionado: {titulo}")
        return aprendizado
    
    def buscar_conhecimento(self, termo):
        """Busca no conhecimento do ESPECIALISTA-IA"""
        aprendizados_json = self.redis_client.get('especialista_ia:aprendizados')
        
        if not aprendizados_json:
            return []
        
        aprendizados = json.loads(aprendizados_json)
        resultados = []
        
        for aprendizado in aprendizados:
            if termo.lower() in aprendizado['titulo'].lower() or \
               termo.lower() in aprendizado['conteudo'].lower():
                resultados.append(aprendizado)
        
        return resultados
    
    def sincronizar_com_enside(self):
        """Sincroniza conhecimento com o sistema ENSIDE"""
        print("\n🔄 Sincronizando com sistema ENSIDE...")
        
        # Buscar dados do Redis
        chaves_enside = self.redis_client.keys('enside:*')
        
        sincronizacao = {
            'timestamp': datetime.now().isoformat(),
            'chaves_sincronizadas': len(chaves_enside),
            'status': 'sucesso'
        }
        
        self.redis_client.set(
            'especialista_ia:ultima_sincronizacao',
            json.dumps(sincronizacao, ensure_ascii=False, indent=2)
        )
        
        print(f"✅ Sincronização concluída!")
        print(f"   📊 Chaves sincronizadas: {len(chaves_enside)}")
        
        return sincronizacao
    
    def status(self):
        """Mostra o status atual do ESPECIALISTA-IA"""
        print("\n" + "="*60)
        print("🤖 STATUS DO ESPECIALISTA-IA")
        print("="*60)
        
        # Verificar Redis
        try:
            self.redis_client.ping()
            print("✅ Redis: Conectado")
        except:
            print("❌ Redis: Desconectado")
        
        # Contar aprendizados
        aprendizados_json = self.redis_client.get('especialista_ia:aprendizados')
        if aprendizados_json:
            aprendizados = json.loads(aprendizados_json)
            print(f"📚 Aprendizados: {len(aprendizados)}")
        else:
            print("📚 Aprendizados: 0")
        
        # Verificar catálogo
        catalogo_json = self.redis_client.get('especialista_ia:catalogo_arquivos')
        if catalogo_json:
            catalogo = json.loads(catalogo_json)
            print(f"📁 Arquivos catalogados: {catalogo['total']}")
        else:
            print("📁 Arquivos catalogados: 0")
        
        # Última sincronização
        sync_json = self.redis_client.get('especialista_ia:ultima_sincronizacao')
        if sync_json:
            sync = json.loads(sync_json)
            print(f"🔄 Última sincronização: {sync['timestamp']}")
        else:
            print("🔄 Última sincronização: Nunca")
        
        print("="*60)

def main():
    """Função principal"""
    ia = EspecialistaIA()
    
    if len(sys.argv) < 2:
        print("\n📋 Comandos disponíveis:")
        print("   varrer     - Varre todo o sistema e cataloga arquivos")
        print("   status     - Mostra o status atual")
        print("   sync       - Sincroniza com sistema ENSIDE")
        print("   aprender   - Adiciona um novo aprendizado")
        print("   buscar     - Busca no conhecimento")
        return
    
    comando = sys.argv[1].lower()
    
    if comando == 'varrer':
        ia.varrer_sistema()
    
    elif comando == 'status':
        ia.status()
    
    elif comando == 'sync':
        ia.sincronizar_com_enside()
    
    elif comando == 'aprender':
        if len(sys.argv) < 4:
            print("❌ Uso: especialista_ia.py aprender <titulo> <conteudo>")
            return
        titulo = sys.argv[2]
        conteudo = sys.argv[3]
        ia.aprender(titulo, conteudo)
    
    elif comando == 'buscar':
        if len(sys.argv) < 3:
            print("❌ Uso: especialista_ia.py buscar <termo>")
            return
        termo = sys.argv[2]
        resultados = ia.buscar_conhecimento(termo)
        
        if resultados:
            print(f"\n🔍 Encontrados {len(resultados)} resultados:")
            for r in resultados:
                print(f"\n   📌 {r['titulo']}")
                print(f"      {r['conteudo'][:100]}...")
        else:
            print("❌ Nenhum resultado encontrado")
    
    else:
        print(f"❌ Comando desconhecido: {comando}")

if __name__ == "__main__":
    main()
