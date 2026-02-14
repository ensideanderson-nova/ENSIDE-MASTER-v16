#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
ESPECIALISTA-IA - VARREDURA TOTAL DO MAC E GITHUB
Varre TUDO e adiciona ao conhecimento
"""

import os
import json
import subprocess
from datetime import datetime
import redis

# Conectar ao Redis
r = redis.Redis(host='localhost', port=6379, decode_responses=True)

print("🔍 INICIANDO VARREDURA TOTAL DO MAC...\n")

# Contador de aprendizados
total_aprendizados = int(r.get('especialista_ia:total_aprendizados') or 557)

def adicionar_aprendizado(fonte, tipo, conteudo):
    global total_aprendizados
    aprendizado = {
        'id': total_aprendizados,
        'fonte': fonte,
        'tipo': tipo,
        'data': datetime.now().isoformat(),
        'conteudo': conteudo
    }
    r.set(f'especialista_ia:aprendizado:{total_aprendizados}', json.dumps(aprendizado, ensure_ascii=False))
    total_aprendizados += 1
    return aprendizado

# 1. VARRER TODOS OS REPOSITÓRIOS GITHUB
print("📦 Varrendo repositórios GitHub...")
repos_encontrados = []
for pasta in ['Desktop', 'Documents', 'Downloads', os.path.expanduser('~')]:
    caminho = os.path.join(os.path.expanduser('~'), pasta) if pasta != os.path.expanduser('~') else pasta
    if os.path.exists(caminho):
        for root, dirs, files in os.walk(caminho):
            if '.git' in dirs:
                repos_encontrados.append(root)
                # Extrair informações do repo
                try:
                    os.chdir(root)
                    remote = subprocess.check_output(['git', 'remote', '-v'], stderr=subprocess.DEVNULL).decode('utf-8')
                    branch = subprocess.check_output(['git', 'branch', '--show-current'], stderr=subprocess.DEVNULL).decode('utf-8').strip()
                    adicionar_aprendizado(root, 'repositorio_github', f"Branch: {branch}\nRemote: {remote}")
                except:
                    pass

print(f"   ✅ {len(repos_encontrados)} repositórios encontrados")

# 2. VARRER ARQUIVOS IMPORTANTES
print("\n📄 Varrendo arquivos importantes...")
arquivos_importantes = []
extensoes = ['.md', '.txt', '.json', '.env', '.sh', '.command', '.py', '.js']
for pasta in ['Desktop', 'Documents', 'Downloads', 'ESPECIALISTA_IA', 'ENSIDE-MASTER-v16']:
    caminho = os.path.join(os.path.expanduser('~'), pasta)
    if os.path.exists(caminho):
        for root, dirs, files in os.walk(caminho):
            # Ignorar node_modules e .git
            dirs[:] = [d for d in dirs if d not in ['node_modules', '.git', 'venv']]
            for file in files:
                if any(file.endswith(ext) for ext in extensoes):
                    arquivo_path = os.path.join(root, file)
                    try:
                        with open(arquivo_path, 'r', encoding='utf-8', errors='ignore') as f:
                            conteudo = f.read(5000)  # Primeiros 5000 caracteres
                            if len(conteudo) > 100:  # Só arquivos com conteúdo relevante
                                adicionar_aprendizado(arquivo_path, f'arquivo_{file.split(".")[-1]}', conteudo[:1000])
                                arquivos_importantes.append(arquivo_path)
                    except:
                        pass

print(f"   ✅ {len(arquivos_importantes)} arquivos processados")

# 3. VARRER REDIS COMPLETO
print("\n🗄️  Varrendo Redis...")
chaves_redis = r.keys('*')
for chave in chaves_redis:
    if not chave.startswith('especialista_ia:'):
        try:
            valor = r.get(chave)
            if valor and len(valor) > 50:
                adicionar_aprendizado(f'redis:{chave}', 'redis_key', valor[:500])
        except:
            pass

print(f"   ✅ {len(chaves_redis)} chaves processadas")

# 4. VARRER APLICAÇÕES INSTALADAS
print("\n💻 Varrendo aplicações instaladas...")
apps_path = '/Applications'
apps = []
if os.path.exists(apps_path):
    for app in os.listdir(apps_path):
        if app.endswith('.app'):
            apps.append(app.replace('.app', ''))
            
adicionar_aprendizado('sistema_mac', 'aplicacoes_instaladas', json.dumps(apps, ensure_ascii=False))
print(f"   ✅ {len(apps)} aplicações encontradas")

# 5. VARRER VARIÁVEIS DE AMBIENTE
print("\n🔐 Varrendo variáveis de ambiente...")
env_vars = dict(os.environ)
env_importantes = {k: v for k, v in env_vars.items() if any(x in k.upper() for x in ['API', 'KEY', 'TOKEN', 'URL', 'PATH', 'HOME'])}
adicionar_aprendizado('sistema_mac', 'variaveis_ambiente', json.dumps(env_importantes, ensure_ascii=False))
print(f"   ✅ {len(env_importantes)} variáveis importantes")

# 6. ATUALIZAR TOTAL
r.set('especialista_ia:total_aprendizados', total_aprendizados)

print(f"\n✅ VARREDURA COMPLETA!")
print(f"📊 Total de aprendizados: {total_aprendizados}")
print(f"📈 Novos aprendizados: {total_aprendizados - 557}")
