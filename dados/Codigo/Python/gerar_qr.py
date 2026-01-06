#!/usr/bin/env python3
import urllib.request
import json

url = 'http://localhost:8080/instance/connect/ENSIDE_WHATSAPP'
headers = {'apikey': 'ENSIDE_MADEIRAS_2024_KEY'}

req = urllib.request.Request(url, headers=headers)
with urllib.request.urlopen(req) as response:
    data = json.loads(response.read().decode())

qr = data.get('base64', '')
if qr:
    html = f'''<html>
<head><title>QR Code WhatsApp</title></head>
<body style="text-align:center;padding:50px;font-family:Arial">
<h1>Escaneie o QR Code com WhatsApp</h1>
<p>Abra WhatsApp > Dispositivos conectados > Conectar dispositivo</p>
<img src="{qr}" style="width:400px;border:2px solid #25D366"/>
<p style="color:red">QR Code expira em ~45 segundos!</p>
</body></html>'''
    with open('/Users/andersonenside/Desktop/qrcode_whatsapp.html', 'w') as f:
        f.write(html)
    print('QR Code salvo em ~/Desktop/qrcode_whatsapp.html')
else:
    print('Erro: QR Code nao disponivel')
    print('Resposta:', data)
