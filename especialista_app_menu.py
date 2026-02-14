#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import rumps
import redis
import subprocess
import os

class ESPECIALISTAApp(rumps.App):
    def __init__(self):
        super(ESPECIALISTAApp, self).__init__("🤖 557")
        self.redis_client = None
        self.conectar_redis()
        self.timer = rumps.Timer(self.atualizar_contador, 3)
        self.timer.start()
    
    def conectar_redis(self):
        try:
            self.redis_client = redis.Redis(host='localhost', port=6379, decode_responses=True)
            self.redis_client.ping()
        except:
            pass
    
    def atualizar_contador(self, _):
        try:
            if self.redis_client:
                total = len(self.redis_client.keys('especialista_ia:aprendizado:*'))
                self.title = f"🤖 {total}"
        except:
            pass
    
    @rumps.clicked("📊 Ver Status")
    def ver_status(self, _):
        try:
            total_chaves = len(self.redis_client.keys('*'))
            total_aprendizados = len(self.redis_client.keys('especialista_ia:aprendizado:*'))
            rumps.notification(
                "ESPECIALISTA-IA",
                "Status do Sistema",
                f"Total de aprendizados: {total_aprendizados}\nTotal de chaves Redis: {total_chaves}"
            )
        except Exception as e:
            rumps.alert("Erro", str(e))
    
    @rumps.clicked("🎓 Adicionar Aprendizado")
    def adicionar_aprendizado(self, _):
        window = rumps.Window(
            message='Digite o título do aprendizado:',
            title='Adicionar Aprendizado',
            default_text='',
            ok='Continuar',
            cancel='Cancelar'
        )
        response = window.run()
        if response.clicked:
            titulo = response.text
            window2 = rumps.Window(
                message='Digite o conteúdo do aprendizado:',
                title='Adicionar Aprendizado',
                default_text='',
                ok='Salvar',
                cancel='Cancelar'
            )
            response2 = window2.run()
            if response2.clicked:
                conteudo = response2.text
                try:
                    total = len(self.redis_client.keys('especialista_ia:aprendizado:*'))
                    chave = f"especialista_ia:aprendizado:{total + 1}"
                    self.redis_client.set(chave, f"{titulo}|||{conteudo}")
                    rumps.notification(
                        "ESPECIALISTA-IA",
                        "Aprendizado Salvo",
                        f"Aprendizado #{total + 1} salvo com sucesso!"
                    )
                except Exception as e:
                    rumps.alert("Erro ao salvar", str(e))
    
    @rumps.clicked("🌐 Abrir Todos os Sistemas")
    def abrir_sistemas(self, _):
        subprocess.Popen(['bash', '-c', 'enside-'], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    
    @rumps.clicked("📱 Sistema Vercel")
    def abrir_vercel(self, _):
        subprocess.Popen(['open', 'https://enside-sistema-unificado.vercel.app'])
    
    @rumps.clicked("💬 Evolution Manager")
    def abrir_evolution(self, _):
        subprocess.Popen(['open', 'http://localhost:8080/manager/ENSIDE'])
    
    @rumps.clicked("📊 Google Sheets")
    def abrir_sheets(self, _):
        subprocess.Popen(['open', 'https://docs.google.com/spreadsheets/d/1FiP885Or0ncyRG_ZZaAvM2vP0sHhDzhLFYifYLjKyIE/edit'])
    
    @rumps.clicked("🗄️ Redis Commander")
    def abrir_redis(self, _):
        subprocess.Popen(['open', 'http://localhost:8081'])
    
    @rumps.clicked("🔄 Atualizar")
    def atualizar(self, _):
        self.atualizar_contador(None)
        rumps.notification("ESPECIALISTA-IA", "Atualizado", "Contador atualizado com sucesso!")
    
    @rumps.clicked("❌ Sair")
    def sair(self, _):
        rumps.quit_application()

if __name__ == "__main__":
    ESPECIALISTAApp().run()
